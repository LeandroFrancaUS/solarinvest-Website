import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar no Paraná | Soluções e Preços | SolarInvest',
  description:
    'Soluções de energia solar no Paraná para residências, empresas e áreas rurais. Leasing, compra direta, suporte técnico e economia na conta de luz em todo o estado.',
  path: '/energia-solar-parana',
  keywords: [
    'energia solar parana',
    'energia solar no paraná',
    'energia solar no parana',
    'empresa energia solar parana',
    'instalação energia solar parana',
    'energia solar cascavel',
    'energia solar em cascavel',
    'integradores de energia solar',
    'energia solar comercial',
    'energia solar rural',
  ],
});

const faqItems = [
  {
    question: 'A SolarInvest atende o Paraná?',
    answer:
      'Sim. A SolarInvest atende o Paraná, incluindo Cascavel e outras cidades do estado, com soluções fotovoltaicas para residências, empresas e área rural.',
  },
  {
    question: 'Energia solar compensa no Paraná?',
    answer:
      'Sim. Apesar de o Paraná ter um clima mais variado do que o Centro-Oeste, a irradiação solar no estado é suficiente para sistemas fotovoltaicos eficientes. Cidades como Cascavel, Londrina e Maringá têm bom potencial solar.',
  },
  {
    question: 'Qual a diferença entre um integrador de energia solar e a SolarInvest?',
    answer:
      'Integradores convencionais vendem e instalam o sistema, mas geralmente não oferecem manutenção contínua ou modelos sem investimento inicial. A SolarInvest combina instalação, suporte, manutenção e modelo de leasing operacional em um único contrato.',
  },
  {
    question: 'Existe energia solar rural no Paraná?',
    answer:
      'Sim. Propriedades rurais no Paraná têm ótimo potencial para energia solar, especialmente para uso agroindustrial e de irrigação. A SolarInvest dimensiona projetos específicos para demanda rural.',
  },
];

export default function EnergiaParanaPage() {
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
      { '@type': 'State', name: 'Paraná' },
      { '@type': 'City', name: 'Cascavel' },
    ],
    description: 'Empresa de energia solar no Paraná com leasing, instalação, manutenção e suporte.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Energia Solar no Paraná', item: `${siteUrl}/energia-solar-parana` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="parana-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="parana-localbiz-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Script id="parana-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Paraná</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar no Paraná
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            A SolarInvest leva soluções de energia solar ao Paraná para residências, comércios, empresas e propriedades
            rurais. Economize na conta de luz com leasing sem entrada ou compra direta, com suporte técnico especializado.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite atendimento no Paraná
            </Link>
          </div>
        </div>
      </section>

      {/* Potencial solar no Paraná */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Potencial de energia solar no Paraná
          </h2>
          <p className="text-gray-700 mb-4">
            O Paraná tem um bom potencial solar, com irradiação que permite sistemas fotovoltaicos eficientes na maior
            parte do estado. Cidades do oeste paranaense como Cascavel têm condições especialmente favoráveis, com
            alta insolação e baixa umidade em grande parte do ano.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Irradiação média', value: '4,8 a 5,5 kWh/m²/dia' },
              { label: 'Economia estimada', value: '20% a 35%' },
              { label: 'Regiões atendidas', value: 'Todo o estado' },
            ].map((item) => (
              <div key={item.label} className="bg-orange-50 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soluções */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Soluções para residências, empresas e área rural</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Residências',
                text: 'Reduza a conta doméstica com leasing sem entrada ou compra direta. Atendemos residências em todo o Paraná.',
                href: '/residencial',
                link: 'Ver soluções residenciais',
              },
              {
                title: 'Empresas',
                text: 'Reduza o custo operacional de energia com leasing operacional e monitoramento contínuo.',
                href: '/empresas',
                link: 'Ver soluções para empresas',
              },
              {
                title: 'Área rural',
                text: 'Sistemas para irrigação, agroindustrial e propriedades rurais com ou sem conexão à rede elétrica.',
                href: '/energia-solar-rural',
                link: 'Ver soluções rurais',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 ring-1 ring-orange-100 shadow-sm flex flex-col">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm flex-1">{item.text}</p>
                <Link href={item.href} className="mt-4 text-orange-600 font-semibold hover:underline text-sm">{item.link} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cidades */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Cidades atendidas no Paraná</h2>
          <p className="text-gray-700 mb-4">Atendemos todo o estado, com destaque para:</p>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Cascavel', href: '/energia-solar-cascavel' },
              'Curitiba', 'Londrina', 'Maringá', 'Foz do Iguaçu', 'Ponta Grossa', 'Guarapuava',
            ].map((city) => {
              if (typeof city === 'string') {
                return (
                  <span key={city} className="rounded-xl bg-orange-50 border border-orange-200 px-5 py-2 text-sm text-orange-700">
                    {city}
                  </span>
                );
              }
              return (
                <Link
                  key={city.name}
                  href={city.href}
                  className="rounded-xl bg-orange-50 border border-orange-200 px-5 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  {city.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas frequentes sobre energia solar no Paraná
          </h2>
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
          <h2 className="text-2xl font-bold mb-3">Economize no Paraná com energia solar</h2>
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
            <Link href="/energia-solar-cascavel" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar em Cascavel</Link>
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing de energia solar</Link>
            <Link href="/preco-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Preço de energia solar</Link>
            <Link href="/energia-solar-rural" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar rural</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
