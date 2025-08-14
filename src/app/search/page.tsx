import Search from '@/components/Search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Busca | SolarInvest Solutions',
  description:
    'Use a busca para encontrar informações sobre energia solar e nossos serviços.',
};

export default function SearchPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Buscar</h1>
      <Search />
    </main>
  );
}
