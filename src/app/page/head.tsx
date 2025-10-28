// src/app/head.tsx

import { seoConstants } from '@/lib/seo';

const { siteUrl, siteName, defaultImage } = seoConstants;

export default function Head() {
  return (
    <>
      <title>{siteName}</title>
      <meta
        name="description"
        content="Energia solar inteligente e acessível para residências, condomínios e empresas."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={siteUrl} />

      {/* 🔁 Preload do thumbnail em alta resolução para performance */}
      <link rel="preload" as="image" href={defaultImage} />

      {/* 🗂️ SEO base */}
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:title" content={siteName} />
      <meta
        property="og:description"
        content="Energia solar inteligente, com economia, segurança e sustentabilidade."
      />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteName} />
      <meta
        name="twitter:description"
        content="Energia solar inteligente, com economia, segurança e sustentabilidade."
      />
      <meta name="twitter:image" content={defaultImage} />
    </>
  );
}