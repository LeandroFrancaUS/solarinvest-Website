'use client';

import { contractDocLinks, resolveDocUrl } from '@/config/contract-docs';

export default function ContractDocuments() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return (
    <section className="mt-12 rounded-2xl border border-orange-100 bg-orange-50/60 p-6 text-left shadow-sm">
      <h2 className="text-xl font-semibold text-orange-700">Documentos de contrato (GitHub)</h2>
      <p className="mt-2 text-sm text-gray-700">
        Links atualizados automaticamente para o dia {day}/{month}.
      </p>
      <ul className="mt-4 space-y-3 text-sm text-gray-700">
        {contractDocLinks.map((doc) => (
          <li key={doc.label} className="flex items-start gap-2">
            <span className="mt-0.5">📄</span>
            <a
              href={resolveDocUrl(doc.urlTemplate, now)}
              className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {doc.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
