import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Quanto Custa Energia Solar? Preço, Economia e Alternativas | SolarInvest',
  description:
    'Veja quanto custa instalar energia solar, quais fatores influenciam o preço e quando vale mais a pena uma solução parcelada, leasing ou sem investimento inicial.',
  path: '/preco-energia-solar',
  keywords: [
    'instalar energia solar preço',
    'quanto custa energia solar',
    'energia solar para residência preço',
    'energia solar goiania preço',
    'energia solar df preço',
    'energia solar parcelado',
    'energia solar financiamento',
    'quanto custa instalar energia solar',
  ],
});

const faqItems = [
  {
    question: 'Quanto custa instalar energia solar em 2026?',
    answer:
      'O preço de um sistema fotovoltaico residencial varia conforme o consumo e o tamanho da instalação. Em geral, sistemas para residências com conta entre R$ 300 e R$ 600/mês custam entre R$ 15.000 e R$ 30.000 na compra direta. Com leasing, não há custo inicial — você paga apenas a mensalidade.',
  },
  {
    question: 'O que influencia o preço da energia solar?',
    answer:
      'Os principais fatores são: consumo mensal de energia, tipo e qualidade dos equipamentos, complexidade da instalação, localização geográfica e modelo comercial escolhido (compra, financiamento ou leasing).',
  },
  {
    question: 'Quando o leasing é melhor do que comprar energia solar?',
    answer:
      'O leasing é vantajoso quando você não quer ou não pode desembolsar o valor total do sistema, quando prefere previsibilidade de custos mensais e quando deseja que manutenção e suporte estejam inclusos no contrato.',
  },
  {
    question: 'Existe energia solar parcelada sem juros?',
    answer:
      'O leasing operacional da SolarInvest funciona como uma mensalidade sem juros bancários. É diferente do financiamento tradicional: não há análise de crédito bancária nem juros embutidos nas parcelas.',
  },
];

export default function PrecoEnergiaPage() {
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Preço de Energia Solar',
        item: `${siteUrl}/preco-energia-solar`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="preco-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="preco-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Preço de Energia Solar</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Quanto Custa Energia Solar?
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            O preço da energia solar varia conforme o consumo, o tipo de instalação e o modelo escolhido. Veja as
            principais referências e descubra quando a compra, o financiamento ou o leasing fazem mais sentido.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite um orçamento gratuito
            </Link>
          </div>
        </div>
      </section>

      {/* O que influencia o preço */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">O que influencia o preço da energia solar</h2>
          <p className="text-gray-700 mb-4">
            O custo de um sistema fotovoltaico não é fixo. Cada projeto é dimensionado de acordo com as necessidades
            específicas do cliente. Os principais fatores que afetam o preço são:
          </p>
          <ul className="space-y-3 text-gray-700">
            {[
              'Consumo mensal de energia (kWh): quanto maior o consumo, maior o sistema necessário.',
              'Tipo de instalação: telhado inclinado, laje plana ou solo têm custos distintos.',
              'Qualidade dos equipamentos: módulos e inversores Tier 1 têm melhor desempenho e maior durabilidade.',
              'Localização: regiões com maior irradiação solar (como Centro-Oeste e Nordeste) podem usar sistemas menores.',
              'Modelo comercial: compra direta, financiamento ou leasing têm estruturas de custo diferentes.',
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-orange-600 font-bold mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Faixas de preço */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Referência de preço: energia solar para residência
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-3 text-left rounded-tl-xl">Perfil de consumo</th>
                  <th className="p-3 text-center">Conta mensal</th>
                  <th className="p-3 text-center">Preço estimado (compra)</th>
                  <th className="p-3 text-center rounded-tr-xl">Com leasing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  ['Pequena residência', 'até R$ 300', 'R$ 12.000 – R$ 20.000', 'Mensalidade reduzida'],
                  ['Residência média', 'R$ 400 – R$ 600', 'R$ 20.000 – R$ 30.000', 'Mensalidade reduzida'],
                  ['Residência grande', 'R$ 700 – R$ 1.200', 'R$ 30.000 – R$ 55.000', 'Mensalidade reduzida'],
                  ['Pequena empresa', 'acima de R$ 1.500', 'R$ 50.000+', 'Mensalidade reduzida'],
                ].map(([perfil, conta, preco, leasing]) => (
                  <tr key={perfil} className="hover:bg-orange-50">
                    <td className="p-3 font-medium text-slate-700">{perfil}</td>
                    <td className="p-3 text-center text-gray-600">{conta}</td>
                    <td className="p-3 text-center text-gray-600">{preco}</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">{leasing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Valores de referência. O orçamento exato depende do projeto. Solicite uma análise gratuita.
          </p>
        </div>
      </section>

      {/* Quando compra faz sentido */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Quando a compra direta faz sentido</h2>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Você tem capital disponível para o investimento inicial</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Quer a propriedade da usina imediatamente</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Busca maior retorno financeiro no longo prazo</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Quando o leasing ou assinatura faz mais sentido
              </h2>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Não quer ou não pode investir o valor total agora</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Quer manutenção e suporte inclusos na mensalidade</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Prefere previsibilidade e gestão financeira simplificada</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas frequentes sobre custo e economia
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-xl bg-white p-5 ring-1 ring-orange-100 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500 font-bold text-lg transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Saiba mais</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/leasing-energia-solar"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Leasing de energia solar sem entrada
            </Link>
            <Link
              href="/comofunciona"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Como funciona energia solar residencial
            </Link>
            <Link
              href="/economia-na-conta-de-luz"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Quanto economiza com energia solar
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Perguntas frequentes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
