import { seoConstants } from '@/lib/seo';

const { siteUrl } = seoConstants;

export type VideoInfo = {
  slug: string;
  title: string;
  description: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
  embedUrl: string;
  thumbnailUrl: string[];
};

export const featuredVideos: VideoInfo[] = [
  {
    slug: 'solarinvest-apresentacao',
    title: 'Apresentação SolarInvest Solutions',
    description:
      'Entenda como a SolarInvest entrega economia mensal, homologação completa e sistemas solares com suporte especializado.',
    uploadDate: '2024-11-01',
    duration: 'PT2M00S',
    contentUrl: `${siteUrl}/solarinvest-apresentacao.mp4`,
    embedUrl: `${siteUrl}/videos/solarinvest-apresentacao`,
    thumbnailUrl: [`${siteUrl}/favicon.png`],
  },
];
