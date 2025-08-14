// src/app/sitemap.xml/route.ts

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://solarinvest.info/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <url>
      <loc>https://solarinvest.info/</loc>
    </url>
    <url>
      <loc>https://www.instagram.com/solarinvest.br/</loc>
    </url>
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
