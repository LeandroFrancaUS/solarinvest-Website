'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

const CLIENT_TYPES = [
  'Residencial',
  'Comercial',
  'Condomínio (vertical)',
  'Condomínio (horizontal)',
  'Outro',
];

const PROPERTY_RELATIONS = [
  'Proprietário',
  'Inquilino (locatário)',
  'Comodatário (uso gratuito)',
  'Arrendatário',
  'Familiar do proprietário',
  'Administrador / Síndico',
];

const INSTALLATION_TYPES = [
  'Telhado fibrocimento',
  'Telhado metálico',
  'Telhado cerâmico',
  'Laje',
  'Solo',
  'Outro',
];

type Status = 'PRÉ-APROVADO' | 'PENDENTE DE ANÁLISE' | 'NÃO ELEGÍVEL (por enquanto)';

type Decision = {
  status: Status;
  reasons: string[];
  priority: 'Alta' | 'Média' | 'Baixa';
  score: number;
  suggestedRoute: 'Comercial imediato' | 'Triagem documentação' | 'Oferta alternativa';
  message: string;
};

type FormState = {
  name: string;
  document: string;
  phone: string;
  email: string;
  cep: string;
  address: string;
  clientType: string;
  clientTypeOther: string;
  propertyRelation: string;
  billFile?: File;
  consumption: string;
  tariff: string;
  installationType: string;
  installationOther: string;
};

