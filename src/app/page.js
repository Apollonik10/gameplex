"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import CarouselSkeleton from "@/components/skeleton/CarouselSkeleton";
import HeroBanner from "@/components/hero-banner/HeroBanner";
import Carousel from "@/components/carousel/Carousel";
import GameCard from "@/components/game-card/GameCard";
import { useGameStore } from "@/store/useGameStore";
import { useDebounce } from "@/hooks/useDebounce";

function HomeContent() {
  const [data, setData] = useState({ featuredGame: null, platforms: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useGameStore();
  const debouncedQuery = useDebounce(searchQuery, 300);

  const searchParams = useSearchParams();
  const genreFilter = searchParams.get("genre");
  const platformFilter = searchParams.get("platform");

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const client = getSupabase();
        if (!client) {
          setError("Supabase não configurado");
          setLoading(false);
          return;
        }

        const { data: featured } = await client
          .from("games")
          .select("*")
          .limit(1)
          .single();

        let query = client.from("platforms").select("id, name, games(*)");
        if (platformFilter) {
          query = client
            .from("platforms")
            .select("id, name, games(*)")
            .eq("short_name", platformFilter);
        }

        const { data: plats } = await query;
        if (!cancelled) {
          setData({ featuredGame: featured, platforms: plats || [] });
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Erro ao carregar dados:", e);
          setError(e.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchData();

    return () => { cancelled = true; };
  }, [platformFilter]);

  const filteredGames = (() => {
    if (debouncedQuery.trim() === "") return [];
    let allGames = data.platforms.flatMap((p) => p.games);
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

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar dados</p>
          <p className="text-zinc-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition"
          >
            Tentar novamente
          </button>
        </div>
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
    <Suspense fallback={
      <main className="flex min-h-screen flex-col bg-zinc-950 pb-20 pt-32">
        <CarouselSkeleton />
        <CarouselSkeleton />
        <CarouselSkeleton />
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
