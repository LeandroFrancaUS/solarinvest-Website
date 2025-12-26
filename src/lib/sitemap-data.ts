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
        title: 'Busca SolarInvest Solutions',
        caption: 'Ferramenta para localizar soluções de energia solar, leasing e serviços com rapidez.',
      },
    ],
  },
];
