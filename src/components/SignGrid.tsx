"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface SignEntry { name: string; img: string; desc: string; }
interface SignCat { name: string; color: string; titleColor: string; description: string; signs: SignEntry[]; }

export function SignGrid({ categories }: { categories: SignCat[] }) {
  const [selected, setSelected] = useState<SignEntry | null>(null);

  return (
    <>
      {categories.map((cat) => (
        <section key={cat.name} className="mb-12">
          <div className={`rounded-xl border p-6 ${cat.color}`}>
            <h2 className={`text-2xl font-bold mb-1 ${cat.titleColor}`}>{cat.name}</h2>
            <p className="text-gray-600 mb-6 text-sm">{cat.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {cat.signs.map((sign) => (
                <div
                  key={sign.name}
                  onClick={() => setSelected(sign)}
                  className="bg-white rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:border-blue-300 border border-transparent transition-all cursor-pointer"
                >
                  <img src={sign.img} alt={sign.name} className="w-24 h-24 object-contain mb-3" />
                  <span className="text-xs font-semibold text-gray-700 leading-tight">{sign.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selected.img} alt={selected.name} className="w-36 h-36 object-contain mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">{selected.name}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{selected.desc}</p>
          </div>
        </div>
      )}
    </>
  );
}
