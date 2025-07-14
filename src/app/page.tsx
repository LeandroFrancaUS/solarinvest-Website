'use client';

import Hero from '@/components/Hero';
import Beneficios from '@/components/Beneficios';
import ComoFunciona from '@/components/ComoFunciona';

/**
 * Página principal da SolarInvest.
 * Exibe o Hero com vídeo, os benefícios e como funciona o serviço.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen pt-24 bg-white">
      {/*
        🧱 pt-24 garante espaçamento suficiente abaixo do Header fixo
      */}
      <Hero />
      <Beneficios />
      <ComoFunciona />
    </main>
  );
}