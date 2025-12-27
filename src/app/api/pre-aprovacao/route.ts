import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type AttachmentPayload = {
  filename: string;
  content: string;
  contentType: string;
  tag: string;
  note?: string;
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
  statusInterno?: string;
  prioridade: string;
  motivosInternos: string[];
  checklist: string[];
  tipoInstalacao: string;
  tipoInstalacaoOutro?: string;
  tipoRede?: string;
  attachments?: AttachmentPayload[];
};

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const remetente = 'Pré-Qualificação SolarInvest <contato@solarinvest.info>';
const destinatarios = ['brsolarinvest@gmail.com'];
const whatsappToken = process.env.WHATSAPP_TOKEN;
const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;
const solarinvestLogoUrl = 'https://solarinvest.info/logo.png';

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_COOLDOWN_MS = 20 * 1000;
const submissionLog = new Map<string, number[]>();

function normalizarWhatsapp(numero: string) {
  const digits = numero.replace(/\D/g, '');
  const semDdi = digits.startsWith('55') ? digits.slice(2) : digits;
  const local = semDdi.slice(-11);

  if (local.length < 10) return '';

  return `55${local}`;
}

function formatarWhatsappAgradavel(numero: string) {
  const digits = numero.replace(/\D/g, '');
  const semDdi = digits.startsWith('55') ? digits.slice(2) : digits;
  const local = semDdi.slice(-11);

  if (local.length === 11) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }

  if (local.length === 10) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }

  return `+55 ${local}`;
}

