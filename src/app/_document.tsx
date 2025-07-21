import { Html, Head, Main, NextScript } from 'next/document';

// 🌐 Documento HTML base — Next.js usa este arquivo para SSR
export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* 🆕 Fontes modernas e elegantes do Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* 🔒 Ícones ou preload de assets podem ser adicionados aqui */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        {/* 🧱 Estrutura principal da aplicação */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}