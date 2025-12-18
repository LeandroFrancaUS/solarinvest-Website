'use client';

import { CheckCircleIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export default function Beneficios() {
  const { baseKeywords, socialProfiles, logoUrl, siteUrl, siteName } = seoConstants;

  // 🎯 Lista dos benefícios oferecidos
  const beneficios = [
    {
      titulo: 'Economia na Conta de Luz',
      descricao: 'Reduza seus custos mensais com energia e ganhe previsibilidade financeira.',
      icone: CheckCircleIcon,
    },
    {
      titulo: 'Segurança Contra Apagões',
      descricao: 'Tenha fornecimento contínuo de energia, mesmo em quedas da rede.',
      icone: ShieldCheckIcon,
    },
    {
      titulo: 'Sustentabilidade e Valorização',
      descricao: 'Contribua com o meio ambiente e aumente o valor do seu imóvel.',
      icone: BoltIcon,
    },
  ];

  const beneficiosJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Benefícios da energia solar com a SolarInvest',
    description:
      'Lista de vantagens de energia solar, economia na conta de luz, segurança contra apagões e sustentabilidade.',
    itemListElement: beneficios.map((beneficio, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: beneficio.titulo,
      description: beneficio.descricao,
    })),
    numberOfItems: beneficios.length,
    image: logoUrl,
    url: `${siteUrl}/#beneficios`,
    keywords: baseKeywords,
    author: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: logoUrl,
      sameAs: [
        socialProfiles.instagram,
        socialProfiles.linkedin,
        socialProfiles.whatsapp,
        socialProfiles.facebook,
        socialProfiles.google,
        socialProfiles.maps,
      ],
    },
  };

  return (
    <section className="w-full bg-white py-16 px-4" id="beneficios" itemScope itemType="https://schema.org/ItemList">
      <div className="max-w-7xl mx-auto text-center">
        {/* 🧱 Título da seção */}
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4">
          Por que escolher a SolarInvest?
        </h2>
        <p className="text-gray-700 text-base sm:text-lg mb-12 max-w-2xl mx-auto">
          Oferecemos benefícios reais para sua casa ou empresa com energia solar inteligente e acessível.
        </p>

        {/* 📦 Grid dos cards de benefícios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {beneficios.map((beneficio, index) => (
            <div
              key={index}
              className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow hover:shadow-md transition"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {/* Ícone ilustrativo */}
              <beneficio.icone className="h-10 w-10 text-orange-500 mb-4 mx-auto" />

              {/* Título do benefício */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2" itemProp="name">
                {beneficio.titulo}
              </h3>

              {/* Descrição */}
              <p className="text-sm text-gray-700" itemProp="description">
                {beneficio.descricao}
              </p>
              <meta itemProp="position" content={`${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <Script
        id="beneficios-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(beneficiosJsonLd) }}
      />
    </section>
  );
}
