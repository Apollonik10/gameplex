"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function GameCard({ game }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites(user?.id);

  if (!game) return null;

  const favorite = isFavorite(game.id);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Você precisa estar logado para favoritar um jogo.");
      return;
    }
    if (favorite) {
      removeFavorite.mutate(game.id);
    } else {
      addFavorite.mutate(game.id);
    }
  };

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
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 transition">
            <Play size={16} fill="currentColor" />
          </button>
          <button 
            onClick={toggleFavorite}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
              favorite ? "bg-red-600 border-red-600 text-white" : "border-zinc-500 text-white hover:border-white"
            }`}
          >
            <Heart size={16} fill={favorite ? "currentColor" : "none"} />
          </button>
          <Link 
            href={`/game/${game.slug}`}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-500 text-white hover:border-white transition"
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
