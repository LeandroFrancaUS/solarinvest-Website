'use client';

import { motion } from 'framer-motion';
import LiteYouTube from '@/components/LiteYouTube';

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10">

        {/* 📝 Texto principal */}
        <motion.div
          className="w-full lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 leading-tight mb-6">
            Energia solar inteligente <br className="hidden sm:inline" />
            para sua casa ou condomínio
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
            Economize na conta de luz, proteja-se contra apagões e invista em sustentabilidade com a <strong>SolarInvest Solutions</strong>.
          </p>

          <a
            href="/contato"
            className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition-colors"
          >
            Solicite uma análise gratuita
          </a>
        </motion.div>

        {/* 🎥 Vídeo otimizado com LiteYouTube */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* 📺 Componente customizado para embed leve do YouTube */}
          <LiteYouTube videoId="UXA3Td8KgmY" />
        </motion.div>
      </div>
    </section>
  );
}