import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Leasing de Energia Solar no Brasil | SolarInvest',
  description:
    'Saiba como funciona o leasing de energia solar e modelos sem entrada, sem compra do sistema e com mensalidade planejada para reduzir o peso da conta de luz.',
  path: '/leasing-energia-solar',
  keywords: [
    'leasing energia solar',
    'energia solar leasing brasil',
    'aluguel de energia solar',
    'energia solar sem comprar',
    'usar energia solar sem investimento',
    'energia solar mensalidade',
    'energia solar contrato mensal',
    'energia solar sem entrada',
    'energia solar sem financiamento',
    'energia solar como serviço',
    'energia solar por assinatura residencial',
  ],
});

const faqItems = [
  {
    question: 'O que é leasing de energia solar?',
    answer:
      'Leasing de energia solar é um modelo em que você utiliza um sistema fotovoltaico instalado no seu imóvel sem precisar comprá-lo. Você paga uma mensalidade pelo uso da usina, que geralmente é menor do que a sua conta de luz atual, e ao final do contrato a propriedade é transferida para você.',
  },
  {
    question: 'Qual a diferença entre leasing e financiamento de energia solar?',
    answer:
      'No financiamento bancário você compra o sistema e paga juros pelo crédito. No leasing, não há entrada nem juros; a mensalidade cobre instalação, seguro, operação e manutenção. O leasing é mais ágil e não exige comprovação de crédito bancário.',
  },
  {
    question: 'Existe energia solar sem investimento inicial?',
    answer:
      'Sim. O leasing operacional da SolarInvest não exige nenhum investimento inicial. Você começa a economizar desde a primeira fatura após a homologação, sem precisar desembolsar o valor total do sistema.',
  },
  {
    question: 'Posso usar energia solar sem comprar o sistema?',
    answer:
      'Sim. Com o modelo de leasing ou assinatura, a SolarInvest instala e opera o sistema por você. Você paga apenas pela energia gerada, com mensalidade pré-acordada em contrato.',
  },
  {
    question: 'Quanto custa a mensalidade do leasing solar?',
    answer:
      'O valor da mensalidade é calculado com base no seu consumo médio e na tarifa da distribuidora. Em geral, ela é menor do que a sua conta de luz atual, gerando economia imediata.',
  },
];

export default function LeasingEnergiaPage() {
  const { siteUrl, siteName, logoUrl } = seoConstants;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Leasing de Energia Solar',
    description:
      'Modelo de leasing operacional de energia solar: sistema instalado no imóvel do cliente, mensalidade menor que a conta de luz, manutenção e suporte inclusos, transferência da usina ao final do contrato.',
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: logoUrl,
    },
    areaServed: 'Brasil',
    serviceType: 'Leasing de energia solar fotovoltaica',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Leasing de Energia Solar',
        item: `${siteUrl}/leasing-energia-solar`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="leasing-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="leasing-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="leasing-breadcrumb-jsonld"
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
            <span className="text-gray-700">Leasing de Energia Solar</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Leasing de Energia Solar no Brasil
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Use energia solar sem precisar comprar o sistema. Com o leasing da SolarInvest, você paga uma mensalidade
            menor do que a sua conta de luz atual e recebe a usina no final do contrato.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite uma análise gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Resumo rápido */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Resposta rápida: leasing de energia solar faz sentido para quem?
          </h2>
          <p className="text-gray-700 mb-4">
            O leasing de energia solar é ideal para quem quer economizar na conta de luz imediatamente, sem precisar
            investir o valor total de um sistema fotovoltaico. É uma opção especialmente vantajosa para residências e
            empresas que querem previsibilidade de custos e não desejam lidar com manutenção ou burocracia.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Conta de luz acima de R$ 400/mês</li>
            <li>Não quer fazer um grande investimento inicial</li>
            <li>Prefere previsibilidade de custos mensais</li>
            <li>Quer suporte e manutenção inclusos no contrato</li>
            <li>Deseja a propriedade da usina ao final do prazo</li>
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Como funciona o leasing de energia solar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                step: '1',
                title: 'Análise gratuita',
                text: 'Enviamos um especialista para avaliar seu consumo e dimensionar a usina ideal para o seu perfil.',
              },
              {
                step: '2',
                title: 'Instalação sem entrada',
                text: 'A SolarInvest projeta, aprova e instala a usina no seu imóvel sem nenhum custo inicial.',
              },
              {
                step: '3',
                title: 'Mensalidade menor que a conta',
                text: 'Você paga uma mensalidade pelo uso da energia gerada, que costuma ser menor do que sua conta atual.',
              },
              {
                step: '4',
                title: 'Usina transferida ao final',
                text: 'Ao término do contrato, a titularidade da usina é transferida automaticamente para o seu nome.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm">
                    {item.step}
                  </span>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Comparação: compra, financiamento e leasing de energia solar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-3 text-left rounded-tl-xl">Critério</th>
                  <th className="p-3 text-center">Compra direta</th>
                  <th className="p-3 text-center">Financiamento</th>
                  <th className="p-3 text-center rounded-tr-xl">Leasing SolarInvest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Investimento inicial', 'Alto', 'Médio (entrada)', 'Zero'],
                  ['Juros', 'Nenhum', 'Sim (bancário)', 'Nenhum'],
                  ['Manutenção inclusa', 'Não', 'Não', 'Sim'],
                  ['Propriedade imediata', 'Sim', 'Sim', 'Ao final do contrato'],
                  ['Previsibilidade mensal', 'Baixa', 'Média', 'Alta'],
                  ['Burocracia', 'Média', 'Alta', 'Baixa'],
                ].map(([criterio, compra, financ, leasing]) => (
                  <tr key={criterio} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-slate-700">{criterio}</td>
                    <td className="p-3 text-center text-gray-600">{compra}</td>
                    <td className="p-3 text-center text-gray-600">{financ}</td>
                    <td className="p-3 text-center font-semibold text-orange-600">{leasing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Principais vantagens do leasing de energia solar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Economia imediata: mensalidade menor que a conta de luz',
              'Sem entrada, sem juros bancários',
              'Manutenção e suporte inclusos durante todo o contrato',
              'Monitoramento de desempenho em tempo real',
              'Usina transferida para seu nome ao final do prazo',
              'Previsibilidade: sem surpresas na cobrança mensal',
              'Proteção contra aumentos futuros na tarifa de energia',
              'Instalação profissional com homologação completa',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm ring-1 ring-orange-100">
                <span className="text-orange-600 font-bold text-lg mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pontos de atenção */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitações e pontos de atenção</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-1">•</span>
              <span>
                O cancelamento antecipado pode gerar custos proporcionais. Verifique as condições no contrato.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-1">•</span>
              <span>
                A titularidade da usina é transferida apenas ao final do prazo, não no início.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-1">•</span>
              <span>
                A economia real depende do consumo, da tarifa da distribuidora e da radiação solar na região.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Perguntas frequentes sobre leasing de energia solar</h2>
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
              href="/preco-energia-solar"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Quanto custa energia solar
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
              Economia na conta de luz
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
