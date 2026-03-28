import ContatoPageClient from './ContatoPageClient';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contato | SolarInvest — Solicite uma Análise Gratuita',
  description:
    'Entre em contato com a SolarInvest e solicite uma análise gratuita. Atendemos residências e empresas em Goiás, Anápolis, Goiânia, Brasília e todo o Brasil.',
  path: '/contato',
  keywords: [
    'contato energia solar',
    'análise gratuita energia solar',
    'empresa energia solar goias',
    'energia solar anapolis',
    'energia solar goiania',
    'energia solar brasilia',
  ],
});

export default function ContatoPage() {
  return <ContatoPageClient />;
}
