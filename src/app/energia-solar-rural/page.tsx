import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar Rural | Soluções para Propriedades e Agronegócio | SolarInvest',
  description:
    'Soluções de energia solar para propriedades rurais, irrigação, agroindustrial e fazendas. Reduza o custo de energia no campo com leasing, compra direta e suporte técnico.',
  path: '/energia-solar-rural',
  keywords: [
    'energia solar rural',
    'energia solar para propriedade rural',
    'energia solar fazenda',
    'energia solar irrigação',
    'energia solar agronegócio',
    'energia solar agroindustrial',
    'sistema fotovoltaico rural',
    'energia solar off-grid rural',
    'módulos fotovoltaicos',
    'projeto de energia solar residencial',
    'energia solar nas casas',
    'energia solar comercial',
  ],
});

const faqItems = [
  {
    question: 'Energia solar funciona para propriedades rurais?',
    answer:
      'Sim. Propriedades rurais têm excelente potencial para energia solar, especialmente por terem maior área disponível para instalação e alto consumo energético para irrigação, maquinário e estruturas de armazenamento.',
  },
  {
    question: 'Qual a diferença entre sistema on-grid e off-grid para área rural?',
    answer:
      'Sistemas on-grid são conectados à rede elétrica e injetam o excedente, gerando créditos de energia. Sistemas off-grid são totalmente independentes da rede, com baterias para armazenamento — ideais para regiões sem acesso à rede ou com quedas frequentes.',
  },
  {
    question: 'Energia solar para irrigação vale a pena?',
    answer:
      'Sim. A irrigação costuma representar um dos maiores custos de energia em propriedades rurais. Sistemas fotovoltaicos reduzem significativamente esse custo, com payback relativamente rápido dado o alto consumo.',
  },
  {
    question: 'Existe leasing de energia solar para área rural?',
    answer:
      'Sim. O leasing operacional da SolarInvest está disponível para propriedades rurais elegíveis. Entre em contato para análise de viabilidade do seu projeto.',
  },
];

export default function EnergiaRuralPage() {
  const { siteUrl, siteName, logoUrl } = seoConstants;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Energia Solar Rural',
    description:
      'Soluções fotovoltaicas para propriedades rurais: irrigação, agroindustrial, fazendas e sistemas off-grid.',
    provider: { '@type': 'Organization', name: siteName, url: siteUrl, logo: logoUrl },
    areaServed: 'Brasil',
    serviceType: 'Energia solar fotovoltaica para área rural e agronegócio',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Energia Solar Rural', item: `${siteUrl}/energia-solar-rural` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="rural-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="rural-service-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="rural-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Energia Solar Rural</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar Rural
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Soluções fotovoltaicas para propriedades rurais, fazendas, sistemas de irrigação e agroindustrial. Reduza
            o custo de energia no campo com instalação profissional, suporte técnico e opções de leasing ou compra
            direta.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicitar análise para propriedade rural
            </Link>
          </div>
        </div>
      </section>

      {/* Para quem faz sentido */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quem deve considerar energia solar rural</h2>
          <p className="text-gray-700 mb-4">
            Propriedades rurais são excelentes candidatas para energia solar por combinarem alto consumo energético
            com grande disponibilidade de área para instalação e boa irradiação solar. São ótimos casos de uso:
          </p>
          <ul className="space-y-2 text-gray-700">
            {[
              'Fazendas e sítios com alto consumo de energia',
              'Sistemas de irrigação com bombeamento elétrico',
              'Agroindústrias, frigoríficos e beneficiadoras',
              'Residências rurais sem acesso adequado à rede elétrica',
              'Propriedades com gerador a diesel que querem reduzir custos',
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-orange-600 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tipos de sistema */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tipos de sistema para área rural</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'On-grid (conectado à rede)',
                text: 'Conectado à distribuidora. O excedente vira créditos de energia. Ideal para propriedades com acesso à rede elétrica.',
              },
              {
                title: 'Off-grid (autônomo)',
                text: 'Independente da rede elétrica, com baterias para armazenamento. Ideal para regiões remotas sem distribuição confiável.',
              },
              {
                title: 'Híbrido',
                text: 'Combina conexão à rede com baterias de backup. Oferece economia e segurança energética simultâneas.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 ring-1 ring-orange-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Principais vantagens da energia solar rural</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Redução significativa do custo com energia elétrica',
              'Área disponível para grandes instalações = maior geração',
              'Redução de dependência de geradores a diesel',
              'Bombeamento solar para irrigação sem custo recorrente',
              'Sem interrupções por quedas da rede elétrica (off-grid/híbrido)',
              'Manutenção simplificada com suporte técnico especializado',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-orange-50 rounded-xl p-4 ring-1 ring-orange-100">
                <span className="text-orange-600 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Perguntas frequentes sobre energia solar rural</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-xl bg-white p-5 ring-1 ring-orange-100 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500 font-bold text-lg transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Economize na propriedade rural com energia solar</h2>
          <p className="text-orange-100 mb-6">Análise gratuita, dimensionamento personalizado.</p>
          <Link href="/contato" className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-50 transition-colors">
            Falar com especialista
          </Link>
        </div>
      </section>

      <section className="py-10 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Saiba mais</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/energia-solar-parana" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar no Paraná</Link>
            <Link href="/energia-solar-cascavel" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar em Cascavel</Link>
            <Link href="/empresas" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar para empresas</Link>
            <Link href="/preco-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Quanto custa energia solar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
