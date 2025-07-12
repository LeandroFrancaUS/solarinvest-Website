'use client';

import { FaBolt, FaLeaf, FaPiggyBank, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Beneficios() {
  const beneficios = [
    {
      icon: <FaPiggyBank className="text-orange-600 text-3xl" />,
      titulo: 'Economia Garantida',
      texto: 'Reduza sua conta de luz desde o primeiro mês com previsibilidade nos custos.',
    },
    {
      icon: <FaBolt className="text-orange-600 text-3xl" />,
      titulo: 'Energia Ininterrupta',
      texto: 'Com soluções híbridas e off-grid, você continua com energia mesmo em apagões.',
    },
    {
      icon: <FaLeaf className="text-orange-600 text-3xl" />,
      titulo: 'Sustentabilidade',
      texto: 'Invista em energia limpa, reduzindo sua pegada de carbono e ajudando o planeta.',
    },
    {
      icon: <FaHome className="text-orange-600 text-3xl" />,
      titulo: 'Valorização do Imóvel',
      texto: 'Imóveis com energia solar são mais valorizados e atrativos no mercado.',
    },
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12">
          Por que escolher a Solar Invest?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {beneficios.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-xl shadow hover:shadow-md transition"
            >
              {item.icon}
              <h3 className="mt-4 text-lg font-semibold text-orange-700">{item.titulo}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.texto}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}