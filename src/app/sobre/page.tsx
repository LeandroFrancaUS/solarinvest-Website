import SobrePageClient from './SobrePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre | SolarInvest Solutions',
  description:
    'Conheça a SolarInvest, especialista em energia solar em Goiás: missão, valores e equipe que entrega usinas fotovoltaicas, leasing solar e suporte contínuo.',
  alternates: { canonical: '/sobre' },
};

export default function SobrePage() {
  return <SobrePageClient />;
}
