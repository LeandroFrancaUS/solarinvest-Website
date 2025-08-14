export async function GET() {
  const baseUrl = 'https://solarinvest.info';
  const lastMod = new Date().toISOString();
  const pages = ['/', '/comofunciona', '/sobre', '/solucoes', '/contato'];

  const urls = pages
    .map(
      (page) => `    <url>\n      <loc>${baseUrl}${page}</loc>\n      <lastmod>${lastMod}</lastmod>\n    </url>`,
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

