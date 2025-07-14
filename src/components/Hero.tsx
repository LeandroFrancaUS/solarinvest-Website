'use client';

import { motion } from 'framer-motion';
import LiteYouTube from '@/components/LiteYouTube';

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 pt-24 pb-16 px-4">
      {/* 🔳 Container central responsivo com padding interno */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

        {/* 🔸 Texto à esquerda (ou abaixo no mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-orange-600 leading-tight tracking-tight mb-6">
            Energia solar inteligente, acessível e sustentável
          </h1>

          <p className="text-base sm:text-lg text-gray-800 max-w-xl mx-auto lg:mx-0">
            Reduza sua conta de luz, proteja-se contra apagões e invista em energia limpa com a SolarInvest Solutions.
          </p>

          <a
            href="/contato"
            className="inline-block mt-6 bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
          >
            Solicite uma análise gratuita
          </a>
        </motion.div>

        {/* ▶️ Vídeo responsivo à direita (ou acima no mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2"
        >
          {/* 🖼️ Player YouTube com carregamento leve e visual elegante */}
          <LiteYouTube videoId="UXA3Td8KgmY" />
        </motion.div>
      </div>
    </section>
  );
}