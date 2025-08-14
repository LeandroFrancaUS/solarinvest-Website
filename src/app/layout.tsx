import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SolarInvest Solutions',
  description: 'Energia solar inteligente e acessível.',
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/',
      'en-US': '/en-US',
    },
  },
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