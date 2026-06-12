"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Plus, Share2, ArrowLeft, Camera, MonitorPlay } from "lucide-react";
import Link from "next/link";
import EmulatorPlayer from "@/components/EmulatorPlayer";
import PlatformBadge from "@/components/platform-badge/PlatformBadge";
import YouTubePlayer from "@/components/youtube-player/YouTubePlayer";
import GlossaryTooltip from "@/components/glossary-tooltip/GlossaryTooltip";

export default function GameDetailsContent({ game, glossary = [] }) {
  const [showEmulator, setShowEmulator] = useState(false);
  const isSNES = game.platforms?.short_name === "SNES";

  // Helper to inject glossary tooltips
  const renderDescription = (text) => {
    if (!text || !glossary.length) return text;

    let parts = [text];
    
    glossary.forEach(item => {
      const newParts = [];
      const regex = new RegExp(`\\b(${item.term})\\b`, 'gi');
      
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }
        
        const split = part.split(regex);
        split.forEach((subPart, i) => {
          if (subPart.toLowerCase() === item.term.toLowerCase()) {
            newParts.push(
              <GlossaryTooltip 
                key={`${item.term}-${i}`} 
                term={subPart} 
                definition={item.definition} 
              />
            );
          } else if (subPart) {
            newParts.push(subPart);
          }
        });
      });
      parts = newParts;
    });
    
    return parts;
  };

  const video = game.game_videos?.[0];
  const screenshots = game.game_screenshots || [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-20">
      {showEmulator && <EmulatorPlayer game={game} onClose={() => setShowEmulator(false)} />}

      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <Image
          src={game.cover_url}
          alt={game.title}
          fill
          className="object-cover opacity-40 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 md:px-16">
          <Link href="/" className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition w-fit">
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="relative h-72 w-48 shrink-0 overflow-hidden rounded-lg shadow-2xl border border-zinc-800">
              <Image src={game.cover_url} alt={game.title} fill className="object-cover" />
            </div>
            
            <div className="flex flex-col">
              <div className="mb-2 flex items-center gap-3">
                <PlatformBadge platform={game.platforms} />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {game.developer}
                </span>
              </div>
              <h1 className="mb-4 text-4xl font-bold md:text-7xl uppercase tracking-tighter italic">
                {game.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-green-500 font-bold text-lg">{game.year}</span>
                <span className="border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 uppercase tracking-widest font-black">Original</span>
                <div className="h-1 w-1 rounded-full bg-zinc-700" />
                <span className="text-zinc-300 font-medium">{game.genre?.join(", ")}</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {isSNES && (
                  <button 
                    onClick={() => setShowEmulator(true)}
                    className="flex items-center gap-3 rounded bg-red-600 px-10 py-4 font-black hover:bg-red-700 transition uppercase tracking-widest shadow-lg shadow-red-600/30"
                  >
                    <Play size={24} fill="currentColor" />
                    Jogar Agora
                  </button>
                )}
                <button className="flex items-center gap-2 rounded bg-zinc-800/80 backdrop-blur-sm px-8 py-4 font-bold hover:bg-zinc-700 transition border border-zinc-700">
                  <Plus size={20} />
                  Minha Lista
                </button>
                <button className="flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-sm p-4 hover:bg-zinc-700 transition border border-zinc-700">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 py-12 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Info & Media */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Description */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-zinc-800" />
              Sobre o Jogo
            </h2>
            <div className="text-zinc-400 text-xl leading-relaxed max-w-3xl">
              {renderDescription(game.description)}
            </div>
          </section>

          {/* Video Section */}
          {video && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 mb-6 flex items-center gap-3">
                <MonitorPlay size={18} className="text-zinc-700" />
                Trailer & Gameplay
              </h2>
              <YouTubePlayer 
                videoId={video.youtube_id} 
                title={video.title}
                thumbnail={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
              />
            </section>
          )}

          {/* Screenshots Gallery */}
          {screenshots.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 mb-6 flex items-center gap-3">
                <Camera size={18} className="text-zinc-700" />
                Galeria de Capturas
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                {screenshots.map((screen, idx) => (
                  <div key={idx} className="relative aspect-video h-48 shrink-0 overflow-hidden rounded-xl border border-zinc-800 snap-start group">
                    <Image 
                      src={screen.url} 
                      alt={`${game.title} screenshot ${idx + 1}`} 
                      fill 
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Specs & Credits */}
        <div className="lg:col-span-4 space-y-12">
          
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">Hardware & Specs</h2>
            <div className="grid grid-cols-1 gap-4">
              {game.technical_specs && Object.entries(game.technical_specs).map(([key, value]) => (
                <div key={key} className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-800/50 hover:bg-zinc-900/50 transition">
                  <span className="block text-[10px] uppercase text-red-500/70 font-black tracking-[0.2em] mb-2">{key}</span>
                  <span className="text-zinc-200 font-medium text-lg">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 pt-8 border-t border-zinc-900">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Desenvolvedor</span>
              <span className="text-zinc-300 font-bold">{game.developer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Distribuidora</span>
              <span className="text-zinc-300 font-bold">{game.publisher}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Lançamento</span>
              <span className="text-zinc-300 font-bold">{game.year}</span>
            </div>
          </section>

          <div className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <Play size={80} fill="currentColor" className="text-red-600" />
            </div>
            <h3 className="font-black mb-4 text-red-500 flex items-center gap-2 uppercase text-[10px] tracking-[0.3em]">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Legacy Note
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed italic relative z-10">
              "Este título definiu o padrão ouro para {game.platforms?.name}. Cada pixel e cada trilha sonora foram projetados para empurrar o hardware ao seu limite absoluto."
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
