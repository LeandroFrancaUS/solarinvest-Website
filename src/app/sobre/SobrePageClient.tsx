'use client';

import FeedbackSection from '@/components/FeedbackSection';
import { motion } from 'framer-motion';

export default function SobrePageClient() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 md:px-8">
      <section className="max-w-5xl mx-auto text-center">
        {/* 🎯 Título com animação */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-bold text-orange-600 mb-6"
        >
          Sobre a SolarInvest
        </motion.h1>

        {/* 💬 Texto de introdução */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700 max-w-3xl mx-auto mb-8"
        >
          A SolarInvest nasceu com o propósito de democratizar o acesso à energia solar no Brasil.
          Nosso compromisso é oferecer soluções inteligentes, acessíveis e sustentáveis, permitindo que famílias e empresas economizem e contribuam para um futuro mais limpo.
        </motion.p>

        {/* ✅ Bloco institucional animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-orange-50 rounded-xl shadow-md p-6 text-left mx-auto"
        >
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Nossa Missão</h2>
          <p className="text-gray-700 mb-4">
            Tornar a energia solar uma realidade para todos, promovendo economia, autonomia energética e redução do impacto ambiental.
          </p>

          <h2 className="text-2xl font-bold text-orange-500 mb-4">Nossa Visão</h2>
          <p className="text-gray-700 mb-4">
            Ser referência em soluções fotovoltaicas no Brasil, com foco em inovação, transparência e excelência no atendimento.
          </p>

          <h2 className="text-2xl font-bold text-orange-500 mb-4">Nossos Valores</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Transparência e ética em cada etapa</li>
            <li>Compromisso com resultados reais</li>
            <li>Respeito ao meio ambiente e às pessoas</li>
            <li>Inovação constante e melhoria contínua</li>
          </ul>
        </motion.div>
      </section>

      <div className="mt-16">
        <FeedbackSection />
      </div>
    </main>
  );
}
