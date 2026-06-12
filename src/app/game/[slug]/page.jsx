import { supabase } from "@/lib/supabase/client";
import GameDetailsContent from "./GameDetailsContent";
import { enrichGame } from "@/lib/enrichment";

async function getGameDetails(slug) {
  const { data, error } = await supabase
    .from("games")
    .select(`
      *,
      platforms (*),
      game_videos (*),
      game_screenshots (*)
    `)
    .eq("slug", slug)
    .single();

  if (error) return null;

  // Se o jogo não tem screenshots ou vídeos, tenta enriquecer on-demand
  if (!data.game_screenshots?.length || !data.game_videos?.length) {
    console.log(`Enriquecendo ${data.title} on-demand...`);
    await enrichGame(data.id);
    
    // Busca novamente para pegar os dados novos
    const { data: updatedData } = await supabase
      .from("games")
      .select(`
        *,
        platforms (*),
        game_videos (*),
        game_screenshots (*)
      `)
      .eq("id", data.id)
      .single();
    
    return updatedData || data;
  }

  return data;
}

async function getGlossary() {
  const { data } = await supabase.from("glossary").select("*");
  return data || [];
}

export default async function GamePage({ params }) {
  const { slug } = params;
  const [game, glossary] = await Promise.all([
    getGameDetails(slug),
    getGlossary()
  ]);

  if (!game) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        Jogo não encontrado.
      </div>
    );
  }

  return <GameDetailsContent game={game} glossary={glossary} />;
}
