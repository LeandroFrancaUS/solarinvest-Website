'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

export default function ContatoForm() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  // 🔁 Atualiza o estado ao digitar nos campos
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📤 Envia os dados do formulário
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados enviados:', form);
    setEnviado(true);
    setForm({ nome: '', email: '', mensagem: '' });
  };

  return (
    <>
      {enviado ? (
        <p className="text-green-600 text-center font-medium">
          Mensagem enviada com sucesso! Entraremos em contato em breve.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 🔸 Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* 🔸 Email */}
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* 🔸 Mensagem */}
          <textarea
            name="mensagem"
            placeholder="Digite sua mensagem"
            value={form.mensagem}
            onChange={handleChange}
            required
            rows={4}
            className="border border-gray-300 rounded px-4 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* 🔸 Botão Enviar */}
          <button
            type="submit"
            className="bg-orange-600 text-white font-semibold px-6 py-3 rounded hover:bg-orange-500 transition"
          >
            Enviar mensagem
          </button>
        </form>
      )}
    </>
  );
}