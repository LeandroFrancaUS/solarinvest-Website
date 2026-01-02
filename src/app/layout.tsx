import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import Script from 'next/script';
import SplashScreen from '@/components/SplashScreen';

import type { Metadata } from 'next';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { seoConstants } from '@/lib/seo';

const { siteUrl, siteName, defaultImage, logoPath, logoUrl, baseKeywords, socialProfiles } = seoConstants;
const gtmId = 'GTM-MK55QTV5';
const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_VERCEL_TRACKING === 'true';
const speedInsightsId =
  analyticsEnabled &&
  (process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID || process.env.NEXT_PUBLIC_VERCEL_INSIGHTS_ID);
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

const defaultMetaDescription =
  'Energia solar inteligente com leasing solar, usinas fotovoltaicas em Goiás e soluções híbridas SolarInvest para residências e empresas com economia sustentável.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultMetaDescription,
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
    description: defaultMetaDescription,
    url: siteUrl,
    siteName,
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: defaultImage,
        width: 1024,
        height: 1024,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: defaultMetaDescription,
    images: [defaultImage],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '1024x1024' },
      { url: '/icon.png', type: 'image/png', sizes: '1024x1024' },
    ],
    shortcut: ['/favicon.png'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
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
    sameAs: [socialProfiles.instagram, socialProfiles.facebook, socialProfiles.whatsapp, socialProfiles.linkedin],
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
    sameAs: [socialProfiles.instagram, socialProfiles.facebook, socialProfiles.whatsapp, socialProfiles.linkedin],
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: siteName,
    url: siteUrl,
    image: logoUrl,
    logo: logoUrl,
    telephone: '+55-62-99515-0975',
    sameAs: [socialProfiles.instagram, socialProfiles.facebook, socialProfiles.whatsapp, socialProfiles.linkedin],
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

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Service', 'Product'],
    name: 'Soluções e leasing de energia solar',
    description:
      'Assinatura, projetos e usinas fotovoltaicas completas da SolarInvest com foco em energia solar limpa, sistemas híbridos e baterias.',
    brand: {
      '@type': 'Brand',
      name: siteName,
      logo: logoUrl,
    },
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: logoUrl,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Goiás, Distrito Federal e Brasil',
    },
    serviceType: 'Energia solar fotovoltaica, leasing solar e sistemas híbridos com baterias',
    category: 'https://schema.org/EnergyEfficiencyEnumeration',
    image: defaultImage,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      description: 'Planos flexíveis de energia solar com previsibilidade de custos e homologação completa.',
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
        <meta property="og:image" content={defaultImage} />
        <meta name="twitter:image" content={defaultImage} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="1024x1024" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
        <Script
          id="services-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
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
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <SplashScreen>
          {/* Compensar header fixo */}
          <Header />
          {children}
          <Footer />
          <WhatsappButton />
        </SplashScreen>
        {analyticsEnabled ? (
          <Analytics
            {...(analyticsMode ? { mode: analyticsMode } : {})}
            {...(typeof analyticsDebug === 'boolean' ? { debug: analyticsDebug } : {})}
            {...(analyticsEndpoint ? { endpoint: analyticsEndpoint } : {})}
            {...(analyticsScriptSrc ? { scriptSrc: analyticsScriptSrc } : {})}
            {...(beforeSendHandler ? { beforeSend: beforeSendHandler } : {})}
          />
        ) : null}
      </body>
    </html>
  );
}
