'use client';

import { ClipboardEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __leadSent?: boolean;
  }
}

/* =========================================================
   TIPOS (UI)
========================================================= */

type ClientType = 'Residencial' | 'Comercial' | 'Condomínio (vertical)' | 'Condomínio (horizontal)' | 'Outro' | '';

type PropertyRelation =
  | 'Proprietário'
  | 'Inquilino (locatário)'
  | 'Comodatário (uso gratuito)'
  | 'Arrendatário'
  | 'Familiar do proprietário'
  | 'Administrador / Síndico'
  | '';

type InstallationType = 'Telhado fibrocimento' | 'Telhado metálico' | 'Telhado cerâmico' | 'Laje' | 'Solo' | 'Outro';

type RedeType = 'Monofásica' | 'Bifásica' | 'Trifásica' | '';

type SystemType = 'On-grid' | 'Híbrido' | 'Off-grid' | '';

type DocTag =
  | 'CONTA_ENERGIA_ATUAL'
  | 'DOC_ID_SOLICITANTE'
  | 'CPF_CNPJ_SOLICITANTE'
  | 'DOC_ID_PROPRIETARIO'
  | 'CPF_CNPJ_PROPRIETARIO'
  | 'COMPROVANTE_VINCULO_PROPRIETARIO'
  | 'CONTRATO_LOCACAO'
  | 'CONTRATO_COMODATO'
  | 'CONTRATO_ARRENDAMENTO'
  | 'AUTORIZACAO_PROPRIETARIO_ASSINADA'
  | 'PROCURACAO'
  | 'COMPROVANTE_PROPRIEDADE'
  | 'ATA_ASSEMBLEIA_APROVACAO'
  | 'AUTORIZACAO_CONDOMINIO_ASSINADA'
  | 'DOC_ID_SINDICO_ADMIN'
  | 'COMPROVANTE_VINCULO_SINDICO'
  | 'FOTOS_LOCAL_INSTALACAO';

const ALL_DOC_TAGS: DocTag[] = [
  'CONTA_ENERGIA_ATUAL',
  'DOC_ID_SOLICITANTE',
  'CPF_CNPJ_SOLICITANTE',
  'DOC_ID_PROPRIETARIO',
  'CPF_CNPJ_PROPRIETARIO',
  'COMPROVANTE_VINCULO_PROPRIETARIO',
  'CONTRATO_LOCACAO',
  'CONTRATO_COMODATO',
  'CONTRATO_ARRENDAMENTO',
  'AUTORIZACAO_PROPRIETARIO_ASSINADA',
  'PROCURACAO',
  'COMPROVANTE_PROPRIEDADE',
  'ATA_ASSEMBLEIA_APROVACAO',
  'AUTORIZACAO_CONDOMINIO_ASSINADA',
  'DOC_ID_SINDICO_ADMIN',
  'COMPROVANTE_VINCULO_SINDICO',
  'FOTOS_LOCAL_INSTALACAO',
];

const BILL_RECOMMENDED: DocTag[] = ['CONTA_ENERGIA_ATUAL'];

export type StatusResultado = 'PRE_APROVADO' | 'PENDENTE' | 'NAO_ELEGIVEL';

type FormState = {
  nome: string;
  cpfCnpj: string;
  whatsapp: string;
  email: string;
  cep: string;
  municipio: string;
  endereco: string;

  tipoCliente: ClientType;
  tipoClienteOutro: string;

  relacaoImovel: PropertyRelation;
  relacaoOutro: string;

  consumoMedio: string;
  tarifa: string;

  // ✅ NOVO: tipo de sistema (obrigatório)
  tipoSistema: SystemType;

  tipoInstalacao: InstallationType;
  tipoInstalacaoOutro: string;

  // ✅ já existia
  tipoRede: RedeType;
};

type AttachmentPayload = {
  filename: string;
  content: string;
  contentType: string;
  tag: DocTag;
  note?: string;
};

type AttachmentWithMeta = {
  id: string;
  file: File;
  tag: DocTag | '';
  note: string;
};

type ValidationErrors = Partial<Record<keyof FormState, string>> & { geral?: string };

type SubmissionState = {
  status?: StatusResultado;
  message?: string;
  loading: boolean;
};

type MunicipioState = { status: 'idle' | 'loading' | 'not_found' | 'error' | 'loaded'; label: string };

