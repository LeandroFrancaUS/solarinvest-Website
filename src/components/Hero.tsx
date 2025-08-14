'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// 🎥 Importação dinâmica do player YouTube otimizado
const LiteYouTube = dynamic(() => import('@/components/LiteYouTube'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video w-full bg-gray-200 animate-pulse rounded-xl" />
  ),
});

export default function Hero() {
  return (
    <section id="hero" className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">

        {/* 📢 Texto promocional do lado esquerdo */}
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
            <Link
              href="/contato"
              className="inline-block mt-6 bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite uma análise gratuita
            </Link>
          </div>
        </motion.div>

        {/* 🎬 Vídeo YouTube leve com thumbnail otimizada */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 🔁 Player só será carregado após clique (LiteYouTube) */}
          <LiteYouTube videoId="UXA3Td8KgmY" />
        </motion.div>
      </div>
    </section>
  );
}