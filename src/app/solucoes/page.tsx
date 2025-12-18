import SolucoesPageClient from './SolucoesPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soluções | SolarInvest Solutions',
  description:
    'Conheça soluções solares personalizadas: sistemas fotovoltaicos com baterias, leasing solar, usinas híbridas e monitoramento completo para residências, empresas e áreas rurais.',
  alternates: { canonical: '/solucoes' },
};

export default function SolucoesPage() {
  return <SolucoesPageClient />;
}
