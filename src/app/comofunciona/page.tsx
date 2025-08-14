// src/app/comofunciona/page.tsx

'use client';

import React from 'react';
import ComoFunciona from '@/components/ComoFunciona';

// 🔍 SEO Metadata
export const metadata = {
  title: 'Como Funciona | How It Works | Solar Invest Solutions',
  description:
    'Entenda como a Solar Invest Solutions oferece energia solar inteligente para economizar. Learn how Solar Invest Solutions delivers smart solar energy to save you money.',
  keywords: [
    'como funciona',
    'how it works',
    'energia solar',
    'solar energy',
    'economia de energia',
    'energy savings',
    'solar invest',
    'solarinvest solutions',
  ],
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ComoFunciona />
    </main>
  );
}