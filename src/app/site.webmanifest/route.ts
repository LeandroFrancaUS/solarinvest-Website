import { NextResponse } from 'next/server';

export function GET() {
  return new NextResponse(
    JSON.stringify({
      name: 'SolarInvest Solutions',
      short_name: 'SolarInvest',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0b3b71',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icon.png',
          sizes: '1024x1024',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    },
  );
}
