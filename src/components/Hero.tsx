'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Hero() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <section className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">

        {/* 📝 Texto promocional */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600 leading-tight tracking-tight">
            Energia solar inteligente para sua casa ou condomínio
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-lg">
            Economize na conta de luz, proteja-se contra apagões e invista em sustentabilidade com a SolarInvest Solutions.
          </p>
          <a
            href="/contato"
            className="inline-block mt-6 bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
          >
            Solicite uma análise gratuita
          </a>
        </motion.div>

        {/* 🎥 Player com thumbnail e botão de play */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full aspect-video rounded-xl shadow-lg overflow-hidden">
            {!videoPlaying ? (
              <button
                onClick={() => setVideoPlaying(true)}
                className="absolute inset-0 w-full h-full flex items-center justify-center group"
              >
                <img
                  src="https://img.youtube.com/vi/UXA3Td8KgmY/maxresdefault.jpg"
                  alt="Prévia do vídeo"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                {/* ▶️ Ícone play com hover */}
                <div className="relative z-10 bg-black/50 group-hover:bg-black/70 p-4 rounded-full transition">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 84 84"
                  >
                    <circle cx="42" cy="42" r="42" fill="none" />
                    <polygon points="33,26 33,58 58,42" fill="white" />
                  </svg>
                </div>
              </button>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/UXA3Td8KgmY?autoplay=1&rel=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
                style={{ border: '0' }}
                title="Apresentação SolarInvest"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}