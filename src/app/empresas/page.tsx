import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar para Empresas | Redução de Custo Operacional | SolarInvest',
  description:
    'Soluções de energia solar para empresas com alto custo de energia. Reduza gastos operacionais, transforme custo variável em previsível e melhore sua margem com leasing solar.',
  path: '/empresas',
  keywords: [
    'energia solar para empresas',
    'reduzir custo fixo empresa',
    'reduzir gastos operacionais energia',
    'reduzir custo energia empresa',
    'leasing energia solar empresas',
    'energia solar sem investimento empresa',
    'como transformar custo em investimento',
    'energia cara brasil o que fazer',
  ],
});

const faqItems = [
  {
    question: 'Como a energia solar ajuda empresas a reduzirem custos?',
    answer:
      'A energia solar reduz o custo mensal com energia elétrica, que costuma ser um dos maiores gastos operacionais de empresas. Com leasing operacional, essa redução acontece sem investimento inicial, transformando um custo variável e crescente em uma mensalidade previsível e menor.',
  },
  {
    question: 'Quanto uma empresa pode economizar com energia solar?',
    answer:
      'Empresas com alto consumo energético podem economizar entre 20% e 40% na conta de luz. Em alguns casos, a mensalidade do leasing é de 30% a 50% menor do que a fatura atual, representando uma economia significativa ao longo do ano.',
  },
  {
    question: 'Existe leasing de energia solar para empresas?',
    answer:
      'Sim. O leasing operacional da SolarInvest é especialmente vantajoso para empresas: sem investimento inicial, com suporte e manutenção inclusos e mensalidade calculada para ser menor que o custo atual de energia.',
  },
  {
    question: 'Como reduzir os gastos operacionais com energia elétrica?',
    answer:
      'A forma mais eficiente é instalar um sistema fotovoltaico ou contratar leasing solar. A SolarInvest faz uma análise gratuita do perfil de consumo da empresa e apresenta a solução mais adequada para maximizar a economia.',
  },
];

export default function EmpresasPage() {
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
    name: 'Energia Solar para Empresas',
    description:
      'Soluções de energia solar para empresas: leasing operacional, instalação fotovoltaica e redução do custo operacional de energia elétrica.',
    provider: { '@type': 'Organization', name: siteName, url: siteUrl, logo: logoUrl },
    areaServed: 'Brasil',
    serviceType: 'Energia solar fotovoltaica para empresas e comércio',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Empresas', item: `${siteUrl}/empresas` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="empresas-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="empresas-service-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="empresas-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Empresas</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar para Empresas
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Reduza o custo operacional de energia da sua empresa com soluções fotovoltaicas. Com leasing solar, você
            elimina o investimento inicial e transforma um gasto crescente em uma mensalidade previsível e menor.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite análise para minha empresa
            </Link>
          </div>
        </div>
      </section>

      {/* Para quem faz sentido */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quem deve considerar energia solar para empresa</h2>
          <p className="text-gray-700 mb-4">
            A energia solar faz sentido para empresas que buscam reduzir custos operacionais e ter previsibilidade
            nos gastos com energia. Em geral, são ótimos candidatos:
          </p>
          <ul className="space-y-2 text-gray-700">
            {[
              'Empresas com conta de energia acima de R$ 1.500/mês',
              'Comércios e escritórios com funcionamento diurno intenso',
              'Indústrias e galpões com alta demanda elétrica',
              'Empresas que querem melhorar margem sem aumentar receita',
              'Negócios que buscam previsibilidade financeira nos custos fixos',
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-orange-600 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Como a SolarInvest atende empresas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                step: '1',
                title: 'Análise do perfil de consumo',
                text: 'Avaliamos a fatura de energia, horários de consumo e estrutura do imóvel para dimensionar a solução ideal.',
              },
              {
                step: '2',
                title: 'Proposta personalizada',
                text: 'Apresentamos comparativo entre compra direta e leasing, com projeção de economia e payback.',
              },
              {
                step: '3',
                title: 'Instalação e homologação',
                text: 'Executamos o projeto completo, desde a instalação até a aprovação junto à distribuidora.',
              },
              {
                step: '4',
                title: 'Suporte contínuo',
                text: 'Monitoramento de desempenho, manutenção preventiva e atendimento técnico durante todo o contrato.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm">{item.step}</span>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Principais vantagens para empresas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Redução imediata do custo mensal com energia',
              'Sem investimento inicial no modelo de leasing',
              'Custo variável transformado em mensalidade previsível',
              'Manutenção e suporte inclusos durante o contrato',
              'Proteção contra aumentos futuros nas tarifas',
              'Melhoria de margem sem necessidade de aumento de receita',
              'Usina transferida para a empresa ao final do leasing',
              'Monitoramento em tempo real do desempenho do sistema',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-orange-50 rounded-xl p-4 ring-1 ring-orange-100">
                <span className="text-orange-600 font-bold text-lg mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Perguntas frequentes</h2>
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

      <section className="py-10 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Saiba mais</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing de energia solar sem entrada</Link>
            <Link href="/economia-na-conta-de-luz" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Como reduzir a conta de luz</Link>
            <Link href="/preco-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Quanto custa energia solar</Link>
            <Link href="/faq" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Perguntas frequentes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
