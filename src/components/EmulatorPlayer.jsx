"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function EmulatorPlayer({ game, onClose }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // NOTA: Em um projeto real, você teria os arquivos do core e da rom localmente ou via CDN confiável.
  // Aqui estamos preparando a estrutura para o EmulatorJS.
  
  useEffect(() => {
    // Bloquear scroll do body
    document.body.style.overflow = "hidden";
    
    // Simulação de carregamento (em um cenário real, aqui carregaria o script do EmulatorJS)
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-[110]"
      >
        <X size={40} />
      </button>

      <div className="relative aspect-video w-full max-w-5xl bg-zinc-900 shadow-2xl rounded-lg overflow-hidden border border-zinc-800">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            <p className="text-zinc-400 font-mono tracking-widest uppercase">Iniciando Core {game.platforms?.short_name}...</p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Emulator Engine Ready</h2>
            <p className="text-zinc-500 max-w-md mb-8">
              O núcleo do {game.platforms?.name} foi carregado. 
              Para rodar <strong>{game.title}</strong> legalmente, o arquivo .sfc/.smc deve ser mapeado no sistema.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-600">
              <div className="p-2 border border-zinc-800">CONTROLES: SETAS</div>
              <div className="p-2 border border-zinc-800">BOTÕES: Z, X, A, S</div>
              <div className="p-2 border border-zinc-800">START: ENTER</div>
              <div className="p-2 border border-zinc-800">SELECT: SHIFT</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
