'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react'; // Ícone de fechar

export default function Hero() {
  const [showStickyVideo, setShowStickyVideo] = useState(false);   // Se o mini player deve aparecer
  const [closedSticky, setClosedSticky] = useState(false);         // Se o usuário fechou o player fixo

  // 🧠 Detecta scroll da página
  useEffect(() => {
    const handleScroll = () => {
      if (!closedSticky) {
        setShowStickyVideo(window.scrollY > 600);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [closedSticky]);

  return (
    <section className="relative w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">

        {/* 🟠 Texto principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
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
        </motion.div>

        {/* 🎥 Vídeo principal (normal) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2"
        >
          <video
            src="/solarinvest-apresentacao-web.mp4"
            controls
            autoPlay
            muted
            playsInline
            loop
            className="w-full max-w-full h-auto rounded-xl shadow"
          />
        </motion.div>
      </div>

      {/* 📌 Mini player fixo com botão de fechar */}
      {showStickyVideo && !closedSticky && (
        <div className="fixed bottom-4 right-4 w-64 z-50 shadow-xl rounded-xl overflow-hidden border border-orange-300 bg-white">
          {/* 🔘 Botão de fechar */}
          <div className="flex justify-end p-1 bg-white">
            <button
              onClick={() => setClosedSticky(true)}
              className="text-gray-500 hover:text-orange-600"
              title="Fechar vídeo"
            >
              <X size={20} />
            </button>
          </div>

          {/* ▶️ Vídeo miniatura */}
          <video
            src="/solarinvest-apresentacao-web.mp4"
            controls
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-auto"
          />
        </div>
      )}
    </section>
  );
}