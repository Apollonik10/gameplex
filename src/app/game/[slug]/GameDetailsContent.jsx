"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Plus, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EmulatorPlayer from "@/components/EmulatorPlayer";

export default function GameDetailsContent({ game }) {
  const [showEmulator, setShowEmulator] = useState(false);
  const isSNES = game.platforms?.short_name === "SNES";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {showEmulator && <EmulatorPlayer game={game} onClose={() => setShowEmulator(false)} />}

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={game.cover_url}
          alt={game.title}
          fill
          className="object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 md:px-16">
          <Link href="/" className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="relative h-72 w-48 shrink-0 overflow-hidden rounded-lg shadow-2xl border border-zinc-800">
              <Image src={game.cover_url} alt={game.title} fill className="object-cover" />
            </div>
            
            <div className="flex flex-col">
              <span className="mb-2 text-sm font-bold uppercase tracking-widest text-red-500">
                {game.platforms?.name}
              </span>
              <h1 className="mb-4 text-4xl font-bold md:text-6xl uppercase tracking-tighter italic">
                {game.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-green-500 font-bold">{game.year}</span>
                <span className="border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400 uppercase tracking-widest">Original</span>
                <span className="text-zinc-300">{game.genre?.join(", ")}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {isSNES && (
                  <button 
                    onClick={() => setShowEmulator(true)}
                    className="flex items-center gap-2 rounded bg-red-600 px-8 py-3 font-bold hover:bg-red-700 transition uppercase tracking-wide shadow-lg shadow-red-600/20"
                  >
                    <Play size={20} fill="currentColor" />
                    Jogar Agora
                  </button>
                )}
                <button className="flex items-center gap-2 rounded bg-zinc-800 px-6 py-3 font-bold hover:bg-zinc-700 transition border border-zinc-700">
                  <Plus size={20} />
                  Minha Lista
                </button>
                <button className="flex items-center justify-center rounded-full bg-zinc-800 p-3 hover:bg-zinc-700 transition border border-zinc-700">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <section className="px-6 py-12 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-2">Sobre o Jogo</h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-12">
            {game.description}
          </p>

          <h2 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-2">Especificações Técnicas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {game.technical_specs && Object.entries(game.technical_specs).map(([key, value]) => (
              <div key={key} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition">
                <span className="block text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-1">{key}</span>
                <span className="text-zinc-200 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">Desenvolvedor</h2>
            <p className="text-zinc-200 text-lg font-medium">{game.developer}</p>
          </div>
          
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">Distribuidora</h2>
            <p className="text-zinc-200 text-lg font-medium">{game.publisher}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 shadow-xl">
            <h3 className="font-bold mb-3 text-red-500 flex items-center gap-2 uppercase text-xs tracking-widest">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Curiosidade Retro
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed italic">
              "Este título é um dos mais influentes da história do {game.platforms?.name}, definindo padrões que duram até hoje na indústria de games."
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
