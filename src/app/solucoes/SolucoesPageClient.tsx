'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SolucoesPageClient() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 md:px-8 space-y-16">
      <section className="max-w-6xl mx-auto text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-bold text-orange-600"
        >
          Nossas Soluções
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700 max-w-2xl mx-auto"
        >
          Atendemos diferentes perfis de clientes com soluções solares personalizadas, eficientes e acessíveis para transformar
          sua relação com a energia.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left">
            <h2 className="text-xl font-bold text-orange-500 mb-2">Residencial</h2>
            <p className="text-gray-700">
              Energia solar para casas, apartamentos e condomínios. Reduza sua conta e invista em sustentabilidade com segurança
              e autonomia.
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left">
            <h2 className="text-xl font-bold text-orange-500 mb-2">Comercial</h2>
            <p className="text-gray-700">
              Projetos para empresas e comércios que buscam economia, previsibilidade e valorização da marca com energia limpa.
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left">
            <h2 className="text-xl font-bold text-orange-500 mb-2">Rural e Off-Grid</h2>
            <p className="text-gray-700">
              Soluções completas para áreas remotas com energia contínua, mesmo sem acesso à rede elétrica tradicional.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-orange-50 rounded-2xl p-8 shadow-md border border-orange-100"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-orange-600 mb-3">Leasing SolarInvest</h2>
          <p className="text-gray-700 mb-6">
            Solicite a análise de aprovação para leasing e descubra rapidamente sua elegibilidade.
          </p>
          <Link
            href="/analise"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-6 py-3 shadow-md hover:bg-orange-700 transition"
          >
            Análise de aprovação para Leasing
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
