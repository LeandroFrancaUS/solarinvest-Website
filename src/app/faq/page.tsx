import Faq from '@/components/Faq';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes | SolarInvest Solutions',
  description:
    'Dúvidas sobre o modelo de leasing solar? Confira respostas sobre custos, vantagens e processo.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <Faq />
    </main>
  );
}
