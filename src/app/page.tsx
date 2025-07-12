// src/app/page.tsx

import Hero from '@/components/Hero';
import Beneficios from '@/components/Beneficios';
import ComoFunciona from '@/components/ComoFunciona'; // Corrigido: agora importa o componente diretamente

// 🔍 SEO Metadata para motores de busca
export const metadata = {
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
};

export default function Home() {
  return (
    <>
      {/* 🟠 Seção inicial com vídeo ou imagem hero */}
      <Hero />

      {/* 🟠 Seção de benefícios da SolarInvest */}
      <Beneficios />

      {/* 🟠 Seção explicativa do processo em etapas */}
      <ComoFunciona />

      {/* 🟠 Seção final com mensagem institucional */}
      <main className="min-h-screen px-4 sm:px-6 md:px-8 py-16 bg-gradient-to-br from-yellow-100 to-orange-200 text-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Bem-vindo à Solar Invest Solutions</h1>
          <p className="mt-4 text-lg">
            Energia solar inteligente, acessível e sustentável para o seu futuro.
          </p>
        </div>
      </main>
    </>
  );
}