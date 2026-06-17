'use client';
import { faqs } from './ClientAreaData';
export default function ClientFAQ() {
  return <div className="grid gap-3">{faqs.map(([q,a], i)=><details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-orange-200"><summary className="cursor-pointer list-none font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-400">{String(i+1).padStart(2,'0')}. {q}<span className="float-right text-orange-500 group-open:rotate-45">+</span></summary><p className="mt-3 text-slate-600">{a}</p></details>)}</div>;
}
