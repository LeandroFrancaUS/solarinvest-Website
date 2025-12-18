import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import Script from 'next/script';

import type { Metadata } from 'next';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { seoConstants } from '@/lib/seo';

const { siteUrl, siteName, defaultImage, logoPath, logoUrl, baseKeywords, socialProfiles } = seoConstants;
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
  description: 'Energia solar inteligente, acessível e sustentável para residências e empresas.',
  applicationName: siteName,
  keywords: baseKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteName,
    description: 'Energia solar inteligente, acessível e sustentável para residências e empresas.',
    url: siteUrl,
    siteName,
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: logoUrl,
        width: 512,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Energia solar inteligente, acessível e sustentável para residências e empresas.',
    images: [logoUrl],
  },
  icons: {
    icon: [
      { url: logoPath, type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: [logoPath],
    apple: [{ url: logoPath }],
  },
  manifest: '/site.webmanifest',
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
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    description:
      'Soluções completas de energia solar, on-grid, off-grid e híbrida com leasing, assinatura e projetos personalizados.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressRegion: 'Goiás',
      addressLocality: 'Goiânia',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-62-99515-0975',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: ['Portuguese', 'English'],
    },
    sameAs: [
      socialProfiles.instagram,
      socialProfiles.linkedin,
      socialProfiles.whatsapp,
      socialProfiles.facebook,
      socialProfiles.google,
      socialProfiles.maps,
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    image: logoUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      socialProfiles.instagram,
      socialProfiles.linkedin,
      socialProfiles.whatsapp,
      socialProfiles.facebook,
      socialProfiles.google,
      socialProfiles.maps,
    ],
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: siteName,
    url: siteUrl,
    image: logoUrl,
    logo: logoUrl,
    telephone: '+55-62-99515-0975',
    sameAs: [
      socialProfiles.instagram,
      socialProfiles.linkedin,
      socialProfiles.whatsapp,
      socialProfiles.facebook,
      socialProfiles.google,
      socialProfiles.maps,
    ],
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Brasil',
    },
    hasMap: socialProfiles.maps,
    knowsAbout: baseKeywords,
    makesOffer: [
      {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        itemOffered: {
          '@type': 'Service',
          name: 'Projetos e leasing de energia solar',
          areaServed: 'Brasil',
          serviceType: 'Energia solar fotovoltaica, on-grid, off-grid e híbrida',
        },
      },
    ],
  };

  return (
    <html lang="pt-BR">
      <head>
        <meta property="og:image" content={logoUrl} />
        <meta name="twitter:image" content={logoUrl} />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="localbusiness-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
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
      <body className="font-sans text-gray-900 bg-white pt-[72px]">
        {/* Compensar header fixo */}
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
