import type { Metadata } from 'next';

const siteUrl = 'https://solarinvest.info';
const siteName = 'SolarInvest Solutions';
const logoPath = '/icon.png';
const logoUrl = `${siteUrl}${logoPath}`;
const defaultImage = logoUrl;
const baseKeywords = [
  'solar',
  'energia solar',
  'energia solar fotovoltaica',
  'sistema fotovoltaico',
  'usina solar',
  'geração distribuída',
  'autoconsumo remoto',
  'energia solar residencial',
  'energia solar comercial',
  'energia solar com baterias',
  'sistema solar híbrido',
  'energia off-grid',
  'energia solar off-grid',
  'microgeração distribuída',
  'economia na conta de luz',
  'redução da conta de energia',
  'energia mais barata',
  'preço fixo de energia',
  'proteção contra aumento da tarifa',
  'previsibilidade de custos',
  'economia mensal garantida',
  'redução de custos operacionais',
  'blindagem tarifária',
  'independência energética',
  'patrimônio energético',
  'ativo energético',
  'geração de patrimônio',
  'investimento em energia',
  'energia como ativo',
  'valorização do imóvel',
  'retorno financeiro indireto',
  'economia acumulada',
  'energia solar sem investimento inicial',
  'energia solar sem entrada',
  'energia solar por assinatura',
  'leasing solar',
  'aluguel de usina solar',
  'energia solar sem financiamento',
  'pague menos que a conta de luz',
  'troca da conta de luz por mensalidade',
  'energia solar acessível',
  'energia solar simplificada',
  'energia sem interrupção',
  'energia durante queda de energia',
  'backup de energia',
  'energia solar com backup',
  'continuidade energética',
  'segurança energética',
  'sistema com baterias',
  'energia confiável',
  'autonomia energética',
  'energia renovável',
  'energia limpa',
  'sustentabilidade energética',
  'redução de carbono',
  'consumo consciente',
  'eficiência energética',
  'quanto custa energia solar',
  'energia solar vale a pena',
  'energia solar com bateria preço',
  'energia solar para áreas remotas',
  'empresa de energia solar confiável',
  'energia solar com preço previsível',
  'transforme sua conta de luz em patrimônio',
  'energia solar com bateria',
  'independência energética com economia real',
  'solarinvest solutions',
  'solarinvest energia solar',
  'painel solar',
  'painel fotovoltaico',
  'módulo fotovoltaico',
  'fotovoltaico',
  'energia fotovoltaica',
  'sistema on-grid',
  'sistema off-grid',
  'sistema híbrido',
  'baterias solares',
  'usina de energia',
  'desconto energia renovável',
  '20% desconto energia solar',
  '30% desconto energia solar',
  'economia de energia',
  'energia solar goiás',
  'energia solar brasília',
  'energia solar com homologação',
  'energia solar para empresas',
  'energia solar para residência',
  'energia solar com monitoramento',
  'energia solar sustentável',
  'soluções em energia solar',
  'energia solar inteligente',
  'solarinvest',
  'SolarInvest Solutions Facebook',
  'facebook solarinvest solutions',
];

const socialProfiles = {
  instagram: 'https://www.instagram.com/solarinvest.br',
  linkedin: 'https://www.linkedin.com/company/solarinvest-solutions/',
  whatsapp: 'https://api.whatsapp.com/send/?phone=5562995150975',
  facebook: 'https://www.facebook.com/SolarInvestSolutions',
  google: 'https://share.google/urA2LS9hMCaGML3YE',
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
  baseKeywords,
  socialProfiles,
};
