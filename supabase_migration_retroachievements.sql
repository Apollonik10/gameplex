-- GAMEPLEX — Migration: RetroAchievements
-- Adiciona campo ra_game_id à tabela games para mapear jogos ao RetroAchievements

-- 1) Adicionar coluna ra_game_id à tabela games
ALTER TABLE games ADD COLUMN IF NOT EXISTS ra_game_id integer;

-- 2) Criar índice para buscas por ra_game_id
CREATE INDEX IF NOT EXISTS idx_games_ra_game_id ON games(ra_game_id);

-- 3) Exemplos de atualização de jogos (descomente e ajuste conforme necessário):
-- UPDATE games SET ra_game_id = 7346 WHERE slug = 'super-mario-world';
-- UPDATE games SET ra_game_id = 1446 WHERE slug = 'super-mario-bros';
-- UPDATE games SET ra_game_id = 1 WHERE slug = 'sonic-the-hedgehog';
-- UPDATE games SET ra_game_id = 11240 WHERE slug = 'castlevania-symphony-of-the-night';
-- UPDATE games SET ra_game_id = 4748 WHERE slug = 'pokemon-red';
-- UPDATE games SET ra_game_id = 10087 WHERE slug = 'the-legend-of-zelda-ocarina-of-time';
