'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { sdrChecklist, sdrManual, quickQualificationCriteria, type SDRManualItem } from '@/content/sdrManual';

export function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

type SearchRecord = SDRManualItem & { category: string; haystack: string; normalizedQuestion: string; normalizedTags: string; normalizedAnswer: string };

const priorityLabel = { qualified: 'Lead qualificado', review: 'Analisar', disqualified: 'Não qualificado' } as const;
const priorityClass = {
  qualified: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  review: 'bg-amber-100 text-amber-800 ring-amber-200',
  disqualified: 'bg-red-100 text-red-800 ring-red-200',
} as const;

function scoreRecord(record: SearchRecord, query: string) {
  if (!query) return 0;
  if (record.normalizedQuestion === query) return 500;
  if (record.normalizedQuestion.includes(query)) return 400;
  if (record.normalizedTags.includes(query)) return 300;
  if (record.normalizedAnswer.includes(query)) return 200;
  const terms = query.split(' ').filter(Boolean);
  return terms.reduce((score, term) => score + (record.normalizedQuestion.includes(term) ? 40 : record.haystack.includes(term) ? 12 : 0), 0);
}

export default function SDRManualSearch() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(sdrManual[0]?.items[0]?.id ?? '');
  const [selectedId, setSelectedId] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [activeCategory, setActiveCategory] = useState(sdrManual[0]?.category ?? '');

  const index = useMemo<SearchRecord[]>(() => sdrManual.flatMap((category) => category.items.map((item) => {
    const normalizedQuestion = normalizeText(item.question);
    const normalizedAnswer = normalizeText(item.answer);
    const normalizedTags = normalizeText(item.tags.join(' '));
    return { ...item, category: category.category, normalizedQuestion, normalizedAnswer, normalizedTags, haystack: normalizeText(`${category.category} ${item.question} ${item.shortAnswer} ${item.answer} ${item.tags.join(' ')}`) };
  })), []);

  const normalizedQuery = normalizeText(query);
  const suggestions = useMemo(() => index
    .map((record) => ({ record, score: scoreRecord(record, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ record }) => record), [index, normalizedQuery]);

  const selectQuestion = useCallback((id: string) => {
    const record = index.find((item) => item.id === id);
    if (record) setActiveCategory(record.category);
    setOpenId(id);
    setSelectedId(id);
    window.history.replaceState(null, '', `#${id}`);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }, [index]);

  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (id && index.some((item) => item.id === id)) selectQuestion(id);
  }, [index, selectQuestion]);

  const copyAnswer = async (item: SDRManualItem) => {
    await navigator.clipboard.writeText(item.answer);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(''), 1800);
  };

  return (
    <main id="top" className="-mt-[72px] min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 px-4 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4"><Image src="/icon.png" width={72} height={72} alt="Logo SolarInvest" className="rounded-2xl bg-white/95 p-2" /><div><p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-300">Base interna não listada</p><h1 className="mt-2 text-3xl font-black md:text-5xl">Manual Operacional SDR SolarInvest</h1><p className="mt-3 max-w-3xl text-slate-200">Atendimento inicial, qualificação de leads, perguntas frequentes e respostas padrão.</p></div></div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-orange-50">Acesso por URL direta • noindex,nofollow • não exibido na navegação pública</div>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:top-0 md:px-8">
        <div className="mx-auto max-w-7xl"><label htmlFor="sdr-search" className="text-sm font-bold text-slate-700">Busca inteligente do manual</label><input id="sdr-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Digite: entrada, falta energia, terreno, vender energia..." className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base shadow-inner outline-none ring-orange-400 transition focus:ring-2" />
        {query ? <div className="mt-3 grid gap-2 md:grid-cols-2">{suggestions.length ? suggestions.map((item) => <button key={item.id} onClick={() => selectQuestion(item.id)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-orange-300 hover:bg-orange-50" aria-label={`Ir para ${item.question}`}><span className="block font-bold text-slate-900">{item.question}</span><span className="text-xs text-slate-500">{item.category}</span></button>) : <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">Nenhuma sugestão encontrada. Tente outra palavra-chave.</p>}</div> : null}</div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[280px_1fr] md:px-8">
        <aside className="space-y-4 md:sticky md:top-32 md:self-start"><div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><h2 className="font-black">Categorias</h2><div className="mt-3 flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">{sdrManual.map((category) => <a key={category.category} href={`#cat-${normalizeText(category.category).replaceAll(' ', '-')}`} onClick={() => setActiveCategory(category.category)} className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition md:whitespace-normal ${activeCategory === category.category ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-orange-100'}`}>{category.category}</a>)}</div></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><h2 className="font-black">Checklist rápido do SDR</h2><ul className="mt-3 space-y-2 text-sm text-slate-700">{sdrChecklist.map((item) => <li key={item} className="flex gap-2"><span className="mt-1 h-3 w-3 rounded border border-orange-400" />{item}</li>)}</ul></div>
        <div className="rounded-2xl bg-orange-50 p-4 shadow-sm ring-1 ring-orange-200"><h2 className="font-black text-orange-900">Critérios rápidos de qualificação</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-orange-950">{quickQualificationCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div></aside>

        <section className="space-y-6"><div className="grid gap-3 md:grid-cols-3"><span className="rounded-2xl bg-emerald-100 px-4 py-3 text-center font-bold text-emerald-800">Lead qualificado</span><span className="rounded-2xl bg-amber-100 px-4 py-3 text-center font-bold text-amber-800">Analisar</span><span className="rounded-2xl bg-red-100 px-4 py-3 text-center font-bold text-red-800">Não qualificado</span></div>
          {sdrManual.map((category) => <div key={category.category} id={`cat-${normalizeText(category.category).replaceAll(' ', '-')}`} className="scroll-mt-32"><div className="mb-3"><h2 className="text-2xl font-black text-slate-950">{category.category}</h2><p className="text-slate-600">{category.description}</p></div><div className="space-y-3">{category.items.map((item) => { const isOpen = openId === item.id; const isSelected = selectedId === item.id; return <article key={item.id} id={item.id} className={`scroll-mt-36 rounded-2xl bg-white shadow-sm ring-1 transition ${isSelected ? 'ring-4 ring-orange-300' : 'ring-slate-200'}`}><button onClick={() => { setOpenId(isOpen ? '' : item.id); setSelectedId(item.id); }} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" aria-expanded={isOpen} aria-controls={`${item.id}-panel`}><span><span className="block text-lg font-black text-slate-950">{item.question}</span><span className="mt-1 block text-sm text-slate-600">{item.shortAnswer}</span></span><span className="text-2xl text-orange-500">{isOpen ? '−' : '+'}</span></button>{isOpen ? <div id={`${item.id}-panel`} className="border-t border-slate-100 px-5 py-4"><div className="mb-3 flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityClass[item.priority ?? 'review']}`}>{priorityLabel[item.priority ?? 'review']}</span>{item.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{tag}</span>)}</div><p className="leading-8 text-slate-700">{item.answer}</p><button onClick={() => copyAnswer(item)} className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600" aria-label={`Copiar resposta de ${item.question}`}>{copiedId === item.id ? 'Resposta copiada' : 'Copiar resposta'}</button></div> : null}</article>; })}</div></div>)}
        </section>
      </div>
      <a href="#top" className="fixed bottom-6 right-6 rounded-full bg-orange-500 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600" aria-label="Voltar ao topo">Topo ↑</a>
    </main>
  );
}
