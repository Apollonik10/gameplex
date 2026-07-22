/**
 * retroachievements.service.js
 *
 * Integração com a API pública do RetroAchievements (https://retroachievements.org).
 *
 * O RetroAchievements é um serviço de conquistas/troféus para jogos retro.
 * Ele tem uma API REST pública que não requer segredo no cliente — só um
 * username e web API key cadastrados em retroachievements.org/settings.
 *
 * Endpoints usados:
 *  - /API/API_GetGame.php          → info do jogo pelo RA game ID
 *  - /API/API_GetGameInfoAndUserProgress.php → conquistas + progresso do usuário
 *  - /API/API_GetAchievementOfTheWeek.php   → conquista da semana
 *  - /API/API_GetUserRecentlyPlayedGames.php → jogos recentes do usuário
 *
 * Uso:
 *  - Preencha NEXT_PUBLIC_RA_USERNAME e NEXT_PUBLIC_RA_API_KEY no .env.local
 *  - Para buscar conquistas de um jogo, você precisa do "RA Game ID" —
 *    veja em https://retroachievements.org/game/<id>
 *  - A tabela `games` do Supabase pode ter um campo `ra_game_id` (integer)
 *    para mapear cada jogo ao seu ID no RetroAchievements.
 */

const RA_BASE = 'https://retroachievements.org/API';

function getCredentials() {
  const username = process.env.NEXT_PUBLIC_RA_USERNAME;
  const apiKey = process.env.NEXT_PUBLIC_RA_API_KEY;
  return { username, apiKey, configured: Boolean(username && apiKey) };
}

/**
 * Busca as conquistas de um jogo pelo RA Game ID.
 * Retorna array de conquistas ou [] se não configurado/não encontrado.
 */
export async function getGameAchievements(raGameId) {
  if (!raGameId) return [];
  const { username, apiKey, configured } = getCredentials();
  if (!configured) return [];

  try {
    const url = `${RA_BASE}/API_GetGame.php?z=${username}&y=${apiKey}&i=${raGameId}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();

    // Achievements vem como objeto { "1": {...}, "2": {...} }
    if (!data.Achievements) return [];
    return Object.values(data.Achievements).map(normalizeAchievement);
  } catch (err) {
    console.error('[RetroAchievements] Erro ao buscar conquistas:', err);
    return [];
  }
}

/**
 * Busca conquistas de um jogo + progresso do usuário logado.
 * Retorna { achievements, numAwardedToUser, numAchievements } ou null.
 */
export async function getGameWithUserProgress(raGameId, raUsername) {
  if (!raGameId) return null;
  const { username, apiKey, configured } = getCredentials();
  if (!configured) return null;

  try {
    const u = raUsername || username;
    const url = `${RA_BASE}/API_GetGameInfoAndUserProgress.php?z=${username}&y=${apiKey}&u=${u}&g=${raGameId}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();

    const achievements = data.Achievements
      ? Object.values(data.Achievements).map(normalizeAchievement)
      : [];

    return {
      achievements,
      numAchievements: data.NumAchievements || 0,
      numAwardedToUser: data.NumAwardedToUser || 0,
      gameTitle: data.Title,
      gameIcon: data.ImageIcon
        ? `https://retroachievements.org${data.ImageIcon}`
        : null,
      points: data.Points || 0,
    };
  } catch (err) {
    console.error('[RetroAchievements] Erro ao buscar progresso:', err);
    return null;
  }
}

/**
 * Busca informações básicas do jogo no RetroAchievements pelo ID.
 */
export async function getGameInfo(raGameId) {
  if (!raGameId) return null;
  const { username, apiKey, configured } = getCredentials();
  if (!configured) return null;

  try {
    const url = `${RA_BASE}/API_GetGame.php?z=${username}&y=${apiKey}&i=${raGameId}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.ID,
      title: data.Title,
      publisher: data.Publisher,
      developer: data.Developer,
      genre: data.Genre,
      numAchievements: data.NumAchievements || 0,
      points: data.Points || 0,
      imageBoxArt: data.ImageBoxArt
        ? `https://retroachievements.org${data.ImageBoxArt}`
        : null,
      imageIcon: data.ImageIcon
        ? `https://retroachievements.org${data.ImageIcon}`
        : null,
    };
  } catch (err) {
    console.error('[RetroAchievements] Erro ao buscar jogo:', err);
    return null;
  }
}

// --- helpers internos ---

function normalizeAchievement(a) {
  return {
    id: a.ID,
    title: a.Title,
    description: a.Description,
    points: a.Points || 0,
    badgeUrl: a.BadgeName
      ? `https://media.retroachievements.org/Badge/${a.BadgeName}.png`
      : null,
    badgeLockedUrl: a.BadgeName
      ? `https://media.retroachievements.org/Badge/${a.BadgeName}_lock.png`
      : null,
    numAwarded: a.NumAwarded || 0,
    numAwardedHardcore: a.NumAwardedHardcore || 0,
    // Se veio com DateEarned, o usuário já desbloqueou
    earned: Boolean(a.DateEarned),
    earnedHardcore: Boolean(a.DateEarnedHardcore),
    dateEarned: a.DateEarned || null,
    type: a.type || 'standard', // 'missable', 'progression', 'win_condition', 'standard'
  };
}
