"use client";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

interface Term {
  word: string;
  definition: string;
  category: string;
  example?: string;
  wordEs: string;
  definitionEs: string;
  exampleEs?: string;
  categoryEs: string;
}

interface Category {
  key: string;
  labelEs: string;
}

interface Props {
  terms: Term[];
  categories: Category[];
}

export function VocabularioSearch({ terms, categories }: Props) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTerms = useMemo(() => {
    if (!normalizedQuery) return terms;
    return terms.filter(t =>
      t.wordEs.toLowerCase().includes(normalizedQuery) ||
      t.definitionEs.toLowerCase().includes(normalizedQuery) ||
      t.word.toLowerCase().includes(normalizedQuery) ||
      t.definition.toLowerCase().includes(normalizedQuery)
    );
  }, [terms, normalizedQuery]);

  const isSearching = normalizedQuery.length > 0;

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Term[]> = {};
    for (const term of filteredTerms) {
      if (!groups[term.category]) groups[term.category] = [];
      groups[term.category].push(term);
    }
    return groups;
  }, [filteredTerms]);

  return (
    <div>
      <div className="sticky top-16 z-10 bg-white pt-2 pb-4 mb-6 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar una palabra en español o inglés..."
            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
              aria-label="Borrar búsqueda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="text-xs text-gray-500 mt-2 px-1">
            {filteredTerms.length} {filteredTerms.length === 1 ? "término encontrado" : "términos encontrados"}
          </p>
        )}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium mb-1">No se encontraron términos</p>
          <p className="text-sm">Intenta con otra palabra o revisa la ortografía.</p>
        </div>
      )}

      {!isSearching && categories.map((cat) => {
        const catTerms = groupedByCategory[cat.key];
        if (!catTerms || catTerms.length === 0) return null;
        return (
          <section key={cat.key} className="mb-10">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-3 px-1">
              {cat.labelEs}
            </h2>
            <div className="space-y-3">
              {catTerms.map((term, i) => (
                <article key={`${cat.key}-${i}`} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900">{term.wordEs}</h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                      EN: {term.word}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-2">{term.definitionEs}</p>
                  {term.exampleEs && (
                    <p className="text-sm text-gray-500 italic border-l-2 border-blue-200 pl-3 mt-2">
                      Ejemplo: {term.exampleEs}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {isSearching && (
        <div className="space-y-3">
          {filteredTerms.map((term, i) => (
            <article key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-900">{term.wordEs}</h3>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                  EN: {term.word}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-2">{term.definitionEs}</p>
              {term.exampleEs && (
                <p className="text-sm text-gray-500 italic border-l-2 border-blue-200 pl-3 mt-2">
                  Ejemplo: {term.exampleEs}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">{term.categoryEs}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
