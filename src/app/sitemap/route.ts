// src/app/sitemap/route.ts

export async function GET() {
  const baseUrl = "https://solarinvest.info";

  const routes = ["/", "/sobre", "/solucoes", "/contato", "/comofunciona"];

  const urls = routes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
