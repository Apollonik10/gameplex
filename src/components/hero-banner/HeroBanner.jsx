"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HeroBanner({ games = [] }) {
  const [index, setIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (games.length === 0) return;
    setIndex((prev) => (prev + 1) % games.length);
  }, [games.length]);

  const prevSlide = useCallback(() => {
    if (games.length === 0) return;
    setIndex((prev) => (prev - 1 + games.length) % games.length);
  }, [games.length]);

  // Rotação automática a cada 20 segundos
  useEffect(() => {
    if (games.length <= 1) return;
    const timer = setInterval(nextSlide, 20000);
    return () => clearInterval(timer);
  }, [games.length, nextSlide]);

  if (games.length === 0) return null;

  const game = games[index];

  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-zinc-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={game.cover_url || "/placeholder-hero.jpg"}
            alt={game.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 lg:w-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={game.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white md:text-6xl lg:text-7xl mb-4 uppercase tracking-tighter italic">
              {game.title}
            </h1>
            <p className="mb-8 max-w-lg text-sm text-zinc-300 md:text-lg line-clamp-3">
              {game.description || "Explore os clássicos que definiram gerações."}
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={`/game/${game.slug}`}
                className="flex items-center gap-2 rounded bg-white px-8 py-2.5 text-black transition hover:bg-zinc-200"
              >
                <Play className="fill-current" size={24} />
                <span className="font-bold uppercase tracking-wide text-sm">Jogar Agora</span>
              </Link>
              <Link
                href={`/game/${game.slug}`}
                className="flex items-center gap-2 rounded bg-zinc-500/50 px-8 py-2.5 text-white backdrop-blur-md transition hover:bg-zinc-500/70"
              >
                <Info size={24} />
                <span className="font-bold uppercase tracking-wide text-sm">Mais Informações</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de navegação */}
      {games.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronRight size={28} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {games.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-white" : "w-3 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
