'use client';

import { motion } from 'framer-motion';
import { FaRegFileAlt, FaTools, FaPiggyBank, FaSolarPanel } from 'react-icons/fa';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export default function ComoFunciona() {
  const { baseKeywords, socialProfiles, logoUrl, siteUrl, siteName } = seoConstants;

  // Lista de etapas com ícone, título e descrição
  const etapas = [
    {
      icon: <FaRegFileAlt size={36} className="text-orange-500" />,
      titulo: 'Análise de Consumo',
      descricao:
        'Você nos envia sua conta de luz e realizamos uma análise gratuita para dimensionar a usina ideal.',
    },
    {
      icon: <FaTools size={36} className="text-orange-500" />,
      titulo: 'Instalação sem investimento',
      descricao:
        'Projetamos, aprovamos e instalamos a usina no seu imóvel sem que você precise investir nada.',
    },
    {
      icon: <FaPiggyBank size={36} className="text-orange-500" />,
      titulo: 'Economia garantida',
      descricao:
        'Você paga apenas pela energia contratada com desconto, enquanto cuidamos da operação e manutenção.',
    },
    {
      icon: <FaSolarPanel size={36} className="text-orange-500" />,
      titulo: 'Usina sua ao final',
      descricao:
        'Ao término do contrato, a usina é transferida para o seu nome e toda a energia gerada passa a ser sua sem custo.',
    },
  ];

  const comoFuncionaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como funciona a energia solar com leasing da SolarInvest',
    description:
      'Passo a passo para contratar energia solar: análise de consumo, instalação sem investimento, economia garantida e transferência da usina.',
    image: logoUrl,
    totalTime: 'P4W',
    supply: {
      '@type': 'Service',
      name: 'Leasing e assinatura de energia solar',
      provider: siteName,
    },
    step: etapas.map((etapa, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: etapa.titulo,
      text: etapa.descricao,
    })),
    keywords: baseKeywords,
    url: `${siteUrl}/comofunciona`,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: logoUrl,
      sameAs: [socialProfiles.instagram, socialProfiles.facebook, socialProfiles.whatsapp, socialProfiles.linkedin],
    },
  };

  return (
    <section
      className="bg-white py-20 px-6 md:px-16 lg:px-28"
      id="como-funciona"
      itemScope
      itemType="https://schema.org/HowTo"
    >
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
          Entenda como a SolarInvest oferece energia solar sem investimento inicial e com transferência de propriedade ao final do contrato.
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
              itemProp="step"
              itemScope
              itemType="https://schema.org/HowToStep"
            >
              {/* Ícone */}
              <div className="mb-4 flex justify-center">{etapa.icon}</div>

              {/* Título */}
              <h3 className="text-xl font-semibold text-orange-700 mb-2" itemProp="name">
                {etapa.titulo}
              </h3>

              {/* Descrição */}
              <p className="text-gray-700 text-sm" itemProp="text">
                {etapa.descricao}
              </p>
              <meta itemProp="position" content={`${index + 1}`} />
            </motion.div>
          ))}
        </div>
      </div>

      <Script
        id="como-funciona-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comoFuncionaJsonLd) }}
      />
    </section>
  );
}
