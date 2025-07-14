// src/app/contato/page.tsx

'use client';

import ContatoForm from '@/components/ContatoForm';
import { motion } from 'framer-motion';

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-10">

        {/* 🧭 Título com animação de entrada */}
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-orange-600 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Fale com a SolarInvest
        </motion.h1>

        {/* ✏️ Descrição opcional */}
        <motion.p
          className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Preencha o formulário abaixo e entraremos em contato rapidamente para entender sua necessidade e oferecer a melhor solução solar para sua residência ou empresa.
        </motion.p>

        {/* 📩 Formulário de contato */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ContatoForm />
        </motion.div>
      </div>
    </main>
  );
}