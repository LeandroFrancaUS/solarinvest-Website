import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import Script from 'next/script';

import type { Metadata } from 'next';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { seoConstants } from '@/lib/seo';

const { siteUrl, siteName, defaultImage } = seoConstants;
const speedInsightsId =
  process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID || process.env.NEXT_PUBLIC_VERCEL_INSIGHTS_ID;
const analyticsModeEnv = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_MODE?.toLowerCase();
const analyticsDebugEnv = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_DEBUG?.toLowerCase();
const analyticsEndpoint = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENDPOINT;
const analyticsScriptSrc = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_SCRIPT_SRC;
const analyticsIgnorePatterns = (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_IGNORE_PATHS
  ? process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_IGNORE_PATHS.split(',')
  : [])
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
  keywords: [
    'energia solar',
    'solarinvest',
    'energia renovável',
    'painel fotovoltaico',
    'sustentabilidade',
    'economia de energia',
  ],
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
    description: 'Energia solar inteligente, acessível e sustentável para residências e empresas.',
    images: [defaultImage],
  },
  icons: {
    icon: '/favicon.ico',
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
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
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
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="pt-BR">
      <head>
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