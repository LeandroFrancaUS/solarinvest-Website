// src/app/sitemap.xml/route.ts

import { type MetadataRoute } from 'next';

// 🔁 Função que retorna o sitemap dinamicamente para o Next.js
export async function GET(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://solarinvest.info'; // ✅ Troque para o domínio real da sua empresa se for diferente

  // 📄 Lista de páginas estáticas do seu site para o sitemap
  const pages = [
    '',
    '/comofunciona',
    '/solucoes',
    '/sobre',
    '/contato',
  ];

  // 🛠️ Retorna um array de objetos no formato esperado pelo Next.js
  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(), // 📆 Atualiza a data automaticamente para hoje
  }));
}