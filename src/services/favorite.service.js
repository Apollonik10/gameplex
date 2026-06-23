import { getSupabase } from '@/lib/supabase/client';

export async function getUserFavorites(userId) {
  if (!userId) return [];
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('user_lists')
    .select('*, games(*)')
    .eq('user_id', userId)
    .eq('list_type', 'favorites');

  if (error) throw error;
  return data;
}

export async function addUserFavorite(userId, gameId) {
  const supabase = getSupabase();
  const { error } = await supabase.from('user_lists').insert({
    user_id: userId,
    game_id: gameId,
    list_type: 'favorites',
  });
  if (error) throw error;
}

export async function removeUserFavorite(userId, gameId) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('user_lists')
    .delete()
    .eq('user_id', userId)
    .eq('game_id', gameId)
    .eq('list_type', 'favorites');
  if (error) throw error;
}

export async function getUserList(userId, listType) {
  if (!userId) return [];
  const supabase = getSupabase();

  const { data } = await supabase
    .from('user_lists')
    .select('*, games(*)')
    .eq('user_id', userId)
    .eq('list_type', listType);

  return data?.map((d) => d.games) || [];
}
