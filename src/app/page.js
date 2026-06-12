"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import CarouselSkeleton from "@/components/skeleton/CarouselSkeleton";
import HeroBanner from "@/components/hero-banner/HeroBanner";
import Carousel from "@/components/carousel/Carousel";
import GameCard from "@/components/game-card/GameCard";
import { useGameStore } from "@/store/useGameStore";
import { useDebounce } from "@/hooks/useDebounce";

function HomeContent() {
  const [data, setData] = useState({ featuredGame: null, platforms: [] });
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useGameStore();
  
  // ✅ NOVO: debounce de 300ms no search
  const debouncedQuery = useDebounce(searchQuery, 300);

  // ✅ NOVO: filtros por URL
  const searchParams = useSearchParams();
  const genreFilter = searchParams.get("genre");
  const platformFilter = searchParams.get("platform");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: featured } = await supabase
          .from("games")
          .select("*")
          .limit(1)
          .single();

        let query = supabase.from("platforms").select(`id, name, games (*)`);
        if (platformFilter) {
          query = supabase
            .from("platforms")
            .select(`id, name, games (*)`)
            .eq("short_name", platformFilter);
        }

        const { data: plats } = await query;
        setData({ featuredGame: featured, platforms: plats || [] });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [platformFilter]);

  // ✅ Compute filteredGames during render to avoid cascading renders
  const filteredGames = (() => {
    if (debouncedQuery.trim() === "") return [];

    let allGames = data.platforms.flatMap((p) => p.games);

    // ✅ NOVO: filtro por gênero
    if (genreFilter) {
      allGames = allGames.filter((g) =>
        g.genre?.some((genre) =>
          genre.toLowerCase().includes(genreFilter.toLowerCase())
        )
      );
    }

    return allGames.filter((g) =>
      g.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  })();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-zinc-950 pb-20 pt-32">
        <CarouselSkeleton />
        <CarouselSkeleton />
        <CarouselSkeleton />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 pb-20 overflow-x-hidden">
      {debouncedQuery.trim() === "" ? (
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
            Resultados para: <span className="text-zinc-400 italic">&quot;{debouncedQuery}&quot;</span>
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

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
