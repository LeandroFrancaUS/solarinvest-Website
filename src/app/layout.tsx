import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import Script from 'next/script';

import type { Metadata } from 'next';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { defaultKeywords, seoConstants } from '@/lib/seo';

const { siteUrl, siteName, defaultImage, logoPath, logoUrl } = seoConstants;
const speedInsightsId =
  process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID || process.env.NEXT_PUBLIC_VERCEL_INSIGHTS_ID;
const analyticsModeEnv = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_MODE?.toLowerCase();
const analyticsDebugEnv = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_DEBUG?.toLowerCase();
const analyticsEndpoint = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENDPOINT;
const analyticsScriptSrc = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_SCRIPT_SRC;
const analyticsIgnorePatterns = (
  process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_IGNORE_PATHS?.split(',') ?? []
)
  .map((pattern) => pattern.trim())
  .filter(Boolean);

const analyticsMode =
  analyticsModeEnv && ['auto', 'development', 'production'].includes(analyticsModeEnv)
    ? (analyticsModeEnv as 'auto' | 'development' | 'production')
    : undefined;

const analyticsDebug =
  analyticsDebugEnv === 'true' ? true : analyticsDebugEnv === 'false' ? false : undefined;

const beforeSendHandler =
  analyticsIgnorePatterns && analyticsIgnorePatterns.length
    ? (event: BeforeSendEvent) => {
        const shouldIgnore = analyticsIgnorePatterns.some((pattern) => {
          if (!pattern) return false;
          if (pattern.endsWith('*')) {
            const prefix = pattern.slice(0, -1);
            return event.url.startsWith(prefix);
          }

          return event.url.includes(pattern);
        });

        return shouldIgnore ? null : event;
      }
    : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    'Energia solar inteligente, acessível e sustentável para residências, empresas e condomínios: on-grid, off-grid, híbrido, leasing de usinas fotovoltaicas, baterias e descontos médios de 20% a 30%.',
  applicationName: siteName,
  keywords: defaultKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/',
    },
  },
  openGraph: {
    title: siteName,
    description:
      'Energia solar inteligente, acessível e sustentável para residências, empresas e condomínios: on-grid, off-grid, híbrido, leasing de usinas fotovoltaicas, baterias e descontos médios de 20% a 30%.',
    url: siteUrl,
    siteName,
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description:
      'Energia solar inteligente, acessível e sustentável para residências, empresas e condomínios: on-grid, off-grid, híbrido, leasing de usinas fotovoltaicas, baterias e descontos médios de 20% a 30%.',
    images: [defaultImage],
  },
  icons: {
    icon: [
      { url: logoPath, type: 'image/png', sizes: '512x512' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: logoPath,
    apple: logoPath,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua das Flores, 123',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '01234-567',
      addressCountry: 'BR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-1234-5678',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: ['Portuguese', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/solarinvest',
      'https://www.instagram.com/solarinvest',
      'https://www.linkedin.com/company/solarinvest',
      'https://www.tiktok.com/@solarinvest',
      'https://x.com/solarinvest',
      'https://www.youtube.com/@solarinvest',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: siteName,
    url: siteUrl,
    image: logoUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}#solar-service`,
    name: 'Energia solar com desconto e leasing de usinas SolarInvest',
    provider: {
      '@id': organizationJsonLd['@id'],
    },
    serviceType: [
      'energia solar on-grid',
      'energia solar off-grid',
      'energia solar híbrida',
      'leasing de usina fotovoltaica',
      'energia solar com baterias',
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -23.55052,
        longitude: -46.633308,
      },
      geoRadius: 1200000,
    },
    keywords: defaultKeywords,
    logo: logoUrl,
    image: logoUrl,
    brand: {
      '@type': 'Brand',
      name: siteName,
      logo: logoUrl,
    },
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        category: 'Energia renovável',
        description:
          'Modelo de leasing e usina fotovoltaica sem investimento inicial, com entrega turnkey e operação completa.',
      },
      {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        eligibleRegion: 'BR',
        description: 'Descontos médios de 20% a 30% na conta de energia com geração solar limpa.',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Planos SolarInvest',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Usina fotovoltaica conectada à rede (on-grid)',
            image: logoUrl,
            description: 'Geração distribuída com painéis solares e módulos fotovoltaicos para residências e empresas.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Sistema híbrido com baterias solares',
            image: logoUrl,
            description: 'Energia solar com backup e armazenamento para segurança contra apagões.',
          },
        },
      ],
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <meta property="og:image" content={logoUrl} />
        <meta name="twitter:image" content={logoUrl} />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="service-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        {speedInsightsId ? (
          <>
            <Script id="vercel-speed-insights-init" strategy="beforeInteractive">
              {`window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};`}
            </Script>
            <Script
              id="vercel-speed-insights"
              src="https://cdn.vercel-insights.com/v1/speed-insights/script.js"
              strategy="afterInteractive"
              defer
              data-speed-insights-id={speedInsightsId}
            />
          </>
        ) : null}
      </head>
      <body className="font-sans text-gray-900 bg-white pt-[72px]"> {/* Compensar header fixo */}
        <Header />
        {children}
        <Footer />
        <WhatsappButton />
        <Analytics
          {...(analyticsMode ? { mode: analyticsMode } : {})}
          {...(typeof analyticsDebug === 'boolean' ? { debug: analyticsDebug } : {})}
          {...(analyticsEndpoint ? { endpoint: analyticsEndpoint } : {})}
          {...(analyticsScriptSrc ? { scriptSrc: analyticsScriptSrc } : {})}
          {...(beforeSendHandler ? { beforeSend: beforeSendHandler } : {})}
        />
      </body>
    </html>
  );
}
