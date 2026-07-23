"use client";

import { useState, useEffect } from "react";
import { getUserList } from "@/services/favorite.service";
import { getPlayHistory } from "@/services/play-history.service";
import GameCard from "@/components/game-card/GameCard";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Gamepad2, Star, Clock } from "lucide-react";
import Link from "next/link";

const TABS = [
  { key: "favorites", label: "Favoritos", icon: Heart },
  { key: "played", label: "Jogados", icon: Gamepad2 },
  { key: "wishlist", label: "Wishlist", icon: Star },
  { key: "history", label: "Histórico", icon: Clock },
];

export default function MyListPage() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [games, setGames] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (activeTab === "history") {
      getPlayHistory(user.id).then(setGames);
    } else {
      getUserList(user.id, activeTab).then(setGames);
    }
  }, [user, activeTab]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
    </div>
  );

  if (!user) return (
    <main className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-white gap-6">
      <Gamepad2 size={64} className="text-zinc-700" />
      <h1 className="text-2xl font-bold">Entre para ver sua lista</h1>
      <p className="text-zinc-500">Faça login para salvar seus jogos favoritos.</p>
      <Link href="/auth" className="rounded bg-red-600 px-8 py-3 font-bold hover:bg-red-700 transition">
        Entrar
      </Link>
    </main>
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 md:px-16">
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
        Minha <span className="text-red-600">Lista</span>
      </h1>

      <div className="flex gap-2 mb-12 border-b border-zinc-900 pb-4">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition ${
              activeTab === key
                ? "bg-red-600 text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {games.length === 0 ? (
        <p className="text-zinc-600 italic">Nenhum jogo nesta lista ainda.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {games.map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      )}
    </main>
  );
}
