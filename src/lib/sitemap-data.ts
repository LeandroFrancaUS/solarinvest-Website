import { seoConstants } from './seo';

export type SitemapImage = {
  loc: string;
  title?: string;
  caption?: string;
};

export type SitemapVideo = {
  loc: string;
  thumbnail: string;
  title: string;
  description: string;
  duration?: number;
  publicationDate?: string;
};

export type SitemapEntry = {
  path: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
};

const { siteUrl, logoUrl } = seoConstants;

const sharedHeroImage = `${siteUrl}/hero-solar-house.png`;
const sharedLogoImage = `${siteUrl}/logo.png`;

const defaultPublicationDate = new Date().toISOString();

export const sitemapEntries: SitemapEntry[] = [
  {
    path: '/',
    changefreq: 'monthly',
    priority: 1,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar residencial SolarInvest',
        caption: 'Residência equipada com usina fotovoltaica SolarInvest Solutions',
      },
      {
        loc: sharedLogoImage,
        title: 'Identidade visual SolarInvest Solutions',
      },
    ],
    videos: [
      {
        loc: `${siteUrl}/solarinvest-apresentacao.mp4`,
        thumbnail: sharedLogoImage,
        title: 'Apresentação SolarInvest Solutions',
        description:
          'Vídeo institucional sobre energia solar, leasing solar, usinas fotovoltaicas e sistemas híbridos em Goiás e Distrito Federal.',
        duration: 120,
        publicationDate: defaultPublicationDate,
      },
    ],
  },
  {
    path: '/comofunciona',
    changefreq: 'monthly',
    priority: 1,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Como funciona o leasing solar',
        caption: 'Etapas para instalar uma usina fotovoltaica SolarInvest e assumir a operação ao final do contrato.',
      },
    ],
  },
  {
    path: '/solucoes',
    changefreq: 'monthly',
    priority: 1,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Soluções fotovoltaicas SolarInvest',
        caption: 'Portfólio de sistemas fotovoltaicos on-grid, off-grid e híbridos com baterias.',
      },
    ],
  },
  {
    path: '/sobre',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedLogoImage,
        title: 'Sobre a SolarInvest Solutions',
        caption: 'História, missão e valores da SolarInvest no mercado de energia solar.',
      },
    ],
  },
  {
    path: '/contato',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedLogoImage,
        title: 'Contato SolarInvest Solutions',
        caption: 'Atendimento para projetos fotovoltaicos, leasing solar e suporte técnico.',
      },
    ],
  },
  {
    path: '/faq',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'FAQ SolarInvest',
        caption: 'Perguntas frequentes sobre usinas fotovoltaicas, leasing solar e economia de energia.',
      },
    ],
  },
  {
    path: '/search',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedLogoImage,
        title: 'Busca SolarInvest Solutions',
        caption: 'Ferramenta para localizar soluções de energia solar, leasing e serviços com rapidez.',
      },
    ],
  },
];
