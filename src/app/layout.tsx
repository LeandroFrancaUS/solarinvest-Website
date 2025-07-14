// src/app/layout.tsx

import './globals.css'; // 🎨 Estilos globais do projeto
import Header from '@/components/Header'; // 🔝 Cabeçalho fixo
import Footer from '@/components/Footer'; // 🔻 Rodapé fixo
import WhatsappButton from '@/components/WhatsappButton'; // 📱 Botão flutuante de WhatsApp
import type { Metadata } from 'next'; // ✅ Tipagem para SEO metadata

// 🔍 SEO metadata padrão (usado em todas as páginas)
export const metadata: Metadata = {
  title: 'SolarInvest Solutions',
  description: 'Energia solar inteligente, acessível e sustentável.',
};

// 🌐 Layout raiz da aplicação, usado em todas as páginas
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-900 bg-white overflow-x-hidden">
        {/* 🔝 Cabeçalho visível em todas as páginas */}
        <Header />

        {/* 🧱 Conteúdo dinâmico da página atual */}
        <main className="min-h-screen px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* 🔻 Rodapé fixo no final da página */}
        <Footer />

        {/* 📱 Botão flutuante para contato rápido */}
        <WhatsappButton />
      </body>
    </html>
  );
}