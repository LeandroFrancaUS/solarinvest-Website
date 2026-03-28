import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar Residencial | Economia sem Investimento Inicial | SolarInvest',
  description:
    'Soluções de energia solar para residências: leasing sem entrada, mensalidade menor que a conta de luz e economia real. Atendemos Goiás, Anápolis, Goiânia e Brasília.',
  path: '/residencial',
  keywords: [
    'energia solar por assinatura residencial',
    'energia solar sem comprar',
    'diminuir despesas mensais casa',
    'energia solar residencial como funciona',
    'energia solar sem investimento residencial',
    'leasing energia solar residencial',
    'energia solar para casa',
    'como economizar energia em casa',
  ],
});

const faqItems = [
  {
    question: 'Como funciona energia solar por assinatura residencial?',
    answer:
      'Na assinatura ou leasing residencial, a SolarInvest instala o sistema fotovoltaico na sua casa sem custo inicial. Você paga uma mensalidade pelo uso da energia gerada, que é calculada para ser menor do que sua conta de luz atual. Ao final do contrato, a usina é transferida para o seu nome.',
  },
  {
    question: 'Dá para usar energia solar sem comprar o sistema?',
    answer:
      'Sim. Com o modelo de leasing da SolarInvest, você utiliza energia solar sem precisar comprar a usina. A propriedade é do cliente apenas ao final do contrato.',
  },
  {
    question: 'Como diminuir as despesas mensais com energia na minha casa?',
    answer:
      'A maneira mais eficaz é instalar energia solar ou contratar leasing solar. A SolarInvest analisa seu perfil de consumo e apresenta a solução com maior economia para o seu caso, com ou sem investimento inicial.',
  },
  {
    question: 'Energia solar funciona sem luz (durante apagão)?',
    answer:
      'Sistemas fotovoltaicos convencionais (sem bateria) são desligados por segurança durante quedas de energia da distribuidora. Sistemas com bateria ou backup permitem continuar funcionando mesmo sem a rede elétrica.',
  },
  {
    question: 'Energia solar precisa de bateria?',
    answer:
      'Não necessariamente. A maioria dos sistemas residenciais é conectada à rede elétrica (on-grid) e não usa bateria. A energia excedente gerada é injetada na rede e vira créditos. Baterias são usadas em sistemas off-grid ou híbridos para maior autonomia.',
  },
];

export default function ResidencialPage() {
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
    name: 'Energia Solar Residencial',
    description:
      'Leasing e instalação de energia solar para residências: sem investimento inicial, mensalidade menor que a conta, suporte e manutenção inclusos.',
    provider: { '@type': 'Organization', name: siteName, url: siteUrl, logo: logoUrl },
    areaServed: 'Brasil',
    serviceType: 'Energia solar fotovoltaica residencial',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Residencial', item: `${siteUrl}/residencial` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="residencial-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="residencial-service-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="residencial-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Residencial</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar Residencial
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Reduza a conta de luz da sua casa com energia solar. A SolarInvest oferece leasing sem entrada, com
            mensalidade menor do que sua conta atual, suporte e manutenção inclusos e a usina transferida ao final.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite análise gratuita para sua casa
            </Link>
          </div>
        </div>
      </section>

      {/* Resposta rápida */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Resposta rápida: como pagar menos energia sem um grande investimento inicial?
          </h2>
          <p className="text-gray-700 mb-4">
            Com o leasing residencial da SolarInvest, você instala energia solar na sua casa sem precisar pagar o
            valor total do sistema. A mensalidade é calculada para ser menor do que sua conta de luz atual — e ao
            final do contrato, a usina já pertence a você.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Sem entrada, sem financiamento bancário, sem juros</li>
            <li>Manutenção e suporte inclusos durante todo o contrato</li>
            <li>Economia imediata na primeira fatura após homologação</li>
            <li>Propriedade da usina garantida ao final do prazo</li>
          </ul>
        </div>
      </section>

      {/* Para quem faz sentido */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Para quem a solução residencial faz sentido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '⚡', text: 'Conta de luz acima de R$ 300/mês' },
              { icon: '💰', text: 'Não quer fazer grande investimento inicial' },
              { icon: '📋', text: 'Quer previsibilidade no custo mensal de energia' },
              { icon: '🔧', text: 'Prefere ter suporte e manutenção inclusos' },
              { icon: '🏠', text: 'Proprietário de imóvel com telhado adequado' },
              { icon: '🌿', text: 'Busca mais independência energética' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-white rounded-xl p-4 ring-1 ring-orange-100 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-700 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Como funciona a energia solar residencial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { step: '1', title: 'Análise gratuita', text: 'Avaliamos sua conta de luz e o seu imóvel para dimensionar o sistema ideal.' },
              { step: '2', title: 'Instalação completa', text: 'Instalamos os painéis, o inversor e toda a infraestrutura sem custo inicial.' },
              { step: '3', title: 'Homologação e ativação', text: 'Aprovamos o sistema junto à distribuidora e ativamos a geração de energia.' },
              { step: '4', title: 'Economia todo mês', text: 'A partir da próxima fatura, você já sente a redução na conta de luz.' },
            ].map((item) => (
              <div key={item.step} className="bg-orange-50 rounded-2xl p-6 ring-1 ring-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm">{item.step}</span>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/comofunciona" className="text-orange-600 font-semibold hover:underline text-sm">
              Ver como funciona energia solar em detalhes →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Perguntas frequentes sobre energia solar residencial</h2>
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
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing de energia solar</Link>
            <Link href="/economia-na-conta-de-luz" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Economia na conta de luz</Link>
            <Link href="/preco-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Quanto custa energia solar</Link>
            <Link href="/energia-solar-goias" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar em Goiás</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
