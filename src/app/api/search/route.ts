import { NextResponse } from 'next/server';

type PageReference = {
  title: string;
  url: string;
  description: string;
  keywords?: string[];
};

const pages: PageReference[] = [
  {
    title: 'Sobre',
    url: '/sobre',
    description: 'Conheça a SolarInvest Solutions.',
    keywords: ['solar'],
  },
  {
    title: 'Soluções',
    url: '/solucoes',
    description: 'Veja nossas soluções em energia solar.',
    keywords: ['solar'],
  },
  {
    title: 'Contato',
    url: '/contato',
    description: 'Fale com a nossa equipe.',
    keywords: ['solar'],
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';

  const results = pages.filter((page) => {
    const matchesTitleOrDescription =
      page.title.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q);
    const matchesKeywords =
      page.keywords?.some((keyword) => keyword.toLowerCase().includes(q)) ?? false;

    return matchesTitleOrDescription || matchesKeywords;
  });

  return NextResponse.json({ results });
}
