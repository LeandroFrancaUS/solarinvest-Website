import { NextResponse } from 'next/server';

import { seoConstants } from '@/lib/seo';

const { siteUrl } = seoConstants;
const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${normalizedSiteUrl}/sitemap.xml
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
