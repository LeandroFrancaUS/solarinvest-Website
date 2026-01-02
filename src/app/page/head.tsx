// src/app/head.tsx

import { seoConstants } from '@/lib/seo';

const { siteUrl, siteName, defaultImage, logoPath } = seoConstants;

export default function Head() {
  return (
    <>
      <title>{siteName}</title>
      <meta
        name="description"
        content="Energia solar inteligente e acessível em Goiás: leasing solar, usinas fotovoltaicas e sistemas híbridos SolarInvest para residências, condomínios e empresas."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="1024x1024" href="/favicon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="canonical" href={siteUrl} />

      {/* 🔁 Preload do thumbnail em alta resolução para performance */}
      <link rel="preload" as="image" href={defaultImage} />

      {/* 🗂️ SEO base */}
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:title" content={siteName} />
      <meta
        property="og:description"
        content="Energia solar inteligente, com leasing solar, economia garantida e sistemas fotovoltaicos sustentáveis para negócios e residências."
      />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteName} />
      <meta
        name="twitter:description"
        content="Energia solar inteligente, com leasing solar, economia garantida e sistemas fotovoltaicos sustentáveis para negócios e residências."
      />
      <meta name="twitter:image" content={defaultImage} />
      <meta itemProp="image" content={defaultImage} />
    </>
  );
}
