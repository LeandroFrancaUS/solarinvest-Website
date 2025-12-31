'use client';

import { ClipboardEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __leadSent?: boolean;
  }
}

type ClientType =
  | 'Residencial'
  | 'Comercial'
  | 'Condomínio (vertical)'
  | 'Condomínio (horizontal)'
  | 'Outro'
  | '';

type PropertyRelation =
  | 'Proprietário'
  | 'Inquilino (locatário)'
  | 'Comodatário (uso gratuito)'
  | 'Arrendatário'
  | 'Familiar do proprietário'
  | 'Administrador / Síndico'
  | '';

type InstallationType =
  | 'Telhado fibrocimento'
  | 'Telhado metálico'
  | 'Telhado cerâmico'
  | 'Laje'
  | 'Solo'
  | 'Outro';

type RedeType = 'Monofásica' | 'Bifásica' | 'Trifásica' | '';

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
  tipoInstalacao: InstallationType;
  tipoInstalacaoOutro: string;
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
    for (let i = 0; i < factor - 1; i += 1) {
      total += Number(digits[i]) * (factor - i);
    }
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
    for (let i = 0; i < factors.length; i += 1) {
      total += Number(digits[i]) * factors[i];
    }
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

function buildDocFlags(relacaoImovel: PropertyRelation, anexos: AttachmentWithMeta[]) {
  const hasTag = (tag: DocTag) => anexos.some((item) => item.tag === tag);

  return {
    hasBill: hasTag('CONTA_ENERGIA_ATUAL'),
    hasOwnerAuth: hasTag('AUTORIZACAO_PROPRIETARIO_ASSINADA'),
    hasRelationContract:
      hasTag('CONTRATO_LOCACAO') || hasTag('CONTRATO_COMODATO') || hasTag('CONTRATO_ARRENDAMENTO'),
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
    motivosInternos.push(
      `Documentos obrigatórios faltando: ${docFlags.missingRequired.join(', ')}`
    );
    statusInterno = 'PENDENTE_DOCS_IMOVEL';
  }

  if (motivosInternos.length === 0) {
    return { status: 'PRE_APROVADO', motivosInternos: ['Perfil forte para leasing'], statusInterno };
  }

  return { status: 'PENDENTE', motivosInternos, statusInterno };
}

