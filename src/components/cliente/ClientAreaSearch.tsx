'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { knowledgeItems, quickTags } from './ClientAreaData';

export default function ClientAreaSearch() {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    const filtered = normalized
      ? knowledgeItems.filter((item) => `${item.title} ${item.excerpt} ${item.type}`.toLowerCase().includes(normalized))
      : knowledgeItems.slice(0, 4);
    return filtered.slice(0, 5);
  }, [normalized]);

  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-lg shadow-orange-100/60">
      <label htmlFor="client-search" className="sr-only">Pesquisar na Central do Cliente</label>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-orange-400">
        <Search className="h-5 w-5 text-orange-500" aria-hidden="true" />
        <input id="client-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquise: como limpar placas, garantia, inversor..." className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Atalhos rápidos">
        {quickTags.map((tag) => (
          <button key={tag} type="button" onClick={() => setQuery(tag)} className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700 shadow-sm hover:bg-orange-100">
            {tag}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3" aria-live="polite">
        {results.length ? results.map((item) => (
          <Link key={`${item.type}-${item.title}`} href={item.href} className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">{item.type}</span>
            <h3 className="mt-1 font-bold text-slate-900">✓ {item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.excerpt}</p>
          </Link>
        )) : <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">Nenhum resultado encontrado. Tente “limpeza”, “garantia”, “inversor” ou “manutenção”.</p>}
      </div>
    </div>
  );
}
