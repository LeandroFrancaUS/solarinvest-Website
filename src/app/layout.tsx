import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import Script from 'next/script';

import type { Metadata } from 'next';

const siteUrl = 'https://solarinvest.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SolarInvest Solutions',
    template: '%s | SolarInvest Solutions',
  },
  description: 'Energia solar inteligente e acessível.',
  openGraph: {
    title: 'SolarInvest Solutions',
    description: 'Energia solar inteligente e acessível.',
    url: siteUrl,
    siteName: 'SolarInvest Solutions',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-solar-house.png',
        width: 1200,
        height: 630,
        alt: 'SolarInvest Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolarInvest Solutions',
    description: 'Energia solar inteligente e acessível.',
    images: ['/hero-solar-house.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SolarInvest Solutions',
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
      availableLanguage: 'Portuguese',
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans text-gray-900 bg-white pt-[72px]"> {/* Compensar header fixo */}
        <Header />
        {children}
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}