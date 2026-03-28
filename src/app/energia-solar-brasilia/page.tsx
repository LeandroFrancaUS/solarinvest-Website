import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar em Brasília e DF | SolarInvest',
  description:
    'Soluções em energia solar para Brasília e DF com foco em economia, previsibilidade de custo, atendimento especializado e alternativas para residências e empresas.',
  path: '/energia-solar-brasilia',
  keywords: [
    'energia solar brasilia',
    'energia solar df preço',
    'empresa energia solar brasilia',
    'leasing energia solar brasilia',
    'energia solar sem investimento brasilia',
    'energia solar df',
  ],
});

const faqItems = [
  {
    question: 'A SolarInvest atende Brasília e o DF?',
    answer:
      'Sim. A SolarInvest atende Brasília e todo o Distrito Federal com equipe técnica especializada para instalação, homologação e manutenção de sistemas fotovoltaicos.',
  },
  {
    question: 'Quanto custa energia solar em Brasília?',
    answer:
      'O preço de um sistema fotovoltaico em Brasília varia conforme o consumo e o modelo de contratação. Para residências com conta acima de R$ 400/mês, o investimento na compra direta costuma partir de R$ 20.000. Com leasing, não há custo inicial.',
  },
  {
    question: 'Energia solar compensa em Brasília e no DF?',
    answer:
      'Sim. O Distrito Federal tem excelente irradiação solar, tornando os sistemas fotovoltaicos muito eficientes. A economia é significativa tanto para residências quanto para empresas.',
  },
];

export default function EnergiaBrasiliaPage() {
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
      { '@type': 'City', name: 'Brasília' },
      { '@type': 'AdministrativeArea', name: 'Distrito Federal' },
    ],
    description: 'Empresa de energia solar em Brasília e DF com leasing, instalação, manutenção e suporte.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Energia Solar em Brasília e DF', item: `${siteUrl}/energia-solar-brasilia` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="brasilia-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="brasilia-localbiz-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Script id="brasilia-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Brasília e DF</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar em Brasília e DF
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            A SolarInvest oferece soluções de energia solar para Brasília e Distrito Federal, com foco em economia,
            previsibilidade de custo e atendimento especializado para residências e empresas.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite atendimento em Brasília
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Energia solar no DF: por que faz sentido</h2>
          <p className="text-gray-700 mb-4">
            Brasília e o Distrito Federal têm uma das maiores irradiações solares do país, com clima seco e elevado
            número de horas de sol por ano. Esse potencial se traduz em sistemas mais eficientes e payback mais rápido.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Irradiação média', value: '5,7 a 6,2 kWh/m²/dia' },
              { label: 'Economia estimada', value: '25% a 40%' },
              { label: 'Atendimento', value: 'DF e entorno' },
            ].map((item) => (
              <div key={item.label} className="bg-orange-50 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Soluções para residências e empresas no DF</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Para residências',
                items: [
                  'Leasing sem entrada: mensalidade menor que a conta',
                  'Compra direta com equipamentos Tier 1',
                  'Monitoramento e suporte inclusos',
                ],
              },
              {
                title: 'Para empresas',
                items: [
                  'Análise personalizada do perfil de consumo',
                  'Leasing operacional sem comprometer o caixa',
                  'Redução do custo fixo de energia elétrica',
                ],
              },
            ].map((group) => (
              <div key={group.title} className="bg-white rounded-xl p-6 ring-1 ring-orange-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-3">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2 text-gray-700 text-sm">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas frequentes sobre energia solar em Brasília
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-xl bg-orange-50 p-5 ring-1 ring-orange-100 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500 font-bold text-lg transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Economize em Brasília com energia solar</h2>
          <p className="text-orange-100 mb-6">Análise gratuita, sem compromisso.</p>
          <Link
            href="/contato"
            className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-50 transition-colors"
          >
            Falar com especialista
          </Link>
        </div>
      </section>

      <section className="py-10 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Veja também</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/energia-solar-goias" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar em Goiás</Link>
            <Link href="/energia-solar-goiania" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar em Goiânia</Link>
            <Link href="/preco-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Preço de energia solar no DF</Link>
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing de energia solar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
