import crypto from "crypto";

/* =========================================================
   TIPOS
========================================================= */

export type PreAnalisePayload = {
  nomeRazao?: string;
  email?: string;
  whatsapp?: string;
  municipio?: string;
  consumoMedioMensal?: number;

  // Selects
  tipoSistema?: string;       // On-grid | Hibrido | Off-grid
  tipoInstalacao?: string;    // Telha fibrocimento | etc
  relacaoImovel?: string;     // Proprietario | Inquilino | etc
  tipoRede?: string;          // Monofásico | Bifásico | Trifásico (opcional)

  // Texto
  cpfCnpj?: string;

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

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitLog = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const history = rateLimitLog.get(ip)?.filter((t) => t > windowStart) ?? [];

  if (history.length >= RATE_LIMIT_MAX) {
    rateLimitLog.set(ip, history);
    return true;
  }

  history.push(now);
  rateLimitLog.set(ip, history);
  return false;
}

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
  "KOMMO_LEAD_FIELD_ID_TIPO_INSTALACAO",
  "KOMMO_LEAD_FIELD_ID_RELACAO_IMOVEL",
  "KOMMO_LEAD_FIELD_ID_TIPO_REDE",
  "KOMMO_LEAD_FIELD_ID_CPF_CNPJ",
  "KOMMO_LEAD_FIELD_ID_ORIGEM",
];

/* =========================================================
   ENUMS DO KOMMO (IDs REAIS)
========================================================= */

const ENUM_TIPO_SISTEMA: Record<string, number> = {
  "on-grid": 2402525,
  "hibrido": 2402527,
  "off-grid": 2402529,
};

const ENUM_TIPO_INSTALACAO: Record<string, number> = {
  "telha fibrocimento": 2402811,
  "telhado metalico": 2402813,
  "telhado ceramico": 2402815,
  "laje": 2402817,
  "solo": 2402819,
  "outro": 2402821,
};

const ENUM_RELACAO_IMOVEL: Record<string, number> = {
  "proprietario": 2402531,
  "inquilino": 2402533,
  "locatario": 2402535,
  "sindico": 2402537,
};

const ENUM_TIPO_REDE: Record<string, number> = {
  "monofasico": 2402829,
  "bifasico": 2402831,
  "trifasico": 2402833,
};

const ENUM_ORIGEM: Record<string, number> = {
  "pre-analise": 2402517,
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

function normalizeKey(value?: unknown) {
  if (!value || typeof value !== "string") return "";

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
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

  const txt = await response.text();
  return txt ? (JSON.parse(txt) as T) : ({} as T);
}

/* =========================================================
   BUILDERS DE CAMPOS
========================================================= */

function buildTextField(envName: string, value?: string | number) {
  const fieldId = getEnvNumber(envName);
  if (!fieldId || value === undefined || value === "") return null;
  return { field_id: fieldId, values: [{ value }] };
}

function buildSelectField(
  envName: string,
  enumMap: Record<string, number>,
  rawValue?: string
) {
  const fieldId = getEnvNumber(envName);
  if (!fieldId || !rawValue) return null;

  const normalized = normalizeKey(rawValue);
  const enumId = enumMap[normalized];

  if (!enumId) {
    console.warn("[kommo-pre-analise] Enum não encontrado", {
      envName,
      rawValue,
      normalized,
      available: Object.keys(enumMap),
    });
    return null;
  }

  return { field_id: fieldId, values: [{ enum_id: enumId }] };
}

/* =========================================================
   PROCESSADOR PRINCIPAL
========================================================= */

export async function processKommoPreAnalise(
  payload: PreAnalisePayload,
  clientIp = "unknown"
): Promise<ProcessResult> {
  const missingEnv = REQUIRED_ENV_VARS.filter((k) => !process.env[k]);
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
        buildTextField("KOMMO_LEAD_FIELD_ID_MUNICIPIO", sanitizeText(payload.municipio)),
        buildTextField("KOMMO_LEAD_FIELD_ID_CONSUMO_MEDIO", sanitizeNumber(payload.consumoMedioMensal)),

        buildSelectField("KOMMO_LEAD_FIELD_ID_TIPO_SISTEMA", ENUM_TIPO_SISTEMA, payload.tipoSistema),
        buildSelectField("KOMMO_LEAD_FIELD_ID_TIPO_INSTALACAO", ENUM_TIPO_INSTALACAO, payload.tipoInstalacao),
        buildSelectField("KOMMO_LEAD_FIELD_ID_RELACAO_IMOVEL", ENUM_RELACAO_IMOVEL, payload.relacaoImovel),

        // ✅ Tipo de rede (opcional)
        buildSelectField("KOMMO_LEAD_FIELD_ID_TIPO_REDE", ENUM_TIPO_REDE, payload.tipoRede),

        buildTextField("KOMMO_LEAD_FIELD_ID_CPF_CNPJ", sanitizeText(payload.cpfCnpj, 60)),
        buildSelectField("KOMMO_LEAD_FIELD_ID_ORIGEM", ENUM_ORIGEM, "pre-analise"),
      ].filter(Boolean),

      _embedded: {
        contacts: [
          {
            name: nomeRazao,
            custom_fields_values: [
              buildTextField("KOMMO_CONTACT_EMAIL_FIELD_ID", email),
              buildTextField("KOMMO_CONTACT_PHONE_FIELD_ID", whatsapp),
            ].filter(Boolean),
          },
        ],
      },
    };

    await fetchKommo(
      "/leads/complex",
      { method: "POST", body: JSON.stringify([leadPayload]) },
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
