'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

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

type StatusResultado = 'PRE_APROVADO' | 'PENDENTE' | 'NAO_ELEGIVEL';

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
  contaDeEnergia?: File;
};

type AttachmentPayload = {
  filename: string;
  content: string;
  contentType: string;
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

const statusMessages: Record<StatusResultado, string> = {
  PRE_APROVADO:
    'Pré-aprovado! ✅\nPelos dados informados, você tem forte elegibilidade para o leasing SolarInvest. Nossa equipe vai analisar sua conta e te chamar no WhatsApp para confirmar os próximos passos.',
  PENDENTE:
    'Recebido! 🔎\nSeus dados foram enviados para análise. Em alguns casos precisamos confirmar informações (ex.: conta de energia, autorização do proprietário ou tipo de instalação). Em breve chamaremos você no WhatsApp.',
  NAO_ELEGIVEL:
    'Por enquanto, pode não ser o ideal.\nPelo consumo informado, o leasing tende a não gerar o melhor custo-benefício. Mas podemos avaliar outras opções (compra/financiamento) ou uma solução sob medida.',
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

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarWhatsapp(numero: string) {
  const digits = onlyDigits(numero);
  return digits.length >= 11 && digits.length <= 13;
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

function parseTarifa(valor: string) {
  const numero = Number(valor.replace(',', '.'));
  return Number.isNaN(numero) ? undefined : Number(numero.toFixed(2));
}

function calcularPrioridade(consumo: number) {
  if (consumo >= 800) return 'Alta';
  if (consumo >= 300) return 'Média';
  return 'Baixa';
}

function buildChecklist(relacaoImovel: PropertyRelation) {
  if (!relacaoImovel) return [];
  if (relacaoImovel === 'Proprietário') return [];
  if (relacaoImovel === 'Administrador / Síndico')
    return ['Ata ou autorização do condomínio'];
  return ['Autorização do proprietário', 'Documento do proprietário (RG/CPF)'];
}

function calcularStatus(
  consumo: number,
  tarifa: number | undefined,
  contaEnviada: boolean,
  cepValido: boolean,
  cpfCnpjValido: boolean,
  whatsappValido: boolean,
  emailValido: boolean,
  tipoInstalacao: InstallationType
): { status: StatusResultado; motivosInternos: string[] } {
  const motivosInternos: string[] = [];

  if (consumo < 200) {
    motivosInternos.push('Consumo abaixo do mínimo de 200 kWh/mês');
    return { status: 'NAO_ELEGIVEL', motivosInternos };
  }

  if (!cpfCnpjValido) motivosInternos.push('CPF/CNPJ inválido');
  if (!whatsappValido) motivosInternos.push('Telefone/WhatsApp inválido');
  if (!emailValido) motivosInternos.push('E-mail inválido');
  if (!cepValido) motivosInternos.push('CEP inválido');

  if (motivosInternos.length) {
    return { status: 'NAO_ELEGIVEL', motivosInternos };
  }

  if (consumo < 300) {
    return {
      status: 'PENDENTE',
      motivosInternos: ['Consumo abaixo do mínimo padrão (300) — avaliar caso a caso'],
    };
  }

  if (tarifa !== undefined && (tarifa <= 0.9 || tarifa >= 2.5)) {
    motivosInternos.push('Tarifa fora do range típico (0,90 - 2,50)');
  }

  if (!contaEnviada) {
    motivosInternos.push('Conta não enviada — análise manual necessária');
  }

  if (tipoInstalacao === 'Outro') {
    motivosInternos.push('Tipo de instalação "Outro" — validar viabilidade');
  }

  if (motivosInternos.length === 0) {
    return { status: 'PRE_APROVADO', motivosInternos: ['Perfil forte para leasing'] };
  }

  return { status: 'PENDENTE', motivosInternos };
}

async function fileToBase64(file: File): Promise<AttachmentPayload> {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(file.type)) {
    throw new Error('Envie apenas PDF ou imagem (JPEG/PNG).');
  }
  if (file.size > 7 * 1024 * 1024) {
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
    reader.readAsDataURL(file);
  });

  return {
    filename: file.name,
    content: base64,
    contentType: file.type,
  };
}

export default function PreApprovalForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submission, setSubmission] = useState<SubmissionState>({ loading: false });
  const [municipioState, setMunicipioState] = useState<MunicipioState>({ status: 'idle', label: '' });
  const [pendencias, setPendencias] = useState<string[]>([]);

  const consumoNormalizado = useMemo(() => parseConsumo(form.consumoMedio), [form.consumoMedio]);
  const tarifaNormalizada = useMemo(() => parseTarifa(form.tarifa), [form.tarifa]);

  const relacaoImovelDocChecklist = useMemo(
    () => buildChecklist(form.relacaoImovel),
    [form.relacaoImovel]
  );

  const atualizarCampo = (campo: keyof FormState, valor: string | File | undefined) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor instanceof File ? valor : valor ?? '',
    }));
  };

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
        setForm((prev) => ({ ...prev, municipio: label }));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setMunicipioState({ status: 'error', label: 'Erro ao buscar município' });
        }
      });

    return () => controller.abort();
  }, [form.cep]);

  const coletarErros = useCallback((): ValidationErrors => {
    const novoErros: ValidationErrors = {};

    if (!form.nome.trim()) novoErros.nome = 'Informe o nome ou razão social.';

    if (!validarCpfOuCnpj(form.cpfCnpj)) {
      novoErros.cpfCnpj = 'CPF ou CNPJ inválido.';
    }

    if (!validarWhatsapp(form.whatsapp)) {
      novoErros.whatsapp = 'Informe um WhatsApp válido com DDD.';
    }

    if (!validarEmail(form.email)) {
      novoErros.email = 'E-mail inválido.';
    }

    if (!validarCEP(form.cep)) {
      novoErros.cep = 'CEP inválido.';
    }

    if (!form.tipoCliente) {
      novoErros.tipoCliente = 'Selecione o tipo de cliente.';
    }

    if (form.tipoCliente === 'Outro' && !form.tipoClienteOutro.trim()) {
      novoErros.tipoClienteOutro = 'Descreva o tipo de cliente.';
    }

    if (!form.relacaoImovel) {
      novoErros.relacaoImovel = 'Selecione a relação com o imóvel.';
    }

    if (form.relacaoImovel === 'Inquilino (locatário)' && !form.relacaoOutro.trim()) {
      novoErros.relacaoOutro = 'Informe detalhes sobre a relação com o imóvel.';
    }

    if (form.tipoInstalacao === 'Outro' && !form.tipoInstalacaoOutro.trim()) {
      novoErros.tipoInstalacaoOutro = 'Descreva o tipo de instalação.';
    }

    if (!consumoNormalizado) {
      novoErros.consumoMedio = 'Informe o consumo médio mensal em kWh.';
    }

    if (tarifaNormalizada === undefined) {
      novoErros.tarifa = 'Informe a tarifa no formato 0,95.';
    }

    if (municipioState.status === 'not_found' || municipioState.status === 'error') {
      novoErros.cep = 'Não foi possível identificar o município. Confirme o CEP.';
    }

    return novoErros;
  }, [
    consumoNormalizado,
    form.cpfCnpj,
    form.email,
    form.cep,
    form.nome,
    form.relacaoImovel,
    form.relacaoOutro,
    form.tipoCliente,
    form.tipoClienteOutro,
    form.tipoInstalacao,
    form.tipoInstalacaoOutro,
    form.whatsapp,
    municipioState.status,
    tarifaNormalizada,
  ]);

  useEffect(() => {
    const novoErros = coletarErros();
    setErrors((prev) => ({ ...novoErros, geral: prev.geral }));

    const avisos: string[] = [];
    Object.values(novoErros).forEach((mensagem) => {
      if (mensagem) avisos.push(mensagem);
    });

    if (!form.contaDeEnergia) {
      avisos.push('Conta de energia não enviada. A análise será manual e pode levar mais tempo.');
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
  }, [coletarErros, form.contaDeEnergia, form.tipoInstalacao, consumoNormalizado, tarifaNormalizada]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmission({ loading: true });

    const novoErros = coletarErros();
    setErrors(novoErros);
    if (Object.keys(novoErros).length > 0) {
      setSubmission({ loading: false });
      return;
    }

    try {
      const attachment = form.contaDeEnergia
        ? await fileToBase64(form.contaDeEnergia)
        : undefined;

      const cpfCnpjValido = validarCpfOuCnpj(form.cpfCnpj);
      const whatsappValido = validarWhatsapp(form.whatsapp);
      const emailValido = validarEmail(form.email);
      const cepValido = validarCEP(form.cep);
      const consumo = consumoNormalizado as number;
      const tarifa = tarifaNormalizada;

      const { status, motivosInternos } = calcularStatus(
        consumo,
        tarifa,
        Boolean(attachment),
        cepValido,
        cpfCnpjValido,
        whatsappValido,
        emailValido,
        form.tipoInstalacao
      );

      const prioridade = calcularPrioridade(consumo);

      const payload = {
        ...form,
        municipio: form.municipio,
        tipoClienteOutro: form.tipoCliente === 'Outro' ? form.tipoClienteOutro : '',
        tipoInstalacaoOutro: form.tipoInstalacao === 'Outro' ? form.tipoInstalacaoOutro : '',
        relacaoOutro: form.relacaoImovel === 'Inquilino (locatário)' ? form.relacaoOutro : '',
        tipoRede: form.tipoRede,
        consumoMedio: consumo,
        tarifa: tarifa ?? 0,
        status,
        prioridade,
        motivosInternos,
        checklist: relacaoImovelDocChecklist,
        attachment,
      };

      const response = await fetch('/api/pre-aprovacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao enviar a solicitação.');
      }

      setSubmission({ status, message: statusMessages[status], loading: false });
      setForm(initialState);
      setErrors({});
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
            Preencha os dados para receber um retorno personalizado. O resultado automático não substitui a análise humana e
            não revela critérios internos.
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
        {errors.geral && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">
            {errors.geral}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Identificação</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome / Razão Social *</label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                value={form.nome}
                onChange={(e) => atualizarCampo('nome', e.target.value)}
                required
              />
              {errors.nome && <p className="text-xs text-red-600 mt-1">{errors.nome}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF/CNPJ *</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  value={form.cpfCnpj}
                  onChange={(e) => atualizarCampo('cpfCnpj', formatCpfCnpj(e.target.value))}
                  required
                />
                {errors.cpfCnpj && <p className="text-xs text-red-600 mt-1">{errors.cpfCnpj}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone (WhatsApp) *</label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  placeholder="(DDD) 9 9999-9999"
                  value={form.whatsapp}
                  onChange={(e) => atualizarCampo('whatsapp', formatWhatsapp(e.target.value))}
                  required
                />
                {errors.whatsapp && <p className="text-xs text-red-600 mt-1">{errors.whatsapp}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail *</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                value={form.email}
                onChange={(e) => atualizarCampo('email', e.target.value)}
                required
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Local da instalação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">CEP *</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={(e) => atualizarCampo('cep', formatCEP(e.target.value))}
                  required
                />
                {errors.cep && <p className="text-xs text-red-600 mt-1">{errors.cep}</p>}
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
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  value={form.tipoCliente}
                  onChange={(e) => atualizarCampo('tipoCliente', e.target.value as ClientType)}
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
                {errors.tipoCliente && <p className="text-xs text-red-600 mt-1">{errors.tipoCliente}</p>}
                {form.tipoCliente === 'Outro' && (
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="Qual?"
                    value={form.tipoClienteOutro}
                    onChange={(e) => atualizarCampo('tipoClienteOutro', e.target.value)}
                  />
                )}
                {errors.tipoClienteOutro && <p className="text-xs text-red-600 mt-1">{errors.tipoClienteOutro}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relação com o imóvel *</label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  value={form.relacaoImovel}
                  onChange={(e) => atualizarCampo('relacaoImovel', e.target.value as PropertyRelation)}
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
                {errors.relacaoImovel && <p className="text-xs text-red-600 mt-1">{errors.relacaoImovel}</p>}
                {form.relacaoImovel === 'Inquilino (locatário)' && (
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    placeholder="Detalhes"
                    value={form.relacaoOutro}
                    onChange={(e) => atualizarCampo('relacaoOutro', e.target.value)}
                  />
                )}
                {errors.relacaoOutro && <p className="text-xs text-red-600 mt-1">{errors.relacaoOutro}</p>}
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
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  value={form.consumoMedio}
                  onChange={(e) => atualizarCampo('consumoMedio', e.target.value)}
                  required
                />
                {errors.consumoMedio && <p className="text-xs text-red-600 mt-1">{errors.consumoMedio}</p>}
                {consumoNormalizado && (
                  <p className="text-xs text-gray-500 mt-1">Consumo considerado: {consumoNormalizado} kWh/mês</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tarifa da concessionária (R$/kWh) *</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  placeholder="0,95"
                  value={form.tarifa}
                  onChange={(e) => atualizarCampo('tarifa', e.target.value)}
                  required
                />
                {errors.tarifa && <p className="text-xs text-red-600 mt-1">{errors.tarifa}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Conta de energia (PDF ou foto)</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none bg-white"
                onChange={(e) => atualizarCampo('contaDeEnergia', e.target.files?.[0])}
              />
              <p className="text-xs text-gray-500 mt-1">
                Envie para agilizar a análise. Sem a conta, o pedido entra como pendente.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Técnica</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de instalação *</label>
              <select
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                value={form.tipoInstalacao}
                onChange={(e) => atualizarCampo('tipoInstalacao', e.target.value as InstallationType)}
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
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  placeholder="Qual?"
                  value={form.tipoInstalacaoOutro}
                  onChange={(e) => atualizarCampo('tipoInstalacaoOutro', e.target.value)}
                />
              )}
              {errors.tipoInstalacaoOutro && (
                <p className="text-xs text-red-600 mt-1">{errors.tipoInstalacaoOutro}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de rede (opcional)</label>
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

            {relacaoImovelDocChecklist.length > 0 && (
              <div className="bg-white border border-orange-100 rounded-xl p-3 text-sm text-gray-700">
                <p className="font-semibold text-orange-700">Documentos complementares</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {relacaoImovelDocChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          <p className="text-sm text-gray-600">Ao enviar, você autoriza contato via WhatsApp e e-mail.</p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 text-white font-semibold px-6 py-3 shadow-md hover:bg-orange-700 transition disabled:opacity-60"
            disabled={submission.loading}
          >
            {submission.loading ? 'Enviando...' : 'Enviar pré-análise'}
          </button>
        </div>
      </form>

      {submission.status && submission.message && (
        <div className="mt-6 rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
          <p className="whitespace-pre-line text-gray-800">{submission.message}</p>
        </div>
      )}
    </section>
  );
}
