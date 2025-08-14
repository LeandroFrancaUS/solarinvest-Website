import type { Metadata } from 'next';
import ContatoContent from './ContatoContent';

export const metadata: Metadata = {
  title: 'Contato | SolarInvest',
  description:
    'Entre em contato com a SolarInvest para solicitar orçamento ou tirar dúvidas sobre nossos sistemas de energia solar.',
  keywords: [
    'SolarInvest',
    'contato',
    'orçamento',
    'energia solar',
    'atendimento',
  ],
  openGraph: {
    title: 'Contato | SolarInvest',
    description:
      'Entre em contato com a SolarInvest para solicitar orçamento ou tirar dúvidas sobre nossos sistemas de energia solar.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato | SolarInvest',
    description:
      'Entre em contato com a SolarInvest para solicitar orçamento ou tirar dúvidas sobre nossos sistemas de energia solar.',
  },
};

export default function ContatoPage() {
  return <ContatoContent />;
}
