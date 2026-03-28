// src/app/page.tsx

import HomeWithSplash from '@/components/HomeWithSplash';
import { buildMetadata } from '@/lib/seo';

// 🔍 SEO Metadata
export const metadata = buildMetadata({
  title: 'SolarInvest | Energia Solar sem Investimento Inicial, Leasing e Economia na Conta de Luz',
  description:
    'Conheça a SolarInvest: soluções em energia solar para residências e empresas, com opções sem investimento inicial, leasing operacional, suporte, manutenção e economia real na conta de luz.',
  path: '/',
  keywords: [
    'energia solar sem investimento',
    'leasing energia solar',
    'empresa energia solar brasil',
    'economia com energia solar',
    'como reduzir conta de luz',
    'energia solar como serviço',
    'energia solar assinatura brasil',
    'energia solar goias',
    'energia solar anapolis',
    'energia solar goiania',
    'energia solar brasilia',
  ],
});

export default function Home() {
  return <HomeWithSplash />;
}
