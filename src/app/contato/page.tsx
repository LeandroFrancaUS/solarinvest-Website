import ContatoPageClient from './ContatoPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato | SolarInvest Solutions',
  description: 'Está pronto para transformar sua energia em economia? Fale com a SolarInvest.',
  alternates: { canonical: '/contato' },
};

export default function ContatoPage() {
  return <ContatoPageClient />;
}
