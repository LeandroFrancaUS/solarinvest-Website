import type { NextApiRequest, NextApiResponse } from 'next';
import { processKommoPreAnalise } from '@/lib/kommo/preAnalise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, errorCode: 'METHOD_NOT_ALLOWED', message: 'Método não suportado.' });
  }

  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const result = await processKommoPreAnalise(req.body as any, ip);

  return res.status(result.status).json(result.body);
}
