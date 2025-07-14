'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// 🎥 Componente leve de player YouTube
function LiteYouTube({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full aspect-video rounded-xl shadow overflow-hidden bg-black">
      {!loaded ? (
        // 📷 Thumbnail visível com botão de play
        <button
          onClick={() => setLoaded(true)}
          className="w-full h-full flex items-center justify-center"
          aria-label="Assistir vídeo"
        >
          <img
            src={thumbnail}
            alt="Prévia do vídeo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="z-10">
            <svg
              className="w-20 h-20 text-white"
              fill="currentColor"
              viewBox="0 0 84 84"
            >
              <circle cx="42" cy="42" r="42" fill="rgba(0,0,0,0.5)" />
              <polygon points="33,26 33,58 58,42" fill="white" />
            </svg>
          </div>
        </button>
      ) : (
        // ▶️ Iframe só é carregado após clique
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="Apresentação SolarInvest"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">

        {/* 📝 Texto promocional */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full md:w-3/4 lg:w-2/3 max-w-2xl text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600 leading-tight">
              Energia solar inteligente para sua casa ou condomínio
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-700">
              Economize na conta de luz, proteja-se contra apagões e invista em sustentabilidade com a SolarInvest Solutions.
            </p>
            <a
              href="/contato"
              className="inline-block mt-6 bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite uma análise gratuita
            </a>
          </div>
        </motion.div>

        {/* 🎥 Vídeo otimizado com carregamento leve */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LiteYouTube videoId="UXA3Td8KgmY" />
        </motion.div>
      </div>
    </section>
  );
}