import { getSupabase } from '@/lib/supabase/client';

export async function recordPlay(userId, gameId) {
  if (!userId || !gameId) return;
  const supabase = getSupabase();

  await supabase.from('play_history').insert({
    user_id: userId,
    game_id: gameId,
  });
}

export async function getPlayHistory(userId, limit = 20) {
  if (!userId) return [];
  const supabase = getSupabase();

  const { data } = await supabase
    .from('play_history')
    .select('*, games(*, platforms(*))')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getLastPlayed(userId) {
  if (!userId) return [];
  const supabase = getSupabase();

  const { data } = await supabase
    .from('play_history')
    .select('*, games(*, platforms(*))')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(10);

  return data || [];
}

export async function getPlayCount(userId, gameId) {
  if (!userId || !gameId) return 0;
  const supabase = getSupabase();

  const { count } = await supabase
    .from('play_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('game_id', gameId);

  return count || 0;
}
