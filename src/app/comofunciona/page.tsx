// src/app/comofunciona/page.tsx

import React from 'react';
import ComoFunciona from '@/components/ComoFunciona';

export const metadata = {
  title: 'Como Funciona | SolarInvest',
  description:
    'Entenda como a SolarInvest transforma sua conta de energia em economia com um processo simples e eficiente.',
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ComoFunciona />
    </main>
  );
}
