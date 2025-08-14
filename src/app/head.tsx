// src/app/head.tsx

export default function Head() {
  return (
    <>
      <title>SolarInvest Solutions</title>
      <meta name="description" content="Energia solar inteligente e acessível para residências, condomínios e empresas." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* 🔁 Preload do thumbnail em alta resolução para performance */}
      <link
        rel="preload"
        as="image"
        href="https://img.youtube.com/vi/UXA3Td8KgmY/maxresdefault.jpg"
      />

      {/* 🗂️ SEO base */}
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:title" content="SolarInvest Solutions" />
      <meta property="og:description" content="Energia solar inteligente, com economia, segurança e sustentabilidade." />
      <meta property="og:image" content="https://img.youtube.com/vi/UXA3Td8KgmY/maxresdefault.jpg" />
      <meta property="og:type" content="website" />
    </>
  );
}
