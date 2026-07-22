-- GAMEPLEX — Migration: Adiciona ra_game_id para integração com RetroAchievements
-- Execute no SQL Editor do Supabase Studio quando for ativar as conquistas.
--
-- O campo ra_game_id é o ID numérico do jogo em retroachievements.org
-- Exemplo: https://retroachievements.org/game/7346 → ra_game_id = 7346
--
-- É OPCIONAL — jogos sem ra_game_id simplesmente não exibem o painel de conquistas.

ALTER TABLE games ADD COLUMN IF NOT EXISTS ra_game_id integer;

COMMENT ON COLUMN games.ra_game_id IS 
  'ID do jogo no RetroAchievements (https://retroachievements.org). '
  'Opcional — quando preenchido, exibe o painel de conquistas na página do jogo.';

-- Exemplos de IDs para preencher depois:
-- UPDATE games SET ra_game_id = 7346  WHERE slug ILIKE '%super-mario-world%';
-- UPDATE games SET ra_game_id = 1446  WHERE slug ILIKE '%super-mario-bros%';
-- UPDATE games SET ra_game_id = 1     WHERE slug ILIKE '%sonic-the-hedgehog%';
-- UPDATE games SET ra_game_id = 11240 WHERE slug ILIKE '%castlevania%symphony%';
-- UPDATE games SET ra_game_id = 4748  WHERE slug ILIKE '%pokemon-red%';
-- UPDATE games SET ra_game_id = 10087 WHERE slug ILIKE '%ocarina%';
