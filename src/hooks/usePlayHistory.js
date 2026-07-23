import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recordPlay, getPlayHistory, getLastPlayed } from '@/services/play-history.service';

const QUERY_KEY = 'playHistory';

export function usePlayHistory(userId) {
  const queryClient = useQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => getPlayHistory(userId),
    enabled: !!userId,
  });

  const { data: lastPlayed = [] } = useQuery({
    queryKey: [QUERY_KEY, 'last', userId],
    queryFn: () => getLastPlayed(userId),
    enabled: !!userId,
  });

  const record = useMutation({
    mutationFn: (gameId) => recordPlay(userId, gameId),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY, userId]);
      queryClient.invalidateQueries([QUERY_KEY, 'last', userId]);
    },
  });

  return { history, lastPlayed, record };
}