const initialFormState: FormState = {
  name: '',
  document: '',
  phone: '',
  email: '',
  cep: '',
  address: '',
  clientType: '',
  clientTypeOther: '',
  propertyRelation: '',
  consumption: '',
  tariff: '',
  installationType: '',
  installationOther: '',
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function validateCpf(document: string) {
  const digits = onlyDigits(document);
  if (digits.length !== 11 || /^([0-9])\1+$/.test(digits)) return false;

  const calcCheckDigit = (slice: number) => {
    const sum = digits
      .slice(0, slice)
      .split('')
      .reduce((acc, num, index) => acc + Number(num) * (slice + 1 - index), 0);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const check1 = calcCheckDigit(9);
  const check2 = calcCheckDigit(10);

  return check1 === Number(digits[9]) && check2 === Number(digits[10]);
}

function validateCnpj(document: string) {
  const digits = onlyDigits(document);
  if (digits.length !== 14 || /^([0-9])\1+$/.test(digits)) return false;

  const calcCheckDigit = (slice: number) => {
    const sliceDigits = digits.slice(0, slice).split('').map(Number);
    const factors = slice === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = sliceDigits.reduce((acc, num, index) => acc + num * factors[index], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const check1 = calcCheckDigit(12);
  const check2 = calcCheckDigit(13);

  return check1 === Number(digits[12]) && check2 === Number(digits[13]);
}

function validateDocument(document: string) {
  const digits = onlyDigits(document);
  if (digits.length === 11) return validateCpf(document);
  if (digits.length === 14) return validateCnpj(document);
  return false;
}

function validatePhone(phone: string) {
  const digits = onlyDigits(phone);
  return digits.length >= 10 && digits.length <= 13;
}

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseConsumption(value: string) {
  const parsed = Math.ceil(Number(value.replace(',', '.')));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseTariff(value: string) {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : NaN;
}

export default function SolucoesPageClient() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [decision, setDecision] = useState<Decision | null>(null);
  const [cepStatus, setCepStatus] = useState<'idle' | 'validating' | 'invalid' | 'valid'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const consumptionValue = useMemo(() => parseConsumption(form.consumption), [form.consumption]);
  const tariffValue = useMemo(() => parseTariff(form.tariff), [form.tariff]);

  const priority = useMemo<Decision['priority']>(() => {
    if (!Number.isFinite(consumptionValue)) return 'Baixa';
    if (consumptionValue >= 800) return 'Alta';
    if (consumptionValue >= 300) return 'Média';
    return 'Baixa';
  }, [consumptionValue]);

  const score = useMemo(() => {
    if (!Number.isFinite(consumptionValue)) return 0;
    let base = Math.min(consumptionValue / 10, 100);
    if (tariffValue >= 1.2 && tariffValue <= 2) base += 5;
    if (form.billFile) base += 5;
    if (priority === 'Alta') base += 5;
    return Math.min(Math.round(base), 100);
  }, [consumptionValue, tariffValue, form.billFile, priority]);

  const suggestedRoute: Decision['suggestedRoute'] = useMemo(() => {
    if (consumptionValue >= 300 && form.billFile && tariffValue >= 0.9 && tariffValue <= 2.5) {
      return 'Comercial imediato';
    }
    if (form.billFile || form.installationType === 'Outro') {
      return 'Triagem documentação';
    }
    return 'Oferta alternativa';
  }, [consumptionValue, form.billFile, tariffValue, form.installationType]);

  async function validateCep(cep: string) {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) return false;
    try {
      setCepStatus('validating');
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await response.json();
      if (data?.erro) {
        setCepStatus('invalid');
        return false;
      }
      setCepStatus('valid');
      return true;
    } catch (error) {
      console.error('Erro ao validar CEP', error);
      setCepStatus('invalid');
      return false;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Informe o nome ou razão social.';
    if (!form.document.trim() || !validateDocument(form.document)) {
      newErrors.document = 'CPF/CNPJ inválido.';
    }
    if (!form.phone.trim() || !validatePhone(form.phone)) {
      newErrors.phone = 'Informe um telefone válido (WhatsApp).';
    }
    if (!form.email.trim() || !validateEmail(form.email)) {
      newErrors.email = 'E-mail inválido.';
    }

    const cepValid = await validateCep(form.cep);
    if (!form.cep.trim() || !cepValid) {
      newErrors.cep = 'CEP inválido ou não encontrado.';
    }

    if (!form.clientType) newErrors.clientType = 'Selecione o tipo de cliente.';
    if (form.clientType === 'Outro' && !form.clientTypeOther.trim()) {
      newErrors.clientTypeOther = 'Descreva o tipo de cliente.';
    }

    if (!form.propertyRelation) newErrors.propertyRelation = 'Informe a relação com o imóvel.';

    if (!form.consumption.trim() || !Number.isFinite(consumptionValue)) {
      newErrors.consumption = 'Informe o consumo médio mensal em kWh.';
    }
    if (!form.tariff.trim() || !Number.isFinite(tariffValue)) {
      newErrors.tariff = 'Informe a tarifa da concessionária (ex.: 1,05).';
    }

    if (!form.installationType) newErrors.installationType = 'Selecione o tipo de instalação.';
    if (form.installationType === 'Outro' && !form.installationOther.trim()) {
      newErrors.installationOther = 'Descreva o tipo de instalação.';
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const reasons: string[] = [];

    if (consumptionValue < 200) {
      reasons.push('Consumo abaixo de 200 kWh/mês (bloqueio automático).');
      setDecision({
        status: 'NÃO ELEGÍVEL (por enquanto)',
        reasons,
        priority,
        score,
        suggestedRoute,
        message:
          'Por enquanto, pode não ser o ideal. Pelo consumo informado, o leasing tende a não gerar o melhor custo-benefício. Mas podemos avaliar outras opções (compra/financiamento) ou uma solução sob medida.',
      });
      setErrors({});
      setIsSubmitting(false);
      return;
    }

    if (!validateDocument(form.document) || !validateEmail(form.email) || !validatePhone(form.phone) || !cepValid) {
      reasons.push('Dados básicos inválidos (CPF/CNPJ, e-mail, telefone ou CEP).');
      setDecision({
        status: 'NÃO ELEGÍVEL (por enquanto)',
        reasons,
        priority,
        score,
        suggestedRoute,
        message:
          'Por enquanto, pode não ser o ideal. Pelo consumo informado, o leasing tende a não gerar o melhor custo-benefício. Mas podemos avaliar outras opções (compra/financiamento) ou uma solução sob medida.',
      });
      setErrors({});
      setIsSubmitting(false);
      return;
    }

    if (consumptionValue < 300) {
      reasons.push('Consumo abaixo do mínimo padrão (300) — avaliar caso a caso.');
      setDecision({
        status: 'PENDENTE DE ANÁLISE',
        reasons,
        priority,
        score,
        suggestedRoute,
        message:
          'Recebido! 🔎\nSeus dados foram enviados para análise. Em alguns casos precisamos confirmar informações (ex.: conta de energia, autorização do proprietário ou tipo de instalação). Em breve chamaremos você no WhatsApp.',
      });
      setErrors({});
      setIsSubmitting(false);
      return;
    }

    if (tariffValue <= 0.9 || tariffValue >= 2.5) {
      reasons.push('Tarifa fora do intervalo esperado (0,90–2,50 R$/kWh).');
    }

    if (!form.billFile) {
      reasons.push('Conta de energia não enviada (necessário confirmar consumo).');
    }

    if (form.installationType === 'Outro') {
      reasons.push('Tipo de instalação marcado como Outro — validar viabilidade.');
    }

    if (['Inquilino (locatário)', 'Comodatário (uso gratuito)', 'Arrendatário', 'Familiar do proprietário', 'Administrador / Síndico'].includes(form.propertyRelation)) {
      reasons.push('Será necessário apresentar autorização/documentação do proprietário/condomínio.');
    }

    const eligible =
      consumptionValue >= 300 &&
      tariffValue > 0.9 &&
      tariffValue < 2.5 &&
      Boolean(form.billFile) &&
      form.installationType !== 'Outro';

    setDecision({
      status: eligible ? 'PRÉ-APROVADO' : 'PENDENTE DE ANÁLISE',
      reasons,
      priority,
      score,
      suggestedRoute,
      message: eligible
        ? 'Pré-aprovado! ✅\nPelos dados informados, você tem forte elegibilidade para o leasing SolarInvest. Nossa equipe vai analisar sua conta e te chamar no WhatsApp para confirmar os próximos passos.'
        : 'Recebido! 🔎\nSeus dados foram enviados para análise. Em alguns casos precisamos confirmar informações (ex.: conta de energia, autorização do proprietário ou tipo de instalação). Em breve chamaremos você no WhatsApp.',
    });

    setErrors({});
    setIsSubmitting(false);
  }

  function renderStatusBadge(status: Status) {
    const styles =
      status === 'PRÉ-APROVADO'
        ? 'bg-green-100 text-green-700'
        : status === 'PENDENTE DE ANÁLISE'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-red-100 text-red-700';
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles}`}>{status}</span>;
  }

  const emailSubject = decision
    ? `[Pré-Qualificação] ${decision.status} — ${form.name || 'Cliente'} — ${form.cep || 'CEP'} — ${
        Number.isFinite(consumptionValue) ? consumptionValue : 'consumo'
      } kWh/mês`
    : '';

  return (
    <main className="min-h-screen bg-white py-12 px-4 md:px-8">
      <section className="max-w-5xl mx-auto mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-bold text-orange-600 mb-4"
        >
          Pré-aprovação rápida de Leasing SolarInvest
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg text-gray-700 max-w-3xl mx-auto"
        >
          Preencha os dados para receber uma pré-qualificação imediata. Seguimos as mesmas regras do leasing do
          app.solarinvest.info, com validação automática e encaminhamento direto para nossa equipe comercial.
        </motion.p>
      </section>

      <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dados do cliente</h2>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome / Razão Social *</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Digite o nome completo"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF/CNPJ *</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.document}
                  onChange={(e) => setForm({ ...form, document: e.target.value })}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
                {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone (WhatsApp) *</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(DDD) 9 9999-9999"
                />
                <p className="text-xs text-gray-500 mt-1">Validaremos o formato e entraremos via WhatsApp.</p>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail *</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@dominio.com"
                  type="email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">CEP *</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.cep}
                  onChange={(e) => {
                    setForm({ ...form, cep: e.target.value });
                    setCepStatus('idle');
                  }}
                  placeholder="00000-000"
                />
                {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                {cepStatus === 'validating' && <p className="text-sm text-gray-500 mt-1">Validando CEP...</p>}
                {cepStatus === 'valid' && <p className="text-sm text-green-600 mt-1">CEP validado com sucesso.</p>}
                {cepStatus === 'invalid' && <p className="text-sm text-red-500 mt-1">CEP não encontrado.</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Endereço completo (opcional, mas recomendado)</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Rua, nº, bairro, cidade/UF"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de cliente *</label>
                <select
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.clientType}
                  onChange={(e) => setForm({ ...form, clientType: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {CLIENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {form.clientType === 'Outro' && (
                  <input
                    className="mt-2 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Qual?"
                    value={form.clientTypeOther}
                    onChange={(e) => setForm({ ...form, clientTypeOther: e.target.value })}
                  />
                )}
                {errors.clientType && <p className="text-red-500 text-sm mt-1">{errors.clientType}</p>}
                {errors.clientTypeOther && <p className="text-red-500 text-sm mt-1">{errors.clientTypeOther}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relação com o imóvel *</label>
                <select
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.propertyRelation}
                  onChange={(e) => setForm({ ...form, propertyRelation: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {PROPERTY_RELATIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.propertyRelation && <p className="text-red-500 text-sm mt-1">{errors.propertyRelation}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Consumo médio mensal (kWh/mês) *</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.consumption}
                  onChange={(e) => setForm({ ...form, consumption: e.target.value })}
                  placeholder="Ex.: 450"
                  inputMode="numeric"
                />
                {errors.consumption && <p className="text-red-500 text-sm mt-1">{errors.consumption}</p>}
                <p className="text-xs text-gray-500 mt-1">Aceita apenas números; arredondamos para cima.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tarifa da concessionária (R$/kWh) *</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.tariff}
                  onChange={(e) => setForm({ ...form, tariff: e.target.value })}
                  placeholder="Ex.: 1,05"
                  inputMode="decimal"
                />
                {errors.tariff && <p className="text-red-500 text-sm mt-1">{errors.tariff}</p>}
                <p className="text-xs text-gray-500 mt-1">Aceitamos 0,95 ou 0.95 e convertemos automaticamente.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Conta de energia (PDF ou foto)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  onChange={(e) => setForm({ ...form, billFile: e.target.files?.[0] })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se não enviar, sua solicitação cai em pendente para triagem humana.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de instalação *</label>
                <select
                  className="mt-1 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={form.installationType}
                  onChange={(e) => setForm({ ...form, installationType: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {INSTALLATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {form.installationType === 'Outro' && (
                  <input
                    className="mt-2 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Qual?"
                    value={form.installationOther}
                    onChange={(e) => setForm({ ...form, installationOther: e.target.value })}
                  />
                )}
                {errors.installationType && <p className="text-red-500 text-sm mt-1">{errors.installationType}</p>}
                {errors.installationOther && <p className="text-red-500 text-sm mt-1">{errors.installationOther}</p>}
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-orange-700">Regras rápidas</p>
                <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1 mt-2">
                  <li>Consumo mínimo: 200 kWh/mês (bloqueio), ideal a partir de 300 kWh/mês.</li>
                  <li>Tarifa fora de 0,90–2,50 gera pendência para revisão.</li>
                  <li>Enviar a conta agiliza a aprovação automática.</li>
                  <li>Autorização do proprietário pode ser exigida.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>Prioridade: <strong>{priority}</strong> | Score: <strong>{score}</strong>/100</p>
                <p>Rota sugerida: <strong>{suggestedRoute}</strong></p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {isSubmitting ? 'Processando...' : 'Gerar pré-aprovação'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultado automático</h3>
            {decision ? (
              <div className="space-y-3">
                {renderStatusBadge(decision.status)}
                <p className="text-sm whitespace-pre-line text-gray-800">{decision.message}</p>
                {decision.reasons.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-700">Motivos internos:</p>
                    <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1 mt-1">
                      {decision.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Prioridade: <strong>{decision.priority}</strong></p>
                  <p>Score: <strong>{decision.score}</strong>/100</p>
                  <p>Rota sugerida: <strong>{decision.suggestedRoute}</strong></p>
                </div>
                {decision.status === 'PRÉ-APROVADO' && (
                  <a
                    href={`https://wa.me/${onlyDigits(form.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full rounded-lg bg-green-600 text-white py-3 font-semibold hover:bg-green-700"
                  >
                    Falar com o time comercial agora
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Preencha o formulário ao lado para gerar o status de pré-aprovação automático.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Modelo de e-mail para a SolarInvest</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Assunto:</strong> {emailSubject || '[Pré-Qualificação] status — nome — CEP — consumo kWh/mês'}</p>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-1">
                <p className="font-semibold">Dados do cliente</p>
                <p>Nome/Razão Social: {form.name || '—'}</p>
                <p>CPF/CNPJ: {form.document || '—'}</p>
                <p>Tipo de cliente: {form.clientType === 'Outro' ? form.clientTypeOther || 'Outro' : form.clientType || '—'}</p>
                <p>Relação com imóvel: {form.propertyRelation || '—'}</p>
                <p>Telefone: {form.phone || '—'}</p>
                <p>E-mail: {form.email || '—'}</p>
                <p>CEP: {form.cep || '—'}</p>
                {form.address && <p>Endereço: {form.address}</p>}

                <p className="font-semibold mt-2">Energia</p>
                <p>Consumo médio: {Number.isFinite(consumptionValue) ? `${consumptionValue} kWh/mês` : '—'}</p>
                <p>Tarifa: {Number.isFinite(tariffValue) ? `${formatCurrency(tariffValue)}/kWh` : '—'}</p>
                <p>Conta enviada: {form.billFile ? 'Sim (arquivo anexado)' : 'Não'}</p>

                <p className="font-semibold mt-2">Técnico</p>
                <p>
                  Tipo de instalação:{' '}
                  {form.installationType === 'Outro'
                    ? form.installationOther || 'Outro'
                    : form.installationType || '—'}
                </p>

                <p className="font-semibold mt-2">Resultado automático</p>
                <p>Status: {decision?.status || 'Aguardando envio'}</p>
                {decision?.reasons?.length ? (
                  <div>
                    <p>Motivos (interno):</p>
                    <ul className="list-disc pl-4">
                      {decision.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>Motivos (interno): —</p>
                )}

                <p className="font-semibold mt-2">Checklist interno</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Autorização do proprietário (se aplicável)</li>
                  <li>RG/CPF do proprietário (se aplicável)</li>
                  <li>Conta de energia atual (se não enviou)</li>
                  <li>Fotos do telhado/área (se Outro, laje/solo, etc.)</li>
                </ul>

                <p className="font-semibold mt-2">Campos internos</p>
                <p>Score: {score}</p>
                <p>Rota sugerida: {suggestedRoute}</p>
                <p>Prioridade: {priority}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Como funciona a decisão</h3>
            <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
              <li>Bloqueios automáticos: consumo &lt; 200 kWh/mês ou dados básicos inválidos.</li>
              <li>Pendente: consumo entre 200–299 kWh/mês, tarifa fora de 0,90–2,50, sem conta ou instalação &quot;Outro&quot;.</li>
              <li>Pré-aprovado: consumo ≥ 300, conta enviada, tarifa válida e instalação comum.</li>
              <li>Seguimos os mesmos critérios do leasing em app.solarinvest.info.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
