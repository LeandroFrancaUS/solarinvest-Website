// src/app/page.tsx

import Hero from '@/components/Hero';
import Beneficios from '@/components/Beneficios';
import ComoFunciona from '@/components/ComoFunciona';
import type { Metadata } from 'next';

// 🔍 SEO Metadata
export const metadata: Metadata = {
  title: 'Energia Solar Inteligente | Solar Invest Solutions',
  description:
    'Economize com energia solar híbrida, off-grid e sustentável. Soluções acessíveis para residências, negócios e comunidades remotas.',
  keywords: [
    'energia solar',
    'solarinvest',
    'solar',
    'solar invest',
    'painel solar',
    'off-grid',
    'energia renovável',
    'fotovoltaica',
    'híbrida',
    'comunidade solar',
  ],
  authors: [{ name: 'SolarInvest Solutions' }],
  creator: 'SolarInvest Solutions',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      {/* 🎥 Vídeo ou imagem hero */}
      <Hero />

      {/* 🌞 Benefícios da solução solar */}
      <Beneficios />

      {/* ⚙️ Etapas de como funciona */}
      <ComoFunciona />

      {/* 🟡 Mensagem final com padding ajustado */}
      <section className="bg-gradient-to-br from-yellow-100 to-orange-200 text-gray-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-20 mt-12 sm:mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Bem-vindo à Solar Invest Solutions
          </h1>
          <p className="mt-4 text-base sm:text-lg">
            Energia solar inteligente, acessível e sustentável para o seu futuro.
          </p>
        </div>
      </section>
    </>
  );
}