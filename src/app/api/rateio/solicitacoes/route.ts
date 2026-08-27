import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { callRateioApp, getRememberedLookup, limited, SUBMIT_TIMEOUT_MS, visitorIp } from '@/lib/rateio/server';

export const runtime = 'nodejs';

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
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false, code: 'MANUAL_TRIAGE_UNAVAILABLE' }, { status: 503 });
    const protocol = `MAN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const safe = JSON.stringify({ project: body.project, requestType: body.requestType, payload: body.payload }, null, 2).replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[character]!));
    const result = await new Resend(apiKey).emails.send({
      from: 'Alteração de Rateio SolarInvest <contato@solarinvest.info>',
      to: ['brsolarinvest@gmail.com'],
      subject: `Alteração de rateio para conferência manual — ${protocol}`,
      html: `<h1>Solicitação manual de alteração de rateio</h1><p><strong>Protocolo:</strong> ${protocol}</p><p>A consulta automática estava indisponível. Todos os dados precisam ser conferidos.</p><pre style="white-space:pre-wrap">${safe}</pre>`,
    });
    if (result.error) return NextResponse.json({ ok: false, code: 'MANUAL_TRIAGE_UNAVAILABLE' }, { status: 503 });
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
  const shareUnits = Array.isArray(payload.shareUnits) ? payload.shareUnits : original.shareUnits;
  const submittedFields = { ...original, shareUnits };
  const upstream = await callRateioApp('/api/public/rateio/requests', {
    reference: original.reference,
    requestType,
    lookupToken: token,
    payload: { ...payload, originalShareUnits: original.shareUnits },
    submittedFields,
    expectedFeeStatus: body.expectedFeeStatus,
  }, SUBMIT_TIMEOUT_MS, ip);
  if (upstream.unavailable) return NextResponse.json({ ok: false, code: 'APP_UNAVAILABLE' }, { status: 503 });
  return NextResponse.json(upstream.data ?? { ok: false }, { status: upstream.status, headers: upstream.status === 429 ? { 'Retry-After': upstream.headers.get('retry-after') || '600' } : undefined });
}
