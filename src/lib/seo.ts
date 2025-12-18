import type { Metadata } from 'next';

const siteUrl = 'https://solarinvest.info';
const siteName = 'SolarInvest Solutions';
const logoPath = '/icon.png';
const logoUrl = `${siteUrl}${logoPath}`;
const defaultImage = logoUrl;

export const defaultKeywords = [
  'energia solar',
  'energia renovável',
  'energia fotovoltaica',
  'painel solar',
  'módulo fotovoltaico',
  'painel fotovoltaico',
  'sistema on-grid',
  'sistema off-grid',
  'sistema híbrido',
  'baterias solares',
  'armazenamento de energia',
  'energia limpa',
  'energia sustentável',
  'economia de energia',
  'desconto energia renovável',
  '20% de desconto na energia',
  '30% de desconto na energia',
  'leasing solar',
  'usina solar gratuita',
  'usina de graça',
  'usina fotovoltaica',
  'energia solar residencial',
  'energia solar comercial',
  'energia solar industrial',
  'energia solar para condomínios',
  'energia solar com baterias',
  'solar invest',
  'solarinvest',
];

export type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function buildMetadata({ title, description, path, keywords = [] }: BuildMetadataOptions): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${siteUrl}${canonicalPath}`;
  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultImage],
    },
  };
}

export const seoConstants = {
  siteUrl,
  siteName,
  logoPath,
  logoUrl,
  defaultImage,
};
