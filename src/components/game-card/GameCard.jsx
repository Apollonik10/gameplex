"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { usePlayHistory } from "@/hooks/usePlayHistory";
import { useAuth } from "@/hooks/useAuth";
import { EJS_SYSTEMS } from "@/lib/constants";
import EmulatorPlayer from "@/components/EmulatorPlayer";

export default function GameCard({ game }) {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites(user?.id);
  const { record } = usePlayHistory(user?.id);
  const [showPlayer, setShowPlayer] = useState(false);
  const [romFile, setRomFile] = useState(null);

  if (!game) return null;

  const favorite = isFavorite(game.id);
  const systemSupported = Boolean(EJS_SYSTEMS[game.platforms?.short_name]);

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

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!systemSupported) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip,.sfc,.smc,.nes,.gb,.gbc,.gba,.n64,.z64,.v64,.nds,.gen,.md,.sms,.gg,.iso,.cso,.pbp,.bin,.cue,.a26,.rom";
    input.onchange = (ev) => {
      const file = ev.target.files?.[0];
      if (file) {
        setRomFile(file);
        setShowPlayer(true);
        // Registrar no histórico se logado
        if (user) record.mutate(game.id);
      }
    };
    input.click();
  };

  return (
    <>
      <Link href={`/game/${game.slug}`} className="block">
        <motion.div
          className="group relative h-64 w-44 shrink-0 cursor-pointer rounded-md bg-zinc-900"
          whileHover={{ scale: 1.1, zIndex: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-md">
            <Image
              src={game.cover_url || "/placeholder-cover.jpg"}
              alt={game.title}
              fill
              sizes="176px"
              className="object-cover transition-opacity duration-300 group-hover:opacity-30"
            />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="mb-2 text-sm font-bold text-white line-clamp-1">
              {game.title}
            </h3>

            <div className="mb-3 flex gap-2">
              {/* Botão Jogar */}
              {systemSupported ? (
                <button
                  onClick={handlePlayClick}
                  title="Jogar agora"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 transition"
                >
                  <Play size={16} fill="currentColor" />
                </button>
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white/40 cursor-not-allowed">
                  <Play size={16} />
                </span>
              )}

              <button
                onClick={toggleFavorite}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                  favorite
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-zinc-500 text-white hover:border-white"
                }`}
              >
                <Heart size={16} fill={favorite ? "currentColor" : "none"} />
              </button>

              <Link
                href={`/game/${game.slug}`}
                onClick={(e) => e.stopPropagation()}
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
      </Link>

      {/* EmulatorJS Player inline */}
      {showPlayer && (
        <EmulatorPlayer
          game={game}
          localFile={romFile}
          onClose={() => {
            setShowPlayer(false);
            setRomFile(null);
          }}
        />
      )}
    </>
  );
}
