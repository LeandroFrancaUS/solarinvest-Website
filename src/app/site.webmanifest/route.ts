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

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
