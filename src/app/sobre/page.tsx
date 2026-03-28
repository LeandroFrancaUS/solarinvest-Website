import SobrePageClient from './SobrePageClient';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'SolarInvest | Empresa de Energia Solar com Suporte, Garantia e Manutenção',
  description:
    'Conheça a SolarInvest, empresa de energia solar com foco em atendimento, suporte, manutenção, garantia e soluções para reduzir o custo de energia de forma inteligente.',
  path: '/sobre',
  keywords: [
    'empresa energia solar brasil',
    'empresa energia solar confiável',
    'empresa energia solar recomendada',
    'energia solar com garantia',
    'energia solar com suporte',
    'energia solar com manutenção',
  ],
});

export default function SobrePage() {
  return <SobrePageClient />;
}
