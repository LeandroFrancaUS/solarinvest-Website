'use client';

import { useState } from 'react';

interface Result {
  title: string;
  url: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data.results);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2" role="search">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          aria-label="Buscar"
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {results.map((r) => (
          <li key={r.url}>
            <a href={r.url} className="text-orange-600 hover:underline">
              {r.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
