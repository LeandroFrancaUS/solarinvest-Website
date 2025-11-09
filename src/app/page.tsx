// src/app/page.tsx

import Hero from '@/components/Hero';
import Beneficios from '@/components/Beneficios';
import ComoFunciona from '@/components/ComoFunciona';
import FeedbackSection from '@/components/FeedbackSection';
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

      {/* 💬 Central de feedback integrado */}
      <FeedbackSection />

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