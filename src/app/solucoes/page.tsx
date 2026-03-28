import SolucoesPageClient from './SolucoesPageClient';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Soluções em Energia Solar | Leasing, Residencial e Empresas | SolarInvest',
  description:
    'Conheça as soluções da SolarInvest: leasing de energia solar, instalação para residências e empresas, sem investimento inicial, com suporte e manutenção inclusos.',
  path: '/solucoes',
  keywords: [
    'leasing energia solar',
    'energia solar sem investimento',
    'soluções energia solar',
    'energia solar residencial',
    'energia solar empresas',
    'energia solar sem entrada',
  ],
});

export default function SolucoesPage() {
  return <SolucoesPageClient />;
}
