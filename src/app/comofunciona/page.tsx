// src/app/comofunciona/page.tsx

import ComoFunciona from '@/components/ComoFunciona';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Funciona | SolarInvest Solutions',
  description:
    'Saiba como funciona o leasing solar da SolarInvest: usina fotovoltaica própria, sem entrada, com homologação completa e economia garantida em Goiás.',
  alternates: { canonical: '/comofunciona' },
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ComoFunciona />
    </main>
  );
}
