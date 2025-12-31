import crypto from 'crypto';

export type PreAnalisePayload = {
  nomeRazao?: string;
  email?: string;
  whatsapp?: string;
  municipio?: string;
  tipoImovel?: string;
  consumoMedioMensal?: number;
  tipoSistema?: string;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
};

type ProcessResult = {
  status: number;
  body: { ok: true } | { ok: false; errorCode: string; message: string };
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitLog = new Map<string, number[]>();

const REQUIRED_ENV_VARS = [
  'KOMMO_SUBDOMAIN',
  'KOMMO_LONG_LIVED_TOKEN',
  'KOMMO_PIPELINE_ID',
  'KOMMO_STATUS_ID',
  'KOMMO_CONTACT_EMAIL_FIELD_ID',
  'KOMMO_CONTACT_PHONE_FIELD_ID',
];

const optionalLeadFieldEnvVars = {
  municipio: 'KOMMO_LEAD_FIELD_ID_MUNICIPIO',
  tipoImovel: 'KOMMO_LEAD_FIELD_ID_TIPO_IMOVEL',
  consumoMedioMensal: 'KOMMO_LEAD_FIELD_ID_CONSUMO_MEDIO',
  tipoSistema: 'KOMMO_LEAD_FIELD_ID_TIPO_SISTEMA',
  utm_source: 'KOMMO_LEAD_FIELD_ID_UTM_SOURCE',
  utm_medium: 'KOMMO_LEAD_FIELD_ID_UTM_MEDIUM',
  utm_campaign: 'KOMMO_LEAD_FIELD_ID_UTM_CAMPAIGN',
  utm_content: 'KOMMO_LEAD_FIELD_ID_UTM_CONTENT',
} as const;

function sanitizeText(value: unknown, maxLength = 200) {
  if (!value || typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function sanitizeEmail(value: unknown) {
  return sanitizeText(value, 254).toLowerCase();
}

function sanitizeWhatsapp(value: unknown) {
  if (!value || typeof value !== 'string') return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return `+${digits}`;
}

function sanitizeNumber(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || value < 0) return undefined;
  return value;
}

function getEnvNumber(name: string) {
  const raw = process.env[name];
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function validatePayload(payload: PreAnalisePayload) {
  const nomeRazao = sanitizeText(payload.nomeRazao);
  const email = sanitizeEmail(payload.email);
  const whatsapp = sanitizeWhatsapp(payload.whatsapp);
  const municipio = sanitizeText(payload.municipio);
  const tipoImovel = sanitizeText(payload.tipoImovel);
  const tipoSistema = sanitizeText(payload.tipoSistema);
  const consumoMedioMensal = sanitizeNumber(payload.consumoMedioMensal);

  const missing = !nomeRazao || !email || !whatsapp;
  if (missing) {
    return {
      valid: false as const,
      response: {
        status: 400,
        body: {
          ok: false as const,
          errorCode: 'VALIDATION_ERROR',
          message: 'Preencha nome, e-mail e WhatsApp para enviar sua pré-análise.',
        },
      },
    };
  }

  return {
    valid: true as const,
    data: { nomeRazao, email, whatsapp, municipio, tipoImovel, tipoSistema, consumoMedioMensal },
  };
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const history = rateLimitLog.get(ip)?.filter((timestamp) => timestamp > windowStart) ?? [];

  if (history.length >= RATE_LIMIT_MAX) {
    rateLimitLog.set(ip, history);
    return true;
  }

  history.push(now);
  rateLimitLog.set(ip, history);
  return false;
}

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  if (user.length <= 2) return `***@${domain}`;
  return `${user.slice(0, 1)}***${user.slice(-1)}@${domain}`;
}

function maskPhone(phone: string) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '***';
  return `***${digits.slice(-4)}`;
}

async function fetchKommo<T>(path: string, options: RequestInit, requestId: string) {
  const subdomain = process.env.KOMMO_SUBDOMAIN;
  const token = process.env.KOMMO_LONG_LIVED_TOKEN;
  const url = `https://${subdomain}.kommo.com/api/v4${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Language': 'pt',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[kommo-pre-analise] Request failed', { requestId, status: response.status, path, error: errorText });
    throw new Error(`KOMMO_HTTP_${response.status}`);
  }

  return (await response.json()) as T;
}

function extractFieldValue(contact: any, fieldId: number) {
  const field = (contact?.custom_fields_values ?? []).find((f: any) => f.field_id === fieldId);
  if (!field) return [] as string[];
  return (field.values ?? []).map((v: any) => String(v.value ?? ''));
}

async function findExistingContact(email: string, whatsapp: string, requestId: string) {
  const query = email || whatsapp;
  if (!query) return undefined;

  try {
    const data = await fetchKommo<{ _embedded?: { contacts?: any[] } }>(`/contacts?query=${encodeURIComponent(query)}`, { method: 'GET' }, requestId);
    const contacts = data._embedded?.contacts ?? [];
    const emailFieldId = getEnvNumber('KOMMO_CONTACT_EMAIL_FIELD_ID');
    const phoneFieldId = getEnvNumber('KOMMO_CONTACT_PHONE_FIELD_ID');

    for (const contact of contacts) {
      if (emailFieldId) {
        const emails = extractFieldValue(contact, emailFieldId).map((emailValue: string) => emailValue.toLowerCase());
        if (email && emails.includes(email)) return contact.id as number | undefined;
      }

      if (phoneFieldId) {
        const phones = extractFieldValue(contact, phoneFieldId).map((phoneValue: string) => phoneValue.replace(/\D/g, ''));
        const normalizedPhone = whatsapp.replace(/\D/g, '');
        if (normalizedPhone && phones.some((p) => p.endsWith(normalizedPhone))) {
          return contact.id as number | undefined;
        }
      }
    }

    return contacts[0]?.id as number | undefined;
  } catch (error) {
    console.error('[kommo-pre-analise] Failed to search contact', { requestId, error: (error as Error).message });
    return undefined;
  }
}

function buildCustomField(fieldIdEnv: string, value?: string | number) {
  const fieldId = getEnvNumber(fieldIdEnv);
  if (!fieldId || value === undefined || value === '') return null;
  return {
    field_id: fieldId,
    values: [{ value }],
  };
}

export async function processKommoPreAnalise(payload: PreAnalisePayload, clientIp = 'unknown'): Promise<ProcessResult> {
  const missingEnv = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missingEnv.length > 0) {
    return {
      status: 500,
      body: {
        ok: false,
        errorCode: 'SERVER_NOT_CONFIGURED',
        message: 'Servidor sem configuração da integração.',
      },
    };
  }

  if (isRateLimited(clientIp)) {
    return {
      status: 429,
      body: {
        ok: false,
        errorCode: 'RATE_LIMITED',
        message: 'Detectamos muitas tentativas. Aguarde alguns minutos e tente novamente.',
      },
    };
  }

  const validation = validatePayload(payload);
  if (!validation.valid) return validation.response;
  const { nomeRazao, email, whatsapp, municipio, tipoImovel, tipoSistema, consumoMedioMensal } = validation.data;

  const pipelineId = getEnvNumber('KOMMO_PIPELINE_ID');
  const statusId = getEnvNumber('KOMMO_STATUS_ID');
  const contactEmailFieldId = getEnvNumber('KOMMO_CONTACT_EMAIL_FIELD_ID');
  const contactPhoneFieldId = getEnvNumber('KOMMO_CONTACT_PHONE_FIELD_ID');
  const requestId = crypto.randomUUID();

  if (!pipelineId || !statusId || !contactEmailFieldId || !contactPhoneFieldId) {
    return {
      status: 500,
      body: {
        ok: false,
        errorCode: 'SERVER_NOT_CONFIGURED',
        message: 'Servidor sem configuração da integração.',
      },
    };
  }

  try {
    const existingContactId = await findExistingContact(email, whatsapp, requestId);

    const leadCustomFields = [
      buildCustomField(optionalLeadFieldEnvVars.municipio, municipio),
      buildCustomField(optionalLeadFieldEnvVars.tipoImovel, tipoImovel),
      buildCustomField(optionalLeadFieldEnvVars.consumoMedioMensal, consumoMedioMensal ?? undefined),
      buildCustomField(optionalLeadFieldEnvVars.tipoSistema, tipoSistema),
      buildCustomField(optionalLeadFieldEnvVars.utm_source, sanitizeText(payload.utm?.utm_source)),
      buildCustomField(optionalLeadFieldEnvVars.utm_medium, sanitizeText(payload.utm?.utm_medium)),
      buildCustomField(optionalLeadFieldEnvVars.utm_campaign, sanitizeText(payload.utm?.utm_campaign)),
      buildCustomField(optionalLeadFieldEnvVars.utm_content, sanitizeText(payload.utm?.utm_content)),
    ].filter(Boolean) as Array<{ field_id: number; values: Array<{ value: string | number }> }>;

    const leadPayload: any = {
      name: 'Pré-análise — Site',
      pipeline_id: pipelineId,
      status_id: statusId,
      tags_to_add: ['origem:site', 'pre-analise'],
      custom_fields_values: leadCustomFields,
      _embedded: {
        contacts: [],
      },
    };

    if (existingContactId) {
      leadPayload._embedded.contacts.push({ id: existingContactId });
    } else {
      const contactFields = [
        buildCustomField('KOMMO_CONTACT_EMAIL_FIELD_ID', email),
        buildCustomField('KOMMO_CONTACT_PHONE_FIELD_ID', whatsapp),
      ].filter(Boolean);

      leadPayload._embedded.contacts.push({
        first_name: nomeRazao,
        custom_fields_values: contactFields,
      });
    }

    await fetchKommo('/leads/complex', { method: 'POST', body: JSON.stringify([leadPayload]) }, requestId);

    return { status: 200, body: { ok: true } };
  } catch (error) {
    const maskedEmail = maskEmail(email);
    const maskedPhone = maskPhone(whatsapp);
    console.error('[kommo-pre-analise] Failed to create lead', {
      requestId,
      error: (error as Error).message,
      email: maskedEmail,
      whatsapp: maskedPhone,
    });

    const isKommoError = (error as Error).message.startsWith('KOMMO_HTTP_');

    return {
      status: isKommoError ? 502 : 500,
      body: {
        ok: false,
        errorCode: 'KOMMO_ERROR',
        message: 'Não conseguimos enviar sua pré-análise agora. Tente novamente em alguns minutos.',
      },
    };
  }
}
