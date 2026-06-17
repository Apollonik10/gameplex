import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFavorites, addUserFavorite, removeUserFavorite } from '@/services/favorite.service';
import { QUERY_KEYS } from '@/lib/constants';

export function useFavorites(userId) {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: [QUERY_KEYS.FAVORITES, userId],
    queryFn: () => getUserFavorites(userId),
    enabled: !!userId,
  });

  const addFavorite = useMutation({
    mutationFn: (gameId) => addUserFavorite(userId, gameId),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEYS.FAVORITES, userId]),
  });

  const removeFavorite = useMutation({
    mutationFn: (gameId) => removeUserFavorite(userId, gameId),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEYS.FAVORITES, userId]),
  });

  const isFavorite = (gameId) => favorites.some((f) => f.game_id === gameId);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
