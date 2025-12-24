'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Beneficios from './Beneficios';
import ComoFunciona from './ComoFunciona';
import Hero from './Hero';

export default function HomeWithSplash() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 via-white to-orange-100">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="rounded-3xl border border-orange-200/70 bg-white/80 p-6 shadow-[0_25px_55px_-30px_rgba(249,115,22,0.45)] backdrop-blur-sm">
            <Image
              src="/LogoNatal2.png"
              alt="Logotipo da SolarInvest"
              width={320}
              height={320}
              priority
              className="h-auto w-full max-w-[240px] sm:max-w-[280px]"
            />
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-orange-500 sm:text-base">
            carregando
            <span className="ml-2 inline-flex animate-pulse gap-1">
              <span className="h-1 w-1 rounded-full bg-orange-400" />
              <span className="h-1 w-1 rounded-full bg-orange-400" />
              <span className="h-1 w-1 rounded-full bg-orange-400" />
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🎥 Vídeo ou imagem hero */}
      <Hero />

      {/* 🌞 Benefícios da solução solar */}
      <Beneficios />

      {/* ⚙️ Etapas de como funciona */}
      <ComoFunciona />

      {/* ❓ Banner de perguntas frequentes */}
      <section className="bg-orange-50 text-center py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-600">Perguntas Frequentes</h2>
        <p className="mt-4 text-base sm:text-lg text-gray-700">
          Ainda tem dúvidas? Confira nossa seção de perguntas e respostas.
        </p>
        <Link
          href="/faq"
          className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Acessar FAQ
        </Link>
      </section>

      {/* 💬 Central de feedback integrado */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-orange-200/60 bg-white/80 p-8 text-center shadow-[0_20px_45px_-25px_rgba(253,186,116,0.55)] backdrop-blur-sm sm:flex-row sm:items-center sm:text-left">
          <div className="flex-1 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-orange-600">
              Ouça nossos clientes
            </span>
            <p className="text-sm text-slate-700 sm:text-base">
              Reunimos depoimentos reais e links oficiais do Google, Facebook e Reclame AQUI em um único espaço para facilitar a sua avaliação.
            </p>
          </div>
          <div className="sm:flex-shrink-0">
            <Link
              href="/sobre#feedback"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              Acessar feedbacks
            </Link>
          </div>
        </div>
      </section>

      {/* 🟡 Mensagem final com padding ajustado */}
      <section className="bg-gradient-to-br from-yellow-100 to-orange-200 text-gray-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-20 mt-12 sm:mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Bem-vindo à SolarInvest Solutions
          </h1>
          <p className="mt-4 text-base sm:text-lg">
            Energia solar inteligente, acessível e sustentável para o seu futuro.
          </p>
        </div>
      </section>
    </>
  );
}
