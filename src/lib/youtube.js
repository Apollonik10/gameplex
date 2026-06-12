const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function searchYouTubeVideo(query) {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "your_youtube_key_here") {
    console.warn("YOUTUBE_API_KEY não configurada.");
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(
        query
      )}&part=snippet&type=video&maxResults=1`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        youtube_id: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url
      };
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar no YouTube:", error);
    return null;
  }
}
