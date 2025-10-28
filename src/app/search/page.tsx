import Search from '@/components/Search';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Busca | SolarInvest Solutions',
  description: 'Use a busca para encontrar informações sobre energia solar e nossos serviços.',
  path: '/search',
  keywords: ['buscar energia solar', 'pesquisa solarinvest', 'encontrar serviços energia solar'],
});

export default function SearchPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Buscar</h1>
      <Search />
    </main>
  );
}
