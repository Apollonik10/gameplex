// src/hooks/useFavorites.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useFavorites(userId) {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_lists')
        .select('*, games(*)')
        .eq('user_id', userId)
        .eq('list_type', 'favorites');
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const addFavorite = useMutation({
    mutationFn: async (gameId) => {
      const { error } = await supabase.from('user_lists').insert({
        user_id: userId,
        game_id: gameId,
        list_type: 'favorites',
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['favorites', userId]),
  });

  const removeFavorite = useMutation({
    mutationFn: async (gameId) => {
      const { error } = await supabase
        .from('user_lists')
        .delete()
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .eq('list_type', 'favorites');
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['favorites', userId]),
  });

  const isFavorite = (gameId) =>
    favorites.some((f) => f.game_id === gameId);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
