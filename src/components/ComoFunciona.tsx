'use client';

import { motion } from 'framer-motion';
import { FaRegFileAlt, FaClipboardCheck, FaTools, FaPiggyBank } from 'react-icons/fa';

export default function ComoFunciona() {
  // Lista de etapas com ícone, título e descrição
  const etapas = [
    {
      icon: <FaRegFileAlt size={36} className="text-orange-500" />,
      titulo: 'Análise de Conta',
      descricao: 'Você nos envia sua conta de luz e realizamos uma análise gratuita e personalizada do seu consumo.',
    },
    {
      icon: <FaClipboardCheck size={36} className="text-orange-500" />,
      titulo: 'Proposta Ideal',
      descricao: 'Apresentamos a solução mais econômica e sustentável, de acordo com seu perfil e localização.',
    },
    {
      icon: <FaTools size={36} className="text-orange-500" />,
      titulo: 'Instalação Técnica',
      descricao: 'Nossa equipe especializada cuida de toda a instalação com agilidade, segurança e qualidade.',
    },
    {
      icon: <FaPiggyBank size={36} className="text-orange-500" />,
      titulo: 'Economia Imediata',
      descricao:
        'Você paga apenas pela energia contrata com desconto, enquanto cuidamos da operação e manutenção.',
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-16 lg:px-28">
      <div className="max-w-7xl mx-auto text-center">
        {/* Título principal com animação */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-6"
        >
          Como Funciona
        </motion.h2>

        {/* Texto de apoio */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-16"
        >
          Entenda como a Solar Invest transforma sua conta de energia em economia real, com um processo simples, rápido e eficiente.
        </motion.p>

        {/* Etapas com ícones e animações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {etapas.map((etapa, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-orange-50 p-6 rounded-xl shadow hover:shadow-md transition text-center"
            >
              {/* Ícone */}
              <div className="mb-4 flex justify-center">{etapa.icon}</div>

              {/* Título */}
              <h3 className="text-xl font-semibold text-orange-700 mb-2">{etapa.titulo}</h3>

              {/* Descrição */}
              <p className="text-gray-700 text-sm">{etapa.descricao}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}