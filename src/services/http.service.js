import { API_CONFIG } from '@/lib/constants';

function getApiKey(envVar, name) {
  if (!envVar || envVar === `your_${name.toLowerCase()}_key_here`) {
    return null;
  }
  return envVar;
}

export async function rawgFetch(path, params = {}) {
  const apiKey = getApiKey(process.env.RAWG_API_KEY, 'RAWG');
  if (!apiKey) return null;

  const url = new URL(`${API_CONFIG.RAWG_BASE_URL}${path}`);
  url.searchParams.set('key', apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);
  return res.json();
}

export async function youtubeFetch(path, params = {}) {
  const apiKey = getApiKey(process.env.YOUTUBE_API_KEY, 'YOUTUBE');
  if (!apiKey) return null;

  const url = new URL(`${API_CONFIG.YOUTUBE_BASE_URL}${path}`);
  url.searchParams.set('key', apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  return res.json();
}
