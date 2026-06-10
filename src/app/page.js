"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import HeroBanner from "@/components/hero-banner/HeroBanner";
import Carousel from "@/components/carousel/Carousel";
import GameCard from "@/components/game-card/GameCard";
import { useGameStore } from "@/store/useGameStore";

export default function Home() {
  const [data, setData] = useState({ featuredGame: null, platforms: [] });
  const [filteredGames, setFilteredGames] = useState([]);
  const { searchQuery } = useGameStore();

  useEffect(() => {
    async function fetchData() {
      const { data: featured } = await supabase.from("games").select("*").limit(1).single();
      const { data: plats } = await supabase.from("platforms").select(`id, name, games (*)`);
      setData({ featuredGame: featured, platforms: plats || [] });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGames([]);
      return;
    }

    const allGames = data.platforms.flatMap(p => p.games);
    const filtered = allGames.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery, data.platforms]);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 pb-20 overflow-x-hidden">
      {searchQuery.trim() === "" ? (
        <>
          <HeroBanner game={data.featuredGame} />
          <section className="mt-[-100px] relative z-20">
            {data.platforms.map((platform) => (
              <Carousel 
                key={platform.id} 
                title={platform.name} 
                games={platform.games} 
              />
            ))}
          </section>
        </>
      ) : (
        <section className="pt-32 px-6 md:px-16">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Resultados para: <span className="text-zinc-400 italic">"{searchQuery}"</span>
          </h2>
          <div className="flex flex-wrap gap-6">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
            {filteredGames.length === 0 && (
              <p className="text-zinc-500">Nenhum jogo encontrado para essa busca.</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
