import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar em Cascavel | SolarInvest',
  description:
    'Soluções de energia solar em Cascavel, PR. Leasing sem entrada, compra direta, energia solar comercial e rural, com suporte técnico e atendimento especializado na região oeste do Paraná.',
  path: '/energia-solar-cascavel',
  keywords: [
    'energia solar em cascavel',
    'energia solar cascavel',
    'empresa energia solar cascavel',
    'instalação energia solar cascavel',
    'leasing energia solar cascavel',
    'energia solar parana',
    'energia solar comercial cascavel',
    'energia solar rural cascavel',
    'integradores de energia solar cascavel',
  ],
});

const faqItems = [
  {
    question: 'A SolarInvest atende Cascavel?',
    answer:
      'Sim. A SolarInvest atende Cascavel e a região oeste do Paraná com projetos fotovoltaicos para residências, comércios, empresas e propriedades rurais.',
  },
  {
    question: 'Energia solar compensa em Cascavel?',
    answer:
      'Sim. Cascavel está localizada no oeste paranaense, com boa irradiação solar e muitas horas de sol por ano. Isso torna os sistemas fotovoltaicos muito eficientes e com bom retorno sobre investimento.',
  },
  {
    question: 'Existe leasing de energia solar em Cascavel?',
    answer:
      'Sim. O modelo de leasing da SolarInvest está disponível em Cascavel: sistema instalado sem custo inicial, mensalidade menor que a conta de luz e usina transferida ao final do contrato.',
  },
];

export default function EnergiaCascavelPage() {
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
    areaServed: [{ '@type': 'City', name: 'Cascavel' }, { '@type': 'State', name: 'Paraná' }],
    description: 'Empresa de energia solar em Cascavel com leasing, instalação, manutenção e suporte.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Energia Solar no Paraná', item: `${siteUrl}/energia-solar-parana` },
      { '@type': 'ListItem', position: 3, name: 'Energia Solar em Cascavel', item: `${siteUrl}/energia-solar-cascavel` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="cascavel-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="cascavel-localbiz-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Script id="cascavel-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/energia-solar-parana" className="hover:text-orange-600">Paraná</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Cascavel</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar em Cascavel
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            A SolarInvest atende Cascavel com soluções completas de energia solar: leasing sem entrada, compra direta,
            atendimento a residências, comércios, empresas e área rural no oeste do Paraná.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite atendimento em Cascavel
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Energia solar em Cascavel: por que faz sentido</h2>
          <p className="text-gray-700 mb-4">
            Cascavel, no oeste paranaense, tem ótimas condições para energia solar. A cidade está entre as mais
            ensolaradas do Paraná, o que se traduz em sistemas mais eficientes e maior economia na conta de luz para
            residências, empresas e propriedades rurais.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Irradiação estimada', value: '5,0 a 5,5 kWh/m²/dia' },
              { label: 'Economia estimada', value: '20% a 35%' },
              { label: 'Atendimento', value: 'Cascavel e região' },
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Soluções disponíveis em Cascavel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: 'Leasing solar residencial', text: 'Mensalidade menor que a conta, sem entrada, com transferência da usina ao final do contrato.' },
              { title: 'Energia solar comercial', text: 'Redução do custo de energia para comércios e empresas em Cascavel com monitoramento contínuo.' },
              { title: 'Energia solar rural', text: 'Soluções para propriedades rurais, irrigação e agroindustrial na região oeste do Paraná.' },
              { title: 'Manutenção e limpeza', text: 'Suporte técnico, manutenção preventiva e limpeza de painéis solares em Cascavel.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 ring-1 ring-orange-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas frequentes sobre energia solar em Cascavel
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
          <h2 className="text-2xl font-bold mb-3">Pronto para economizar em Cascavel?</h2>
          <p className="text-orange-100 mb-6">Análise gratuita, sem compromisso.</p>
          <Link href="/contato" className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-50 transition-colors">
            Falar com especialista
          </Link>
        </div>
      </section>

      <section className="py-10 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Veja também</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/energia-solar-parana" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar no Paraná</Link>
            <Link href="/energia-solar-rural" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar rural</Link>
            <Link href="/limpeza-de-placas-solares" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Limpeza de placas solares</Link>
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing de energia solar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
