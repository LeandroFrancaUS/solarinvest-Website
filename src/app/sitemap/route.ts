// Generates sitemap.xml
import { siteRoutes } from '@/routes';

export const revalidate = 86400; // regenerate daily

export async function GET() {
  const baseUrl = 'https://solarinvest.info';
  const lastmod = new Date().toISOString();
  const urls = siteRoutes
    .map((path) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${lastmod}</lastmod>
    </url>`)
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
