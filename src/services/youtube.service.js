import { youtubeFetch } from './http.service';
import { API_CONFIG } from '@/lib/constants';

export async function searchYouTubeVideo(query) {
  const data = await youtubeFetch('/search', {
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: API_CONFIG.YOUTUBE_MAX_RESULTS,
  });

  if (!data?.items?.length) return null;

  const video = data.items[0];
  return {
    youtube_id: video.id.videoId,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
  };
}
