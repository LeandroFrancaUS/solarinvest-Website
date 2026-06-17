'use client';

import { faqs } from './ClientAreaData';

export default function ClientFAQ() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {faqs.map(([question, answer], index) => (
        <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm open:border-orange-200 open:shadow-md">
          <summary className="cursor-pointer list-none font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400">
            {String(index + 1).padStart(2, '0')}. {question}
            <span className="float-right text-orange-500 group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{answer}</p>
        </details>
      ))}
    </div>
  );
}
