import ContatoPageClient from './ContatoPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato | SolarInvest Solutions',
  description:
    'Pronto para economizar com energia solar? Fale com a SolarInvest e solicite proposta de leasing solar, usinas fotovoltaicas e sistemas híbridos com baterias.',
  alternates: { canonical: '/contato' },
};

export default function ContatoPage() {
  return <ContatoPageClient />;
}
