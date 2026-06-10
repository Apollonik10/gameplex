import { supabase } from "@/lib/supabase/client";
import HeroBanner from "@/components/hero-banner/HeroBanner";

async function getFeaturedGame() {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export default async function Home() {
  const featuredGame = await getFeaturedGame();

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950">
      <HeroBanner game={featuredGame} />
      
      {/* Aqui virão os carrosséis na sequência */}
      <section className="mt-[-100px] relative z-20 pb-20">
        {/* Placeholder para os carrosséis */}
        <div className="px-6 md:px-16 space-y-8">
          <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 w-44 bg-zinc-900 rounded-md shrink-0 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
