import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'SolarInvest Solutions',
  description: 'Energia solar inteligente e acessível.',
  themeColor: '#ffffff',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'SolarInvest Solutions',
    description: 'Energia solar inteligente, com economia, segurança e sustentabilidade.',
    images: [
      {
        url: 'https://img.youtube.com/vi/UXA3Td8KgmY/maxresdefault.jpg',
      },
    ],
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
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