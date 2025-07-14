'use client';

import { useState } from 'react';

// ✅ Tipagem dos dados do formulário
interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

export default function ContatoForm() {
  // 🧠 Estado do formulário
  const [form, setForm] = useState<FormData>({ nome: '', email: '', mensagem: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // 🔁 Atualiza o formulário conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📤 Envia os dados para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus('success');
        setForm({ nome: '', email: '', mensagem: '' }); // 🧽 Limpa os campos
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Erro ao enviar:', err);
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-6 text-left"
    >
      {/* 📛 Campo Nome */}
      <div className="flex flex-col">
        <label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-1">
          Nome completo
        </label>
        <input
          type="text"
          name="nome"
          id="nome"
          value={form.nome}
          onChange={handleChange}
          required
          className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* 📧 Campo E-mail */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* 💬 Campo Mensagem */}
      <div className="flex flex-col">
        <label htmlFor="mensagem" className="text-sm font-medium text-gray-700 mb-1">
          Mensagem
        </label>
        <textarea
          name="mensagem"
          id="mensagem"
          rows={5}
          value={form.mensagem}
          onChange={handleChange}
          required
          className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* 🔘 Botão de envio */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-orange-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-orange-500 transition"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
      </button>

      {/* 🟢 Feedback visual */}
      {status === 'success' && (
        <p className="text-green-600 text-sm">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm">Erro ao enviar. Por favor, tente novamente mais tarde.</p>
      )}
    </form>
  );
}