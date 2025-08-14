// src/app/comofunciona/page.tsx

import ComoFunciona from '@/components/ComoFunciona';
import FAQComoFunciona from '@/components/FAQComoFunciona';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Funciona | SolarInvest Solutions',
  description:
    'Entenda como a SolarInvest transforma sua conta de energia em economia com um processo simples e eficiente.',
  alternates: { canonical: '/comofunciona' },
};

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-white">
      <ComoFunciona />
      <FAQComoFunciona />
    </main>
  );
}