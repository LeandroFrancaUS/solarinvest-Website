'use client';

import { motion } from 'framer-motion';
import LiteYouTube from '@/components/LiteYouTube';

// Hero Section – Destaque principal da homepage
export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* 📝 Bloco de texto promocional à esquerda (ou abaixo no mobile) */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
              Energia solar inteligente para sua casa ou condomínio
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
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

        {/* 🎥 Vídeo otimizado à direita (ou acima no mobile) */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Componente otimizado para performance (LiteYouTube) */}
          <LiteYouTube videoId="UXA3Td8KgmY" />
        </motion.div>
      </div>
    </section>
  );
}