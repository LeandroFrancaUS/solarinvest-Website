import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { callRateioApp, getRememberedLookup, limited, SUBMIT_TIMEOUT_MS, visitorIp } from '@/lib/rateio/server';
import { buildRateioEmail, type RateioEmailInput } from '@/lib/rateio/email';
import type { ShareUnit } from '@/lib/rateio/types';

export const runtime = 'nodejs';

const RATEIO_FROM = 'Alteração de Rateio SolarInvest <contato@solarinvest.info>';
const RATEIO_INBOX = 'brsolarinvest@gmail.com';

async function sendRateioEmail(details: RateioEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[rateio-email] RESEND_API_KEY não configurada', { protocol: details.protocol });
    return false;
  }

  const email = buildRateioEmail(details);
  try {
    const result = await new Resend(apiKey).emails.send({
      from: RATEIO_FROM,
      to: [RATEIO_INBOX],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }, { idempotencyKey: `rateio-${details.protocol}` });
    if (result.error) {
      console.error('[rateio-email] Resend recusou a notificação', { protocol: details.protocol, error: result.error });
      return false;
    }
    return true;
  } catch (error) {
    console.error('[rateio-email] Falha ao enviar a notificação', { protocol: details.protocol, error });
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
      project: body.project as RateioEmailInput['project'], requestType: body.requestType as RateioEmailInput['requestType'], payload: (body.payload || {}) as Record<string, unknown>,
      feeAssessment: { status: 'indeterminate' }, feeAccepted: Boolean(body.feeAccepted), submittedAt: new Date(), ip, userAgent: request.headers.get('user-agent') || 'não informado',
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
  const shareUnits: ShareUnit[] = requestedShareUnits.map((unit) => {
    const fields = unit && typeof unit === 'object' ? unit as Record<string, unknown> : {};
    return { ...fields, holderName: original.holder.name } as ShareUnit;
  });
  const comparison = payload.comparison && typeof payload.comparison === 'object' ? payload.comparison as Record<string, unknown> : {};
  const beneficiaries = Array.isArray(comparison.beneficiaries) ? comparison.beneficiaries.map((unit) => ({ ...(unit as Record<string, unknown>), holderName: original.holder.name })) : [];
  const safePayload = { ...payload, shareUnits, comparison: { ...comparison, beneficiaries } };
  const submittedFields = { ...original, shareUnits };
  const upstream = await callRateioApp('/api/public/rateio/requests', {
    reference: original.reference,
    requestType,
    lookupToken: token,
    payload: { ...safePayload, originalShareUnits: original.shareUnits },
    submittedFields,
    expectedFeeStatus: body.expectedFeeStatus,
    feeAccepted: Boolean(body.feeAccepted),
  }, SUBMIT_TIMEOUT_MS, ip);
  if (upstream.unavailable) return NextResponse.json({ ok: false, code: 'APP_UNAVAILABLE' }, { status: 503 });
  const responseData = upstream.data && typeof upstream.data === 'object' ? upstream.data as Record<string, unknown> : null;
  if (upstream.status >= 200 && upstream.status < 300 && responseData?.ok === true) {
    const protocol = typeof responseData.protocol === 'string' ? responseData.protocol : `RAT-${crypto.randomUUID()}`;
    await sendRateioEmail({
      protocol,
      manual: false,
      project: submittedFields,
      requestType: requestType as RateioEmailInput['requestType'],
      payload: { ...safePayload, originalShareUnits: original.shareUnits },
      feeAssessment: responseData.feeAssessment as RateioEmailInput['feeAssessment'],
      feeAccepted: Boolean(body.feeAccepted), submittedAt: new Date(), ip, userAgent: request.headers.get('user-agent') || 'não informado',
    });
  }
  return NextResponse.json(upstream.data ?? { ok: false }, { status: upstream.status, headers: upstream.status === 429 ? { 'Retry-After': upstream.headers.get('retry-after') || '600' } : undefined });
}
