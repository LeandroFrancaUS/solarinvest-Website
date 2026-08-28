import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { callRateioApp, getRememberedLookup, limited, SUBMIT_TIMEOUT_MS, visitorIp } from '@/lib/rateio/server';

export const runtime = 'nodejs';

const RATEIO_FROM = 'Alteração de Rateio SolarInvest <contato@solarinvest.info>';
const RATEIO_INBOX = 'brsolarinvest@gmail.com';

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]!));
}

async function sendRateioEmail({ protocol, manual, details }: { protocol: string; manual: boolean; details: unknown }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[rateio-email] RESEND_API_KEY não configurada', { protocol });
    return false;
  }

  const safeDetails = escapeHtml(JSON.stringify(details, null, 2));
  try {
    const result = await new Resend(apiKey).emails.send({
      from: RATEIO_FROM,
      to: [RATEIO_INBOX],
      subject: `${manual ? 'Alteração de rateio para conferência manual' : 'Nova solicitação de alteração de rateio'} — ${protocol}`,
      html: `<h1>${manual ? 'Solicitação manual' : 'Nova solicitação'} de alteração de rateio</h1><p><strong>Protocolo:</strong> ${escapeHtml(protocol)}</p>${manual ? '<p>A consulta automática estava indisponível. Todos os dados precisam ser conferidos.</p>' : '<p>A solicitação foi registrada com sucesso no sistema.</p>'}<pre style="white-space:pre-wrap">${safeDetails}</pre>`,
    }, { idempotencyKey: `rateio-${protocol}` });
    if (result.error) {
      console.error('[rateio-email] Resend recusou a notificação', { protocol, error: result.error });
      return false;
    }
    return true;
  } catch (error) {
    console.error('[rateio-email] Falha ao enviar a notificação', { protocol, error });
    return false;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, code: 'INVALID_BODY' }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true, protocol: 'SOLICITAÇÃO-RECEBIDA', manual: Boolean(body.manual) });
  const mountedAt = Number(body.mountedAt);
  if (!Number.isFinite(mountedAt) || Date.now() - mountedAt < 3_000) {
    return NextResponse.json({ ok: false, code: 'TOO_FAST', message: 'Aguarde alguns segundos e tente novamente.' }, { status: 400 });
  }
  const ip = visitorIp(request);
  if (limited(`submit:${ip}`, 3)) return NextResponse.json({ ok: false, code: 'RATE_LIMITED' }, { status: 429, headers: { 'Retry-After': '600' } });

  if (body.manual === true) {
    // A API pública exige lookupToken. O fluxo de contingência é recebido pelo site
    // para avaliação manual, sem tentar contornar essa garantia no app.
    const protocol = `MAN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const emailSent = await sendRateioEmail({
      protocol,
      manual: true,
      details: { project: body.project, requestType: body.requestType, payload: body.payload },
    });
    if (!emailSent) return NextResponse.json({ ok: false, code: 'MANUAL_TRIAGE_UNAVAILABLE' }, { status: 503 });
    return NextResponse.json({
      ok: true,
      manual: true,
      protocol,
    }, { status: 201 });
  }

  const token = typeof body.lookupToken === 'string' ? body.lookupToken : '';
  const original = getRememberedLookup(token);
  if (!original) return NextResponse.json({ ok: false, code: 'LOOKUP_EXPIRED' }, { status: 400 });
  const requestType = body.requestType;
  if (!['inclusion', 'exclusion', 'redistribution'].includes(String(requestType))) {
    return NextResponse.json({ ok: false, code: 'INVALID_REQUEST_TYPE' }, { status: 400 });
  }
  const payload = body.payload && typeof body.payload === 'object' ? body.payload as Record<string, unknown> : {};
  // A titularidade confirmada no lookup é a única fonte confiável. Nunca
  // encaminhamos o titular enviado pelo navegador no fluxo autenticado.
  const requestedShareUnits = Array.isArray(payload.shareUnits) ? payload.shareUnits : original.shareUnits;
  const shareUnits = requestedShareUnits.map((unit) => {
    const fields = unit && typeof unit === 'object' ? unit as Record<string, unknown> : {};
    return { ...fields, holderName: original.holder.name };
  });
  const safePayload = { ...payload, shareUnits };
  const submittedFields = { ...original, shareUnits };
  const upstream = await callRateioApp('/api/public/rateio/requests', {
    reference: original.reference,
    requestType,
    lookupToken: token,
    payload: { ...safePayload, originalShareUnits: original.shareUnits },
    submittedFields,
    expectedFeeStatus: body.expectedFeeStatus,
  }, SUBMIT_TIMEOUT_MS, ip);
  if (upstream.unavailable) return NextResponse.json({ ok: false, code: 'APP_UNAVAILABLE' }, { status: 503 });
  const responseData = upstream.data && typeof upstream.data === 'object' ? upstream.data as Record<string, unknown> : null;
  if (upstream.status >= 200 && upstream.status < 300 && responseData?.ok === true) {
    const protocol = typeof responseData.protocol === 'string' ? responseData.protocol : `RAT-${crypto.randomUUID()}`;
    await sendRateioEmail({
      protocol,
      manual: false,
      details: {
        project: submittedFields,
        requestType,
        payload: { ...payload, originalShareUnits: original.shareUnits },
        feeAssessment: responseData.feeAssessment,
      },
    });
  }
  return NextResponse.json(upstream.data ?? { ok: false }, { status: upstream.status, headers: upstream.status === 429 ? { 'Retry-After': upstream.headers.get('retry-after') || '600' } : undefined });
}
