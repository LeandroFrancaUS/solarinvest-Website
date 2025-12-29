'use client';

import React, { useMemo, useState } from 'react';

export default function ContatoForm() {
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

  // 🔄 Atualiza campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'municipio') value = normalizarMunicipio(value);
    if (name === 'estado') value = normalizarEstado(value);
    if (name === 'whatsapp') value = sanitizeWhatsappInput(value);

    setFormData({ ...formData, [name]: value });
  };

  // 📩 Envia formulário para API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappDigits = normalizarWhatsapp(formData.whatsapp);
    setErro(null);

    if (!formData.consumo.trim()) {
      setErro('Informe o consumo médio de energia ou valor da conta.');
      return;
    }

    if (!formData.municipio.trim() || formData.municipio.length < 3) {
      setErro('Informe o município onde o sistema será instalado.');
      return;
    }

    if (!estadosBrasil.includes(formData.estado)) {
      setErro('Selecione um estado válido (UF).');
      return;
    }

    if (whatsappDigits.length < 12) {
      setErro('Informe um número de WhatsApp válido com DDD.');
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

      {/* 📛 Nome */}
      <div>
        <label htmlFor="nome" className="block font-semibold text-gray-800 mb-1">
          Nome
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          required
          value={formData.nome}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 📧 Email */}
      <div>
        <label htmlFor="email" className="block font-semibold text-gray-800 mb-1">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 🔌 Consumo médio */}
      <div>
        <label htmlFor="consumo" className="block font-semibold text-gray-800 mb-1">
          Consumo médio de energia (12 meses)
        </label>
        <input
          type="text"
          id="consumo"
          name="consumo"
          required
          placeholder="Ex.: 500 kWh/mês ou R$ 300,00"
          value={formData.consumo}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 🗺️ Localização */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="municipio" className="block font-semibold text-gray-800 mb-1">
            Município para instalação
          </label>
          <input
            type="text"
            id="municipio"
            name="municipio"
            required
            placeholder="Cidade"
            value={formData.municipio}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label htmlFor="estado" className="block font-semibold text-gray-800 mb-1">
            Estado (UF)
          </label>
          <input
            type="text"
            id="estado"
            name="estado"
            required
            placeholder="UF"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-500 mt-1">O estado é validado automaticamente (ex.: SP, RJ, MG).</p>
        </div>
      </div>

      {/* 📱 WhatsApp */}
      <div>
        <label htmlFor="whatsapp" className="block font-semibold text-gray-800 mb-1">
          Número de WhatsApp para contato
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          required
          placeholder="(DD) 90000-0000"
          value={formData.whatsapp}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <p className="text-xs text-gray-500 mt-1">Nós removemos automaticamente caracteres especiais para validar o número.</p>
      </div>

      {/* ✍️ Mensagem */}
      <div>
        <label htmlFor="mensagem" className="block font-semibold text-gray-800 mb-1">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={5}
          value={formData.mensagem}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
        ></textarea>
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