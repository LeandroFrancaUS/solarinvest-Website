//pagina contato
'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import React from 'react';

export default function SolucoesPage() {
  // Dados das soluções, cada uma com título e descrição
  const solutions = [
    {
      title: 'Residências Inteligentes',
      description: 'Energia solar acessível para casas urbanas ou rurais, com instalação gratuita e economia imediata.',
    },
    {
      title: 'Condomínios Compartilhados',
      description: 'Redução coletiva da conta de luz com usina fotovoltaica para múltiplas residências.',
    },
    {
      title: 'Empresas e Indústrias',
      description: 'Soluções de grande escala com retorno garantido e valorização patrimonial.',
    },
  ];

  return (
    <main className="bg-white min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      {/* Título da página com animação */}
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Nossas Soluções
      </motion.h1>

      {/* Lista de cards animados */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {solutions.map((solucao, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-md rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            {/* Ícone de check com destaque */}
            <CheckCircle className="text-orange-500 w-8 h-8 mb-4" />

            {/* Título da solução */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {solucao.title}
            </h2>

            {/* Descrição da solução */}
            <p className="text-gray-700 text-base leading-relaxed">
              {solucao.description}
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}