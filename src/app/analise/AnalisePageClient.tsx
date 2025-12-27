'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { seoConstants } from '@/lib/seo';
import PreApprovalForm, { StatusResultado, statusVisuals } from './PreApprovalForm';

const pageUrl = `${seoConstants.siteUrl}/analise`;

const faqItems = [
  {
    question: 'Essa página já está pronta para campanhas no Google e Meta Ads?',
    answer:
      'Sim. A landing page possui metadados, carregamento rápido e copy direta para campanhas de pesquisa e performance em Facebook/Instagram Ads.',
  },
  {
    question: 'Como receberei o retorno da pré-análise?',
    answer:
      'Após enviar o formulário, você recebe a resposta priorizada pelo WhatsApp informado, incluindo orientações sobre documentos complementares.',
  },
  {
    question: 'Posso encaminhar o link da análise em anúncios ou mensagens?',
    answer:
      'Sim. Use o link solarinvest.info/analise com parâmetros UTM para acompanhar suas campanhas e manter a página rastreável pelo Google Search.',
  },
];

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: seoConstants.siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Pré-análise de leasing',
      item: pageUrl,
    },
  ],
};

const webPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Análise de pré-aprovação para leasing solar',
  url: pageUrl,
  inLanguage: 'pt-BR',
  description:
    'Landing page otimizada para campanhas de Google Search e Meta Ads com formulário de pré-análise de leasing solar e retorno por WhatsApp.',
  isPartOf: {
    '@type': 'WebSite',
    url: seoConstants.siteUrl,
    name: 'SolarInvest Solutions',
  },
  potentialAction: {
    '@type': 'CommunicateAction',
    target: seoConstants.socialProfiles.whatsapp,
    name: 'Falar com especialista no WhatsApp',
  },
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const campaignHighlights = [
  {
    title: 'Indexação e rastreabilidade',
    description:
      'URL única, com metadados completos e carregamento rápido para favorecer o ranqueamento orgânico e a qualidade dos anúncios.',
  },
  {
    title: 'Pronta para Google & Meta Ads',
    description:
      'Copy direta para performance, link curto fácil de usar em anúncios e aderência a políticas de destino seguro.',
  },
  {
    title: 'Engajamento multicanal',
    description:
      'Formulário com retorno via WhatsApp, convite para seguir no Instagram e CTA permanente para novas análises.',
  },
];

