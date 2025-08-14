import type { Metadata } from 'next';
import SolucoesContent from './SolucoesContent';

export const metadata: Metadata = {
  title: 'Soluções em Energia Solar | SolarInvest',
  description:
    'Conheça soluções solares residenciais, comerciais e off-grid da SolarInvest para reduzir custos e promover sustentabilidade.',
  keywords: [
    'SolarInvest',
    'soluções solares',
    'residencial',
    'comercial',
    'off-grid',
    'energia renovável',
  ],
  openGraph: {
    title: 'Soluções em Energia Solar | SolarInvest',
    description:
      'Conheça soluções solares residenciais, comerciais e off-grid da SolarInvest para reduzir custos e promover sustentabilidade.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soluções em Energia Solar | SolarInvest',
    description:
      'Conheça soluções solares residenciais, comerciais e off-grid da SolarInvest para reduzir custos e promover sustentabilidade.',
  },
};

export default function SolucoesPage() {
  return <SolucoesContent />;
}
