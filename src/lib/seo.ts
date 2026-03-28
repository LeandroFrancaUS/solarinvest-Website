import type { Metadata } from 'next';

const siteUrl = 'https://solarinvest.info';
const siteName = 'SolarInvest';
const logoPath = '/logos_festivos/2026_Logo.png';
const logoUrl = `${siteUrl}${logoPath}`;
const defaultImage = `${siteUrl}/favicon.png`;
const baseKeywords = [
  'energia solar',
  'energia solar fotovoltaica',
  'sistema fotovoltaico',
  'leasing energia solar',
  'energia solar leasing brasil',
  'aluguel de energia solar',
  'energia solar sem investimento',
  'energia solar sem entrada',
  'energia solar por assinatura',
  'energia solar mensalidade',
  'energia solar contrato mensal',
  'energia solar sem financiamento',
  'energia solar como serviço',
  'energia solar assinatura brasil',
  'energia solar residencial',
  'energia solar comercial',
  'energia solar para empresas',
  'energia solar para residência',
  'economia na conta de luz',
  'como reduzir conta de luz',
  'conta de luz muito cara',
  'redução da conta de energia',
  'quanto custa energia solar',
  'instalar energia solar preço',
  'energia solar para residência preço',
  'energia solar vale a pena',
  'energia solar compensa 2026',
  'quanto economiza energia solar',
  'energia solar como funciona',
  'energia solar residencial como funciona',
  'energia solar precisa de bateria',
  'energia solar funciona sem luz',
  'energia solar vantagens e desvantagens',
  'empresa de energia solar goias',
  'energia solar goias',
  'energia solar anapolis',
  'energia solar goiania',
  'energia solar brasilia',
  'energia solar df',
  'instalação energia solar goias',
  'empresa energia solar confiável',
  'empresa energia solar brasil',
  'energia solar com garantia',
  'energia solar com suporte',
  'energia solar com manutenção',
  'reduzir custo fixo empresa',
  'reduzir gastos operacionais energia',
  'reduzir custo energia empresa',
  'previsibilidade de custos',
  'independência energética',
  'energia renovável',
  'energia limpa',
  'solarinvest',
  'painel solar',
  'usina solar',
  'geração distribuída',
];

const socialProfiles = {
  instagram: 'https://www.instagram.com/solarinvest.br/',
  facebook: 'https://www.facebook.com/SolarInvestSolutions',
  whatsapp:
    'https://api.whatsapp.com/send/?phone=5562995150975&text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+a+energia+solar+da+SolarInvest.&type=phone_number&app_absent=0',
  linkedin: 'https://www.linkedin.com/company/solarinvest-solutions/',
  maps: 'https://maps.app.goo.gl/F4Nergs2Arurxxij7',
  website: siteUrl,
};

export type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function buildMetadata({ title, description, path, keywords = [] }: BuildMetadataOptions): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${siteUrl}${canonicalPath}`;
  const mergedKeywords = Array.from(new Set([...baseKeywords, ...keywords])).filter(Boolean);

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
          width: 1024,
          height: 1024,
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
  baseKeywords,
  socialProfiles,
};
