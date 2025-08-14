'use client';

import { motion } from 'framer-motion';
import ContatoForm from '@/components/ContatoForm';

// 🔍 SEO Metadata
export const metadata = {
  title: 'Contato | Contact | Solar Invest Solutions',
  description:
    'Fale com a Solar Invest Solutions para conhecer nossas soluções solares. Get in touch with Solar Invest Solutions for solar energy solutions.',
  keywords: [
    'contato',
    'contact',
    'fale conosco',
    'contact us',
    'suporte',
    'support',
    'energia solar',
    'solar energy',
    'solar invest',
  ],
};

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 md:px-8">
      <section className="max-w-3xl mx-auto text-center">
        {/* 🎯 Título com animação */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-bold text-orange-600 mb-6"
        >
          Fale com a gente
        </motion.h1>

        {/* 💬 Subtítulo animado */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700 max-w-2xl mx-auto mb-10"
        >
          Está pronto para transformar sua energia em economia? Preencha o formulário abaixo e entraremos em contato rapidamente.
        </motion.p>

        {/* 📩 Formulário animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ContatoForm />
        </motion.div>
      </section>
    </main>
  );
}