export default function AnalisePageClient() {
  const searchParams = useSearchParams();
  const shouldAutoOpen = searchParams?.get('abrir') === 'true';
  const [mostrarFormulario, setMostrarFormulario] = useState(shouldAutoOpen);
  const [resultado, setResultado] = useState<{ status: StatusResultado; message: string } | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    if (shouldAutoOpen && !hasAutoOpened) {
      setHasAutoOpened(true);
      setMostrarFormulario(true);
    }

    if (mostrarFormulario) {
      const anchor = document.getElementById('pre-aprovacao');
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mostrarFormulario, shouldAutoOpen, hasAutoOpened]);

  useEffect(() => {
    if (resultado) {
      const anchor = document.getElementById('resultado-analise');
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [resultado]);

  const iniciarAnalise = () => {
    setResultado(null);
    setMostrarFormulario(true);
    setHasAutoOpened(true);
  };

  const handleSubmitted = (res: { status: StatusResultado; message: string }) => {
    setResultado(res);
    setMostrarFormulario(false);
  };

  return (
    <main className="min-h-screen bg-white py-16 px-4 md:px-8 space-y-12">
      <Script id="analise-breadcrumb-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbStructuredData)}
      </Script>
      <Script id="analise-webpage-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(webPageStructuredData)}
      </Script>
      <Script id="analise-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqStructuredData)}
      </Script>

      <section className="max-w-5xl mx-auto text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-bold text-orange-600"
        >
          Análise de aprovação para Leasing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700 max-w-3xl mx-auto"
        >
          Confirme seus dados para avaliarmos rapidamente a elegibilidade do leasing SolarInvest. A página é otimizada para
          Google Search, campanhas Meta Ads e retorno direto pelo WhatsApp.
        </motion.p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-center">
          {!resultado && (
            <button
              type="button"
              onClick={iniciarAnalise}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-6 py-3 shadow-md hover:bg-orange-700 transition"
            >
              Iniciar pré-análise
            </button>
          )}

          <a
            className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-5 py-3 font-semibold text-orange-700 shadow-sm hover:bg-orange-100 transition"
            href={`${seoConstants.socialProfiles.whatsapp}&utm_source=analise&utm_medium=cta&utm_campaign=whatsapp-leads`}
            target="_blank"
            rel="noreferrer"
          >
            Falar com especialista
          </a>

          <a
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-800 shadow-sm hover:border-orange-200 hover:text-orange-700 transition"
            href={`${seoConstants.socialProfiles.instagram}?utm_source=analise&utm_medium=cta&utm_campaign=instagram-follow`}
            target="_blank"
            rel="noreferrer"
          >
            Seguir no Instagram
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {campaignHighlights.map((item) => (
          <div key={item.title} className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-orange-700">{item.title}</h2>
            <p className="mt-2 text-gray-700 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </section>

      {mostrarFormulario && (
        <section className="max-w-7xl mx-auto" id="pre-aprovacao">
          <PreApprovalForm onSubmitted={handleSubmitted} />
        </section>
      )}

      {resultado && (
        <section id="resultado-analise" className="max-w-3xl mx-auto text-center space-y-4">
          <div
            className={`rounded-2xl border p-6 shadow-lg ${statusVisuals[resultado.status].styles} animate-[pulse_1.2s_ease-in-out_1]`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`text-3xl ${statusVisuals[resultado.status].accent}`} aria-hidden>
                {statusVisuals[resultado.status].icon}
              </div>
              <div>
                <p
                  className={`text-base md:text-xl font-extrabold uppercase tracking-wide ${
                    statusVisuals[resultado.status].accent
                  }`}
                >
                  {statusVisuals[resultado.status].title}
                </p>
                <p className="whitespace-pre-line mt-2 leading-relaxed text-gray-800">{resultado.message}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={iniciarAnalise}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white font-semibold px-5 py-3 shadow-md hover:bg-orange-700 transition"
            >
              Iniciar nova pré-análise
            </button>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto space-y-4 rounded-3xl bg-gray-50 p-6 md:p-8 shadow-inner">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-heading font-semibold text-gray-900">Perguntas rápidas sobre a divulgação</h2>
          <p className="text-gray-700">Use este material para campanhas e para gerar seguidores qualificados.</p>
        </div>
        <div className="space-y-3">
          {faqItems.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-200"
            >
              <summary className="flex cursor-pointer items-center justify-between text-left font-semibold text-gray-900">
                {faq.question}
                <span className="text-orange-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-gray-700 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-orange-200 bg-white p-4 text-center">
          <p className="text-gray-800">
            Inclua parâmetros UTM no link <strong>solarinvest.info/analise</strong> ao anunciar. Assim você mede conversões e
            mantém a página elegível para Google Search e Facebook/Instagram Ads.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-white font-semibold shadow-md hover:bg-orange-700 transition"
              href={`${seoConstants.socialProfiles.whatsapp}&utm_source=analise&utm_medium=faq_cta&utm_campaign=whatsapp-leads`}
              target="_blank"
              rel="noreferrer"
            >
              Enviar link com UTM pelo WhatsApp
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-800 shadow-sm hover:border-orange-200 hover:text-orange-700 transition"
              href={`${seoConstants.socialProfiles.instagram}?utm_source=analise&utm_medium=faq_cta&utm_campaign=instagram-follow`}
              target="_blank"
              rel="noreferrer"
            >
              Convidar para seguir no Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
