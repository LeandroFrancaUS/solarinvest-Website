import type { Metadata } from 'next';
import React from 'react';
import ComoFunciona from '@/components/ComoFunciona';

export const metadata: Metadata = {
  title: 'Como Funciona a Energia Solar | SolarInvest',
  description:
    'Veja o passo a passo para implementar energia solar com a SolarInvest, da análise inicial à economia garantida.',
  keywords: [
    'SolarInvest',
    'como funciona',
    'instalação solar',
    'processo de energia solar',
    'economia de energia',
  ],
  openGraph: {
    title: 'Como Funciona a Energia Solar | SolarInvest',
    description:
      'Veja o passo a passo para implementar energia solar com a SolarInvest, da análise inicial à economia garantida.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Como Funciona a Energia Solar | SolarInvest',
    description:
      'Veja o passo a passo para implementar energia solar com a SolarInvest, da análise inicial à economia garantida.',
  },
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ComoFunciona />
    </main>
  );
}
