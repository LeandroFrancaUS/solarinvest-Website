import Link from 'next/link';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import ClientAreaSearch from '@/components/cliente/ClientAreaSearch';
import ClientFAQ from '@/components/cliente/ClientFAQ';
import { categories, downloads, faqs } from '@/components/cliente/ClientAreaData';
import { JsonLd, clientAreaContainerClass } from '@/components/cliente/ClientAreaLayout';

export const metadata = buildMetadata({
  title: 'Central do Cliente SolarInvest | Manutenção, Limpeza e Garantias',
  description:
    'Área do Cliente SolarInvest com busca, FAQ, guias de limpeza de módulos, manutenção de inversores, garantias, monitoramento e planos de O&M.',
  path: '/area-do-cliente',
  keywords: [
    'manutenção de energia solar',
    'limpeza de placas solares',
    'garantia de inversor solar',
    'como limpar módulos fotovoltaicos',
    'manutenção preventiva de usina solar',
  ],
});

export default function AreaDoClientePage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white pt-12">
      <JsonLd id="client-faq-jsonld" data={faqJsonLd} />

      <section className="pb-8">
        <div className={clientAreaContainerClass}>
          <div className="grid gap-8 rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-xl shadow-orange-100/60 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="py-2">
              <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
                Área do Cliente
              </span>
              <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Central do Cliente SolarInvest
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">
                Tudo o que você precisa para manter seu sistema fotovoltaico operando com máxima eficiência, segurança e economia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/area-do-cliente/limpeza-modulos" className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600">
                  Manual de Limpeza
                </Link>
                <Link href="/area-do-cliente/planos" className="rounded-full border border-orange-300 bg-white px-6 py-3 font-bold text-orange-700 hover:bg-orange-50">
                  Planos de O&M
                </Link>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {['Busca rápida', 'Guias práticos', 'Suporte técnico'].map((item) => (
                  <div key={item} className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <ClientAreaSearch />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className={clientAreaContainerClass}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Navegação rápida</span>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Categorias principais</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Cards compactos para encontrar qualquer orientação em poucos cliques, sem excesso de rolagem.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <article key={cat.title} className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
                  <Icon className="h-8 w-8 text-orange-500" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-black text-slate-900">{cat.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{cat.description}</p>
                  <Link href={cat.href} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-600">
                    Saiba Mais <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="downloads" className="py-8">
        <div className={clientAreaContainerClass}>
          <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-white p-6 shadow-lg shadow-orange-100/50 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Biblioteca</span>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Documentação e downloads</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-600">Estrutura preparada para anexar PDFs e versões futuras dos materiais técnicos.</p>
          </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {downloads.map((item) => (
                <div key={item} className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
                  <Download className="h-6 w-6 text-orange-500" aria-hidden="true" />
                  <h3 className="mt-3 font-bold text-slate-900">{item}</h3>
                  <p className="mt-2 text-sm text-slate-600">PDF em preparação</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="pb-14 pt-8">
        <div className={`${clientAreaContainerClass} grid gap-8 lg:grid-cols-[320px_1fr]`}>
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 lg:h-fit">
            <FileText className="h-8 w-8 text-orange-500" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black text-slate-900">FAQ inteligente</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Perguntas frequentes sobre operação, manutenção, garantias e suporte, organizadas para consulta rápida.
            </p>
          </div>
          <ClientFAQ />
        </div>
      </section>
    </main>
  );
}