async function enviarWhatsapp(to: string, body: string, imageUrl?: string) {
  if (!whatsappToken || !whatsappPhoneId) {
    throw new Error('WhatsApp não configurado (WHATSAPP_TOKEN ou WHATSAPP_PHONE_ID ausente).');
  }

  if (!to) {
    throw new Error('WhatsApp destino ausente.');
  }

  if (imageUrl) {
    const imageResponse = await fetch(`https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'image',
        image: {
          link: imageUrl,
          caption: 'SolarInvest',
        },
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      throw new Error(`Falha ao enviar mídia do WhatsApp (${imageResponse.status}): ${errorText}`);
    }
  }

  const textResponse = await fetch(`https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${whatsappToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    }),
  });

  if (!textResponse.ok) {
    const errorText = await textResponse.text();
    throw new Error(`Falha ao enviar texto do WhatsApp (${textResponse.status}): ${errorText}`);
  }
}

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

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const history = submissionLog.get(ip)?.filter((timestamp) => timestamp > windowStart) ?? [];

  const lastRequest = history[history.length - 1];
  if (lastRequest && now - lastRequest < RATE_LIMIT_COOLDOWN_MS) {
    submissionLog.set(ip, history);
    return { limited: true, reason: 'Aguarde alguns segundos antes de enviar novamente.' };
  }

  if (history.length >= RATE_LIMIT_MAX) {
    submissionLog.set(ip, history);
    return {
      limited: true,
      reason: 'Detectamos muitas solicitações seguidas. Aguarde alguns minutos antes de tentar de novo.',
    };
  }

  history.push(now);
  submissionLog.set(ip, history);
  return { limited: false };
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

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const rateResult = isRateLimited(ip);
  if (rateResult.limited) {
    return NextResponse.json({ success: false, error: rateResult.reason }, { status: 429 });
  }

  const whatsappNormalizado = normalizarWhatsapp(body.whatsapp);
  const whatsappAmigavel = formatarWhatsappAgradavel(whatsappNormalizado);
  const whatsappLink = `https://wa.me/${whatsappNormalizado}`;
  const whatsappTelLink = `tel:+${whatsappNormalizado}`;

  if (!whatsappNormalizado) {
    return NextResponse.json({ success: false, error: 'WhatsApp inválido.' }, { status: 400 });
  }

  const assunto = `[Pré-Qualificação] ${body.status} — ${body.nome} — ${body.cep} — ${body.consumoMedio} kWh/mês`;

  const valorContaEstimado = Number((body.consumoMedio * body.tarifa).toFixed(2));

  const motivos = body.motivosInternos?.length
    ? `<ul>${body.motivosInternos.map((m) => `<li>${sanitize(m)}</li>`).join('')}</ul>`
    : '<p>Perfil forte para leasing.</p>';

  const checklist = body.checklist?.length
    ? `<ul>${body.checklist.map((item) => `<li>${sanitize(item)}</li>`).join('')}</ul>`
    : '<p>Nenhum documento adicional identificado.</p>';

  const obrigatoriosFaltando = (body.checklist || []).filter(
    (tag) => !(body.attachments || []).some((att) => att.tag === tag)
  );

  const tipoRede = body.tipoRede ? sanitize(body.tipoRede) : 'Não informado';

  const attachments = body.attachments?.length
    ? body.attachments.map((item) => ({
        filename: sanitize(item.filename),
        content: item.content,
        contentType: item.contentType,
      }))
    : undefined;

  const arquivosTabela = body.attachments?.length
    ? `<table style="width: 100%; border-collapse: collapse; margin-top: 8px;">${body.attachments
        .map(
          (item) => `
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 6px;">${sanitize(item.filename)}</td>
            <td style="border: 1px solid #e5e7eb; padding: 6px;">${sanitize(item.tag)}</td>
            <td style="border: 1px solid #e5e7eb; padding: 6px;">${sanitize(item.note ?? '')}</td>
          </tr>`
        )
        .join('')}</table>`
    : '<p>Nenhum arquivo enviado.</p>';

  try {
    const { data, error } = await resend.emails.send({
      from: remetente,
      to: destinatarios,
      subject: assunto,
      attachments,
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
            <li>
              <strong>Telefone/WhatsApp:</strong>
              <a href="${sanitize(whatsappLink)}" style="color: #e15800; text-decoration: none; font-weight: 600;">
                ${sanitize(whatsappAmigavel)}
              </a>
            </li>
            <li><strong>E-mail:</strong> ${sanitize(body.email)}</li>
            <li><strong>CEP:</strong> ${sanitize(body.cep)}</li>
            <li><strong>Município:</strong> ${sanitize(body.municipio)}</li>
            <li><strong>Endereço:</strong> ${sanitize(body.endereco)}</li>
          </ul>

          <h3>Energia</h3>
          <ul>
            <li><strong>Consumo médio:</strong> ${sanitize(String(body.consumoMedio))} kWh/mês</li>
            <li><strong>Tarifa:</strong> R$ ${sanitize(body.tarifa.toFixed(2))}/kWh</li>
            <li><strong>Conta atual estimada:</strong> R$ ${sanitize(valorContaEstimado.toFixed(2))} / mês</li>
            <li><strong>Conta enviada:</strong> ${attachments?.length ? `Sim (${attachments.length} arquivo(s))` : 'Não'}</li>
          </ul>

          <h3>Técnico</h3>
          <ul>
            <li><strong>Tipo de instalação:</strong> ${sanitize(body.tipoInstalacao)} ${sanitize(body.tipoInstalacaoOutro)}</li>
            <li><strong>Tipo de rede:</strong> ${tipoRede}</li>
          </ul>

          <h3>Resultado automático</h3>
          <ul>
            <li><strong>Status:</strong> ${sanitize(body.status)}</li>
            <li><strong>Status interno:</strong> ${sanitize(body.statusInterno ?? body.status)}</li>
            <li><strong>Motivos (interno):</strong> ${motivos}</li>
          </ul>

          <h3>Checklist interno</h3>
          ${checklist}

          <h3>Arquivos enviados</h3>
          ${arquivosTabela}

          <h3>Resumo obrigatório</h3>
          <p>Faltando: ${obrigatoriosFaltando.length ? obrigatoriosFaltando.join(', ') : 'Nenhum (OK)'}</p>

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

    const clienteEmail = await resend.emails.send({
      from: remetente,
      to: [body.email],
      subject: 'Recebemos sua pré-análise de leasing SolarInvest',
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; padding: 16px; line-height: 1.6;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <img src="${solarinvestLogoUrl}" alt="SolarInvest" width="140" height="48" style="object-fit: contain;" />
            <div style="font-weight: 600; color: #e15800;">SolarInvest</div>
          </div>
          <h2 style="color: #e15800; margin: 0 0 12px 0;">Solicitação recebida</h2>
          <p style="margin: 0 0 10px 0;">Olá, ${sanitize(body.nome)}.</p>
          <p style="margin: 0 0 12px 0;">Recebemos sua solicitação de pré-análise de leasing SolarInvest.</p>
          <p style="margin: 0 0 12px 0;">Status automático: <strong>${sanitize(body.status)}</strong></p>
          <p style="margin: 0 0 12px 0;">Em breve nossa equipe entrará em contato pelo WhatsApp +${sanitize(whatsappNormalizado)} para confirmar próximos passos.</p>
          <h3 style="margin: 16px 0 8px 0;">Resumo informado</h3>
          <ul>
            <li><strong>CEP:</strong> ${sanitize(body.cep)} — ${sanitize(body.municipio)}</li>
            <li><strong>Consumo médio:</strong> ${sanitize(String(body.consumoMedio))} kWh/mês</li>
            <li><strong>Tarifa:</strong> R$ ${sanitize(body.tarifa.toFixed(2))}/kWh</li>
            <li><strong>Conta atual estimada:</strong> R$ ${sanitize(valorContaEstimado.toFixed(2))} / mês</li>
          </ul>
          <p style="margin-top: 12px;">Se precisar complementar dados, responda a este e-mail ou aguarde nosso contato.</p>
        </div>
      `,
    });

    if (clienteEmail.error) {
      return NextResponse.json({ success: false, error: 'Erro ao enviar confirmação ao cliente.' }, { status: 502 });
    }

    try {
      await enviarWhatsapp(
        whatsappNormalizado,
        `Olá, ${body.nome}! Recebemos sua solicitação de pré-análise de leasing SolarInvest. Status automático: ${body.status}. Em breve entraremos em contato.`,
        solarinvestLogoUrl
      );
    } catch (err) {
      console.error('Erro ao enviar WhatsApp para pré-análise:', err);
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 });
  }
}
