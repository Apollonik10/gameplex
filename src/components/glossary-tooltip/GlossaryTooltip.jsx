"use client";

import { useState } from "react";
import { Info } from "lucide-react";

export default function GlossaryTooltip({ term, definition }) {
  const [show, setShow] = useState(false);

  return (
    <span 
      className="relative inline-block group"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="cursor-help border-b border-dotted border-red-500 text-zinc-100 font-medium">
        {term}
      </span>
      
      {show && (
        <div className="absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg bg-zinc-900 p-4 text-sm text-zinc-300 shadow-2xl border border-zinc-800 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
            <Info size={12} />
            Glossário Técnico
          </div>
          <p className="leading-relaxed">
            {definition}
          </p>
          <div className="absolute top-full left-1/2 -ml-2 border-[8px] border-transparent border-t-zinc-900" />
        </div>
      )}
    </span>
  );
}