const initialState: FormState = {
  nome: '',
  cpfCnpj: '',
  whatsapp: '',
  email: '',
  cep: '',
  municipio: '',
  endereco: '',

  tipoCliente: '',
  tipoClienteOutro: '',

  relacaoImovel: '',
  relacaoOutro: '',

  consumoMedio: '',
  tarifa: '',

  // ✅ default on-grid (você pode trocar pra '' se quiser obrigar escolher)
  tipoSistema: 'On-grid',

  tipoInstalacao: 'Telhado fibrocimento',
  tipoInstalacaoOutro: '',

  tipoRede: '',
};

export const statusMessages: Record<StatusResultado, string> = {
  PRE_APROVADO:
    'Pelos dados informados, você tem forte elegibilidade para o leasing SolarInvest. Nossa equipe vai analisar sua conta e te chamar no WhatsApp para confirmar os próximos passos.',
  PENDENTE:
    'Recebido! Seus dados foram enviados para análise. Em alguns casos precisamos confirmar informações (ex.: conta de energia, autorização do proprietário ou tipo de instalação). Em breve chamaremos você no WhatsApp.',
  NAO_ELEGIVEL:
    'Por enquanto, pode não ser o ideal. Pelo consumo informado, o leasing tende a não gerar o melhor custo-benefício. Mas podemos avaliar outras opções (compra/financiamento) ou uma solução sob medida.',
};

export const statusVisuals: Record<StatusResultado, { title: string; icon: string; styles: string; accent: string }> = {
  PRE_APROVADO: {
    title: 'PRÉ-APROVADO',
    icon: '✅',
    styles: 'bg-green-50 border-green-200 text-green-900',
    accent: 'text-green-800',
  },
  PENDENTE: {
    title: 'EM ANÁLISE',
    icon: '🔎',
    styles: 'bg-amber-50 border-amber-200 text-amber-900',
    accent: 'text-amber-800',
  },
  NAO_ELEGIVEL: {
    title: 'NÃO ELEGÍVEL NO MOMENTO',
    icon: 'ℹ️',
    styles: 'bg-slate-50 border-slate-200 text-slate-900',
    accent: 'text-slate-700',
  },
};

