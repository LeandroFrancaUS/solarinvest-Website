import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight, LifeBuoy } from 'lucide-react';
import { seoConstants } from '@/lib/seo';

export function Breadcrumbs({ items, compact = false }: { items: { label: string; href?: string }[]; compact?: boolean }) {
  return (
    <nav className={`${compact ? 'mb-4' : 'mb-5'} flex flex-wrap items-center gap-2 text-sm text-slate-500`} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-orange-600">Início</Link>
      <ChevronRight className="h-4 w-4" />
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-orange-600">{item.label}</Link>
          ) : (
            <span className="font-semibold text-slate-800">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </span>
      ))}
    </nav>
  );
}

export const clientAreaContainerClass = 'mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8';

export function PageShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white pt-12">
      <section className="pb-12">
        <div className={clientAreaContainerClass}>
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-amber-50 p-6 text-slate-900 shadow-xl shadow-orange-100/60 md:p-8">
            <div className="w-full">
              <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">
                Central do Cliente SolarInvest
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-[860px] text-lg leading-relaxed text-slate-700">
                {description}
              </p>
            </div>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

export function SupportCta({ label = 'Solicitar Inspeção Técnica' }: { label?: string }) {
  return (
    <Link href="/area-do-cliente/suporte" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600">
      <LifeBuoy className="h-5 w-5" />
      {label}
    </Link>
  );
}

export function JsonLd({ data, id }: { data: object; id: string }) {
  return <Script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const siteUrl = seoConstants.siteUrl;
