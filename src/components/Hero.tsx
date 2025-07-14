'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        
        {/* 📝 Texto promocional à esquerda (ou abaixo no mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full md:w-1/2 text-center md:text-left">
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

        {/* 🎥 Vídeo YouTube responsivo à direita (ou acima no mobile) */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 📐 Wrapper para manter proporção 16:9 usando plugin aspect-ratio do Tailwind */}
          <div className="aspect-w-16 aspect-h-9 w-full rounded-xl shadow overflow-hidden">
            <iframe
              src="https://youtu.be/UXA3Td8KgmY"
              title="Apresentação SolarInvest"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: '0' }} // ✅ Substituição do atributo deprecated 'frameBorder'
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}