import './globals.css'; // 🧩 Estilos globais aplicados em toda a aplicação

import Header from '@/components/Header'; // 🔝 Cabeçalho com menu responsivo
import Footer from '@/components/Footer'; // 🔻 Rodapé com contatos e redes sociais
import WhatsappButton from '@/components/WhatsappButton'; // 📱 Botão flutuante de WhatsApp

import type { Metadata } from 'next';

/**
 * 🔍 SEO metadata global — aparece em todas as páginas
 */
export const metadata: Metadata = {
  title: 'SolarInvest Solutions',
  description: 'Energia solar inteligente e acessível.',
};

/**
 * 🌐 Layout raiz (envolve todas as rotas do app)
 * Contém estrutura HTML padrão e componentes fixos
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-900 bg-white">
        {/* ⬆️ Cabeçalho fixo com logo e menu */}
        <Header />

        {/* 🧱 Conteúdo dinâmico da página */}
        {children}

        {/* ⬇️ Rodapé padrão com informações da empresa */}
        <Footer />

        {/* 💬 Botão de WhatsApp fixo na tela */}
        <WhatsappButton />
      </body>
    </html>
  );
}