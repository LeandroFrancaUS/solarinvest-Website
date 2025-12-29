import { NextResponse } from 'next/server';

type PageReference = {
  title: string;
  url: string;
  description: string;
  keywords?: string[];
};

const pages: PageReference[] = [
  {
    title: 'Página inicial',
    url: '/',
    description:
      'Energia solar inteligente com soluções híbridas, off-grid e acessíveis para residências e empresas.',
    keywords: ['energia solar', 'off-grid', 'solar invest', 'economia de energia'],
  },
  {
    title: 'Como funciona',
    url: '/comofunciona',
    description:
      'Entenda o passo a passo do leasing solar: diagnóstico, projeto, homologação e economia garantida.',
    keywords: ['leasing solar', 'projeto fotovoltaico', 'homologação', 'economia na conta de luz'],
  },
  {
    title: 'Soluções',
    url: '/solucoes',
    description:
      'Sistemas solares personalizados com baterias, usinas híbridas, monitoramento e planos para residências e negócios.',
    keywords: ['sistemas solares', 'usina híbrida', 'baterias', 'monitoramento'],
  },
  {
    title: 'Sobre',
    url: '/sobre',
    description:
      'Conheça a SolarInvest, missão, valores e equipe especializada em projetos fotovoltaicos em Goiás.',
    keywords: ['sobre a solarinvest', 'valores', 'missão', 'time'],
  },
  {
    title: 'Contato',
    url: '/contato',
    description:
      'Fale com a equipe SolarInvest para propostas de usinas, leasing solar ou sistemas híbridos com baterias.',
    keywords: ['proposta solar', 'atendimento', 'whatsapp solar', 'contato'],
  },
  {
    title: 'Perguntas frequentes',
    url: '/faq',
    description:
      'Respostas sobre custos, economia, instalação, manutenção e garantias dos sistemas solares SolarInvest.',
    keywords: ['faq', 'dúvidas', 'manutenção', 'garantia', 'custos'],
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
