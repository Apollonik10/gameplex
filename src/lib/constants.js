export const API_CONFIG = {
  RAWG_BASE_URL: 'https://api.rawg.io/api',
  YOUTUBE_BASE_URL: 'https://www.googleapis.com/youtube/v3',
  RAWG_PAGE_SIZE: 5,
  YOUTUBE_MAX_RESULTS: 1,
};

export const QUERY_KEYS = {
  GAMES: 'games',
  GAME: 'game',
  PLATFORMS: 'platforms',
  FAVORITES: 'favorites',
  GLOSSARY: 'glossary',
  PLAY_HISTORY: 'playHistory',
};

export const STALE_TIMES = {
  GAMES: 1000 * 60 * 5,
  PLATFORMS: 1000 * 60 * 10,
  GLOSSARY: 1000 * 60 * 15,
};

export const LIST_TYPES = {
  FAVORITES: 'favorites',
  PLAYED: 'played',
  WISHLIST: 'wishlist',
};

// Mapeia o short_name da plataforma para o identificador de SISTEMA aceito por
// EJS_core no EmulatorJS (https://emulatorjs.org/docs/systems/). Isso é diferente
// do nome do core específico (ex: 'snes9x') — o EJS_core geralmente espera o
// nome do sistema ('snes'), que internamente escolhe o core padrão.
// PS2 não está na lista porque o EmulatorJS não tem core compatível até hoje.
export const EJS_SYSTEMS = {
  NES: { system: 'nes' },
  SNES: { system: 'snes' },
  GB: { system: 'gb' },
  GBC: { system: 'gb' },
  GBA: { system: 'gba' },
  N64: { system: 'n64' },
  NDS: { system: 'nds' },
  Genesis: { system: 'segaMD' },
  SMS: { system: 'segaMS' },
  GG: { system: 'segaGG' },
  '32X': { system: 'sega32x' },
  Saturn: { system: 'segaSaturn' },
  PS1: { system: 'psx' },
  PSP: { system: 'psp', requiresThreads: true },
  Atari2600: { system: 'atari2600' },
  NeoGeo: { system: 'arcade' },
  MAME: { system: 'mame' },
};

export const EMULATORJS_CDN = 'https://cdn.emulatorjs.org/stable/data/';

export const EMULATOR_CORES = {
  SNES: { core: 'snes9x', extensions: ['.sfc', '.smc', '.zip'] },
  NES: { core: 'fceumm', extensions: ['.nes', '.zip'] },
  GB: { core: 'gambatte', extensions: ['.gb', '.zip'] },
  GBC: { core: 'gambatte', extensions: ['.gbc', '.gb', '.zip'] },
  GBA: { core: 'mgba', extensions: ['.gba', '.zip'] },
  N64: { core: 'mupen64plus', extensions: ['.n64', '.z64', '.v64'] },
  PS1: { core: 'pcsx_rearmed', extensions: ['.bin', '.cue', '.iso'] },
  Genesis: { core: 'genesis_plus_gx', extensions: ['.gen', '.md', '.zip'] },
  SMS: { core: 'genesis_plus_gx', extensions: ['.sms', '.zip'] },
  GG: { core: 'genesis_plus_gx', extensions: ['.gg', '.zip'] },
  PSP: { core: 'ppsspp', extensions: ['.iso', '.cso', '.pbp'] },
  Atari2600: { core: 'stella', extensions: ['.a26', '.bin', '.zip'] },
  NeoGeo: { core: 'fbneo', extensions: ['.zip'] },
  MAME: { core: 'mame2003', extensions: ['.zip', '.chd'] },
};
