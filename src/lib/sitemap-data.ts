import { featuredVideos } from '@/config/videos';
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

const sharedHeroImage = `${siteUrl}/icon.png`;
const sharedLogoImage = logoUrl;

const [presentationVideo] = featuredVideos;

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
    path: '/videos',
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Biblioteca de vídeos SolarInvest',
        caption: 'Conteúdos em vídeo sobre economia de energia, projetos fotovoltaicos e leasing solar.',
      },
    ],
  },
  {
    path: '/videos/solarinvest-apresentacao',
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: sharedLogoImage,
        title: 'Vídeo institucional SolarInvest',
        caption: 'Conheça a proposta de valor e os diferenciais da SolarInvest Solutions.',
      },
    ],
    videos: presentationVideo
      ? [
          {
            loc: presentationVideo.contentUrl,
            thumbnail: presentationVideo.thumbnailUrl[0],
            title: presentationVideo.title,
            description: presentationVideo.description,
            duration: 120,
            publicationDate: `${presentationVideo.uploadDate}T00:00:00Z`,
          },
        ]
      : [],
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
        title: 'Busca SolarInvest',
        caption: 'Ferramenta para localizar soluções de energia solar, leasing e serviços com rapidez.',
      },
    ],
  },
  {
    path: '/leasing-energia-solar',
    changefreq: 'monthly',
    priority: 1,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Leasing de energia solar SolarInvest',
        caption: 'Modelo de leasing operacional de energia solar sem investimento inicial e com transferência da usina.',
      },
    ],
  },
  {
    path: '/economia-na-conta-de-luz',
    changefreq: 'monthly',
    priority: 1,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Economia na conta de luz com energia solar',
        caption: 'Soluções SolarInvest para reduzir a conta de energia de residências e empresas.',
      },
    ],
  },
  {
    path: '/preco-energia-solar',
    changefreq: 'monthly',
    priority: 1,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Preço de energia solar',
        caption: 'Quanto custa instalar energia solar em residências e empresas com a SolarInvest.',
      },
    ],
  },
  {
    path: '/energia-solar-goias',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar em Goiás',
        caption: 'Empresa de energia solar em Goiás com instalação, leasing, manutenção e suporte.',
      },
    ],
  },
  {
    path: '/energia-solar-anapolis',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar em Anápolis',
        caption: 'Soluções de energia solar em Anápolis com a SolarInvest.',
      },
    ],
  },
  {
    path: '/energia-solar-goiania',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar em Goiânia',
        caption: 'Preço e soluções de energia solar em Goiânia pela SolarInvest.',
      },
    ],
  },
  {
    path: '/energia-solar-brasilia',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar em Brasília e DF',
        caption: 'Soluções de energia solar para Brasília e Distrito Federal com a SolarInvest.',
      },
    ],
  },
  {
    path: '/empresas',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar para empresas',
        caption: 'Redução do custo operacional de energia para empresas com leasing solar SolarInvest.',
      },
    ],
  },
  {
    path: '/residencial',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar residencial',
        caption: 'Leasing de energia solar para residências com mensalidade menor que a conta de luz.',
      },
    ],
  },
  {
    path: '/limpeza-de-placas-solares',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Limpeza de placas solares',
        caption: 'Como limpar painéis fotovoltaicos corretamente: produtos, frequência e segurança.',
      },
    ],
  },
  {
    path: '/energia-solar-parana',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar no Paraná',
        caption: 'Soluções de energia solar no Paraná para residências, empresas e área rural.',
      },
    ],
  },
  {
    path: '/energia-solar-cascavel',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar em Cascavel',
        caption: 'Soluções fotovoltaicas em Cascavel, PR, com leasing, suporte e manutenção.',
      },
    ],
  },
  {
    path: '/energia-solar-rural',
    changefreq: 'monthly',
    priority: 0.9,
    images: [
      {
        loc: sharedHeroImage,
        title: 'Energia solar rural',
        caption: 'Sistemas fotovoltaicos para propriedades rurais, irrigação e agroindustrial.',
      },
    ],
  },
];
