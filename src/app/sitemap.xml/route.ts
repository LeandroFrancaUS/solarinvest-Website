import { NextResponse } from 'next/server';

import { sitemapEntries } from '@/lib/sitemap-data';
import { seoConstants } from '@/lib/seo';

const { siteUrl } = seoConstants;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatPriority = (priority: number) => priority.toFixed(1);

export const revalidate = 86400;

export async function GET() {
  const generatedAt = new Date().toISOString();

  const urls = sitemapEntries
    .map((entry) => {
      const loc = `${siteUrl}${entry.path}`;
      const changefreq = entry.changefreq ?? 'monthly';
      const priority = formatPriority(entry.priority ?? 1);

      const images = (entry.images ?? [])
        .map(
          (image) => `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>${image.title ? `
      <image:title>${escapeXml(image.title)}</image:title>` : ''}${
            image.caption ? `
      <image:caption>${escapeXml(image.caption)}</image:caption>` : ''
          }
    </image:image>`
        )
        .join('\n');

      const videos = (entry.videos ?? [])
        .map(
          (video) => `    <video:video>
      <video:thumbnail_loc>${escapeXml(video.thumbnail)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${escapeXml(video.loc)}</video:content_loc>${
        video.duration ? `
      <video:duration>${video.duration}</video:duration>` : ''
      }${
            video.publicationDate ? `
      <video:publication_date>${video.publicationDate}</video:publication_date>` : ''
          }
    </video:video>`
        )
        .join('\n');

      return `<url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${generatedAt}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${images ? `
${images}` : ''}${videos ? `
${videos}` : ''}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
