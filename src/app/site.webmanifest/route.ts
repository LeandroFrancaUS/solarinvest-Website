import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 3600;

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

export function GET() {
  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600, immutable',
    },
  });
}
