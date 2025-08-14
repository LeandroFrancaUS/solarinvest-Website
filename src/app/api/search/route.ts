import { NextResponse } from 'next/server';

const pages = [
  {
    title: 'Sobre',
    url: '/sobre',
    description: 'Conheça a SolarInvest Solutions.',
  },
  {
    title: 'Soluções',
    url: '/solucoes',
    description: 'Veja nossas soluções em energia solar.',
  },
  {
    title: 'Contato',
    url: '/contato',
    description: 'Fale com a nossa equipe.',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const results = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q)
  );

  return NextResponse.json({ results });
}
