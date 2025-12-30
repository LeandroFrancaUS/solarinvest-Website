import { NextResponse } from 'next/server';
import { processKommoPreAnalise } from '@/lib/kommo/preAnalise';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { ok: false, errorCode: 'INVALID_JSON', message: 'Formato inválido. Envie os dados novamente.' },
      { status: 400 }
    );
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const result = await processKommoPreAnalise(body as any, ip);

  return NextResponse.json(result.body, { status: result.status });
}
