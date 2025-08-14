// Generates sitemap.xml

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://solarinves.info/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <loc>https://solarinvest.com/</loc>
    <loc>https://www.instagram.com/solarinvest.br/</loc>
    
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
