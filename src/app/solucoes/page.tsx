import SolucoesPageClient from './SolucoesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soluções | SolarInvest Solutions',
  description: 'Conheça nossas soluções solares personalizadas para residências, empresas e áreas rurais.',
  alternates: { canonical: '/solucoes' },
};

export default function SolucoesPage() {
  return <SolucoesPageClient />;
}
