import { getSupabase } from '@/lib/supabase/client';

export async function getGameBySlug(slug) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('games')
    .select('*, platforms(*), game_videos(*), game_screenshots(*)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

export async function getGameById(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('games')
    .select('*, platforms(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getFeaturedGame() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('games')
    .select('*')
    .limit(1)
    .single();

  return data;
}

export async function getGamesByPlatform(platformFilter = null) {
  const supabase = getSupabase();
  let query = supabase.from('platforms').select('id, name, games(*)');

  if (platformFilter) {
    query = query.eq('short_name', platformFilter);
  }

  const { data } = await query;
  return data || [];
}

export async function updateGameRawgId(gameId, rawgId) {
  const supabase = getSupabase();
  await supabase
    .from('games')
    .update({ rawg_id: rawgId })
    .eq('id', gameId);
}

export async function updateGameDetails(gameId, updates) {
  const supabase = getSupabase();
  await supabase
    .from('games')
    .update(updates)
    .eq('id', gameId);
}

export async function getAllGameIds() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('games').select('id');
  if (error) return [];
  return data;
}
