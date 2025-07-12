import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

import { SpeedInsights } from '@vercel/speed-insights/next'; // ✅ Performance Insights
import { Analytics } from '@vercel/analytics/next'; // ✅ Analytics de uso e tráfego

import type { Metadata } from 'next';

// 🔍 SEO Metadata global
export const metadata: Metadata = {
  title: 'SolarInvest Solutions',
  description: 'Energia solar inteligente e acessível.',
};

// 🌐 Layout raiz da aplicação
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-900 bg-white">
        {/* 🔝 Cabeçalho fixo com logo e menu */}
        <Header />

        {/* 🧱 Conteúdo dinâmico das páginas */}
        {children}

        {/* 🔻 Rodapé com links e redes sociais */}
        <Footer />

        {/* 📱 Botão flutuante de WhatsApp */}
        <WhatsappButton />

        {/* 🚀 Métricas de performance e análise da Vercel */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}