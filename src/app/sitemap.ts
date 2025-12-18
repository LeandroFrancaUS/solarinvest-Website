import type { MetadataRoute } from 'next';

import { siteUrl } from '@/config/site';
import { siteRoutes } from '@/routes';

export const revalidate = 86400; // regenerate daily

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Note: `MetadataRoute.Sitemap` entries do not support image metadata, so we
  // keep the payload limited to the allowed fields to satisfy Next.js typing.
  const routes: MetadataRoute.Sitemap = siteRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  }));

  return routes;
}
