'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

// 🎥 Importação dinâmica do player YouTube otimizado
const LiteYouTube = dynamic(() => import('@/components/LiteYouTube'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video w-full bg-gray-200 animate-pulse rounded-xl" />
  ),
});

export default function Hero() {
  const { baseKeywords, socialProfiles, logoUrl, siteUrl, siteName } = seoConstants;

  const heroServiceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Energia solar inteligente para residências e condomínios',
    serviceType: 'Energia solar fotovoltaica, on-grid, off-grid e híbrida com leasing e assinatura',
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: logoUrl,
      sameAs: [
        socialProfiles.instagram,
        socialProfiles.linkedin,
        socialProfiles.whatsapp,
        socialProfiles.google,
        socialProfiles.maps,
      ],
    },
    areaServed: 'Brasil',
    image: logoUrl,
    keywords: baseKeywords,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/contato`,
      description: 'Análise gratuita para projetos solares residenciais, comerciais e híbridos',
    },
  };

  return (
    <section
      id="hero"
      className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* 📢 Texto promocional do lado esquerdo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-3xl mx-auto md:mx-0 text-center md:text-left space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600 leading-tight md:leading-tight">
              Energia solar inteligente para sua casa, comercio ou condomínio
            </h1>
            <p className="text-base sm:text-lg text-gray-700">
              Economize na conta de luz, proteja-se contra apagões e invista em sustentabilidade com a SolarInvest Solutions.
            </p>
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite uma análise gratuita
            </Link>
          </div>
        </motion.div>

        {/* 🎬 Vídeo YouTube leve com thumbnail otimizada */}
        <motion.div
          className="w-full max-w-3xl mx-auto md:max-w-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 🔁 Player só será carregado após clique (LiteYouTube) */}
          <LiteYouTube videoId="UXA3Td8KgmY" />
        </motion.div>
      </div>

      <Script
        id="hero-service-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroServiceJsonLd) }}
      />
    </section>
  );
}
