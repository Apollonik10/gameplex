import { rawgFetch } from './http.service';
import { API_CONFIG } from '@/lib/constants';

export async function searchRAWGGame(query) {
  const data = await rawgFetch('/games', {
    search: query,
    page_size: API_CONFIG.RAWG_PAGE_SIZE,
  });
  return data?.results || [];
}

export async function getRAWGGameDetails(id) {
  return rawgFetch(`/games/${id}`);
}

export async function getRAWGGameScreenshots(id) {
  const data = await rawgFetch(`/games/${id}/screenshots`);
  return data?.results || [];
}
