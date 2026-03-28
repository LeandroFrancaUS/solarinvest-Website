import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar em Goiânia | Preço e Soluções | SolarInvest',
  description:
    'Veja soluções de energia solar em Goiânia, preços, alternativas sem entrada e opções para reduzir a conta de luz com suporte técnico e atendimento especializado.',
  path: '/energia-solar-goiania',
  keywords: [
    'energia solar goiania',
    'energia solar goiania preço',
    'empresa energia solar goiania',
    'instalação energia solar goiania',
    'leasing energia solar goiania',
    'energia solar sem investimento goiania',
  ],
});

const faqItems = [
  {
    question: 'Quanto custa energia solar em Goiânia?',
    answer:
      'O preço de um sistema fotovoltaico em Goiânia varia conforme o consumo. Para residências com conta entre R$ 400 e R$ 800/mês, o valor costuma ficar entre R$ 20.000 e R$ 40.000 na compra direta. Com leasing, não há custo inicial.',
  },
  {
    question: 'A SolarInvest atende Goiânia?',
    answer:
      'Sim. Goiânia é uma das principais cidades atendidas pela SolarInvest, com equipe técnica local para instalação, homologação, manutenção e suporte.',
  },
  {
    question: 'Existe energia solar sem investimento inicial em Goiânia?',
    answer:
      'Sim. Com o leasing operacional da SolarInvest, você pode ter energia solar em Goiânia sem precisar desembolsar o valor total do sistema. A mensalidade é calculada para ser menor do que sua conta de luz atual.',
  },
];

export default function EnergiaGoianiaPage() {
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
    areaServed: [{ '@type': 'City', name: 'Goiânia' }, { '@type': 'State', name: 'Goiás' }],
    description: 'Empresa de energia solar em Goiânia com leasing, instalação, manutenção e suporte.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Energia Solar em Goiás', item: `${siteUrl}/energia-solar-goias` },
      { '@type': 'ListItem', position: 3, name: 'Energia Solar em Goiânia', item: `${siteUrl}/energia-solar-goiania` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="goiania-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="goiania-localbiz-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Script id="goiania-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/energia-solar-goias" className="hover:text-orange-600">Goiás</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Goiânia</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar em Goiânia
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Soluções completas de energia solar em Goiânia para residências e empresas. Com leasing sem entrada ou
            compra direta, a SolarInvest entrega economia real na conta de luz e suporte técnico especializado.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite atendimento em Goiânia
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Energia solar em Goiânia: preço e alternativas</h2>
          <p className="text-gray-700 mb-4">
            Goiânia é a maior cidade de Goiás e uma das com melhor potencial solar do Brasil. A irradiação elevada
            garante sistemas menores e mais eficientes para o mesmo nível de economia. Veja as principais opções:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Leasing solar em Goiânia',
                text: 'Mensalidade menor que a conta de luz. Sem entrada, sem juros, com manutenção inclusa e transferência da usina ao final do contrato.',
              },
              {
                title: 'Compra direta em Goiânia',
                text: 'Investimento com retorno em 3 a 5 anos. Propriedade imediata da usina e economia total da geração após o payback.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-orange-50 rounded-xl p-6 ring-1 ring-orange-100">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas frequentes sobre energia solar em Goiânia
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
          <h2 className="text-2xl font-bold mb-3">Economize em Goiânia com energia solar</h2>
          <p className="text-orange-100 mb-6">Solicite uma análise gratuita e descubra o preço ideal para o seu perfil.</p>
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
            <Link href="/energia-solar-anapolis" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar em Anápolis</Link>
            <Link href="/preco-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Preço de energia solar</Link>
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing de energia solar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
