'use client';

import React, { useState } from 'react';

export default function ContatoForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: '',
  });

  const [enviado, setEnviado] = useState(false); // ✅ Para feedback visual

  // 🔄 Atualiza campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📩 Envia formulário para API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEnviado(true);
        setFormData({ nome: '', email: '', mensagem: '' });
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