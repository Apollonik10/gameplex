const RAWG_API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function searchRAWGGame(query) {
  if (!RAWG_API_KEY || RAWG_API_KEY === "your_rawg_key_here") {
    console.warn("RAWG_API_KEY não configurada.");
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=5`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao buscar no RAWG:", error);
    return [];
  }
}

export async function getRAWGGameDetails(id) {
  if (!RAWG_API_KEY || RAWG_API_KEY === "your_rawg_key_here") return null;

  try {
    const response = await fetch(`${BASE_URL}/games/${id}?key=${RAWG_API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter detalhes do RAWG:", error);
    return null;
  }
}

export async function getRAWGGameScreenshots(id) {
  if (!RAWG_API_KEY || RAWG_API_KEY === "your_rawg_key_here") return [];

  try {
    const response = await fetch(`${BASE_URL}/games/${id}/screenshots?key=${RAWG_API_KEY}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao obter screenshots do RAWG:", error);
    return [];
  }
}
