"use client";

import { Search, Book, Cpu, Layers, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const CATEGORY_ICONS = {
  "Hardware": <Cpu size={18} />,
  "Rendering": <Layers size={18} />,
  "Performance": <Zap size={18} />,
  "Geral": <Book size={18} />,
};

export default function GlossaryPage() {
  const [glossary, setGlossary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlossary() {
      const { data } = await supabase
        .from("glossary")
        .select("*")
        .order("term");
      setGlossary(data || []);
      setLoading(false);
    }
    fetchGlossary();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 md:px-16 flex items-center justify-center">
        <p className="text-zinc-500 animate-pulse">Carregando glossário...</p>
      </main>
    );
  }

  const grouped = glossary.reduce((acc, item) => {
    const firstLetter = item.term[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(item);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
            Glossário <span className="text-red-600">Técnico</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Explore os termos técnicos da era retro, desde arquiteturas de CPU até técnicas de renderização que definiram gerações.
          </p>
        </header>

        {glossary.length === 0 ? (
          <div className="p-12 border border-zinc-900 rounded-3xl bg-zinc-900/20 text-center">
            <Book size={48} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-500 italic">O glossário está vazio no momento. Adicione termos no banco de dados.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {letters.map(letter => (
              <section key={letter} className="relative">
                <div className="sticky top-24 z-10 bg-zinc-950/80 backdrop-blur-md py-4 mb-8 border-b border-zinc-900">
                  <h2 className="text-5xl font-black text-zinc-800 leading-none">{letter}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {grouped[letter].map(item => (
                    <div 
                      key={item.id} 
                      id={item.term.toLowerCase()}
                      className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition duration-300"
                    >
                      <div className="flex items-center gap-2 mb-3 text-red-500/60 uppercase text-[10px] font-black tracking-widest">
                        {CATEGORY_ICONS[item.category] || <Book size={18} />}
                        {item.category || "Geral"}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition">{item.term}</h3>
                      <p className="text-zinc-400 leading-relaxed text-sm">
                        {item.definition}
                      </p>
                      
                      {item.related_terms && item.related_terms.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.related_terms.map(rel => (
                            <span key={rel} className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase font-bold">
                              {rel}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Quick Nav */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1 text-[10px] font-black text-zinc-700 uppercase">
        {letters.map(letter => (
          <button 
            key={letter} 
            className="hover:text-red-500 transition px-2 py-1"
            onClick={() => {
               document.getElementById(grouped[letter][0].term.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    </main>
  );
}
