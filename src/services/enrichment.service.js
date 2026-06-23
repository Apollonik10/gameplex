import { getSupabase } from '@/lib/supabase/client';
import {
  getGameById,
  updateGameRawgId,
  updateGameDetails,
  getAllGameIds,
} from './game.service';
import { searchRAWGGame, getRAWGGameDetails, getRAWGGameScreenshots } from './rawg.service';
import { searchYouTubeVideo } from './youtube.service';

export async function enrichGame(gameId) {
  const game = await getGameById(gameId);
  if (!game) return null;

  let rawgId = game.rawg_id;

  if (!rawgId) {
    const results = await searchRAWGGame(`${game.title} ${game.platforms?.name}`);
    if (results.length > 0) {
      rawgId = results[0].id;
      await updateGameRawgId(gameId, rawgId.toString());
    }
  }

  if (rawgId) {
    const details = await getRAWGGameDetails(rawgId);
    if (details) {
      const updates = {
        description: game.description || details.description_raw || details.description,
        developer: game.developer || details.developers?.[0]?.name,
        publisher: game.publisher || details.publishers?.[0]?.name,
        genre: game.genre || details.genres?.map((g) => g.name),
      };

      if (!game.cover_url && details.background_image) {
        updates.cover_url = details.background_image;
      }

      await updateGameDetails(gameId, updates);
    }

    const supabase = getSupabase();
    const existingScreens = await supabase
      .from('game_screenshots')
      .select('id')
      .eq('game_id', gameId);

    if (existingScreens.data?.length === 0) {
      const screenshots = await getRAWGGameScreenshots(rawgId);
      if (screenshots.length > 0) {
        const screenInserts = screenshots.slice(0, 5).map((s, index) => ({
          game_id: gameId,
          url: s.image,
          order: index,
        }));
        await supabase.from('game_screenshots').insert(screenInserts);
      }
    }
  }

  const supabase = getSupabase();
  const existingVideos = await supabase
    .from('game_videos')
    .select('id')
    .eq('game_id', gameId);

  if (existingVideos.data?.length === 0) {
    const searchQuery = `${game.title} ${game.platforms?.name} official trailer`;
    const video = await searchYouTubeVideo(searchQuery);

    if (video) {
      await supabase.from('game_videos').insert({
        game_id: gameId,
        youtube_id: video.youtube_id,
        title: video.title,
        type: 'trailer',
      });
    }
  }

  return { success: true };
}

export async function enrichAllGames() {
  const gameIds = await getAllGameIds();
  const results = [];
  for (const { id } of gameIds) {
    const res = await enrichGame(id);
    results.push(res);
  }
  return results;
}
