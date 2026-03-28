import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar em Goiás | SolarInvest',
  description:
    'Empresa de energia solar em Goiás com soluções para residências e empresas, incluindo opções para reduzir a conta de luz com suporte, manutenção e atendimento regional.',
  path: '/energia-solar-goias',
  keywords: [
    'empresa de energia solar goias',
    'energia solar goias',
    'instalação energia solar goias',
    'energia solar anapolis',
    'energia solar goiania',
    'empresa energia solar confiável',
  ],
});

const faqItems = [
  {
    question: 'Energia solar compensa em Goiás?',
    answer:
      'Sim. Goiás tem uma das maiores taxas de irradiação solar do Brasil, o que torna a energia solar extremamente eficiente. Com a elevada incidência de sol ao longo do ano, os sistemas fotovoltaicos geram mais energia e proporcionam economia maior.',
  },
  {
    question: 'A SolarInvest atende todo o estado de Goiás?',
    answer:
      'Sim. Atuamos em Goiânia, Anápolis, Brasília e em diversas cidades do estado de Goiás, com equipe técnica regional para instalação, homologação e manutenção.',
  },
  {
    question: 'Qual a economia esperada com energia solar em Goiás?',
    answer:
      'Em Goiás, a economia com energia solar costuma ser superior à média nacional, graças à alta irradiação solar. Residências e empresas podem economizar entre 20% e 40% na conta de luz, dependendo do consumo e do modelo contratado.',
  },
];

export default function EnergiaGoiasPage() {
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

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteName,
    url: siteUrl,
    logo: logoUrl,
    telephone: '+55-62-99515-0975',
    areaServed: [
      { '@type': 'State', name: 'Goiás' },
      { '@type': 'City', name: 'Goiânia' },
      { '@type': 'City', name: 'Anápolis' },
    ],
    description:
      'Empresa de energia solar em Goiás com instalação, leasing, manutenção e suporte para residências e empresas.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Energia Solar em Goiás',
        item: `${siteUrl}/energia-solar-goias`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="goias-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="goias-localbiz-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Script
        id="goias-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Energia Solar em Goiás</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar em Goiás
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            A SolarInvest oferece soluções completas de energia solar para residências e empresas em Goiás. Com alta
            irradiação solar e atendimento regional especializado, a economia na conta de luz é real e imediata.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite atendimento em Goiás
            </Link>
          </div>
        </div>
      </section>

      {/* Por que Goiás é ideal */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Por que Goiás é um dos melhores estados para energia solar
          </h2>
          <p className="text-gray-700 mb-4">
            Goiás se destaca pela elevada irradiação solar ao longo do ano, o que significa sistemas menores e mais
            eficientes para o mesmo nível de geração de energia. Isso se traduz diretamente em maior economia e retorno
            mais rápido do investimento.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Irradiação média', value: '5,5 a 6,0 kWh/m²/dia' },
              { label: 'Economia estimada', value: '20% a 40%' },
              { label: 'Cidades atendidas', value: 'Todo o estado' },
            ].map((item) => (
              <div key={item.label} className="bg-orange-50 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soluções para residências */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Energia solar para residências em Goiás</h2>
          <p className="text-gray-700 mb-3">
            Moradores de Goiás podem reduzir a conta de luz com instalação fotovoltaica ou com leasing solar, sem
            precisar desembolsar o valor total do sistema. A SolarInvest cuida de toda a operação, da análise à
            homologação.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Leasing sem entrada: mensalidade menor que a conta atual</span></li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Compra direta com equipamentos Tier 1 e garantia extendida</span></li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Monitoramento em tempo real e suporte técnico regional</span></li>
          </ul>
          <div className="mt-4">
            <Link href="/residencial" className="text-orange-600 font-semibold hover:underline text-sm">
              Ver soluções para residências →
            </Link>
          </div>
        </div>
      </section>

      {/* Soluções para empresas */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Energia solar para empresas em Goiás</h2>
          <p className="text-gray-700 mb-3">
            Empresas em Goiás com alto consumo de energia podem transformar esse custo fixo em uma vantagem
            competitiva. Com leasing operacional, é possível reduzir despesas mensais sem comprometer o caixa.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Análise personalizada para cada perfil de consumo empresarial</span></li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Redução do custo fixo de energia com previsibilidade mensal</span></li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Suporte técnico e manutenção inclusos</span></li>
          </ul>
          <div className="mt-4">
            <Link href="/empresas" className="text-orange-600 font-semibold hover:underline text-sm">
              Ver soluções para empresas →
            </Link>
          </div>
        </div>
      </section>

      {/* Cidades */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Cidades atendidas em Goiás</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Goiânia', href: '/energia-solar-goiania' },
              { name: 'Anápolis', href: '/energia-solar-anapolis' },
              { name: 'Brasília / DF', href: '/energia-solar-brasilia' },
            ].map((city) => (
              <Link
                key={city.name}
                href={city.href}
                className="rounded-xl bg-white border border-orange-200 px-5 py-3 font-semibold text-orange-700 hover:bg-orange-100 transition-colors shadow-sm"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas frequentes sobre energia solar em Goiás
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-xl bg-orange-50 p-5 ring-1 ring-orange-100 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500 font-bold text-lg transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Pronto para economizar em Goiás?</h2>
          <p className="text-orange-100 mb-6">
            Solicite uma análise gratuita e descubra quanto você pode economizar com energia solar.
          </p>
          <Link
            href="/contato"
            className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-50 transition-colors"
          >
            Falar com especialista
          </Link>
        </div>
      </section>
    </main>
  );
}
