import Faq from '@/components/Faq';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'FAQ Energia Solar | Dúvidas sobre Preço, Economia e Funcionamento | SolarInvest',
  description:
    'Tire suas dúvidas sobre energia solar: preço, economia, leasing, funcionamento, bateria, falta de energia, manutenção, garantia e alternativas sem investimento inicial.',
  path: '/faq',
  keywords: [
    'faq energia solar',
    'dúvidas energia solar',
    'energia solar vale a pena',
    'quanto economiza energia solar',
    'energia solar compensa 2026',
    'leasing energia solar',
    'energia solar sem investimento',
    'energia solar como funciona',
  ],
});

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <Faq />
    </main>
  );
}
