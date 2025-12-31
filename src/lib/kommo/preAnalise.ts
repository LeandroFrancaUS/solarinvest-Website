import crypto from "crypto";

/* =========================================================
   TIPOS
========================================================= */

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

/* =========================================================
   RATE LIMIT
========================================================= */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_LIMIT_MAX = 10;
const rateLimitLog = new Map<string, number[]>();

/* =========================================================
   ENV OBRIGATÓRIAS
========================================================= */

const REQUIRED_ENV_VARS = [
  "KOMMO_SUBDOMAIN",
  "KOMMO_LONG_LIVED_TOKEN",
  "KOMMO_PIPELINE_ID",
  "KOMMO_STATUS_ID",
  "KOMMO_CONTACT_EMAIL_FIELD_ID",
  "KOMMO_CONTACT_PHONE_FIELD_ID",
  "KOMMO_LEAD_FIELD_ID_MUNICIPIO",
  "KOMMO_LEAD_FIELD_ID_CONSUMO_MEDIO",
  "KOMMO_LEAD_FIELD_ID_TIPO_SISTEMA",
  "KOMMO_LEAD_FIELD_ID_ORIGEM",
  "KOMMO_LEAD_FIELD_ID_RELACAO_IMOVEL",
];

/* =========================================================
   ENUMS (IDs REAIS DO KOMMO)
========================================================= */

const ENUM_TIPO_SISTEMA: Record<string, number> = {
  "On-grid": 2402525,
  "hibrido": 2402527,
  "Off-grid": 2402529,
};

const ENUM_ORIGEM: Record<string, number> = {
  "Pre Analise": 2402517,
  "Whatsapp": 2402519,
  "facebook": 2402521,
  "instagram": 2402523,
};

const ENUM_RELACAO_IMOVEL: Record<string, number> = {
  "Proprietario": 2402531,
  "Inquilino": 2402533,
  "Locatario": 2402535,
  "Sindico": 2402537,
};

/* =========================================================
   HELPERS
========================================================= */

function sanitizeText(value: unknown, max = 200) {
  if (!value || typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function sanitizeEmail(value: unknown) {
  return sanitizeText(value, 254).toLowerCase();
}

function sanitizeWhatsapp(value: unknown) {
  if (!value || typeof value !== "string") return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  return `+${digits}`;
}

function sanitizeNumber(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return undefined;
  }
  return value;
}

function getEnvNumber(name: string) {
  const raw = process.env[name];
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const history =
    rateLimitLog.get(ip)?.filter((t) => t > windowStart) ?? [];

  if (history.length >= RATE_LIMIT_MAX) {
    rateLimitLog.set(ip, history);
    return true;
  }

  history.push(now);
  rateLimitLog.set(ip, history);
  return false;
}

/* =========================================================
   KOMMO FETCH
========================================================= */

async function fetchKommo<T>(
  path: string,
  options: RequestInit,
  requestId: string
) {
  const subdomain = process.env.KOMMO_SUBDOMAIN!;
  const token = process.env.KOMMO_LONG_LIVED_TOKEN!;
  const url = `https://${subdomain}.kommo.com/api/v4${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Language": "pt",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[kommo-pre-analise] Request failed", {
      requestId,
      status: response.status,
      path,
      error: text,
    });
    throw new Error(`KOMMO_HTTP_${response.status}`);
  }

  return (await response.json()) as T;
}

/* =========================================================
   CUSTOM FIELDS
========================================================= */

function buildTextOrNumberField(
  envName: string,
  value?: string | number
) {
  const fieldId = getEnvNumber(envName);
  if (!fieldId || value === undefined || value === "") return null;
  return {
    field_id: fieldId,
    values: [{ value }],
  };
}

function buildSelectField(
  envName: string,
  enumMap: Record<string, number>,
  value?: string
) {
  const fieldId = getEnvNumber(envName);
  if (!fieldId || !value) return null;
  const enumId = enumMap[value];
  if (!enumId) return null;

  return {
    field_id: fieldId,
    values: [{ enum_id: enumId }],
  };
}

/* =========================================================
   PROCESSADOR PRINCIPAL
========================================================= */

export async function processKommoPreAnalise(
  payload: PreAnalisePayload,
  clientIp = "unknown"
): Promise<ProcessResult> {
  const missingEnv = REQUIRED_ENV_VARS.filter(
    (k) => !process.env[k]
  );

  if (missingEnv.length > 0) {
    return {
      status: 500,
      body: {
        ok: false,
        errorCode: "SERVER_NOT_CONFIGURED",
        message: "Servidor sem configuração da integração.",
      },
    };
  }

  if (isRateLimited(clientIp)) {
    return {
      status: 429,
      body: {
        ok: false,
        errorCode: "RATE_LIMITED",
        message: "Aguarde alguns minutos e tente novamente.",
      },
    };
  }

  const nomeRazao = sanitizeText(payload.nomeRazao);
  const email = sanitizeEmail(payload.email);
  const whatsapp = sanitizeWhatsapp(payload.whatsapp);

  if (!nomeRazao || !email || !whatsapp) {
    return {
      status: 400,
      body: {
        ok: false,
        errorCode: "VALIDATION_ERROR",
        message: "Nome, e-mail e WhatsApp são obrigatórios.",
      },
    };
  }

  const requestId = crypto.randomUUID();

  try {
    const leadPayload = {
      name: "Pré-análise — Site",
      pipeline_id: getEnvNumber("KOMMO_PIPELINE_ID"),
      status_id: getEnvNumber("KOMMO_STATUS_ID"),
      tags_to_add: ["origem:site", "pre-analise"],
      custom_fields_values: [
        buildTextOrNumberField(
          "KOMMO_LEAD_FIELD_ID_MUNICIPIO",
          sanitizeText(payload.municipio)
        ),
        buildTextOrNumberField(
          "KOMMO_LEAD_FIELD_ID_CONSUMO_MEDIO",
          sanitizeNumber(payload.consumoMedioMensal)
        ),
        buildSelectField(
          "KOMMO_LEAD_FIELD_ID_TIPO_SISTEMA",
          ENUM_TIPO_SISTEMA,
          payload.tipoSistema
        ),
        buildSelectField(
          "KOMMO_LEAD_FIELD_ID_ORIGEM",
          ENUM_ORIGEM,
          "Pre Analise"
        ),
        buildSelectField(
          "KOMMO_LEAD_FIELD_ID_RELACAO_IMOVEL",
          ENUM_RELACAO_IMOVEL,
          payload.tipoImovel
        ),
      ].filter(Boolean),
      _embedded: {
        contacts: [
          {
            name: nomeRazao,
            custom_fields_values: [
              buildTextOrNumberField(
                "KOMMO_CONTACT_EMAIL_FIELD_ID",
                email
              ),
              buildTextOrNumberField(
                "KOMMO_CONTACT_PHONE_FIELD_ID",
                whatsapp
              ),
            ].filter(Boolean),
          },
        ],
      },
    };

    await fetchKommo(
      "/leads/complex",
      {
        method: "POST",
        body: JSON.stringify([leadPayload]),
      },
      requestId
    );

    return { status: 200, body: { ok: true } };
  } catch (error) {
    console.error("[kommo-pre-analise] Failed", {
      requestId,
      error: (error as Error).message,
    });

    return {
      status: 503,
      body: {
        ok: false,
        errorCode: "KOMMO_ERROR",
        message:
          "Não foi possível enviar sua pré-análise. Tente novamente em alguns minutos.",
      },
    };
  }
}
