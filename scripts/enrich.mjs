/**
 * enrich.mjs — Script para enriquecer jogos com dados do RAWG e YouTube
 *
 * Uso:
 *   node --env-file=.env.local scripts/enrich.mjs
 *   node --env-file=.env.local scripts/enrich.mjs --covers-only
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RAWG_KEY = process.env.RAWG_API_KEY;
const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variáveis SUPABASE não configuradas');
  process.exit(1);
}

if (!RAWG_KEY) {
  console.error('❌ RAWG_API_KEY não configurada');
  process.exit(1);
}

const RAWG_BASE = 'https://api.rawg.io/api';
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

// --- Supabase REST helpers ---

async function supabaseQuery(table, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  
  const res = await fetch(url.toString(), {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
  
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

async function supabaseUpdate(table, id, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error(`Supabase update error: ${res.status}`);
}

async function supabaseInsert(table, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error(`Supabase insert error: ${res.status}`);
}

// --- RAWG ---

async function searchRAWG(query) {
  const url = `${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=3`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

async function getRAWGDetails(id) {
  const url = `${RAWG_BASE}/games/${id}?key=${RAWG_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function getRAWGScreenshots(id) {
  const url = `${RAWG_BASE}/games/${id}/screenshots?key=${RAWG_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// --- YouTube ---

async function searchYouTube(query) {
  if (!YOUTUBE_KEY || YOUTUBE_KEY === 'sua_chave_youtube_aqui') return null;

  const url = `${YOUTUBE_BASE}/search?key=${YOUTUBE_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();

  if (!data.items?.length) return null;
  const video = data.items[0];
  return {
    youtube_id: video.id.videoId,
    title: video.snippet.title,
  };
}

// --- Main ---

async function enrichGame(game, coversOnly = false) {
  const updates = {};
  let rawgId = game.rawg_id;

  // Buscar no RAWG se não tem rawg_id
  if (!rawgId) {
    const platformName = game.platforms?.name || '';
    const results = await searchRAWG(`${game.title} ${platformName}`);
    if (results.length > 0) {
      rawgId = String(results[0].id);
      updates.rawg_id = rawgId;
    }
  }

  // Enriquecer com detalhes do RAWG
  if (rawgId) {
    const details = await getRAWGDetails(rawgId);
    if (details) {
      if (!coversOnly) {
        if (!game.description && (details.description_raw || details.description)) {
          updates.description = details.description_raw || details.description;
        }
        if (!game.developer && details.developers?.[0]?.name) {
          updates.developer = details.developers[0].name;
        }
        if (!game.publisher && details.publishers?.[0]?.name) {
          updates.publisher = details.publishers[0].name;
        }
        if ((!game.genre || game.genre.length === 0) && details.genres?.length) {
          updates.genre = details.genres.map(g => g.name);
        }
      }
      // Cover do RAWG (background_image é a capa principal)
      if (!game.cover_url && details.background_image) {
        updates.cover_url = details.background_image;
      }
    }

    // Screenshots (apenas no modo completo)
    if (!coversOnly) {
      const existingScreens = await supabaseQuery('game_screenshots', {
        game_id: `eq.${game.id}`,
        select: 'id'
      });

      if (!existingScreens?.length) {
        const screenshots = await getRAWGScreenshots(rawgId);
        if (screenshots.length > 0) {
          const inserts = screenshots.slice(0, 5).map((s, i) => ({
            game_id: game.id,
            url: s.image,
            order: i,
          }));
          await supabaseInsert('game_screenshots', inserts);
          console.log(`  📸 ${screenshots.length} screenshots salvas`);
        }
      }
    }
  }

  // Trailer no YouTube (apenas no modo completo)
  if (!coversOnly) {
    const existingVideos = await supabaseQuery('game_videos', {
      game_id: `eq.${game.id}`,
      select: 'id'
    });

    if (!existingVideos?.length) {
      const platformName = game.platforms?.name || '';
      const video = await searchYouTube(`${game.title} ${platformName} official trailer`);
      if (video) {
        await supabaseInsert('game_videos', {
          game_id: game.id,
          youtube_id: video.youtube_id,
          title: video.title,
          type: 'trailer',
        });
        console.log(`  🎬 Trailer encontrado: ${video.title}`);
      } else if (!YOUTUBE_KEY || YOUTUBE_KEY === 'sua_chave_youtube_aqui') {
        console.log('  ⏳ YouTube: aguardando API key');
      }
    }
  }

  // Salvar updates
  if (Object.keys(updates).length > 0) {
    await supabaseUpdate('games', game.id, updates);
    console.log(`  ✅ Atualizado: ${Object.keys(updates).join(', ')}`);
  }

  return updates;
}

async function main() {
  const coversOnly = process.argv.includes('--covers-only');
  console.log('🎮 GamePlex — Enriquecimento de Jogos\n');
  if (coversOnly) console.log('📸 Modo: apenas covers\n');

  // Buscar todos os jogos com plataforma
  const games = await supabaseQuery('games', {
    select: '*, platforms(*)'
  });

  console.log(`📦 ${games.length} jogos encontrados\n`);

  let enriched = 0;
  let skipped = 0;

  for (const game of games) {
    console.log(`🔍 ${game.title} (${game.platforms?.name || '?'})`);

    // Verificar se precisa enriquecer
    const needsEnrichment = coversOnly
      ? !game.cover_url
      : !game.rawg_id ||
        !game.description ||
        !game.developer ||
        !game.cover_url;

    if (!needsEnrichment) {
      console.log('  ⏭️  Já completo');
      skipped++;
      continue;
    }

    try {
      await enrichGame(game, coversOnly);
      enriched++;

      // Rate limiting: 1 req/s para RAWG
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ❌ Erro: ${err.message}`);
    }
  }

  console.log(`\n✅ Concluído: ${enriched} enriquecidos, ${skipped} já completos`);
}

main().catch(console.error);
