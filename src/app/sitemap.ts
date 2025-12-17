import type { MetadataRoute } from 'next';

import { siteUrl } from '@/config/site';
import { siteRoutes } from '@/routes';

export const revalidate = 86400; // regenerate daily

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return siteRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  }));
}
