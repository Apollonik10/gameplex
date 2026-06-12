import { supabase } from "./supabase/client.js";
import { searchRAWGGame, getRAWGGameDetails, getRAWGGameScreenshots } from "./rawg.js";
import { searchYouTubeVideo } from "./youtube.js";

export async function enrichGame(gameId) {
  // 1. Get game from Supabase
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select(`*, platforms(*)`)
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    console.error("Erro ao buscar jogo no Supabase:", gameError);
    return null;
  }

  console.log(`Enriquecendo: ${game.title} (${game.platforms?.name})`);

  let rawgId = game.rawg_id;

  // 2. Search RAWG if rawg_id is missing
  if (!rawgId) {
    const results = await searchRAWGGame(`${game.title} ${game.platforms?.name}`);
    if (results.length > 0) {
      rawgId = results[0].id;
      // Update game with rawg_id
      await supabase.from("games").update({ rawg_id: rawgId.toString() }).eq("id", gameId);
    }
  }

  if (rawgId) {
    // 3. Get RAWG Details (Description, Developers, etc)
    const details = await getRAWGGameDetails(rawgId);
    if (details) {
      const updates = {
        description: game.description || details.description_raw || details.description,
        developer: game.developer || details.developers?.[0]?.name,
        publisher: game.publisher || details.publishers?.[0]?.name,
        genre: game.genre || details.genres?.map(g => g.name),
      };
      
      if (!game.cover_url && details.background_image) {
        updates.cover_url = details.background_image;
      }

      await supabase.from("games").update(updates).eq("id", gameId);
    }

    // 4. Get RAWG Screenshots
    const existingScreens = await supabase.from("game_screenshots").select("id").eq("game_id", gameId);
    if (existingScreens.data?.length === 0) {
      const screenshots = await getRAWGGameScreenshots(rawgId);
      if (screenshots.length > 0) {
        const screenInserts = screenshots.slice(0, 5).map((s, index) => ({
          game_id: gameId,
          url: s.image,
          order: index
        }));
        await supabase.from("game_screenshots").insert(screenInserts);
      }
    }
  }

  // 5. YouTube Trailer
  const existingVideos = await supabase.from("game_videos").select("id").eq("game_id", gameId);
  if (existingVideos.data?.length === 0) {
    const searchQuery = `${game.title} ${game.platforms?.name} official trailer`;
    const video = await searchYouTubeVideo(searchQuery);
    
    if (video) {
      await supabase.from("game_videos").insert({
        game_id: gameId,
        youtube_id: video.youtube_id,
        title: video.title,
        type: 'trailer'
      });
    }
  }

  return { success: true };
}

export async function enrichAllGames() {
  const { data: games, error } = await supabase.from("games").select("id");
  if (error) return { error };

  const results = [];
  for (const game of games) {
    const res = await enrichGame(game.id);
    results.push(res);
  }
  return results;
}
