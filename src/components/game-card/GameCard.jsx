"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function GameCard({ game }) {
  if (!game) return null;

  return (
    <motion.div
      className="group relative h-64 w-44 shrink-0 cursor-pointer rounded-md bg-zinc-900"
      whileHover={{ scale: 1.1, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Cover Image */}
      <div className="relative h-full w-full overflow-hidden rounded-md">
        <Image
          src={game.cover_url || "/placeholder-cover.jpg"}
          alt={game.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-30"
        />
      </div>

      {/* Hover Info Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="mb-2 text-sm font-bold text-white line-clamp-1">
          {game.title}
        </h3>
        
        <div className="mb-3 flex gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200">
            <Play size={16} fill="currentColor" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-500 text-white hover:border-white">
            <Plus size={16} />
          </button>
          <Link 
            href={`/game/${game.slug}`}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-500 text-white hover:border-white"
          >
            <ChevronDown size={16} />
          </Link>
        </div>

        <div className="flex flex-wrap gap-1">
          {game.genre?.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] text-zinc-400">
              • {g}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
