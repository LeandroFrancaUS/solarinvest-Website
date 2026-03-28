import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Script from 'next/script';
import { seoConstants } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Limpeza de Placas Solares | Como Limpar Painéis Fotovoltaicos | SolarInvest',
  description:
    'Saiba como fazer a limpeza de placas solares corretamente, com que frequência lavar, quais produtos usar e como a sujeira afeta a geração de energia. Dicas e suporte da SolarInvest.',
  path: '/limpeza-de-placas-solares',
  keywords: [
    'limpeza de placas solares',
    'limpeza de placa solar',
    'limpeza de painéis solares',
    'limpeza painel solar',
    'limpeza placa solar',
    'como limpar painel solar',
    'como limpar placas solares',
    'como limpar as placas solares',
    'lavagem placa solar',
    'lavagem de placa solar',
    'como lavar placas solares',
    'como lavar as placas solares',
    'como lavar placas de energia solar',
    'como limpar placas solares com lava jatos',
    'lavar placa solar da choque',
    'placa solar suja',
    'produtos para lavar placa solar',
    'produto para lavar placas solares',
    'produtos para limpeza de placa solar',
    'produtos para limpeza de placas solares',
    'produtos para limpar placa solar',
    'limpeza de placas fotovoltaicas',
    'módulos fotovoltaicos',
  ],
});

const faqItems = [
  {
    question: 'Com que frequência devo fazer a limpeza das placas solares?',
    answer:
      'Em regiões com pouca chuva ou muito pó — como o Centro-Oeste brasileiro — recomenda-se limpeza a cada 3 a 6 meses. Em regiões com chuvas frequentes, a própria chuva já faz boa parte da limpeza e o intervalo pode ser maior. O monitoramento do desempenho ajuda a identificar quando a limpeza está necessária.',
  },
  {
    question: 'Qual produto usar para lavar placas solares?',
    answer:
      'Use apenas água limpa e, se necessário, detergente neutro diluído. Evite produtos abrasivos, solventes, álcool concentrado ou produtos com amônia. Esses produtos podem danificar o vidro e a camada antirreflexo dos módulos fotovoltaicos.',
  },
  {
    question: 'Posso usar lava-jato para limpar placas solares?',
    answer:
      'Não é recomendado. Jatos de alta pressão podem penetrar nas bordas dos módulos, causar microfissuras nas células e anular a garantia do fabricante. Use mangueira com pressão moderada ou balde com esponja macia.',
  },
  {
    question: 'Placa solar suja perde geração?',
    answer:
      'Sim. Sujeira, poeira, folhas e dejetos de pássaros reduzem a geração de energia. A perda pode variar de 5% a 25% dependendo do grau de sujidade. A limpeza regular mantém o desempenho do sistema próximo ao projetado.',
  },
  {
    question: 'Dá choque ao lavar placa solar?',
    answer:
      'Os módulos fotovoltaicos geram tensão sempre que há luz. Para segurança, recomenda-se fazer a limpeza no início da manhã ou no final da tarde, quando a irradiação é menor. Nunca molhe os conectores elétricos ou a caixa de junção. Prefira contratar um profissional habilitado.',
  },
  {
    question: 'A SolarInvest oferece serviço de limpeza de painéis solares?',
    answer:
      'Sim. No modelo de leasing, a manutenção preventiva — incluindo limpeza periódica — está inclusa no contrato. Para clientes com sistemas próprios, oferecemos planos de manutenção com visitas técnicas programadas.',
  },
];

