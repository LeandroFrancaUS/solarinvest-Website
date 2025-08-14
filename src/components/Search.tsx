'use client';

import { useState } from 'react';

interface Result {
  title: string;
  url: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Response not OK');
      }

      const data = await res.json();
      setResults(data.results);
      setError(null);
    } catch (err) {
      console.error(err);
      setResults([]);
      setError('Não foi possível carregar os resultados. Tente novamente.');
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
      {error && (
        <p role="alert" className="mt-4 text-red-600">
          {error}
        </p>
      )}
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
