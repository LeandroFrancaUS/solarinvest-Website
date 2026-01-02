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

  // sistema (On-grid / híbrido / Off-grid)
  tipoSistema?: string;

  // instalação (telha/metal/solo/etc)
  tipoInstalacao?: string;

  // relação com imóvel (Proprietario/Inquilino/Locatario/Sindico)
  relacaoImovel?: string;

  // CPF/CNPJ (texto)
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
  "KOMMO_LEAD_FIELD_ID_CPF_CNPJ",
  "KOMMO_LEAD_FIELD_ID_TIPO_INSTALACAO",
];

/* =========================================================
   ENUM IDs REAIS (DO KOMMO)
========================================================= */

// IDs do seu print do Kommo:
const ENUM_ID_TIPO_SISTEMA = {
  "on-grid": 2402525,
  "hibrido": 2402527,
  "off-grid": 2402529,
} as const;

const ENUM_ID_ORIGEM = {
  "pre-analise": 2402517,
  "whastapp": 2402519, // (typo do Kommo, mantive)
  "facebook": 2402521,
  "instagram": 2402523,
} as const;

const ENUM_ID_RELACAO_IMOVEL = {
  "proprietario": 2402531,
  "inquilino": 2402533,
  "locatario": 2402535,
  "sindico": 2402537,
} as const;

const ENUM_ID_TIPO_INSTALACAO = {
  "telha fibrocimento": 2402811,
  "telhado metalico": 2402813,
  "telhado ceramico": 2402815,
  "laje": 2402817,
  "solo": 2402819,
  "outro": 2402821,
} as const;

/**
 * ✅ Se true: quando o usuário enviar um valor de select inválido,
 * o endpoint retorna 400 ao invés de apenas logar e seguir.
 */
const FAIL_ON_INVALID_SELECT = false;

/* =========================================================
   HELPERS (normalização e sanitização)
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
  const history = rateLimitLog.get(ip)?.filter((t) => t > windowStart) ?? [];

  if (history.length >= RATE_LIMIT_MAX) {
    rateLimitLog.set(ip, history);
    return true;
  }

  history.push(now);
  rateLimitLog.set(ip, history);
  return false;
}

/**
 * Normaliza textos para “chaves” de enum:
 * - remove acentos
 * - lowercase
 * - colapsa espaços
 * - normaliza hífen
 */
