// next.config.js

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://www.youtube.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https://img.youtube.com https://i.ytimg.com;
  frame-src https://www.youtube.com;
  connect-src 'self';
`;

module.exports = {
  // ✅ Liberação de domínios externos para next/image
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },

  // ✅ Headers de segurança (CSP, referrer, etc.)
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
    ];
  },

  // 🔀 Reescrita de rotas (ex: sitemap)
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
    ];
  },
};