// src/app/api/contato/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// ✅ Inicializa o serviço Resend somente se a chave de API estiver definida
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// 🔐 Define remetente personalizado (necessita validação no painel do Resend)
const remetente = 'Contato SolarInvest <contato@solarinvest.info>'; // Deve estar validado no painel da Resend

function sanitize(input: string): string {
  return input.replace(/[&<>"']/g, (char) => {
    const chars: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return chars[char];
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const estadosBrasil = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const normalizeWhatsapp = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const semDdi = digits.startsWith('55') ? digits.slice(2) : digits;
  const local = semDdi.slice(-11);

  if (local.length < 10) return '';

  return `55${local}`;
};

export async function POST(req: Request) {
  if (!resend) {
    console.error('[❌ Missing RESEND_API_KEY]');
    return NextResponse.json(
      { success: false, error: 'Servidor mal configurado.' },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'JSON inválido.' },
      { status: 400 }
    );
  }

  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const consumo = typeof body.consumo === 'string' ? body.consumo.trim() : '';
  const municipio = typeof body.municipio === 'string' ? body.municipio.trim() : '';
  const estado = typeof body.estado === 'string' ? body.estado.trim().toUpperCase() : '';
  const whatsapp = typeof body.whatsapp === 'string' ? normalizeWhatsapp(body.whatsapp) : '';
  const mensagem = typeof body.mensagem === 'string' ? body.mensagem.trim() : '';

  if (
    !nome ||
    nome.length > 100 ||
    !isValidEmail(email) ||
    !consumo ||
    consumo.length > 200 ||
    !municipio ||
    municipio.length > 200 ||
    !estado ||
    !estadosBrasil.includes(estado) ||
    !whatsapp ||
    whatsapp.length < 12 ||
    whatsapp.length > 15 ||
    !mensagem ||
    mensagem.length > 2000
  ) {
    return NextResponse.json(
      { success: false, error: 'Dados inválidos.' },
      { status: 400 }
    );
  }

  const mensagemSanitizada = sanitize(mensagem).replace(/\n/g, '<br/>');

  try {
    const { data, error } = await resend.emails.send({
      from: remetente,
      to: ['brsolarinvest@gmail.com'],
      subject: `Nova mensagem via site SolarInvest (${sanitize(municipio)}/${sanitize(estado)})`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #E15800;">📬 Nova mensagem recebida</h2>
          <p><strong>👤 Nome:</strong> ${sanitize(nome)}</p>
          <p><strong>✉️ Email:</strong> ${sanitize(email)}</p>
          <p><strong>📊 Consumo médio (12 meses):</strong> ${sanitize(consumo)}</p>
          <p><strong>📍 Local de instalação:</strong> ${sanitize(municipio)} / ${sanitize(estado)}</p>
          <p><strong>📱 WhatsApp:</strong> +${sanitize(whatsapp)}</p>
          <p><strong>📝 Mensagem:</strong></p>
          <div style="margin-top: 10px; padding: 15px; background: #f9f9f9; border-left: 4px solid #E15800;">
            ${mensagemSanitizada}
          </div>
          <hr style="margin-top: 30px;" />
          <p style="font-size: 12px; color: #999;">Site: <a href="https://solarinvest.info">solarinvest.info</a></p>
        </div>
      `,
    });

    if (error) {
      console.error('[❌ Erro ao enviar email]', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao enviar email.' },
        { status: 502 }
      );
    }

    console.log('[✔️ Email enviado com sucesso]', data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[❌ Erro ao enviar email]', err);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}

