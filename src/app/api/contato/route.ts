// src/app/api/contato/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// ✅ Inicializa o serviço Resend com a variável de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

// 🔐 Define remetente personalizado (necessita validação no painel do Resend)
const remetente = 'Contato SolarInvest <contato@solarinvest.info>'; // Deve estar validado no painel da Resend

export async function POST(req: Request) {
  const { nome, email, mensagem } = await req.json();

  try {
    const data = await resend.emails.send({
      from: remetente,
      to: ['brsolarinvest@gmail.com'],
      subject: 'Nova mensagem via site SolarInvest',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #E15800;">📬 Nova mensagem recebida</h2>
          <p><strong>👤 Nome:</strong> ${nome}</p>
          <p><strong>✉️ Email:</strong> ${email}</p>
          <p><strong>📝 Mensagem:</strong></p>
          <div style="margin-top: 10px; padding: 15px; background: #f9f9f9; border-left: 4px solid #E15800;">
            ${mensagem.replace(/\n/g, '<br/>')}
          </div>
          <hr style="margin-top: 30px;" />
          <p style="font-size: 12px; color: #999;">Site: <a href="https://solarinvest.info">solarinvest.info</a></p>
        </div>
      `,
    });

    console.log('[✔️ Email enviado com sucesso]', data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[❌ Erro ao enviar email]', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}