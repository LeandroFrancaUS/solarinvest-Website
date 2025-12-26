import Link from 'next/link';

import { featuredVideos } from '@/config/videos';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Vídeos | SolarInvest Solutions',
  description:
    'Assista aos principais vídeos da SolarInvest sobre economia com energia solar, homologação completa e sistemas híbridos com suporte especializado.',
  path: '/videos',
  keywords: ['vídeos', 'demonstração', 'apresentação solarinvest', 'video solar'],
});

export default function VideosPage() {
  const [primaryVideo] = featuredVideos;

  return (
    <main className="min-h-screen bg-white py-16 px-4 md:px-8">
      <section className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Vídeos SolarInvest</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">
            Conheça nossas soluções em vídeo
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Conteúdo educativo e institucional para mostrar como entregamos economia mensal, homologação completa e suporte
            especializado em projetos solares.
          </p>
        </header>

        {primaryVideo ? (
          <article className="rounded-2xl border border-orange-100 bg-orange-50/40 shadow-sm p-6 md:p-10 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-orange-600">Destaque</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{primaryVideo.title}</h2>
              <p className="text-base text-gray-700 md:text-lg">{primaryVideo.description}</p>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <video
                controls
                preload="metadata"
                poster={primaryVideo.thumbnailUrl[0]}
                className="h-full w-full object-cover"
              >
                <source src={primaryVideo.contentUrl} type="video/mp4" />
                Seu navegador não suporta reprodução de vídeo.
              </video>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-gray-700">
                <p><strong>Upload:</strong> {primaryVideo.uploadDate}</p>
                <p><strong>Duração:</strong> 2 minutos</p>
              </div>
              <Link
                href={`/videos/${primaryVideo.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-white font-semibold shadow-md transition hover:bg-orange-600"
              >
                Ver detalhes do vídeo
              </Link>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
