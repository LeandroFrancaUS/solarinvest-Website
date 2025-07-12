'use client';

import { motion } from 'framer-motion';
import { FaBolt, FaLeaf, FaWallet } from 'react-icons/fa';

const beneficios = [
  {
    titulo: 'Economia Garantida',
    descricao: 'Reduza drasticamente sua conta de luz com nossas soluções inteligentes e sustentáveis.',
    icon: <FaWallet className="text-4xl text-orange-600" />,
  },
  {
    titulo: 'Energia Sustentável',
    descricao: 'Contribua com o meio ambiente usando fontes renováveis e limpas.',
    icon: <FaLeaf className="text-4xl text-orange-600" />,
  },
  {
    titulo: 'Fornecimento Ininterrupto',
    descricao: 'Garanta energia mesmo durante apagões com sistemas híbridos e off-grid.',
    icon: <FaBolt className="text-4xl text-orange-600" />,
  },
];

export default function Beneficios() {
  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-700 mb-12">
          Por que escolher a Solar Invest?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {beneficios.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-xl shadow hover:shadow-md transition"
            >
              {item.icon}
              <h3 className="mt-4 text-lg font-semibold text-orange-700">{item.titulo}</h3>
              <p className="text-sm text-gray-700 mt-2">{item.descricao}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}