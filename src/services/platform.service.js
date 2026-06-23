import { getSupabase } from '@/lib/supabase/client';

export async function getPlatformById(id) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('platforms')
    .select('*, games(*)')
    .eq('id', id)
    .single();

  return data;
}

export async function getAllPlatforms() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('platforms')
    .select('*, games(*)')
    .order('name');

  if (error) return [];
  return data;
}