export default function LimpezaPlacasSolaresPage() {
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

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como fazer a limpeza de placas solares corretamente',
    description: 'Passo a passo para limpar painéis fotovoltaicos de forma segura e eficiente.',
    image: logoUrl,
    totalTime: 'PT1H',
    tool: [
      { '@type': 'HowToTool', name: 'Balde com água limpa' },
      { '@type': 'HowToTool', name: 'Detergente neutro diluído' },
      { '@type': 'HowToTool', name: 'Esponja macia ou rodo com borracha' },
      { '@type': 'HowToTool', name: 'Mangueira com pressão moderada' },
    ],
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Escolha o horário', text: 'Realize a limpeza de manhã cedo ou ao final da tarde, evitando o horário de pico solar.' },
      { '@type': 'HowToStep', position: 2, name: 'Remova sujeira solta', text: 'Use água para umedecer e remover poeira superficial antes de esfregar.' },
      { '@type': 'HowToStep', position: 3, name: 'Aplique detergente neutro', text: 'Dilua detergente neutro em água e aplique com esponja macia em movimentos suaves.' },
      { '@type': 'HowToStep', position: 4, name: 'Enxágue', text: 'Enxágue bem com água limpa, removendo todo o resíduo de detergente.' },
      { '@type': 'HowToStep', position: 5, name: 'Deixe secar', text: 'Deixe secar naturalmente. Não use pano que possa arranhar o vidro.' },
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Limpeza de Placas Solares',
        item: `${siteUrl}/limpeza-de-placas-solares`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <Script id="limpeza-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="limpeza-howto-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <Script id="limpeza-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Limpeza de Placas Solares</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 leading-tight mb-4">
            Limpeza de Placas Solares
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Placas solares sujas geram menos energia. Saiba com que frequência limpar, quais produtos usar, como fazer
            com segurança e quando contratar um serviço profissional de limpeza de painéis fotovoltaicos.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-block bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-orange-500 transition-colors"
            >
              Solicitar limpeza ou manutenção
            </Link>
          </div>
        </div>
      </section>

      {/* Resposta rápida */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Resposta rápida: placa solar suja perde geração?
          </h2>
          <p className="text-gray-700 mb-3">
            Sim. A sujeira reduz a incidência de luz sobre as células fotovoltaicas, diminuindo a geração de energia.
            A perda pode variar entre <strong>5% e 25%</strong> dependendo do tipo e grau de sujidade — poeira, folhas,
            fezes de pássaros e fuligem são os principais vilões.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Regiões áridas e com pouca chuva: limpeza a cada 3 meses</li>
            <li>Regiões com chuvas regulares: limpeza semestral geralmente suficiente</li>
            <li>Monitoramento em tempo real ajuda a detectar queda de desempenho</li>
          </ul>
        </div>
      </section>

      {/* Como limpar */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Como limpar painéis solares corretamente: passo a passo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                step: '1',
                title: 'Escolha o horário correto',
                text: 'Limpe de manhã cedo ou ao final da tarde. Painéis quentes em pleno sol podem rachar com água fria.',
              },
              {
                step: '2',
                title: 'Remova sujeira solta',
                text: 'Umedeça os painéis com água para amolecer a poeira antes de esfregar.',
              },
              {
                step: '3',
                title: 'Use detergente neutro diluído',
                text: 'Aplique com esponja macia. Nunca use produtos abrasivos, esponjas de aço ou solventes.',
              },
              {
                step: '4',
                title: 'Enxágue bem e deixe secar',
                text: 'Remova todo o resíduo de detergente. Deixe secar naturalmente — não use pano que possa arranhar.',
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

      {/* Produtos permitidos e proibidos */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            O que usar (e o que evitar) na limpeza de placas solares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 ring-1 ring-green-200">
              <h3 className="font-semibold text-green-800 mb-3">✓ Pode usar</h3>
              <ul className="space-y-2 text-green-900 text-sm">
                {[
                  'Água limpa (mangueira com pressão moderada)',
                  'Detergente neutro diluído em água',
                  'Esponja macia ou rodo com borracha macia',
                  'Pano de microfibra úmido (sem pressão)',
                ].map((item) => <li key={item} className="flex gap-2"><span>•</span><span>{item}</span></li>)}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-6 ring-1 ring-red-200">
              <h3 className="font-semibold text-red-800 mb-3">✗ Evite</h3>
              <ul className="space-y-2 text-red-900 text-sm">
                {[
                  'Lava-jato ou alta pressão de água',
                  'Produtos abrasivos, esponja de aço',
                  'Álcool concentrado ou solventes',
                  'Produtos com amônia ou cloro',
                  'Limpeza no horário de pico solar (10h–15h)',
                ].map((item) => <li key={item} className="flex gap-2"><span>•</span><span>{item}</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Segurança: dá choque ao lavar placa solar?
          </h2>
          <p className="text-gray-700 mb-4">
            Os módulos fotovoltaicos geram tensão elétrica sempre que há luz solar, inclusive em dias nublados. Por
            isso, a limpeza requer cuidados básicos de segurança:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Nunca molhe os conectores elétricos, caixas de junção ou cabos expostos.</span></li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Faça a limpeza no início da manhã ou ao entardecer, com menor irradiação.</span></li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Para telhados acima de 2 metros, use equipamentos de segurança (EPI) ou contrate profissional habilitado.</span></li>
            <li className="flex gap-2"><span className="text-orange-600 font-bold">•</span><span>Em caso de dúvida, acione o suporte técnico da SolarInvest.</span></li>
          </ul>
        </div>
      </section>

      {/* Manutenção inclusa no leasing */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Com o leasing SolarInvest, limpeza e manutenção estão inclusos
          </h2>
          <p className="text-gray-700 mb-4">
            Clientes do modelo de leasing operacional da SolarInvest não precisam se preocupar com limpeza ou
            manutenção: tudo está incluso no contrato. Nossa equipe realiza visitas técnicas periódicas, monitora o
            desempenho do sistema e realiza manutenção preventiva e corretiva.
          </p>
          <Link
            href="/leasing-energia-solar"
            className="inline-block text-orange-600 font-semibold hover:underline text-sm"
          >
            Saiba mais sobre o leasing solar com manutenção inclusa →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6 md:px-16 lg:px-28 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas frequentes sobre limpeza de placas solares
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

      {/* Internal links */}
      <section className="py-10 px-6 md:px-16 lg:px-28 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Saiba mais</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/leasing-energia-solar" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Leasing com manutenção inclusa</Link>
            <Link href="/comofunciona" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Como funciona energia solar</Link>
            <Link href="/residencial" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Energia solar residencial</Link>
            <Link href="/faq" className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors">Perguntas frequentes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
