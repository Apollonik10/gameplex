"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const EMULATORJS_CORES = {
  'SNES': { core: 'snes9x', extensions: ['.sfc', '.smc', '.zip'] },
  'NES':  { core: 'fceumm', extensions: ['.nes', '.zip'] },
  'GB':   { core: 'gambatte', extensions: ['.gb', '.zip'] },
  'GBC':  { core: 'gambatte', extensions: ['.gbc', '.gb', '.zip'] },
  'GBA':  { core: 'mgba', extensions: ['.gba', '.zip'] },
  'N64':  { core: 'mupen64plus', extensions: ['.n64', '.z64', '.v64'] },
  'PS1':  { core: 'pcsx_rearmed', extensions: ['.bin', '.cue', '.iso'] },
  'Genesis': { core: 'genesis_plus_gx', extensions: ['.gen', '.md', '.zip'] },
  'SMS':  { core: 'genesis_plus_gx', extensions: ['.sms', '.zip'] },
  'GG':   { core: 'genesis_plus_gx', extensions: ['.gg', '.zip'] },
  'PSP':  { core: 'ppsspp', extensions: ['.iso', '.cso', '.pbp'] },
  'Atari2600': { core: 'stella', extensions: ['.a26', '.bin', '.zip'] },
  'NeoGeo': { core: 'fbneo', extensions: ['.zip'] },
  'MAME': { core: 'mame2003', extensions: ['.zip', '.chd'] },
};

export default function EmulatorPlayer({ game, onClose }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const platformShortName = game.platforms?.short_name;
  const coreInfo = EMULATORJS_CORES[platformShortName] || { core: 'unknown', extensions: [] };
  
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
            <p className="text-zinc-400 font-mono tracking-widest uppercase">Iniciando Core {coreInfo.core}...</p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Emulator Engine Ready</h2>
            <p className="text-zinc-500 max-w-md mb-8">
              O núcleo do {game.platforms?.name} ({coreInfo.core}) foi carregado. 
              Para rodar <strong>{game.title}</strong> legalmente, um arquivo com extensões {coreInfo.extensions.join(", ")} deve ser mapeado no sistema.
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
