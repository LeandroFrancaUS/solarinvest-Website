import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Energia Solar em Anápolis | SolarInvest',
  description:
    'Conheça a SolarInvest em Anápolis: soluções em energia solar para quem quer economizar, reduzir custos e avaliar opções com ou sem investimento inicial.',
  path: '/energia-solar-anapolis',
  keywords: [
    'energia solar anapolis',
    'empresa energia solar anapolis',
    'instalação energia solar anapolis',
    'energia solar sem investimento anapolis',
    'energia solar goias',
  ],
});

const faqItems = [
  {
    question: 'A SolarInvest atende Anápolis?',
    answer:
      'Sim. A SolarInvest tem equipe técnica que atende Anápolis e região com instalação, homologação, manutenção e suporte completo para residências e empresas.',
  },
  {
    question: 'Energia solar compensa em Anápolis?',
    answer:
      'Sim. Anápolis está localizada em Goiás, que possui excelente irradiação solar. Isso significa maior geração de energia e melhor retorno sobre o investimento, seja em compra direta ou leasing.',
  },
  {
    question: 'Existe leasing de energia solar em Anápolis?',
    answer:
      'Sim. A SolarInvest oferece leasing operacional em Anápolis: o sistema é instalado sem custo inicial e você paga uma mensalidade menor do que sua conta de luz atual.',
  },
];

export default function EnergiaAnapolisPage() {
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
    areaServed: [{ '@type': 'City', name: 'Anápolis' }, { '@type': 'State', name: 'Goiás' }],
    description: 'Empresa de energia solar em Anápolis com leasing, instalação, manutenção e suporte.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Energia Solar em Goiás', item: `${siteUrl}/energia-solar-goias` },
      { '@type': 'ListItem', position: 3, name: 'Energia Solar em Anápolis', item: `${siteUrl}/energia-solar-anapolis` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="anapolis-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="anapolis-localbiz-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Script id="anapolis-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/energia-solar-goias" className="hover:text-orange-600">Goiás</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Anápolis</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Energia Solar em Anápolis
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            A SolarInvest atende Anápolis com soluções completas de energia solar para residências e empresas.
            Reduza sua conta de luz com instalação profissional, suporte técnico e opções de leasing sem entrada.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicite atendimento em Anápolis
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Por que contratar energia solar em Anápolis
          </h2>
          <p className="text-gray-700 mb-4">
            Anápolis possui ótima irradiação solar por estar no Centro-Oeste brasileiro. Residências e empresas se
            beneficiam de sistemas eficientes com geração alta durante todo o ano. A SolarInvest oferece análise
            gratuita, instalação completa e suporte continuado.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Residências', text: 'Reduza sua conta doméstica com leasing solar ou compra direta, com suporte técnico local.' },
              { title: 'Empresas', text: 'Transforme o alto custo de energia em previsibilidade mensal com modelos de leasing operacional.' },
              { title: 'Instalação completa', text: 'Projeto, aprovação, instalação e homologação junto à distribuidora, sem burocracia.' },
              { title: 'Suporte e manutenção', text: 'Equipe técnica em Anápolis para manutenção preventiva e corretiva durante todo o contrato.' },
            ].map((item) => (
              <div key={item.title} className="bg-orange-50 rounded-xl p-5 ring-1 ring-orange-100">
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
            Perguntas frequentes sobre energia solar em Anápolis
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
          <h2 className="text-2xl font-bold mb-3">Economize em Anápolis com energia solar</h2>
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
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing de energia solar</Link>
            <Link href="/faq" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Perguntas frequentes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
