import { supabase } from "@/lib/supabase/client";
import HeroBanner from "@/components/hero-banner/HeroBanner";
import Carousel from "@/components/carousel/Carousel";

async function getHomeData() {
  // 1. Buscar o jogo de destaque (Hero)
  const { data: featuredGame } = await supabase
    .from("games")
    .select("*")
    .limit(1)
    .single();

  // 2. Buscar plataformas que têm jogos
  const { data: platforms } = await supabase
    .from("platforms")
    .select(`
      id,
      name,
      games (*)
    `);

  return { featuredGame, platforms };
}

export default async function Home() {
  const { featuredGame, platforms } = await getHomeData();

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 pb-20 overflow-x-hidden">
      {/* Hero Banner */}
      <HeroBanner game={featuredGame} />
      
      {/* Carrosséis por Plataforma */}
      <section className="mt-[-100px] relative z-20">
        {platforms?.map((platform) => (
          <Carousel 
            key={platform.id} 
            title={platform.name} 
            games={platform.games} 
          />
        ))}

        {/* Fallback caso não haja plataformas ou jogos */}
        {(!platforms || platforms.length === 0) && (
          <div className="px-6 md:px-16 text-zinc-500">
            Nenhum jogo encontrado no catálogo.
          </div>
        )}
      </section>
    </main>
  );
}
