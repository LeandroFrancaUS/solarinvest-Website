'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { seoConstants } from '@/lib/seo';
import PreApprovalForm, { StatusResultado, statusVisuals } from './PreApprovalForm';

const pageUrl = `${seoConstants.siteUrl}/analise`;

const faqItems = [
  {
    question: 'Como receberei o retorno da pré-análise?',
    answer:
      'Após enviar o formulário, você recebe a resposta priorizada pelo WhatsApp informado, incluindo orientações sobre documentos complementares.',
  },
  {
    question: 'Posso encaminhar o link da análise em anúncios ou mensagens?',
    answer: 'Sim. Use o link solarinvest.info/analise com parâmetros UTM para acompanhar suas campanhas.',
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
  description: 'Landing page com formulário de pré-análise de leasing solar e retorno por WhatsApp.',
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

export default function AnalisePageClient() {
  const searchParams = useSearchParams();

  // abrir=true (default), abrir=false fecha, abrir=qualquer outra coisa => default true
  const abrirParam = searchParams?.get('abrir');
  const shouldAutoOpen = abrirParam === null ? true : abrirParam === 'true';

  const utmParams = useMemo(
    () => ({
      utm_source: searchParams?.get('utm_source') ?? null,
      utm_medium: searchParams?.get('utm_medium') ?? null,
      utm_campaign: searchParams?.get('utm_campaign') ?? null,
      utm_content: searchParams?.get('utm_content') ?? null,
    }),
    [searchParams]
  );

  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(shouldAutoOpen);
  const [resultado, setResultado] = useState<{ status: StatusResultado; message: string } | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isExternalReferrer, setIsExternalReferrer] = useState<boolean | null>(null);

  useEffect(() => {
    const referrer = document.referrer;
    const normalizedSiteUrl = seoConstants.siteUrl.replace(/\/$/, '');
    if (!referrer) {
      setIsExternalReferrer(true);
      return;
    }

    setIsExternalReferrer(!referrer.startsWith(normalizedSiteUrl));
  }, []);

  useEffect(() => {
    if (shouldAutoOpen && !hasAutoOpened) {
      setHasAutoOpened(true);
      setMostrarFormulario(true);
    }
  }, [shouldAutoOpen, hasAutoOpened]);

  useEffect(() => {
    // ✅ só scrolla quando o formulário estiver visível
    if (!mostrarFormulario || isExternalReferrer === null) return;

    // ✅ se veio de fora, abra direto no módulo do formulário; se navegado internamente, respeite topo
    if (isExternalReferrer) {
      const anchor = document.getElementById('pre-aprovacao');
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isExternalReferrer, mostrarFormulario]);

  useEffect(() => {
    if (!resultado) return;
    const anchor = document.getElementById('resultado-analise');
    anchor?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white py-16 px-4 md:px-10 space-y-14">
      <Script id="analise-breadcrumb-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbStructuredData)}
      </Script>
      <Script id="analise-webpage-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(webPageStructuredData)}
      </Script>
      <Script id="analise-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqStructuredData)}
      </Script>

      <section className="max-w-6xl mx-auto text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-heading font-bold text-orange-700"
        >
          Análise de aprovação para Leasing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700 max-w-4xl mx-auto"
        >
          Confirme seus dados para avaliarmos rapidamente a elegibilidade do leasing SolarInvest.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 text-left mt-6">
          {[
            {
              title: 'Retorno guiado por especialistas',
              desc: 'Priorizamos seu contato no WhatsApp e indicamos exatamente os próximos documentos.',
              icon: '🎯',
            },
            {
              title: 'Triagem inteligente',
              desc: 'Usamos IA para validar informações e acelerar a aprovação sem burocracia.',
              icon: '⚡',
            },
            {
              title: 'Segurança de dados',
              desc: 'Dados criptografados e usados apenas para a pré-análise do seu projeto solar.',
              icon: '🛡️',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white/60 backdrop-blur-sm p-4 shadow-sm"
            >
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {mostrarFormulario && (
        // ✅ Deixe o ID AQUI (no wrapper) e REMOVA do PreApprovalForm, se ele ainda tiver
        <section className="max-w-7xl mx-auto" id="pre-aprovacao">
          <PreApprovalForm onSubmitted={handleSubmitted} utmParams={utmParams} />
        </section>
      )}

      {resultado && (
        <section id="resultado-analise" className="max-w-3xl mx-auto text-center space-y-4">
          <div
            className={`rounded-2xl border p-6 shadow-lg ${
              statusVisuals[resultado.status].styles
            } animate-[pulse_1.2s_ease-in-out_1]`}
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
    </main>
  );
}
