import Link from 'next/link';

import { featuredVideos } from '@/config/videos';
import { buildMetadata } from '@/lib/seo';

const video = featuredVideos.find((entry) => entry.slug === 'solarinvest-apresentacao');

export const metadata = buildMetadata({
  title: video?.title ?? 'Vídeo SolarInvest',
  description:
    video?.description ??
    'Confira os destaques da SolarInvest: economia mensal com energia solar, homologação completa e suporte especializado.',
  path: '/videos/solarinvest-apresentacao',
  keywords: ['vídeos solarinvest', 'apresentação solar', 'economia de energia com vídeo'],
});

export default function VideoDetalhePage() {
  if (!video) return null;

  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Organization',
      name: 'SolarInvest Solutions',
      logo: {
        '@type': 'ImageObject',
        url: `${video.thumbnailUrl[0]}`,
      },
    },
  };

  return (
    <main className="min-h-screen bg-white py-16 px-4 md:px-8">
      <section className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Vídeo</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">{video.title}</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">{video.description}</p>
        </header>

        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
          <video controls preload="metadata" poster={video.thumbnailUrl[0]} className="h-full w-full object-cover">
            <source src={video.contentUrl} type="video/mp4" />
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-base text-gray-800">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Por que este vídeo importa?</h2>
            <p>
              Mostramos como a SolarInvest cuida de todo o processo: análise do consumo, homologação da usina, monitoramento e
              suporte para garantir economia real na conta de luz.
            </p>
            <p>
              O vídeo resume como nossos modelos de leasing e assinatura trazem previsibilidade, além de reforçar nossa presença
              em Goiás e regiões vizinhas.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Dados do vídeo</h2>
            <p><strong>Upload:</strong> {video.uploadDate}</p>
            <p><strong>Duração:</strong> 2 minutos</p>
            <p>
              <strong>Formatos compatíveis:</strong> arquivo MP4 disponível para crawlers, com poster e preload para carregamento
              rápido.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start">
          <Link
            href="/videos"
            className="inline-flex items-center justify-center rounded-full border border-orange-500 px-6 py-3 text-orange-600 font-semibold transition hover:bg-orange-50"
          >
            Voltar para vídeos
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-white font-semibold shadow-md transition hover:bg-orange-600"
          >
            Fale com um especialista
          </Link>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      </section>
    </main>
  );
}
