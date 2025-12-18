import { NextResponse } from 'next/server';

import { seoConstants } from '@/lib/seo';

const { siteUrl } = seoConstants;
const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

const robotsContent = `# robots.txt gerado automaticamente para SolarInvest (Google Search Central)
# Permite rastreamento amplo e bloqueia apenas áreas administrativas e APIs privadas.
# Última atualização: ${new Date().toISOString()}

User-agent: *
Allow: /
Allow: /assets/
Allow: /static/
Allow: /images/
Allow: /videos/
Disallow: /admin/
Disallow: /api/private/
Disallow: /*?sessionid=
Disallow: /*?token=

# Bots de anúncios e imagens
User-agent: AdsBot-Google
Allow: /

User-agent: Google-Image
Allow: /

# Crawlers comuns Google
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-Video
Allow: /

User-agent: Googlebot-News
Allow: /

# Crawlers especiais Google
User-agent: Mediapartners-Google
Allow: /

User-agent: Storebot-Google
Allow: /

User-agent: Google-Read-Aloud
Allow: /

User-agent: DuplexWeb-Google
Allow: /

# Fetchers ativados pelo usuário
User-agent: Google-Lens
Allow: /

User-agent: Google App Preview
Allow: /

User-agent: AMP Cache
Allow: /

User-agent: PageSpeed Insights Bot
Allow: /

Sitemap: ${normalizedSiteUrl}/sitemap.xml
Sitemap: ${normalizedSiteUrl}/sitemap-index.xml
Host: ${normalizedSiteUrl}
`;

export const revalidate = 86400;

export function GET() {
  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