/* =========================================================
   HELPERS
========================================================= */

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatCpfCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function formatWhatsapp(value: string) {
  const digits = onlyDigits(value).slice(0, 13);
  if (digits.length <= 10) return digits;
  const match = digits.match(/(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/);
  if (!match) return digits;
  const [, ddd, first, middle, last] = match;
  const part1 = ddd ? `(${ddd}` + (ddd.length === 2 ? ') ' : '') : '';
  const part2 = first ? `${first} ` : '';
  const part3 = middle ? middle + (middle.length === 4 && last ? '-' : '') : '';
  return `${part1}${part2}${part3}${last ?? ''}`.trim();
}

function formatCEP(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

const legalNameRegex = /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 .,&\-/]*$/u;

function sanitizeLegalName(raw: string, options?: { trimEdges?: boolean }) {
  const cleaned = raw.replace(/[^\p{L}\p{N}\s.,&/-]/gu, '');
  const normalizedSpaces = cleaned.replace(/\s+/g, ' ');
  const normalizedHyphens = normalizedSpaces.replace(/-+/g, '-');
  const normalizedSlashes = normalizedHyphens.replace(/\/+/g, '/');
  const shouldTrim = options?.trimEdges !== false;
  const cleanedEdges = shouldTrim
    ? normalizedSlashes.replace(/^[\s.,&/-]+|[\s.,&/-]+$/g, '')
    : normalizedSlashes.replace(/^[\s.,&/-]+/, '');
  return { value: cleanedEdges, changed: cleanedEdges !== raw };
}

function isValidLegalName(value: string) {
  if (!value) return false;
  return legalNameRegex.test(value.trim());
}

function normalizarWhatsappBrasil(numero: string) {
  const digits = onlyDigits(numero);
  const semDdi = digits.startsWith('55') ? digits.slice(2) : digits;
  const local = semDdi.slice(-11);

  if (local.length < 10) return '';
  return `55${local}`;
}

function maskCpfCnpj(value: string) {
  const digits = onlyDigits(value);
  if (digits.length !== 11 && digits.length !== 14) return value;

  const maskedDigits = digits
    .split('')
    .map((digit, index) => (index < digits.length - 4 ? '•' : digit))
    .join('');

  if (digits.length === 11) {
    return maskedDigits
      .replace(/(.{3})(.)/, '$1.$2')
      .replace(/(.{3})(.)/, '$1.$2')
      .replace(/(.{3})(.{1,2})$/, '$1-$2');
  }

  return maskedDigits
    .replace(/(.{2})(.)/, '$1.$2')
    .replace(/(.{3})(.)/, '$1.$2')
    .replace(/(.{3})(.)/, '$1/$2')
    .replace(/(.{4})(.{1,2})$/, '$1-$2');
}

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarWhatsapp(numero: string) {
  return Boolean(normalizarWhatsappBrasil(numero));
}

function validarCEP(cep: string) {
  return /^\d{5}-?\d{3}$/.test(cep);
}

function validarCPF(cpf: string) {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  const calc = (factor: number) => {
    let total = 0;
    for (let i = 0; i < factor - 1; i += 1) total += Number(digits[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calc(10);
  const d2 = calc(11);
  return d1 === Number(digits[9]) && d2 === Number(digits[10]);
}

function validarCNPJ(cnpj: string) {
  const digits = onlyDigits(cnpj);
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;

  const calc = (factors: number[]) => {
    let total = 0;
    for (let i = 0; i < factors.length; i += 1) total += Number(digits[i]) * factors[i];
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calc([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return d1 === Number(digits[12]) && d2 === Number(digits[13]);
}

function validarCpfOuCnpj(value: string) {
  const digits = onlyDigits(value);
  if (digits.length === 11) return validarCPF(digits);
  if (digits.length === 14) return validarCNPJ(digits);
  return false;
}

function parseConsumo(consumo: string) {
  const numero = Number(consumo.replace(/,/g, '.'));
  if (Number.isNaN(numero) || numero <= 0) return undefined;
  return Math.ceil(numero);
}

function formatTarifaInput(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 5);
  if (!digits) return '';

  const inteiro = digits[0];
  const decimais = digits.slice(1);
  const hasSeparator = raw.includes(',') || raw.includes('.') || decimais.length > 0;

  return hasSeparator && decimais.length ? `${inteiro},${decimais}` : hasSeparator ? `${inteiro},` : inteiro;
}

function parseTarifa(valor: string) {
  if (!valor) return undefined;
  const normalizado = valor.replace(',', '.');
  const numero = Number(normalizado);
  if (Number.isNaN(numero)) return undefined;
  const arredondado = Math.ceil(numero * 10000) / 10000;
  return Number(arredondado.toFixed(4));
}

function calcularPrioridade(consumo: number) {
  if (consumo >= 800) return 'Alta';
  if (consumo >= 300) return 'Média';
  return 'Baixa';
}

/* =========================================================
   DOCS (CHECKLIST)
========================================================= */

function buildDocFlags(relacaoImovel: PropertyRelation, anexos: AttachmentWithMeta[]) {
  const hasTag = (tag: DocTag) => anexos.some((item) => item.tag === tag);

  return {
    hasBill: hasTag('CONTA_ENERGIA_ATUAL'),
    hasOwnerAuth: hasTag('AUTORIZACAO_PROPRIETARIO_ASSINADA'),
    hasRelationContract: hasTag('CONTRATO_LOCACAO') || hasTag('CONTRATO_COMODATO') || hasTag('CONTRATO_ARRENDAMENTO'),
    hasCondoApproval: hasTag('ATA_ASSEMBLEIA_APROVACAO'),
    missingRequired: getDocRules(relacaoImovel).required.filter((tag) => !hasTag(tag)),
  };
}

type DocRules = { options: DocTag[]; required: DocTag[]; recommended: DocTag[] };

function getDocRules(relacaoImovel: PropertyRelation): DocRules {
  switch (relacaoImovel) {
    case 'Inquilino (locatário)':
      return {
        options: [
          'CONTA_ENERGIA_ATUAL',
          'DOC_ID_SOLICITANTE',
          'CONTRATO_LOCACAO',
          'AUTORIZACAO_PROPRIETARIO_ASSINADA',
          'DOC_ID_PROPRIETARIO',
          'CPF_CNPJ_PROPRIETARIO',
          'FOTOS_LOCAL_INSTALACAO',
        ],
        required: ['CONTRATO_LOCACAO', 'AUTORIZACAO_PROPRIETARIO_ASSINADA'],
        recommended: BILL_RECOMMENDED,
      };
    case 'Comodatário (uso gratuito)':
      return {
        options: [
          'CONTA_ENERGIA_ATUAL',
          'DOC_ID_SOLICITANTE',
          'CONTRATO_COMODATO',
          'AUTORIZACAO_PROPRIETARIO_ASSINADA',
          'DOC_ID_PROPRIETARIO',
          'CPF_CNPJ_PROPRIETARIO',
        ],
        required: ['AUTORIZACAO_PROPRIETARIO_ASSINADA'],
        recommended: BILL_RECOMMENDED,
      };
    case 'Arrendatário':
      return {
        options: [
          'CONTA_ENERGIA_ATUAL',
          'DOC_ID_SOLICITANTE',
          'CONTRATO_ARRENDAMENTO',
          'AUTORIZACAO_PROPRIETARIO_ASSINADA',
          'DOC_ID_PROPRIETARIO',
          'CPF_CNPJ_PROPRIETARIO',
        ],
        required: ['CONTRATO_ARRENDAMENTO', 'AUTORIZACAO_PROPRIETARIO_ASSINADA'],
        recommended: BILL_RECOMMENDED,
      };
    case 'Familiar do proprietário':
      return {
        options: [
          'CONTA_ENERGIA_ATUAL',
          'DOC_ID_SOLICITANTE',
          'AUTORIZACAO_PROPRIETARIO_ASSINADA',
          'DOC_ID_PROPRIETARIO',
          'CPF_CNPJ_PROPRIETARIO',
          'COMPROVANTE_VINCULO_PROPRIETARIO',
        ],
        required: ['AUTORIZACAO_PROPRIETARIO_ASSINADA'],
        recommended: BILL_RECOMMENDED,
      };
    case 'Administrador / Síndico':
      return {
        options: [
          'CONTA_ENERGIA_ATUAL',
          'DOC_ID_SINDICO_ADMIN',
          'ATA_ASSEMBLEIA_APROVACAO',
          'AUTORIZACAO_CONDOMINIO_ASSINADA',
          'COMPROVANTE_VINCULO_SINDICO',
          'FOTOS_LOCAL_INSTALACAO',
        ],
        required: ['DOC_ID_SINDICO_ADMIN', 'ATA_ASSEMBLEIA_APROVACAO'],
        recommended: BILL_RECOMMENDED,
      };
    case 'Proprietário':
      return {
        options: ['CONTA_ENERGIA_ATUAL', 'DOC_ID_SOLICITANTE', 'CPF_CNPJ_SOLICITANTE', 'FOTOS_LOCAL_INSTALACAO'],
        required: [],
        recommended: BILL_RECOMMENDED,
      };
    default:
      return { options: [], required: [], recommended: BILL_RECOMMENDED };
  }
}

/* =========================================================
   STATUS
========================================================= */

function calcularStatus(
  consumo: number,
  tarifa: number | undefined,
  contaEnviada: boolean,
  cepValido: boolean,
  cpfCnpjValido: boolean,
  whatsappValido: boolean,
  emailValido: boolean,
  tipoInstalacao: InstallationType,
  relacaoImovel: PropertyRelation,
  docFlags: ReturnType<typeof buildDocFlags>
): { status: StatusResultado; motivosInternos: string[]; statusInterno: string } {
  const motivosInternos: string[] = [];
  let statusInterno: string = 'PRE_APROVADO';

  if (consumo < 200) {
    motivosInternos.push('Consumo abaixo do mínimo de 200 kWh/mês');
    return { status: 'NAO_ELEGIVEL', motivosInternos, statusInterno: 'NAO_ELEGIVEL' };
  }

  if (!cpfCnpjValido) motivosInternos.push('CPF/CNPJ inválido');
  if (!whatsappValido) motivosInternos.push('Telefone/WhatsApp inválido');
  if (!emailValido) motivosInternos.push('E-mail inválido');
  if (!cepValido) motivosInternos.push('CEP inválido');

  if (motivosInternos.length) {
    return { status: 'NAO_ELEGIVEL', motivosInternos, statusInterno: 'NAO_ELEGIVEL' };
  }

  if (consumo < 300) {
    return {
      status: 'PENDENTE',
      motivosInternos: ['Consumo abaixo do mínimo padrão (300) — avaliar caso a caso'],
      statusInterno: 'PENDENTE_REVISAO',
    };
  }

  if (tarifa !== undefined && (tarifa <= 0.9 || tarifa >= 2.5)) {
    motivosInternos.push('Tarifa fora do range típico (0,90 - 2,50)');
    statusInterno = 'PENDENTE_REVISAO';
  }

  if (!contaEnviada) {
    motivosInternos.push('Conta não enviada — análise manual necessária');
    statusInterno = 'PENDENTE_CONTA';
  }

  if (tipoInstalacao === 'Outro') {
    motivosInternos.push('Tipo de instalação "Outro" — validar viabilidade');
    statusInterno = 'PENDENTE_REVISAO';
  }

  if (docFlags.missingRequired.length > 0 && relacaoImovel !== 'Proprietário') {
    motivosInternos.push(`Documentos obrigatórios faltando: ${docFlags.missingRequired.join(', ')}`);
    statusInterno = 'PENDENTE_DOCS_IMOVEL';
  }

  if (motivosInternos.length === 0) {
    return { status: 'PRE_APROVADO', motivosInternos: ['Perfil forte para leasing'], statusInterno };
  }

  return { status: 'PENDENTE', motivosInternos, statusInterno };
}

/* =========================================================
   ARQUIVOS
========================================================= */

async function fileToBase64(anexo: AttachmentWithMeta): Promise<AttachmentPayload> {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(anexo.file.type)) throw new Error('Envie apenas PDF ou imagem (JPEG/PNG).');
  if (anexo.file.size > 7 * 1024 * 1024) throw new Error('Arquivo maior que 7MB.');

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const content = result.split(',')[1];
      resolve(content);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(anexo.file);
  });

  return {
    filename: anexo.file.name,
    content: base64,
    contentType: anexo.file.type,
    tag: anexo.tag as DocTag,
    note: anexo.note,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

type PreApprovalFormProps = {
  onSubmitted?: (payload: { status: StatusResultado; message: string }) => void;
  utmParams?: Partial<{
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
  }>;
};

export default function PreApprovalForm({ onSubmitted, utmParams }: PreApprovalFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submission, setSubmission] = useState<SubmissionState>({ loading: false });
  const [municipioState, setMunicipioState] = useState<MunicipioState>({ status: 'idle', label: '' });
  const [pendencias, setPendencias] = useState<string[]>([]);
  const [cpfCnpjMasked, setCpfCnpjMasked] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState('');
  const [documentos, setDocumentos] = useState<AttachmentWithMeta[]>([]);
  const [taggingQueue, setTaggingQueue] = useState<File[]>([]);
  const [tagModalFile, setTagModalFile] = useState<File | null>(null);
  const [tagModalNote, setTagModalNote] = useState('');
  const [tagModalTag, setTagModalTag] = useState<DocTag | ''>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [nomePasteSanitized, setNomePasteSanitized] = useState(false);

  const consumoNormalizado = useMemo(() => parseConsumo(form.consumoMedio), [form.consumoMedio]);
  const tarifaNormalizada = useMemo(() => parseTarifa(form.tarifa), [form.tarifa]);
  const valorContaEstimado = useMemo(() => {
    if (!consumoNormalizado || tarifaNormalizada === undefined) return undefined;
    return Number((consumoNormalizado * tarifaNormalizada).toFixed(2));
  }, [consumoNormalizado, tarifaNormalizada]);

  const cpfCnpjDisplay = useMemo(
    () => (cpfCnpjMasked ? maskCpfCnpj(form.cpfCnpj) : form.cpfCnpj),
    [cpfCnpjMasked, form.cpfCnpj]
  );

  const relacaoImovelDocRules = useMemo(() => getDocRules(form.relacaoImovel), [form.relacaoImovel]);
  const recommendedDocTags = useMemo(
    () => relacaoImovelDocRules.recommended.filter((tag) => !relacaoImovelDocRules.required.includes(tag)),
    [relacaoImovelDocRules]
  );
  const docFlags = useMemo(() => buildDocFlags(form.relacaoImovel, documentos), [documentos, form.relacaoImovel]);

  const atualizarCampo = (campo: keyof FormState, valor: string | File | File[] | undefined) => {
    setForm((prev) => {
      const proximo = {
        ...prev,
        [campo]: Array.isArray(valor) ? valor : valor instanceof File ? valor : valor ?? '',
      };

      if (hasSubmitted || touched[campo]) {
        validarEstado(proximo, hasSubmitted);
      }

      return proximo;
    });
  };

  useEffect(() => {
    if (tagModalFile || taggingQueue.length === 0) return;
    setTagModalFile(taggingQueue[0]);
    setTaggingQueue((prev) => prev.slice(1));
    setTagModalNote('');
    setTagModalTag('');
  }, [taggingQueue, tagModalFile]);

  // CEP -> ViaCEP
  useEffect(() => {
    const digits = onlyDigits(form.cep);
    if (digits.length !== 8) {
      setMunicipioState({ status: 'idle', label: '' });
      setForm((prev) => ({ ...prev, municipio: '' }));
      return;
    }

    const controller = new AbortController();
    setMunicipioState({ status: 'loading', label: 'Buscando município...' });

    fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data?.erro) {
          setMunicipioState({ status: 'not_found', label: 'CEP não encontrado' });
          setForm((prev) => ({ ...prev, municipio: '' }));
          return;
        }
        const label = `${data.localidade ?? ''}${data.uf ? `/${data.uf}` : ''}`.trim();
        setMunicipioState({ status: 'loaded', label });
        const rua = typeof data.logradouro === 'string' ? data.logradouro.trim() : '';
        setForm((prev) => ({
          ...prev,
          municipio: label,
          ...(rua && !prev.endereco.trim() ? { endereco: rua } : {}),
        }));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setMunicipioState({ status: 'error', label: 'Erro ao buscar município' });
        }
      });

    return () => controller.abort();
  }, [form.cep]);

  const coletarErros = (state: FormState = form): ValidationErrors => {
    const novoErros: ValidationErrors = {};
    const consumoNormalizadoLocal = parseConsumo(state.consumoMedio);
    const tarifaNormalizadaLocal = parseTarifa(state.tarifa);

    const nomeSanitizado = sanitizeLegalName(state.nome).value;
    if (!nomeSanitizado) novoErros.nome = 'Informe o nome ou razão social.';
    else if (!isValidLegalName(nomeSanitizado)) {
      novoErros.nome = 'Use apenas letras, números, espaço, ponto, vírgula, hífen (-), & ou /. Sem emojis ou símbolos.';
    }

    if (!validarCpfOuCnpj(state.cpfCnpj)) novoErros.cpfCnpj = 'CPF ou CNPJ inválido.';
    if (!validarWhatsapp(state.whatsapp)) novoErros.whatsapp = 'Informe um WhatsApp válido com DDD.';
    if (!validarEmail(state.email)) novoErros.email = 'E-mail inválido.';
    if (!validarCEP(state.cep)) novoErros.cep = 'CEP inválido.';

    if (!state.tipoCliente) novoErros.tipoCliente = 'Selecione o tipo de cliente.';
    if (state.tipoCliente === 'Outro' && !state.tipoClienteOutro.trim()) novoErros.tipoClienteOutro = 'Descreva o tipo de cliente.';

    if (!state.relacaoImovel) novoErros.relacaoImovel = 'Selecione a relação com o imóvel.';
    if (state.relacaoImovel === 'Inquilino (locatário)' && !state.relacaoOutro.trim()) {
      novoErros.relacaoOutro = 'Informe detalhes sobre a relação com o imóvel.';
    }

    // ✅ novo: tipoSistema obrigatório
    if (!state.tipoSistema) novoErros.tipoSistema = 'Selecione o tipo de sistema.';

    if (state.tipoInstalacao === 'Outro' && !state.tipoInstalacaoOutro.trim()) {
      novoErros.tipoInstalacaoOutro = 'Descreva o tipo de instalação.';
    }

    if (!consumoNormalizadoLocal) novoErros.consumoMedio = 'Informe o consumo médio mensal em kWh.';
    if (tarifaNormalizadaLocal === undefined) novoErros.tarifa = 'Informe a tarifa atual no formato 1,20.';

    if (municipioState.status === 'not_found' || municipioState.status === 'error') {
      novoErros.cep = 'Não foi possível identificar o município. Confirme o CEP.';
    }

    return novoErros;
  };

  const atualizarPendencias = useCallback(
    (novoErros: ValidationErrors, shouldShow: boolean) => {
      if (!shouldShow) {
        setPendencias([]);
        return;
      }

      const avisos: string[] = [];
      Object.values(novoErros).forEach((mensagem) => {
        if (mensagem) avisos.push(mensagem);
      });

      if (!docFlags.hasBill) avisos.push('Conta de energia não enviada. A análise será manual e pode levar mais tempo.');
      if (docFlags.missingRequired.length) avisos.push(`Documentos obrigatórios pendentes: ${docFlags.missingRequired.join(', ')}`);

      if (consumoNormalizado && consumoNormalizado < 300) avisos.push('Consumo informado abaixo de 300 kWh/mês: tende a ir para análise manual.');
      if (tarifaNormalizada !== undefined && (tarifaNormalizada <= 0.9 || tarifaNormalizada >= 2.5)) {
        avisos.push('Tarifa fora do intervalo típico (0,90 a 2,50). Confirme o valor.');
      }
      if (form.tipoInstalacao === 'Outro') avisos.push('Tipo de instalação marcado como Outro — precisaremos validar a viabilidade.');

      setPendencias(avisos);
    },
    [consumoNormalizado, docFlags, form.tipoInstalacao, tarifaNormalizada]
  );

  const validarEstado = (
    estadoAtualizado: FormState,
    shouldShowGeneral: boolean,
    touchedMapa: Partial<Record<keyof FormState, boolean>> = touched
  ) => {
    const novoErros = coletarErros(estadoAtualizado);
    const hasErrors = Object.keys(novoErros).length > 0;

    const payloadErros =
      shouldShowGeneral && hasErrors
        ? { ...novoErros, geral: 'Não foi enviado. Complete os campos destacados para prosseguir.' }
        : { ...novoErros };

    setErrors(payloadErros);
    atualizarPendencias(novoErros, shouldShowGeneral);

    return { novoErros, hasErrors };
  };

  const marcarCampoTocado = (campo: keyof FormState) => {
    const atualizado = { ...touched, [campo]: true };
    setTouched(atualizado);
    return atualizado;
  };

  const showError = (campo: keyof FormState) => (hasSubmitted || touched[campo]) && !!errors[campo];

  const classeCampo = (campo: keyof FormState) =>
    `mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none ${
      showError(campo) ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500'
    }`;

  const handleLegalNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const navigationKeys = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab', 'Enter']);
    if (navigationKeys.has(event.key)) return;
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) return;

    if (!/[\p{L}\p{N}\s.,&/-]/u.test(event.key)) event.preventDefault();
  };

  const atualizarNome = (valor: string, mapaTocado: Partial<Record<keyof FormState, boolean>> = touched) => {
    const { value: sanitizado } = sanitizeLegalName(valor, { trimEdges: false });
    setNomePasteSanitized(false);
    const proximo = { ...form, nome: sanitizado };
    setForm(proximo);

    if (hasSubmitted || mapaTocado.nome) validarEstado(proximo, hasSubmitted, mapaTocado);
  };

  const handleNomeBlur = () => {
    const mapaTocado = marcarCampoTocado('nome');
    const { value: sanitizado } = sanitizeLegalName(form.nome);
    const proximo = { ...form, nome: sanitizado };
    setForm(proximo);
    validarEstado(proximo, hasSubmitted, mapaTocado);
  };

  const handleNomePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    const { value: sanitizado, changed } = sanitizeLegalName(pastedText);
    const mapaTocado = marcarCampoTocado('nome');
    setNomePasteSanitized(changed);
    const proximo = { ...form, nome: sanitizado };
    setForm(proximo);
    validarEstado(proximo, hasSubmitted, mapaTocado);
  };

  const handleBlurCampo = (campo: keyof FormState) => {
    const mapaTocado = marcarCampoTocado(campo);
    validarEstado(form, hasSubmitted, mapaTocado);
  };

  const ordemCampos: (keyof FormState)[] = [
    'nome',
    'cpfCnpj',
    'whatsapp',
    'email',
    'cep',
    'tipoCliente',
    'tipoClienteOutro',
    'relacaoImovel',
    'relacaoOutro',
    'consumoMedio',
    'tarifa',
    'tipoSistema',
    'tipoInstalacao',
    'tipoInstalacaoOutro',
    'tipoRede',
  ];

  const focarPrimeiroErro = (novoErros: ValidationErrors) => {
    const campo = ordemCampos.find((chave) => novoErros[chave]);
    if (!campo) return;

    const elemento = document.querySelector<HTMLElement>(`[name="${campo}"]`);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elemento.focus({ preventScroll: true });
    }
  };

  const confirmarEtiqueta = () => {
    if (!tagModalFile || !tagModalTag) return;
    setDocumentos((prev) => [
      ...prev,
      { id: `${tagModalFile.name}-${Date.now()}`, file: tagModalFile, tag: tagModalTag, note: tagModalNote.trim() },
    ]);
    setTagModalFile(null);
    setTagModalNote('');
    setTagModalTag('');
  };

  const removerDocumento = (id: string) => {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
  };

  const pushLeadSubmitEvent = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    if (!window.__leadSent) {
      window.__leadSent = true;
      window.dataLayer.push({ event: 'lead_submit' });
    }
  }, []);

  // ✅ Kommo: normalizações mínimas para bater com enums do backend (preAnalise.ts)
  const mapTipoSistemaParaBackend = (value: SystemType): string | undefined => {
    if (!value) return undefined;
    if (value === 'On-grid') return 'On-grid';
    if (value === 'Híbrido') return 'Hibrido';
    if (value === 'Off-grid') return 'Off-grid';
    return undefined;
  };

  const mapTipoRedeParaBackend = (value: RedeType): string | undefined => {
    if (!value) return undefined;
    // backend normaliza acentos e espaços, então aqui só garantimos algo consistente
    if (value === 'Monofásica') return 'Monofasico';
    if (value === 'Bifásica') return 'Bifasico';
    if (value === 'Trifásica') return 'Trifasico';
    return undefined;
  };

  const mapRelacaoImovelParaBackend = (value: PropertyRelation): string | undefined => {
    switch (value) {
      case 'Proprietário':
        return 'Proprietario';
      case 'Inquilino (locatário)':
        return 'Inquilino';
      case 'Administrador / Síndico':
        return 'Sindico';
      // não existem como enum específico hoje no Kommo; mapeamos pro mais próximo
      case 'Comodatário (uso gratuito)':
      case 'Arrendatário':
      case 'Familiar do proprietário':
        return 'Locatario';
      default:
        return undefined;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmission({ loading: true });
    setHasSubmitted(true);

    if (honeypotValue.trim()) {
      setErrors({ geral: 'Não foi possível enviar. Tente novamente.' });
      setSubmission({ loading: false });
      return;
    }

    const nomeSanitizado = sanitizeLegalName(form.nome).value;
    const formSanitizado = { ...form, nome: nomeSanitizado };
    setForm(formSanitizado);

    const { novoErros, hasErrors } = validarEstado(formSanitizado, true);
    focarPrimeiroErro(novoErros);

    if (hasErrors) {
      setSubmission({ loading: false });
      return;
    }

    try {
      if (tagModalFile) {
        setErrors({ geral: 'Finalize a etiqueta do documento selecionado.' });
        setSubmission({ loading: false });
        return;
      }

      const cpfCnpjValido = validarCpfOuCnpj(formSanitizado.cpfCnpj);
      const whatsappValido = validarWhatsapp(formSanitizado.whatsapp);
      const emailValido = validarEmail(formSanitizado.email);
      const cepValido = validarCEP(formSanitizado.cep);

      const consumo = consumoNormalizado as number;
      const tarifa = tarifaNormalizada;

      const whatsappNormalizado = normalizarWhatsappBrasil(formSanitizado.whatsapp);
      const whatsappComPrefixo = whatsappNormalizado ? `+${whatsappNormalizado}` : '';

      const { status } = calcularStatus(
        consumo,
        tarifa,
        docFlags.hasBill,
        cepValido,
        cpfCnpjValido,
        whatsappValido,
        emailValido,
        formSanitizado.tipoInstalacao,
        formSanitizado.relacaoImovel,
        docFlags
      );

      // prioridade calculada (mantido, mesmo que ainda não use)
      calcularPrioridade(consumo);

      const cleanUtmValue = (value?: string | null) => (value ? value.trim() || undefined : undefined);

      // ✅ ÚNICO payload (sem duplicações)
      const payload = {
        nomeRazao: formSanitizado.nome,
        email: formSanitizado.email,
        whatsapp: whatsappComPrefixo,
        municipio: formSanitizado.municipio,

        tipoImovel:
          formSanitizado.tipoCliente === 'Outro' ? formSanitizado.tipoClienteOutro : formSanitizado.tipoCliente,

        consumoMedioMensal: consumo,

        // ✅ AGORA vem do campo "Tipo de sistema"
        tipoSistema: mapTipoSistemaParaBackend(formSanitizado.tipoSistema),

        tipoInstalacao:
          formSanitizado.tipoInstalacao === 'Outro' ? formSanitizado.tipoInstalacaoOutro : formSanitizado.tipoInstalacao,

        // ✅ opcional
        tipoRede: mapTipoRedeParaBackend(formSanitizado.tipoRede),

        // ✅ Kommo enums (quando não existir, pode vir undefined)
        relacaoImovel: mapRelacaoImovelParaBackend(formSanitizado.relacaoImovel),

        // ✅ envia CPF/CNPJ (texto livre
