'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

export default function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados enviados:', form);
    setEnviado(true);
    setForm({ nome: '', email: '', mensagem: '' });
  };

  return (
    <section className="min-h-screen bg-orange-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-6 text-center">
          Fale com a Solar Invest
        </h1>

        {enviado ? (
          <p className="text-green-600 text-center font-medium">
            Mensagem enviada com sucesso! Entraremos em contato em breve.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="nome"
              placeholder="Seu nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <textarea
              name="mensagem"
              placeholder="Digite sua mensagem"
              value={form.mensagem}
              onChange={handleChange}
              required
              rows={4}
              className="border border-gray-300 rounded px-4 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="submit"
              className="bg-orange-600 text-white font-semibold px-6 py-3 rounded hover:bg-orange-500 transition"
            >
              Enviar mensagem
            </button>
          </form>
        )}
      </div>
    </section>
  );
}