function normalizeKey(input: unknown) {
  const raw = sanitizeText(input, 120);
  if (!raw) return "";

  const noAccents = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove diacríticos

  return noAccents
    .toLowerCase()
    .replace(/[–—]/g, "-") // hífens “diferentes”
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Alguns valores do front podem vir com variações.
 * Aqui a gente “aperta” para bater com o que o Kommo espera.
 */
function normalizeTipoSistema(value?: unknown) {
  const k = normalizeKey(value);

  // aceita variações comuns
  if (k === "on grid") return "on-grid";
  if (k === "ongrid") return "on-grid";
  if (k === "hibrido" || k === "hibrido") return "hibrido";
  if (k === "off grid") return "off-grid";
  if (k === "offgrid") return "off-grid";

  // se já veio “on-grid/off-grid”
  return k;
}

function normalizeTipoInstalacao(value?: unknown) {
  let k = normalizeKey(value);

  // variações “telhado” vs “telha”
  if (k === "telhado fibrocimento") k = "telha fibrocimento";

  // normaliza metálico / cerâmico para sem acento e chave padrão
  if (k === "telhado metalico") k = "telhado metalico";
  if (k === "telhado ceramico") k = "telhado ceramico";

  // “outros” do front
  if (k === "outros") k = "outro";

  return k;
}

function normalizeRelacaoImovel(value?: unknown) {
  const k = normalizeKey(value);

  // variações
  if (k === "proprietario" || k === "proprietário") return "proprietario";
  if (k === "sindico" || k === "síndico") return "sindico";

  return k;
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

  // Em alguns endpoints pode vir 204. Aqui não é esperado.
  const txt = await response.text();
  if (!txt) return {} as T;

  return JSON.parse(txt) as T;
}

/* =========================================================
   CUSTOM FIELDS BUILDERS
========================================================= */

function buildTextOrNumberField(envName: string, value?: string | number) {
  const fieldId = getEnvNumber(envName);
  if (!fieldId || value === undefined || value === "") return null;
  return { field_id: fieldId, values: [{ value }] };
}

function buildSelectEnumField(
  envName: string,
  enumId: number | undefined,
  meta: { field: string; raw?: unknown; normalized?: string; requestId: string }
) {
  const fieldId = getEnvNumber(envName);
  if (!fieldId) return null;

  // se não veio nada, não envia campo
  if (meta.raw === undefined || meta.raw === null || meta.raw === "") return null;

  if (!enumId) {
    console.warn("[kommo-pre-analise] Select value not mapped", {
      requestId: meta.requestId,
      field: meta.field,
      raw: meta.raw,
      normalized: meta.normalized,
      envName,
    });

    if (FAIL_ON_INVALID_SELECT) {
      throw new Error(`INVALID_SELECT_${meta.field}`);
    }
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

  // ✅ normaliza selects vindos do front
  const tipoSistemaKey = normalizeTipoSistema(payload.tipoSistema);
  const tipoInstalacaoKey = normalizeTipoInstalacao(payload.tipoInstalacao);
  const relacaoImovelKey = normalizeRelacaoImovel(payload.relacaoImovel);

  const enumTipoSistema = (ENUM_ID_TIPO_SISTEMA as any)[tipoSistemaKey] as
    | number
    | undefined;

  const enumTipoInstalacao = (ENUM_ID_TIPO_INSTALACAO as any)[tipoInstalacaoKey] as
    | number
    | undefined;

  const enumRelacaoImovel = (ENUM_ID_RELACAO_IMOVEL as any)[relacaoImovelKey] as
    | number
    | undefined;

  const enumOrigem = (ENUM_ID_ORIGEM as any)["pre-analise"] as number;

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

        // ✅ Tipo de sistema
        buildSelectEnumField(
          "KOMMO_LEAD_FIELD_ID_TIPO_SISTEMA",
          enumTipoSistema,
          {
            field: "tipoSistema",
            raw: payload.tipoSistema,
            normalized: tipoSistemaKey,
            requestId,
          }
        ),

        // ✅ Tipo de instalação
        buildSelectEnumField(
          "KOMMO_LEAD_FIELD_ID_TIPO_INSTALACAO",
          enumTipoInstalacao,
          {
            field: "tipoInstalacao",
            raw: payload.tipoInstalacao,
            normalized: tipoInstalacaoKey,
            requestId,
          }
        ),

        // ✅ Relação com imóvel
        buildSelectEnumField(
          "KOMMO_LEAD_FIELD_ID_RELACAO_IMOVEL",
          enumRelacaoImovel,
          {
            field: "relacaoImovel",
            raw: payload.relacaoImovel,
            normalized: relacaoImovelKey,
            requestId,
          }
        ),

        // ✅ CPF/CNPJ (texto)
        buildTextOrNumberField(
          "KOMMO_LEAD_FIELD_ID_CPF_CNPJ",
          sanitizeText(payload.cpfCnpj, 60)
        ),

        // ✅ Origem fixa
        buildSelectEnumField("KOMMO_LEAD_FIELD_ID_ORIGEM", enumOrigem, {
          field: "origem",
          raw: "Pre Analise",
          normalized: "pre-analise",
          requestId,
        }),
      ].filter(Boolean),

      _embedded: {
        contacts: [
          {
            name: nomeRazao,
            custom_fields_values: [
              buildTextOrNumberField("KOMMO_CONTACT_EMAIL_FIELD_ID", email),
              buildTextOrNumberField("KOMMO_CONTACT_PHONE_FIELD_ID", whatsapp),
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
    const msg = (error as Error).message;

    // se você ligar FAIL_ON_INVALID_SELECT, devolve 400 claro:
    if (msg.startsWith("INVALID_SELECT_")) {
      const field = msg.replace("INVALID_SELECT_", "");
      return {
        status: 400,
        body: {
          ok: false,
          errorCode: "INVALID_SELECT",
          message: `Valor inválido no campo: ${field}.`,
        },
      };
    }

    console.error("[kommo-pre-analise] Failed", {
      requestId,
      error: msg,
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
