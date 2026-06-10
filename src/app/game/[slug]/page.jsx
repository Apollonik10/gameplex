import { supabase } from "@/lib/supabase/client";
import GameDetailsContent from "./GameDetailsContent";

async function getGameDetails(slug) {
  const { data, error } = await supabase
    .from("games")
    .select(`
      *,
      platforms (*)
    `)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export default async function GamePage({ params }) {
  const { slug } = params;
  const game = await getGameDetails(slug);

  if (!game) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        Jogo não encontrado.
      </div>
    );
  }

  return <GameDetailsContent game={game} />;
}
