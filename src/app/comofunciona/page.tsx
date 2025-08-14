// src/app/comofunciona/page.tsx

import ComoFunciona from '@/components/ComoFunciona';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Funciona | SolarInvest Solutions',
  description:
    'Veja como funciona o modelo sem investimento inicial da SolarInvest e como você se torna dono da usina ao final do contrato.',
  alternates: { canonical: '/comofunciona' },
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ComoFunciona />
    </main>
  );
}