/**
 * GamePlex — Definições de tipos (JSDoc)
 * Contratos de dados para toda a aplicação.
 */

/**
 * @typedef {Object} Platform
 * @property {string} id
 * @property {string} name
 * @property {string} short_name
 * @property {string|null} logo_url
 * @property {string|null} brand_color
 * @property {string|null} manufacturer
 * @property {number|null} year_released
 * @property {string|null} emulator_core
 * @property {string[]|null} rom_extensions
 * @property {string|null} retroarch_core
 * @property {string|null} emulatorjs_core
 * @property {Game[]} [games]
 */

/**
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} platform_id
 * @property {string|null} cover_url
 * @property {string|null} description
 * @property {string[]|null} genre
 * @property {number|null} year
 * @property {string|null} developer
 * @property {string|null} publisher
 * @property {number} players
 * @property {Object|null} technical_specs
 * @property {string|null} rawg_id
 * @property {Platform} [platforms]
 * @property {GameVideo[]} [game_videos]
 * @property {GameScreenshot[]} [game_screenshots]
 */

/**
 * @typedef {Object} GameVideo
 * @property {string} id
 * @property {string} game_id
 * @property {string} youtube_id
 * @property {string|null} title
 * @property {'trailer'|'gameplay'|'review'} type
 */

/**
 * @typedef {Object} GameScreenshot
 * @property {string} id
 * @property {string} game_id
 * @property {string} url
 * @property {number} order
 */

/**
 * @typedef {Object} GlossaryTerm
 * @property {string} id
 * @property {string} term
 * @property {string} definition
 * @property {string|null} category
 * @property {string[]|null} related_terms
 */

/**
 * @typedef {Object} UserList
 * @property {string} id
 * @property {string} user_id
 * @property {string} game_id
 * @property {'favorites'|'played'|'wishlist'} list_type
 * @property {Game} [games]
 */

/**
 * @typedef {Object} RawgGame
 * @property {number} id
 * @property {string} name
 * @property {string} background_image
 * @property {string} description_raw
 * @property {Object[]} genres
 * @property {Object[]} developers
 * @property {Object[]} publishers
 */

/**
 * @typedef {Object} YouTubeSearchResult
 * @property {string} youtube_id
 * @property {string} title
 * @property {string} thumbnail
 */

/**
 * @typedef {Object} EnrichmentResult
 * @property {boolean} success
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} email
 * @property {Object} [user_metadata]
 */
