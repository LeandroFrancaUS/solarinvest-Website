import SobrePageClient from './SobrePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre | SolarInvest Solutions',
  description: 'Conheça a SolarInvest, nossa missão e valores no mercado de energia solar.',
  alternates: { canonical: '/sobre' },
};

export default function SobrePage() {
  return <SobrePageClient />;
}
