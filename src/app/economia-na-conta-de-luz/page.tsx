import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Como Reduzir a Conta de Luz com Energia Solar | SolarInvest',
  description:
    'Descubra como economizar na conta de luz com energia solar. Soluções para residências e empresas com conta de energia cara, sem necessidade de grande investimento inicial.',
  path: '/economia-na-conta-de-luz',
  keywords: [
    'conta de luz muito cara',
    'como reduzir conta de luz',
    'como pagar menos energia',
    'energia cara brasil o que fazer',
    'como economizar energia elétrica',
    'alternativa conta de luz alta',
    'quanto economiza energia solar',
    'economia com energia solar',
    'reduzir custo energia empresa',
    'energia elétrica muito cara solução',
    'diminuir despesas mensais casa',
  ],
});

const faqItems = [
  {
    question: 'Quanto posso economizar com energia solar?',
    answer:
      'A economia média com energia solar fica entre 15% e 35% do valor da conta, dependendo do consumo, da tarifa da distribuidora e da radiação solar na região. Em muitos casos, a mensalidade do leasing já é inferior ao valor atual da conta de luz.',
  },
  {
    question: 'Vale a pena energia solar em 2026?',
    answer:
      'Sim. Com a contínua elevação das tarifas de energia elétrica no Brasil, a energia solar se torna cada vez mais vantajosa. O retorno sobre investimento tem encurtado, e modelos como leasing tornam a solução acessível sem necessidade de capital inicial.',
  },
  {
    question: 'Como reduzir a conta de luz da minha empresa?',
    answer:
      'Empresas com contas de energia elevadas podem reduzir significativamente esse custo com instalação de painéis solares ou com modelos de leasing operacional. A SolarInvest oferece análise gratuita para dimensionar a solução ideal.',
  },
  {
    question: 'Como pagar menos energia sem fazer um grande investimento inicial?',
    answer:
      'O leasing de energia solar permite economizar na conta de luz sem desembolsar o valor total do sistema. Você paga uma mensalidade menor do que sua conta atual e, ao final do contrato, recebe a usina transferida para o seu nome.',
  },
];

export default function EconomiaContaLuzPage() {
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
        name: 'Economia na Conta de Luz',
        item: `${siteUrl}/economia-na-conta-de-luz`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="economia-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="economia-breadcrumb-jsonld"
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
            <span className="text-gray-700">Economia na Conta de Luz</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Como Reduzir a Conta de Luz com Energia Solar
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Se a sua conta de luz está alta, a energia solar pode ser a solução mais inteligente para residências e
            empresas. Entenda como funciona e descubra alternativas com ou sem investimento inicial.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Calcule sua economia agora
            </Link>
          </div>
        </div>
      </section>

      {/* Resposta rápida */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Resposta rápida: vale a pena energia solar?
          </h2>
          <p className="text-gray-700 mb-3">
            Na maioria dos casos, sim. A energia solar reduz o valor da conta de luz de forma imediata e previsível,
            com alternativas que eliminam a necessidade de investimento inicial.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Economia média de 20% a 35% na conta mensal</li>
            <li>Retorno do investimento em 3 a 6 anos na compra direta</li>
            <li>Com leasing, a economia começa logo na primeira fatura após instalação</li>
            <li>Proteção contra aumentos futuros na tarifa de energia</li>
          </ul>
        </div>
      </section>

      {/* O que fazer com conta alta */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            O que fazer quando a conta de luz está muito cara
          </h2>
          <p className="text-gray-700 mb-4">
            Uma conta de energia cara é um problema crescente no Brasil. Tarifas sobem anualmente e o peso desse custo
            representa uma parcela significativa do orçamento de famílias e empresas. Existem caminhos práticos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Instalar energia solar',
                text: 'A solução mais eficaz para redução permanente do custo de energia elétrica.',
              },
              {
                title: 'Adotar o leasing solar',
                text: 'Para quem quer economizar sem investimento inicial: mensalidade menor que a conta atual.',
              },
              {
                title: 'Revisar equipamentos',
                text: 'Aparelhos ineficientes aumentam o consumo. Uma auditoria energética ajuda a identificar desperdícios.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 ring-1 ring-orange-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quanto economiza */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quanto economiza com energia solar</h2>
          <p className="text-gray-700 mb-4">
            A economia depende de fatores como consumo mensal, tarifa da distribuidora e radiação solar na região. No
            Centro-Oeste — incluindo Goiás, Anápolis, Goiânia e Brasília — a irradiação é excelente, o que significa
            mais energia gerada e maior economia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Consumo mensal', value: 'até R$ 600', economia: '20% a 25%' },
              { label: 'Consumo mensal', value: 'R$ 600 a R$ 1.500', economia: '25% a 30%' },
              { label: 'Consumo mensal', value: 'acima de R$ 1.500', economia: '30% a 40%' },
            ].map((item) => (
              <div key={item.value} className="bg-orange-50 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-slate-900 my-1">{item.value}</p>
                <p className="text-orange-600 font-semibold">Economia estimada: {item.economia}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Estimativas baseadas em projetos regionais. O valor exato varia por projeto.
          </p>
        </div>
      </section>

      {/* Alternativas residenciais */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Alternativas para residências</h2>
          <p className="text-gray-700 mb-3">
            Residências com conta de luz acima de R$ 400/mês são excelentes candidatas para a energia solar. As
            principais alternativas são:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>
                <strong>Leasing solar:</strong> mensalidade menor que a conta atual, sem investimento inicial, com
                transferência da usina ao final do contrato.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>
                <strong>Compra direta:</strong> maior investimento inicial, mas propriedade imediata da usina e retorno
                em médio prazo.
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <Link href="/residencial" className="text-orange-600 font-semibold hover:underline text-sm">
              Ver soluções para residências →
            </Link>
          </div>
        </div>
      </section>

      {/* Alternativas empresariais */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Alternativas para empresas</h2>
          <p className="text-gray-700 mb-3">
            Empresas com alta demanda energética conseguem reduzir significativamente o custo fixo com energia solar.
            O impacto é ainda maior em operações industriais, comércio e serviços com funcionamento em horário de pico.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>
                Redução do custo operacional com energia, melhorando margens e competitividade.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>
                Modelos de leasing operacional permitem transformar um custo variável em custo fixo previsível.
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <Link href="/empresas" className="text-orange-600 font-semibold hover:underline text-sm">
              Ver soluções para empresas →
            </Link>
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
              Leasing de energia solar sem investimento inicial
            </Link>
            <Link
              href="/preco-energia-solar"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Quanto custa energia solar
            </Link>
            <Link
              href="/empresas"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Soluções para empresas
            </Link>
            <Link
              href="/residencial"
              className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Soluções para residências
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
