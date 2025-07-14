// src/app/api/contato/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

// Garante que a API key esteja presente para evitar erros em runtime
if (!resendApiKey) {
  console.error('❌ RESEND_API_KEY não definida. Verifique .env.local ou as variáveis no Vercel.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const { nome, email, mensagem } = await req.json();

    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ error: 'Serviço de e-mail indisponível.' }, { status: 500 });
    }

    const data = await resend.emails.send({
      from: 'Contato SolarInvest <contato@solarinvest.info>',
      to: ['brsolarinvest@gmail.com'],
      subject: 'Novo contato via site SolarInvest',
      html: `
        <div style="font-family: sans-serif; font-size: 16px;">
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensagem:</strong><br />${mensagem.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    console.log('✅ E-mail enviado:', data);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    return NextResponse.json({ error: 'Erro ao enviar e-mail.' }, { status: 500 });
  }
}