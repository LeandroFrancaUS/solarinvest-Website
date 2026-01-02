import { NextResponse } from 'next/server';

const manifest = {
  name: 'SolarInvest Solutions',
  short_name: 'SolarInvest',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#0b3b71',
  icons: [
    {
      src: '/icon.png',
      sizes: '1024x1024',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
};

export const runtime = 'edge';
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
