'use client';

import { motion } from 'framer-motion';
export const metadata = {
  title: 'Como Funciona | Solar Invest Solutions',
  description: 'Entenda como funciona o sistema solar híbrido da Solar Invest: autonomia, economia e sustentabilidade sem complicações.',
  keywords: [
    'como funciona energia solar',
    'sistema híbrido',
    'painel solar explicado',
    'off-grid solar',
    'economia de energia',
  ],
};

export default function ComoFunciona() {
  const passos = [
    {
      etapa: '1',
      titulo: 'Diagnóstico gratuito',
      descricao: 'Analisamos seu consumo e identificamos a melhor solução solar para sua realidade.',
    },
    {
      etapa: '2',
      titulo: 'Proposta personalizada',
      descricao: 'Você recebe uma proposta clara, com economia real — sem investimento inicial obrigatório.',
    },
    {
      etapa: '3',
      titulo: 'Instalação completa',
      descricao: 'Nossa equipe cuida de tudo: equipamentos, instalação, homologação e ativação.',
    },
    {
      etapa: '4',
      titulo: 'Economia imediata',
      descricao: 'Você já começa a economizar na conta de luz com energia solar limpa e confiável.',
    },
  ];

  return (
    <section className="bg-orange-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12">
          Como funciona?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {passos.map((passo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center text-center hover:shadow-md transition">
                <div className="text-white bg-orange-600 w-10 h-10 flex items-center justify-center rounded-full font-bold mb-4">
                  {passo.etapa}
                </div>
                <h3 className="text-lg font-semibold text-orange-700">{passo.titulo}</h3>
                <p className="text-sm text-gray-600 mt-2">{passo.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}