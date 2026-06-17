"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Info } from "lucide-react";
import Link from "next/link";

export default function HeroBanner({ game }) {
  if (!game) return null;

  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-zinc-950">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5 }}
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
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 lg:w-1/2">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
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
              <span className="font-bold uppercase tracking-wide text-sm">Assistir Trailer</span>
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
      </div>
    </div>
  );
}
