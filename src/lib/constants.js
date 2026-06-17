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
