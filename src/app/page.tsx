// src/app/page.tsx

import HomeWithSplash from '@/components/HomeWithSplash';
import { buildMetadata } from '@/lib/seo';

// 🔍 SEO Metadata
export const metadata = buildMetadata({
  title: 'Energia Solar Inteligente | SolarInvest Solutions',
  description:
    'Economize com energia solar híbrida, off-grid e sustentável. Soluções acessíveis para residências, negócios e comunidades remotas.',
  path: '/',
  keywords: [
    'energia solar',
    'solarinvest',
    'solar invest',
    'painel solar',
    'off-grid',
    'energia renovável',
    'fotovoltaica',
    'híbrida',
    'comunidade solar',
  ],
});

export default function Home() {
  return <HomeWithSplash />;
}
