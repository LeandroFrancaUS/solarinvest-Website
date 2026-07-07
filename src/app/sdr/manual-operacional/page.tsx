import type { Metadata } from 'next';
import SDRManualSearch from '@/components/SDRManualSearch';

export const metadata: Metadata = {
  title: 'Manual Operacional SDR SolarInvest',
  description: 'Atendimento inicial, qualificação de leads, perguntas frequentes e respostas padrão.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: '/sdr/manual-operacional' },
};

export default function SDRManualPage() {
  return <SDRManualSearch />;
}
