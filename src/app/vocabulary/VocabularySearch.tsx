"use client";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

interface Term {
  word: string;
  definition: string;
  category: string;
  example?: string;
}

interface Category {
  key: string;
  label: string;
}

interface Props {
  terms: Term[];
  categories: Category[];
}

export function VocabularySearch({ terms, categories }: Props) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTerms = useMemo(() => {
    if (!normalizedQuery) return terms;
    return terms.filter(t =>
      t.word.toLowerCase().includes(normalizedQuery) ||
      t.definition.toLowerCase().includes(normalizedQuery)
    );
  }, [terms, normalizedQuery]);

  const isSearching = normalizedQuery.length > 0;

  return (
    <div>
      {/* Search bar */}
      <div className="sticky top-16 z-10 bg-white pt-2 pb-4 mb-6 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a word — for example, yield"
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
            aria-label="Search vocabulary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="text-xs text-gray-500 mt-2 ml-1">
            {filteredTerms.length === 0
              ? `No words found for "${query}"`
              : `${filteredTerms.length} word${filteredTerms.length === 1 ? "" : "s"} found`}
          </p>
        )}
      </div>

      {/* Results */}
      {isSearching ? (
        // Flat search results — no category headers
        <div className="space-y-3">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Try a different word, or browse all terms below.</p>
              <button
                onClick={() => setQuery("")}
                className="mt-3 text-sm text-blue-600 hover:underline font-medium"
              >
                Show all words
              </button>
            </div>
          ) : (
            filteredTerms.map(term => (
              <div key={term.word} className="rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-blue-200 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{term.word}</h3>
                    <p className="text-sm text-gray-700 mt-1">{term.definition}</p>
                    {term.example && (
                      <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 mt-2 inline-block">
                        💡 {term.example}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // Default — grouped by category
        <>
          {categories.filter(c => c.key !== "all").map(cat => {
            const catTerms = terms.filter(t => t.category === cat.key);
            if (catTerms.length === 0) return null;
            return (
              <section key={cat.key} className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{cat.label}</h2>
                <div className="space-y-3">
                  {catTerms.map(term => (
                    <div key={term.word} className="rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{term.word}</h3>
                          <p className="text-sm text-gray-700 mt-1">{term.definition}</p>
                          {term.example && (
                            <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 mt-2 inline-block">
                              💡 {term.example}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
