import Link from 'next/link';
import { Download, ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import ClientAreaSearch from '@/components/cliente/ClientAreaSearch';
import ClientFAQ from '@/components/cliente/ClientFAQ';
import { categories, downloads, faqs } from '@/components/cliente/ClientAreaData';
import { Breadcrumbs, JsonLd } from '@/components/cliente/ClientAreaLayout';

export const metadata = buildMetadata({
  title: 'Central do Cliente SolarInvest | Manutenção, Limpeza e Garantias',
  description: 'Área do Cliente SolarInvest com busca, FAQ, guias de limpeza de módulos, manutenção de inversores, garantias, monitoramento e planos de O&M.',
  path: '/area-do-cliente',
  keywords: ['manutenção de energia solar','limpeza de placas solares','garantia de inversor solar','como limpar módulos fotovoltaicos','manutenção preventiva de usina solar'],
});

export default function AreaDoClientePage() {
  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q,a]) => ({ '@type':'Question', name:q, acceptedAnswer:{ '@type':'Answer', text:a } })) };
  return <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white pt-28">
    <JsonLd id="client-faq-jsonld" data={faqJsonLd} />
    <section className="px-6 py-12 md:px-16 lg:px-28"><div className="mx-auto max-w-7xl"><Breadcrumbs items={[{label:'Área do Cliente'}]} />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]"><div><span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Área do Cliente</span><h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">Central do Cliente SolarInvest</h1><p className="mt-5 max-w-2xl text-lg text-slate-700">Tudo o que você precisa para manter seu sistema fotovoltaico operando com máxima eficiência, segurança e economia.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/area-do-cliente/limpeza-modulos" className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600">Manual de Limpeza</Link><Link href="/area-do-cliente/planos" className="rounded-full border border-orange-300 bg-white px-6 py-3 font-bold text-orange-700 hover:bg-orange-50">Planos de O&M</Link></div></div><ClientAreaSearch /></div>
    </div></section>
    <section className="px-6 py-12 md:px-16 lg:px-28"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-black text-slate-950">Categorias principais</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{categories.map((cat)=>{const Icon=cat.icon; return <article key={cat.title} className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Icon className="h-9 w-9 text-orange-500" /><h3 className="mt-5 text-lg font-black text-slate-950">{cat.title}</h3><p className="mt-2 text-sm text-slate-600">{cat.description}</p><Link href={cat.href} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-orange-600">Saiba Mais <ArrowRight className="h-4 w-4" /></Link></article>})}</div></div></section>
    <section id="downloads" className="px-6 py-12 md:px-16 lg:px-28"><div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-8 text-white md:p-10"><h2 className="text-3xl font-black">Documentação e downloads</h2><p className="mt-2 text-slate-300">Biblioteca preparada para anexar PDFs e versões futuras dos materiais técnicos.</p><div className="mt-8 grid gap-4 md:grid-cols-5">{downloads.map((item)=><div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5"><Download className="h-6 w-6 text-orange-300" /><h3 className="mt-3 font-bold">{item}</h3><p className="mt-2 text-sm text-slate-300">PDF em preparação</p></div>)}</div></div></section>
    <section id="faq" className="px-6 py-12 md:px-16 lg:px-28"><div className="mx-auto max-w-4xl"><h2 className="text-3xl font-black text-slate-950">FAQ inteligente</h2><p className="mt-2 text-slate-600">Perguntas frequentes sobre operação, manutenção, garantias e suporte.</p><div className="mt-8"><ClientFAQ /></div></div></section>
  </main>;
}
