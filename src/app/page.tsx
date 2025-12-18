// src/app/page.tsx

import Hero from '@/components/Hero';
import Beneficios from '@/components/Beneficios';
import ComoFunciona from '@/components/ComoFunciona';
import SeoGuidelines from '@/components/SeoGuidelines';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

// 🔍 SEO Metadata
export const metadata = buildMetadata({
  title: 'Energia Solar Inteligente | SolarInvest Solutions',
  description:
    'Economize com energia solar híbrida, off-grid e sustentável. Soluções acessíveis para residências, negócios e comunidades remotas.',
  path: '/',
  keywords: [
    'energia solar',
    'solarinvest',
    'solar invest',
    'painel solar',
    'off-grid',
    'energia renovável',
    'fotovoltaica',
    'híbrida',
    'comunidade solar',
  ],
});

export default function Home() {
  return (
    <>
      {/* 🎥 Vídeo ou imagem hero */}
      <Hero />

      {/* 🌞 Benefícios da solução solar */}
      <Beneficios />

      {/* ⚙️ Etapas de como funciona */}
      <ComoFunciona />

      {/* 📘 Guia rápido de SEO */}
      <SeoGuidelines />

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
