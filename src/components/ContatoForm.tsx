'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function ContatoForm() {
  const criarEstadoInicialErros = () => ({
    nome: '',
    email: '',
    consumo: '',
    municipio: '',
    estado: '',
    whatsapp: '',
    mensagem: '',
  });

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    consumo: '',
    municipio: '',
    estado: '',
    whatsapp: '',
    mensagem: '',
  });

  const [enviado, setEnviado] = useState(false); // ✅ Para feedback visual
  const [erro, setErro] = useState<string | null>(null);
  const [exibirValidacao, setExibirValidacao] = useState(false);
  const [errosCampos, setErrosCampos] = useState<Record<keyof typeof formData, string>>(criarEstadoInicialErros);

  useEffect(() => {
    setExibirValidacao(false);
    setErrosCampos(criarEstadoInicialErros());
    setErro(null);
    setEnviado(false);
  }, []);

  const estadosBrasil = useMemo(
    () => [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ],
    []
  );

  const normalizarMunicipio = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/(^|\s)\p{L}/gu, (letra) => letra.toUpperCase());

  const normalizarEstado = (value: string) => value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();

  const sanitizeWhatsappInput = (value: string) => value.replace(/\D/g, '').slice(0, 13);

  const normalizarWhatsapp = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const semDdi = digits.startsWith('55') ? digits.slice(2) : digits;
    const local = semDdi.slice(-11);

    if (local.length < 10) return '';

    return `55${local}`;
  };

  const validarEmail = (email: string) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim());

  const validarFormulario = (dados: typeof formData, whatsappDigits: string) => {
    const erros: Record<keyof typeof formData, string> = {
      nome: '',
      email: '',
      consumo: '',
      municipio: '',
      estado: '',
      whatsapp: '',
      mensagem: '',
    };

    if (!dados.nome.trim()) erros.nome = 'Nome é obrigatório.';
    if (!dados.email.trim() || !validarEmail(dados.email)) erros.email = 'Informe um e-mail válido.';
    if (!dados.consumo.trim()) erros.consumo = 'Informe o consumo médio de energia ou valor da conta.';
    if (!dados.municipio.trim() || dados.municipio.length < 3)
      erros.municipio = 'Informe o município onde o sistema será instalado.';
    if (!estadosBrasil.includes(dados.estado)) erros.estado = 'Selecione um estado válido (UF).';
    if (whatsappDigits.length < 12) erros.whatsapp = 'Informe um número de WhatsApp válido com DDD.';
    if (!dados.mensagem.trim()) erros.mensagem = 'Mensagem é obrigatória.';

    return erros;
  };

  const atualizarErros = (dados: typeof formData, whatsappDigits: string) => {
    const novosErros = validarFormulario(dados, whatsappDigits);
    setErrosCampos(novosErros);
    return novosErros;
  };

  const classeCampo = (nomeCampo: keyof typeof formData) =>
    `w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none ${
      exibirValidacao && errosCampos[nomeCampo]
        ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-300'
    }`;

  const mensagemErroCampo = (nomeCampo: keyof typeof formData) =>
    exibirValidacao && errosCampos[nomeCampo] ? (
      <p className="text-sm text-red-600 mt-1">{errosCampos[nomeCampo]}</p>
    ) : null;

  // 🔄 Atualiza campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'municipio') value = normalizarMunicipio(value);
    if (name === 'estado') value = normalizarEstado(value);
    if (name === 'whatsapp') value = sanitizeWhatsappInput(value);

    const atualizado = { ...formData, [name]: value };
    setFormData(atualizado);
    setEnviado(false);

    if (exibirValidacao) {
      const whatsappDigits = name === 'whatsapp' ? normalizarWhatsapp(value) : normalizarWhatsapp(atualizado.whatsapp);
      atualizarErros(atualizado, whatsappDigits);
    }
  };

  // 📩 Envia formulário para API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappDigits = normalizarWhatsapp(formData.whatsapp);
    setErro(null);
    setExibirValidacao(true);

    const novosErros = atualizarErros(formData, whatsappDigits);
    const mensagemPrimeiroErro = Object.values(novosErros).find(Boolean);

    if (mensagemPrimeiroErro) {
      setErro(mensagemPrimeiroErro);
      return;
    }

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, whatsapp: whatsappDigits }),
      });

      if (res.ok) {
        setEnviado(true);
        setExibirValidacao(false);
        setErrosCampos({ nome: '', email: '', consumo: '', municipio: '', estado: '', whatsapp: '', mensagem: '' });
        setFormData({ nome: '', email: '', consumo: '', municipio: '', estado: '', whatsapp: '', mensagem: '' });
      } else {
        alert('Erro ao enviar. Tente novamente mais tarde.');
      }
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('Erro inesperado ao enviar o formulário.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto text-left"
    >
      {/* ✅ Mensagem de sucesso */}
      {enviado && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
          Obrigado pelo contato! Responderemos em breve.
        </div>
      )}

      {erro && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
          {erro}
        </div>
      )}

      <p className="text-sm text-gray-600">Campos marcados com <span className="text-red-600">*</span> são obrigatórios.</p>

      {/* 📛 Nome */}
      <div>
        <label htmlFor="nome" className="block font-semibold text-gray-800 mb-1">
          Nome <span className="text-red-600" aria-hidden>*</span>
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          aria-required
          aria-invalid={exibirValidacao && !!errosCampos.nome ? true : undefined}
          className={classeCampo('nome')}
        />
        {mensagemErroCampo('nome')}
      </div>

      {/* 📧 Email */}
      <div>
        <label htmlFor="email" className="block font-semibold text-gray-800 mb-1">
          E-mail <span className="text-red-600" aria-hidden>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-required
          aria-invalid={exibirValidacao && !!errosCampos.email ? true : undefined}
          className={classeCampo('email')}
        />
        {mensagemErroCampo('email')}
      </div>

      {/* 🔌 Consumo médio */}
      <div>
        <label htmlFor="consumo" className="block font-semibold text-gray-800 mb-1">
          Consumo médio de energia (12 meses) <span className="text-red-600" aria-hidden>*</span>
        </label>
        <input
          type="text"
          id="consumo"
          name="consumo"
          placeholder="Ex.: 500 kWh/mês ou R$ 300,00"
          value={formData.consumo}
          onChange={handleChange}
          aria-required
          aria-invalid={exibirValidacao && !!errosCampos.consumo ? true : undefined}
          className={classeCampo('consumo')}
        />
        {mensagemErroCampo('consumo')}
      </div>

      {/* 🗺️ Localização */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="municipio" className="block font-semibold text-gray-800 mb-1">
            Município para instalação <span className="text-red-600" aria-hidden>*</span>
          </label>
          <input
            type="text"
            id="municipio"
            name="municipio"
            placeholder="Cidade"
            value={formData.municipio}
            onChange={handleChange}
            aria-required
            aria-invalid={exibirValidacao && !!errosCampos.municipio ? true : undefined}
            className={classeCampo('municipio')}
          />
          {mensagemErroCampo('municipio')}
        </div>

        <div>
          <label htmlFor="estado" className="block font-semibold text-gray-800 mb-1">
            Estado (UF) <span className="text-red-600" aria-hidden>*</span>
          </label>
          <input
            type="text"
            id="estado"
            name="estado"
            placeholder="UF"
            value={formData.estado}
            onChange={handleChange}
            aria-required
            aria-invalid={exibirValidacao && !!errosCampos.estado ? true : undefined}
            className={classeCampo('estado')}
          />
          {mensagemErroCampo('estado')}
          <p className="text-xs text-gray-500 mt-1">O estado é validado automaticamente (ex.: SP, RJ, MG).</p>
        </div>
      </div>

      {/* 📱 WhatsApp */}
      <div>
        <label htmlFor="whatsapp" className="block font-semibold text-gray-800 mb-1">
          Número de WhatsApp para contato <span className="text-red-600" aria-hidden>*</span>
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          placeholder="(DD) 90000-0000"
          value={formData.whatsapp}
          onChange={handleChange}
          aria-required
          aria-invalid={exibirValidacao && !!errosCampos.whatsapp ? true : undefined}
          className={classeCampo('whatsapp')}
        />
        {mensagemErroCampo('whatsapp')}
        <p className="text-xs text-gray-500 mt-1">Nós removemos automaticamente caracteres especiais para validar o número.</p>
      </div>

      {/* ✍️ Mensagem */}
      <div>
        <label htmlFor="mensagem" className="block font-semibold text-gray-800 mb-1">
          Mensagem <span className="text-red-600" aria-hidden>*</span>
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          value={formData.mensagem}
          onChange={handleChange}
          aria-required
          aria-invalid={exibirValidacao && !!errosCampos.mensagem ? true : undefined}
          className={`${classeCampo('mensagem')} resize-none`}
        ></textarea>
        {mensagemErroCampo('mensagem')}
      </div>

      {/* 📤 Botão de envio */}
      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Enviar Mensagem
      </button>
    </form>
  );
}