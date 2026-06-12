// src/hooks/useGames.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useGames(platformShortName = null) {
  return useQuery({
    queryKey: ['games', platformShortName],
    queryFn: async () => {
      let query = supabase
        .from('games')
        .select('*, platforms(name, short_name, brand_color)');

      if (platformShortName) {
        query = query.eq('platforms.short_name', platformShortName);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useGame(slug) {
  return useQuery({
    queryKey: ['game', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*, platforms(*), game_videos(*), game_screenshots(*)')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('*, games(*)')
        .order('name');
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
