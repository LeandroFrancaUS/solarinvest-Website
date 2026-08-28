import { NextResponse } from 'next/server';
import { callRateioApp, limited, LOOKUP_TIMEOUT_MS, rememberLookup, visitorIp } from '@/lib/rateio/server';
import { isRateioTestProject } from '@/lib/rateio/testProject';
import type { LookupSuccess } from '@/lib/rateio/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const ip = visitorIp(request);
  if (limited(`lookup:${ip}`, 5)) {
    return NextResponse.json({ ok: false, rateLimited: true, retryAfter: '600' }, { status: 429, headers: { 'Retry-After': '600' } });
  }
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (typeof input.reference !== 'string' || !['document', 'generator_uc'].includes(String(input.verifierType)) || typeof input.verifier !== 'string') {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const upstream = await callRateioApp('/api/public/rateio/project-lookup', {
    reference: input.reference,
    verifierType: input.verifierType,
    verifier: input.verifier,
  }, LOOKUP_TIMEOUT_MS, ip);
  if (upstream.unavailable) return NextResponse.json({ ok: false, unavailable: true });
  if (upstream.status === 429) {
    const retryAfter = upstream.headers.get('retry-after') || '600';
    return NextResponse.json({ ok: false, rateLimited: true, retryAfter }, { status: 429, headers: { 'Retry-After': retryAfter } });
  }
  if (upstream.status !== 200) return NextResponse.json({ ok: false }, { status: upstream.status });
  const data = upstream.data as Partial<LookupSuccess> | null;
  if (data?.ok === true && data.lookupToken && data.project && data.feeAssessment) {
    rememberLookup(data.lookupToken, data.project);
    // The app keeps identifying pending requests, but they must not prevent the
    // Solar Lab accounts from exercising the complete public flow repeatedly.
    const feeAssessment = isRateioTestProject(data.project)
      ? { ...data.feeAssessment, hasPendingRequest: false }
      : data.feeAssessment;
    return NextResponse.json({ ...data, feeAssessment });
  }
  return NextResponse.json({ ok: false });
}
