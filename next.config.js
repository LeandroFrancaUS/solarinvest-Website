// next.config.js

const path = require('path');

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://www.youtube.com https://vercel.live;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https://img.youtube.com https://i.ytimg.com;
  frame-src 'self' https://www.youtube.com https://vercel.live;
  connect-src 'self' https://viacep.com.br;
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source:
          '/:path(_next/static/.*|favicon\\.png|icon\\.png|site\\.webmanifest|LogoNatal\\.png|LogoNatal2\\.png|logo\\.png|logo%20original\\.png|hero-solar-house\\.png|images/.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
      {
        source: '/icon.png',
        destination: '/logo.png',
      },
    ];
  },

  webpack(config) {
    try {
      require.resolve('@vercel/analytics/next');
    } catch (error) {
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias['@vercel/analytics/next'] = path.resolve(
        __dirname,
        'src/lib/vercel-analytics-stub.tsx',
      );
    }

    return config;
  },
};
