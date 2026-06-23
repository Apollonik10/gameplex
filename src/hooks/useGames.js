import { useQuery } from '@tanstack/react-query';
import { getGameBySlug, getGamesByPlatform, getAllPlatforms } from '@/services/game.service';
import { QUERY_KEYS, STALE_TIMES } from '@/lib/constants';

export function useGames(platformShortName = null) {
  return useQuery({
    queryKey: [QUERY_KEYS.GAMES, platformShortName],
    queryFn: () => getGamesByPlatform(platformShortName),
    staleTime: STALE_TIMES.GAMES,
  });
}

export function useGame(slug) {
  return useQuery({
    queryKey: [QUERY_KEYS.GAME, slug],
    queryFn: () => getGameBySlug(slug),
  });
}

export function usePlatforms() {
  return useQuery({
    queryKey: [QUERY_KEYS.PLATFORMS],
    queryFn: getAllPlatforms,
    staleTime: STALE_TIMES.PLATFORMS,
  });
}
