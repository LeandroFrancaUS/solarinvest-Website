import Faq from '@/components/Faq';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes | SolarInvest Solutions',
  description:
    'Dúvidas sobre leasing solar, usinas fotovoltaicas ou sistemas híbridos? Confira respostas sobre custos, economia, instalação e suporte da SolarInvest.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <Faq />
    </main>
  );
}
