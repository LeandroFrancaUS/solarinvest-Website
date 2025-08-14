import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://solarinvest.info'),
  title: 'SolarInvest Solutions',
  description: 'Energia solar inteligente e acessível.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'SolarInvest Solutions',
    description: 'Energia solar inteligente e acessível.',
    url: 'https://solarinvest.info',
    images: ['/hero-solar-house.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolarInvest Solutions',
    description: 'Energia solar inteligente e acessível.',
    images: ['/hero-solar-house.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-900 bg-white pt-[72px]"> {/* Compensar header fixo */}
        <Header />
        {children}
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}