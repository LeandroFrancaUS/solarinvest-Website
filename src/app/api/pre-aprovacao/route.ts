import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type AttachmentPayload = {
  filename: string;
  content: string;
  contentType: string;
};

type Payload = {
  nome: string;
  cpfCnpj: string;
  whatsapp: string;
  email: string;
  cep: string;
  municipio: string;
  endereco: string;
  tipoCliente: string;
  tipoClienteOutro?: string;
  relacaoImovel: string;
  relacaoOutro?: string;
  consumoMedio: number;
  tarifa: number;
  status: 'PRE_APROVADO' | 'PENDENTE' | 'NAO_ELEGIVEL';
  prioridade: string;
  motivosInternos: string[];
  checklist: string[];
  tipoInstalacao: string;
  tipoInstalacaoOutro?: string;
  tipoRede?: string;
  attachment?: AttachmentPayload;
};

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const remetente = 'Pré-Qualificação SolarInvest <contato@solarinvest.info>';
const destinatarios = ['brsolarinvest@gmail.com'];

function sanitize(input: string | undefined) {
  if (!input) return '';
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

export async function POST(req: Request) {
  if (!resend) {
    return NextResponse.json({ success: false, error: 'Servidor não configurado.' }, { status: 500 });
  }

  let body: Payload;

  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ success: false, error: 'JSON inválido.' }, { status: 400 });
  }

  const missing =
    !body.nome ||
    !body.cpfCnpj ||
    !body.whatsapp ||
    !body.email ||
    !body.cep ||
    !body.municipio ||
    !body.consumoMedio ||
    !body.tarifa ||
    !body.tipoCliente ||
    !body.relacaoImovel ||
    !body.tipoInstalacao;

  if (missing) {
    return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes.' }, { status: 400 });
  }

  const assunto = `[Pré-Qualificação] ${body.status} — ${body.nome} — ${body.cep} — ${body.consumoMedio} kWh/mês`;

  const motivos = body.motivosInternos?.length
    ? `<ul>${body.motivosInternos.map((m) => `<li>${sanitize(m)}</li>`).join('')}</ul>`
    : '<p>Perfil forte para leasing.</p>';

  const checklist = body.checklist?.length
    ? `<ul>${body.checklist.map((item) => `<li>${sanitize(item)}</li>`).join('')}</ul>`
    : '<p>Nenhum documento adicional identificado.</p>';

  const tipoRede = body.tipoRede ? sanitize(body.tipoRede) : 'Não informado';

  const attachment = body.attachment
    ? [
        {
          filename: sanitize(body.attachment.filename),
          content: body.attachment.content,
          contentType: body.attachment.contentType,
        },
      ]
    : undefined;

  try {
    const { data, error } = await resend.emails.send({
      from: remetente,
      to: destinatarios,
      subject: assunto,
      attachments: attachment,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; padding: 16px; line-height: 1.5;">
          <h2 style="color: #e15800;">Pré-qualificação de Leasing</h2>
          <p style="margin: 0 0 12px 0;">Status automático: <strong>${sanitize(body.status)}</strong></p>

          <h3>Dados do cliente</h3>
          <ul>
            <li><strong>Nome/Razão Social:</strong> ${sanitize(body.nome)}</li>
            <li><strong>CPF/CNPJ:</strong> ${sanitize(body.cpfCnpj)}</li>
            <li><strong>Tipo de cliente:</strong> ${sanitize(body.tipoCliente)} ${sanitize(body.tipoClienteOutro)}</li>
            <li><strong>Relação com imóvel:</strong> ${sanitize(body.relacaoImovel)} ${sanitize(body.relacaoOutro)}</li>
            <li><strong>Telefone:</strong> ${sanitize(body.whatsapp)}</li>
            <li><strong>E-mail:</strong> ${sanitize(body.email)}</li>
            <li><strong>CEP:</strong> ${sanitize(body.cep)}</li>
            <li><strong>Município:</strong> ${sanitize(body.municipio)}</li>
            <li><strong>Endereço:</strong> ${sanitize(body.endereco)}</li>
          </ul>

          <h3>Energia</h3>
          <ul>
            <li><strong>Consumo médio:</strong> ${sanitize(String(body.consumoMedio))} kWh/mês</li>
            <li><strong>Tarifa:</strong> R$ ${sanitize(body.tarifa.toFixed(2))}/kWh</li>
            <li><strong>Conta enviada:</strong> ${body.attachment ? 'Sim (em anexo)' : 'Não'}</li>
          </ul>

          <h3>Técnico</h3>
          <ul>
            <li><strong>Tipo de instalação:</strong> ${sanitize(body.tipoInstalacao)} ${sanitize(body.tipoInstalacaoOutro)}</li>
            <li><strong>Tipo de rede:</strong> ${tipoRede}</li>
          </ul>

          <h3>Resultado automático</h3>
          <ul>
            <li><strong>Status:</strong> ${sanitize(body.status)}</li>
            <li><strong>Motivos (interno):</strong> ${motivos}</li>
          </ul>

          <h3>Checklist interno</h3>
          ${checklist}

          <h3>Campos internos extras</h3>
          <ul>
            <li><strong>Score:</strong> ${Math.min(100, Math.round(body.consumoMedio / 10))}</li>
            <li><strong>Rota sugerida:</strong> ${
              body.status === 'PRE_APROVADO'
                ? 'Comercial imediato'
                : body.status === 'PENDENTE'
                  ? 'Triagem documentação'
                  : 'Oferta alternativa'
            }</li>
            <li><strong>Prioridade:</strong> ${sanitize(body.prioridade)}</li>
          </ul>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ success: false, error: 'Erro ao enviar e-mail.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 });
  }
}