async function fileToBase64(anexo: AttachmentWithMeta): Promise<AttachmentPayload> {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(anexo.file.type)) {
    throw new Error('Envie apenas PDF ou imagem (JPEG/PNG).');
  }
  if (anexo.file.size > 7 * 1024 * 1024) {
    throw new Error('Arquivo maior que 7MB.');
  }

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
    () =>
      relacaoImovelDocRules.recommended.filter(
        (tag) => !relacaoImovelDocRules.required.includes(tag)
      ),
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

    if (!validarCpfOuCnpj(state.cpfCnpj)) {
      novoErros.cpfCnpj = 'CPF ou CNPJ inválido.';
    }

    if (!validarWhatsapp(state.whatsapp)) {
      novoErros.whatsapp = 'Informe um WhatsApp válido com DDD.';
    }

    if (!validarEmail(state.email)) {
      novoErros.email = 'E-mail inválido.';
    }

    if (!validarCEP(state.cep)) {
      novoErros.cep = 'CEP inválido.';
    }

    if (!state.tipoCliente) {
      novoErros.tipoCliente = 'Selecione o tipo de cliente.';
    }

    if (state.tipoCliente === 'Outro' && !state.tipoClienteOutro.trim()) {
      novoErros.tipoClienteOutro = 'Descreva o tipo de cliente.';
    }

    if (!state.relacaoImovel) {
      novoErros.relacaoImovel = 'Selecione a relação com o imóvel.';
    }

    if (state.relacaoImovel === 'Inquilino (locatário)' && !state.relacaoOutro.trim()) {
      novoErros.relacaoOutro = 'Informe detalhes sobre a relação com o imóvel.';
    }

    if (state.tipoInstalacao === 'Outro' && !state.tipoInstalacaoOutro.trim()) {
      novoErros.tipoInstalacaoOutro = 'Descreva o tipo de instalação.';
    }

    if (!consumoNormalizadoLocal) {
      novoErros.consumoMedio = 'Informe o consumo médio mensal em kWh.';
    }

    if (tarifaNormalizadaLocal === undefined) {
      novoErros.tarifa = 'Informe a tarifa atual no formato 1,20.';
    }

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

      if (!docFlags.hasBill) {
        avisos.push('Conta de energia não enviada. A análise será manual e pode levar mais tempo.');
      }

      if (docFlags.missingRequired.length) {
        avisos.push(`Documentos obrigatórios pendentes: ${docFlags.missingRequired.join(', ')}`);
      }

      if (consumoNormalizado && consumoNormalizado < 300) {
        avisos.push('Consumo informado abaixo de 300 kWh/mês: tende a ir para análise manual.');
      }

      if (tarifaNormalizada !== undefined && (tarifaNormalizada <= 0.9 || tarifaNormalizada >= 2.5)) {
        avisos.push('Tarifa fora do intervalo típico (0,90 a 2,50). Confirme o valor.');
      }

      if (form.tipoInstalacao === 'Outro') {
        avisos.push('Tipo de instalação marcado como Outro — precisaremos validar a viabilidade.');
      }

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

    const payload = shouldShowGeneral && hasErrors ? { ...novoErros, geral: 'Não foi enviado. Complete os campos destacados para prosseguir.' } : { ...novoErros };

    setErrors(payload);
    const mostrarPendencias = shouldShowGeneral;
    atualizarPendencias(novoErros, mostrarPendencias);

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
      showError(campo)
        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
        : 'border-gray-200 focus:border-orange-500'
    }`;

  const handleLegalNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const navigationKeys = new Set([
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Tab',
      'Enter',
    ]);

    if (navigationKeys.has(event.key)) return;
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) return;

    if (!/[\p{L}\p{N}\s.,&/-]/u.test(event.key)) {
      event.preventDefault();
    }
  };

  const atualizarNome = (valor: string, mapaTocado: Partial<Record<keyof FormState, boolean>> = touched) => {
    const { value: sanitizado } = sanitizeLegalName(valor, { trimEdges: false });
    setNomePasteSanitized(false);
    const proximo = { ...form, nome: sanitizado };
    setForm(proximo);

    if (hasSubmitted || mapaTocado.nome) {
      validarEstado(proximo, hasSubmitted, mapaTocado);
    }
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
    'tipoInstalacao',
    'tipoInstalacaoOutro',
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

      const { status, motivosInternos, statusInterno } = calcularStatus(
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

      const prioridade = calcularPrioridade(consumo);

      const cleanUtmValue = (value?: string | null) => (value ? value.trim() || undefined : undefined);

      const response = await fetch('/api/kommo/pre-analise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeRazao: formSanitizado.nome,
          email: formSanitizado.email,
          whatsapp: whatsappComPrefixo,
          municipio: formSanitizado.municipio,
          tipoImovel:
            formSanitizado.tipoCliente === 'Outro'
              ? formSanitizado.tipoClienteOutro
              : formSanitizado.tipoCliente,
          consumoMedioMensal: consumo,
          tipoSistema:
            formSanitizado.tipoInstalacao === 'Outro'
              ? formSanitizado.tipoInstalacaoOutro
              : formSanitizado.tipoInstalacao,
          utm: utmParams
            ? {
                utm_source: cleanUtmValue(utmParams.utm_source),
                utm_medium: cleanUtmValue(utmParams.utm_medium),
                utm_campaign: cleanUtmValue(utmParams.utm_campaign),
                utm_content: cleanUtmValue(utmParams.utm_content),
              }
            : undefined,
        }),
      });

      let result: { ok?: boolean; message?: string } = {};
      try {
        result = await response.json();
      } catch (error) {
        console.error('Falha ao interpretar resposta do servidor (pré-análise)', error);
      }

      if (!response.ok || !result.ok) {
        const mensagemErro =
          typeof result.message === 'string'
            ? result.message
            : 'Erro ao enviar a solicitação. Tente novamente em instantes.';
        throw new Error(mensagemErro);
      }

      pushLeadSubmitEvent();
      setSubmission({ status, message: statusMessages[status], loading: false });
      setForm(initialState);
      setDocumentos([]);
      setTaggingQueue([]);
      setTagModalFile(null);
      setCpfCnpjMasked(false);
      setErrors({});
      setHasSubmitted(false);
      setTouched({});
      setPendencias([]);
      setNomePasteSanitized(false);
      onSubmitted?.({ status, message: statusMessages[status] });
    } catch (error: unknown) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao enviar a solicitação.';
      setErrors({ geral: mensagem });
      setSubmission({ loading: false });
    }
  };

  return (
    <section id="pre-aprovacao" className="w-full bg-gray-50 border border-orange-100 rounded-3xl p-6 md:p-10 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">
            Pré-aprovação de leasing
          </p>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mt-1">
            Faça uma análise rápida e gratuita
          </h2>
          <p className="text-gray-700 mt-2 max-w-3xl">
            Preencha os dados para receber um retorno personalizado. O resultado automático não substitui a análise humana.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-orange-200 rounded-2xl px-4 py-3 shadow-inner text-sm text-gray-700">
          <span className="text-orange-600 text-xl">⚡</span>
          <div>
            <p className="font-semibold">100% online</p>
            <p className="text-xs">Retorno rápido pelo WhatsApp</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="sr-only" aria-hidden>
          <label htmlFor="extra-info">Não preencha este campo</label>
          <input
            id="extra-info"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypotValue}
            onChange={(e) => setHoneypotValue(e.target.value)}
            className="hidden"
          />
        </div>

        {errors.geral && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">
            {errors.geral}
          </div>
        )}

        {tagModalFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Arquivo</p>
                  <p className="font-semibold text-gray-900 break-all">{tagModalFile.name}</p>
                </div>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setTagModalFile(null);
                    setTagModalNote('');
                    setTagModalTag('');
                  }}
                  aria-label="Fechar modal"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Selecione a etiqueta</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  value={tagModalTag}
                  onChange={(e) => setTagModalTag(e.target.value as DocTag)}
                >
                  <option value="" disabled>
                    Escolha uma etiqueta
                  </option>
                  {(relacaoImovelDocRules.options.length ? relacaoImovelDocRules.options : ALL_DOC_TAGS).map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Observação (opcional)</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  value={tagModalNote}
                  onChange={(e) => setTagModalNote(e.target.value)}
                  placeholder="Ex.: autorização assinada pelo proprietário"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setTagModalFile(null);
                    setTagModalNote('');
                    setTagModalTag('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!tagModalTag}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-600 text-white font-semibold px-4 py-2 shadow-md hover:bg-orange-700 transition disabled:opacity-60"
                  onClick={confirmarEtiqueta}
                >
                  Salvar etiqueta
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Identificação</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome / Razão Social *</label>
              <input
                type="text"
                name="nome"
                className={classeCampo('nome')}
                value={form.nome}
                onChange={(e) => atualizarNome(e.target.value)}
                onBlur={handleNomeBlur}
                onPaste={handleNomePaste}
                onKeyDown={handleLegalNameKeyDown}
                required
                aria-invalid={showError('nome') || undefined}
              />
              {nomePasteSanitized && (
                <p className="text-xs text-amber-700 mt-1">Alguns caracteres foram removidos para manter o formato válido.</p>
              )}
              {showError('nome') && (
                <p className="text-xs text-red-600 mt-1" aria-live="polite">
                  {errors.nome}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF/CNPJ *</label>
                <input
                  type="text"
                  name="cpfCnpj"
                  className={classeCampo('cpfCnpj')}
                  value={cpfCnpjDisplay}
                  onChange={(e) => {
                    setCpfCnpjMasked(false);
                    atualizarCampo('cpfCnpj', formatCpfCnpj(e.target.value));
                  }}
                  onFocus={() => setCpfCnpjMasked(false)}
                  onBlur={() => {
                    const digitsLength = onlyDigits(form.cpfCnpj).length;
                    setCpfCnpjMasked(digitsLength === 11 || digitsLength === 14);
                    handleBlurCampo('cpfCnpj');
                  }}
                  required
                />
                {showError('cpfCnpj') && <p className="text-xs text-red-600 mt-1">{errors.cpfCnpj}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone (WhatsApp) *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  className={classeCampo('whatsapp')}
                  placeholder="(DDD) 9 9999-9999"
                  value={form.whatsapp}
                  onChange={(e) => atualizarCampo('whatsapp', formatWhatsapp(e.target.value))}
                  onBlur={() => handleBlurCampo('whatsapp')}
                  required
                />
                {showError('whatsapp') && <p className="text-xs text-red-600 mt-1">{errors.whatsapp}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail *</label>
              <input
                type="email"
                name="email"
                className={classeCampo('email')}
                value={form.email}
                onChange={(e) => atualizarCampo('email', e.target.value)}
                onBlur={() => handleBlurCampo('email')}
                required
              />
              {showError('email') && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Local da instalação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">CEP *</label>
                  <input
                    type="text"
                    name="cep"
                    className={classeCampo('cep')}
                    placeholder="00000-000"
                    value={form.cep}
                    onChange={(e) => atualizarCampo('cep', formatCEP(e.target.value))}
                    onBlur={() => handleBlurCampo('cep')}
                    required
                  />
                  {showError('cep') && <p className="text-xs text-red-600 mt-1">{errors.cep}</p>}
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-500">Município</label>
                  <input
                    type="text"
                    readOnly
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
                    value={form.municipio || municipioState.label}
                    placeholder={
                      municipioState.status === 'loading'
                        ? 'Consultando...'
                        : municipioState.status === 'not_found'
                          ? 'CEP não encontrado'
                          : 'Informe o CEP para preencher'
                    }
                  />
                </div>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço completo</label>
                  <input
                    type="text"
                    name="endereco"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="Rua, nº, bairro, cidade/UF"
                    value={form.endereco}
                    onChange={(e) => atualizarCampo('endereco', e.target.value)}
                  />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de cliente *</label>
                  <select
                    name="tipoCliente"
                    className={classeCampo('tipoCliente')}
                    value={form.tipoCliente}
                    onChange={(e) => atualizarCampo('tipoCliente', e.target.value as ClientType)}
                    onBlur={() => handleBlurCampo('tipoCliente')}
                    required
                  >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Residencial</option>
                  <option>Comercial</option>
                  <option>Condomínio (vertical)</option>
                  <option>Condomínio (horizontal)</option>
                  <option>Outro</option>
                </select>
                {showError('tipoCliente') && <p className="text-xs text-red-600 mt-1">{errors.tipoCliente}</p>}
                {form.tipoCliente === 'Outro' && (
                  <input
                    type="text"
                    name="tipoClienteOutro"
                    className={classeCampo('tipoClienteOutro')}
                    placeholder="Qual?"
                    value={form.tipoClienteOutro}
                    onChange={(e) => atualizarCampo('tipoClienteOutro', e.target.value)}
                    onBlur={() => handleBlurCampo('tipoClienteOutro')}
                  />
                )}
                {showError('tipoClienteOutro') && <p className="text-xs text-red-600 mt-1">{errors.tipoClienteOutro}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relação com o imóvel *</label>
                <select
                  name="relacaoImovel"
                  className={classeCampo('relacaoImovel')}
                  value={form.relacaoImovel}
                  onChange={(e) => atualizarCampo('relacaoImovel', e.target.value as PropertyRelation)}
                  onBlur={() => handleBlurCampo('relacaoImovel')}
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Proprietário</option>
                  <option>Inquilino (locatário)</option>
                  <option>Comodatário (uso gratuito)</option>
                  <option>Arrendatário</option>
                  <option>Familiar do proprietário</option>
                  <option>Administrador / Síndico</option>
                </select>
                {showError('relacaoImovel') && <p className="text-xs text-red-600 mt-1">{errors.relacaoImovel}</p>}
                {form.relacaoImovel === 'Inquilino (locatário)' && (
                  <input
                    type="text"
                    name="relacaoOutro"
                    className={classeCampo('relacaoOutro')}
                    placeholder="Detalhes"
                    value={form.relacaoOutro}
                    onChange={(e) => atualizarCampo('relacaoOutro', e.target.value)}
                    onBlur={() => handleBlurCampo('relacaoOutro')}
                  />
                )}
                {showError('relacaoOutro') && <p className="text-xs text-red-600 mt-1">{errors.relacaoOutro}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900">Energia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Consumo médio mensal (kWh/mês) *</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  name="consumoMedio"
                  className={classeCampo('consumoMedio')}
                  value={form.consumoMedio}
                  onChange={(e) => atualizarCampo('consumoMedio', e.target.value)}
                  onBlur={() => handleBlurCampo('consumoMedio')}
                  required
                />
                {showError('consumoMedio') && <p className="text-xs text-red-600 mt-1">{errors.consumoMedio}</p>}
                {consumoNormalizado && (
                  <p className="text-xs text-gray-500 mt-1">Consumo considerado: {consumoNormalizado} kWh/mês</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tarifa da concessionária (R$/kWh) *</label>
                <input
                  type="text"
                  name="tarifa"
                  className={classeCampo('tarifa')}
                  placeholder="0,95"
                  value={form.tarifa}
                  onChange={(e) => atualizarCampo('tarifa', formatTarifaInput(e.target.value))}
                  onBlur={() => {
                    atualizarCampo('tarifa', formatTarifaInput(form.tarifa));
                    handleBlurCampo('tarifa');
                  }}
                  required
                />
                {showError('tarifa') && <p className="text-xs text-red-600 mt-1">{errors.tarifa}</p>}
                {valorContaEstimado !== undefined && (
                  <p className="text-xs text-gray-600 mt-1">
                    Conta atual estimada: <span className="font-semibold">R$ {valorContaEstimado.toFixed(2)}</span> / mês
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Conta de energia / Documentos</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none bg-white"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) {
                    setTaggingQueue((prev) => [...prev, ...files]);
                  }
                  e.target.value = '';
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                A análise poderá levar mais tempo caso a conta de energia atual não seja enviada.
              </p>
              {documentos.length > 0 && (
                <ul className="text-xs text-gray-700 mt-2 space-y-2">
                  {documentos.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{item.file.name}</span>
                        <span className="text-[11px] uppercase tracking-wide text-orange-700 font-semibold">{item.tag}</span>
                        {item.note && <span className="text-[11px] text-gray-600">Obs.: {item.note}</span>}
                      </div>
                      <button
                        type="button"
                        className="text-xs text-red-600 hover:text-red-700"
                        onClick={() => removerDocumento(item.id)}
                        aria-label={`Remover ${item.file.name}`}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Técnica</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de instalação *</label>
              <select
                name="tipoInstalacao"
                className={classeCampo('tipoInstalacao')}
                value={form.tipoInstalacao}
                onChange={(e) => atualizarCampo('tipoInstalacao', e.target.value as InstallationType)}
                onBlur={() => handleBlurCampo('tipoInstalacao')}
                required
              >
                <option>Telhado fibrocimento</option>
                <option>Telhado metálico</option>
                <option>Telhado cerâmico</option>
                <option>Laje</option>
                <option>Solo</option>
                <option>Outro</option>
              </select>
              {form.tipoInstalacao === 'Outro' && (
                <input
                  type="text"
                  name="tipoInstalacaoOutro"
                  className={classeCampo('tipoInstalacaoOutro')}
                  placeholder="Qual?"
                  value={form.tipoInstalacaoOutro}
                  onChange={(e) => atualizarCampo('tipoInstalacaoOutro', e.target.value)}
                  onBlur={() => handleBlurCampo('tipoInstalacaoOutro')}
                />
              )}
              {showError('tipoInstalacaoOutro') && (
                <p className="text-xs text-red-600 mt-1">{errors.tipoInstalacaoOutro}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de rede</label>
              <select
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                value={form.tipoRede}
                onChange={(e) => atualizarCampo('tipoRede', e.target.value as RedeType)}
              >
                <option value="">Selecione</option>
                <option>Monofásica</option>
                <option>Bifásica</option>
                <option>Trifásica</option>
              </select>
            </div>

            {relacaoImovelDocRules.options.length > 0 && (
              <div className="bg-white border border-orange-100 rounded-xl p-3 text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-orange-700">Checklist automático</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {relacaoImovelDocRules.required.length ? (
                    relacaoImovelDocRules.required.map((tag) => {
                      const ok = documentos.some((doc) => doc.tag === tag);
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${
                            ok
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : 'border-amber-200 bg-amber-50 text-amber-800'
                          }`}
                        >
                          {ok ? '✅' : '⏳'} {tag}
                        </span>
                      );
                    })
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 border border-slate-200 bg-slate-50 text-slate-700">
                      Nenhum documento obrigatório para esta relação
                    </span>
                  )}
                </div>
                {recommendedDocTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {recommendedDocTags.map((tag) => {
                      const ok = documentos.some((doc) => doc.tag === tag);
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 border ${
                            ok
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : 'border-blue-200 bg-blue-50 text-blue-800'
                          }`}
                        >
                          {ok ? '✅' : '⭐'} {tag}
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-900">
                            Recomendado
                          </span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {pendencias.length > 0 && (
          <div className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-orange-700">O que falta ou precisa de atenção</p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              {pendencias.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2 pb-6 md:pr-20">
          <p className="text-sm text-gray-600">Ao enviar, você autoriza contato via WhatsApp e e-mail.</p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 text-white font-semibold px-6 py-3 shadow-md hover:bg-orange-700 transition disabled:opacity-60 md:self-end md:mr-4"
            disabled={submission.loading}
          >
            {submission.loading ? 'Enviando...' : 'Enviar pré-análise'}
          </button>
        </div>
      </form>

      {submission.status && submission.message && (
        <div
          className={`mt-6 rounded-2xl border p-6 shadow-lg transition transform duration-300 text-center ${
            statusVisuals[submission.status].styles
          } animate-[pulse_1.8s_ease-in-out_2]`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`text-3xl ${statusVisuals[submission.status].accent}`} aria-hidden>
              {statusVisuals[submission.status].icon}
            </div>
            <p
              className={`text-xl md:text-2xl font-extrabold uppercase tracking-[0.14em] px-3 py-1 rounded-full bg-white/60 ${
                statusVisuals[submission.status].accent
              }`}
            >
              {statusVisuals[submission.status].title}
            </p>
            <p className="whitespace-pre-line leading-relaxed">{submission.message}</p>
          </div>
        </div>
      )}
    </section>
  );
}
