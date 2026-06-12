-- GAMEPLEX — Sincronização & Mudanças (Junho 2026)
-- Rodar no SQL Editor do Supabase Studio

-- 1.1 — Adicionar colunas na tabela platforms
ALTER TABLE platforms 
  ADD COLUMN IF NOT EXISTS emulator_core text,
  ADD COLUMN IF NOT EXISTS rom_extensions text[],
  ADD COLUMN IF NOT EXISTS retroarch_core text,
  ADD COLUMN IF NOT EXISTS emulatorjs_core text;

-- 1.2 — Atualizar plataformas existentes
UPDATE platforms SET
  emulator_core = 'snes9x',
  emulatorjs_core = 'snes9x',
  retroarch_core = 'snes9x_libretro',
  rom_extensions = ARRAY['.sfc', '.smc', '.zip', '.7z']
WHERE short_name = 'SNES';

UPDATE platforms SET
  emulator_core = 'pcsx_rearmed',
  emulatorjs_core = 'pcsx_rearmed',
  retroarch_core = 'pcsx_rearmed_libretro',
  rom_extensions = ARRAY['.bin', '.cue', '.iso', '.img', '.pbp', '.chd']
WHERE short_name = 'PS1';

UPDATE platforms SET
  emulator_core = 'genesis_plus_gx',
  emulatorjs_core = 'genesis_plus_gx',
  retroarch_core = 'genesis_plus_gx_libretro',
  rom_extensions = ARRAY['.gen', '.md', '.smd', '.bin', '.zip']
WHERE short_name = 'Genesis';

UPDATE platforms SET
  emulator_core = 'gambatte',
  emulatorjs_core = 'gambatte',
  retroarch_core = 'gambatte_libretro',
  rom_extensions = ARRAY['.gbc', '.gb', '.zip']
WHERE short_name = 'GBC';

-- 1.3 — Inserir novas plataformas
INSERT INTO platforms (name, short_name, brand_color, manufacturer, year_released, emulator_core, emulatorjs_core, retroarch_core, rom_extensions) VALUES
('Nintendo Entertainment System', 'NES', '#E60012', 'Nintendo', 1985, 'fceumm', 'fceumm', 'fceumm_libretro', ARRAY['.nes', '.fds', '.unf', '.zip']),
('Game Boy', 'GB', '#8BAC0F', 'Nintendo', 1989, 'gambatte', 'gambatte', 'gambatte_libretro', ARRAY['.gb', '.zip']),
('Game Boy Advance', 'GBA', '#7C3F98', 'Nintendo', 2001, 'mgba', 'mgba', 'mgba_libretro', ARRAY['.gba', '.zip']),
('Nintendo 64', 'N64', '#E60012', 'Nintendo', 1996, 'mupen64plus_next', 'mupen64plus', 'mupen64plus_next_libretro', ARRAY['.n64', '.z64', '.v64', '.zip']),
('Nintendo DS', 'NDS', '#CC0000', 'Nintendo', 2004, 'melonds', 'melonds', 'melonds_libretro', ARRAY['.nds', '.zip']),
('Sega Master System', 'SMS', '#000066', 'Sega', 1986, 'genesis_plus_gx', 'genesis_plus_gx', 'genesis_plus_gx_libretro', ARRAY['.sms', '.bin', '.zip']),
('Sega Saturn', 'Saturn', '#1A3A6A', 'Sega', 1994, 'mednafen_saturn', 'yabause', 'mednafen_saturn_libretro', ARRAY['.bin', '.cue', '.iso', '.img', '.chd']),
('Sega Game Gear', 'GG', '#000000', 'Sega', 1990, 'genesis_plus_gx', 'genesis_plus_gx', 'genesis_plus_gx_libretro', ARRAY['.gg', '.bin', '.zip']),
('Sega 32X', '32X', '#1A1A1A', 'Sega', 1994, 'picodrive', 'picodrive', 'picodrive_libretro', ARRAY['.32x', '.bin', '.zip']),
('PlayStation 2', 'PS2', '#00439C', 'Sony', 2000, 'pcsx2', NULL, NULL, ARRAY['.iso', '.bin', '.img', '.mdf', '.gz', '.chd']),
('PlayStation Portable', 'PSP', '#003087', 'Sony', 2005, 'ppsspp', 'ppsspp', 'ppsspp_libretro', ARRAY['.iso', '.cso', '.pbp', '.elf']),
('Atari 2600', 'Atari2600', '#FF6600', 'Atari', 1977, 'stella2014', 'stella', 'stella2014_libretro', ARRAY['.a26', '.bin', '.zip']),
('Neo Geo', 'NeoGeo', '#CC0000', 'SNK', 1990, 'fbneo', 'fbneo', 'fbneo_libretro', ARRAY['.zip', '.rom']),
('Arcade (MAME)', 'MAME', '#FF0000', 'Various', 1970, 'mame2003_plus', 'mame2003', 'mame2003_plus_libretro', ARRAY['.zip', '.chd'])
ON CONFLICT (short_name) DO NOTHING;

-- 1.4 — Completar o Glossário
INSERT INTO glossary (term, definition, category, related_terms) VALUES
('PPU', 'Picture Processing Unit. O chip responsável por gerar o sinal de vídeo em consoles como o NES e SNES. No SNES, o PPU suportava Mode 7, transparência e até 32.768 cores simultâneas.', 'Hardware', ARRAY['VDP', 'GPU', 'Mode 7']),
('VDP', 'Video Display Processor. Processador de vídeo comum em consoles da Sega (Master System, Mega Drive). O VDP do Mega Drive suportava 64 cores de uma paleta de 512 e sprites de 8x8 até 32x32 pixels.', 'Hardware', ARRAY['PPU', 'Sprite', 'Blast Processing']),
('Mode 7', 'Modo gráfico exclusivo do SNES que permite rotacionar, escalar e inclinar uma camada de fundo, criando um efeito pseudo-3D. Usado em F-Zero, Mario Kart e Super Mario RPG.', 'Rendering', ARRAY['SNES', 'PPU', 'Parallax Scrolling']),
('Blast Processing', 'Termo de marketing usado pela Sega para descrever a alta velocidade de clock da CPU do Mega Drive (7.61 MHz) comparada ao SNES (3.58 MHz). Na prática, o impacto variava por jogo.', 'Performance', ARRAY['CPU', 'Mega Drive', 'VDP']),
('Parallax Scrolling', 'Técnica onde múltiplas camadas de background se movem em velocidades diferentes para criar ilusão de profundidade. Muito usada em jogos de plataforma como Sonic e Super Mario World.', 'Rendering', ARRAY['Mode 7', 'PPU', 'VDP']),
('SRAM', 'Static Random Access Memory. Tipo de memória usada em cartuchos para salvar o progresso do jogo via bateria interna. Quando a bateria morre, os saves são perdidos permanentemente.', 'Hardware', ARRAY['Save State', 'Battery Backup']),
('DMA', 'Direct Memory Access. Permite que o hardware transfira dados entre dispositivos sem passar pela CPU, acelerando o processamento de sprites e sons. Fundamental para o desempenho do SNES e PS1.', 'Performance', ARRAY['CPU', 'Bus', 'PPU']),
('Framebuffer', 'Área de memória RAM que armazena os dados de um frame de vídeo completo antes de ser enviado ao display. Double buffering usa dois framebuffers para eliminar tearing.', 'Rendering', ARRAY['PPU', 'VDP', 'Scanline']),
('Scanline', 'Linhas horizontais individuais que compunham a imagem em monitores CRT. Emuladores modernos oferecem filtros que recriam o efeito visual das scanlines para autenticidade retro.', 'Rendering', ARRAY['CRT', 'Framebuffer', 'PPU']),
('CRT', 'Cathode Ray Tube. Tecnologia de monitores que usava um feixe de elétrons para iluminar fósforos. Os jogos retro foram desenhados especificamente para este display, com pixels maiores e bordas suavizadas.', 'Hardware', ARRAY['Scanline', 'Framebuffer']),
('Input Lag', 'O atraso entre o comando do jogador e a ação na tela, medido em milissegundos. Emulação pode introduzir 1-3 frames de lag extra. Crucial em jogos de ritmo e luta.', 'Performance', ARRAY['Latency', 'Frame Rate']),
('BIOS', 'Basic Input/Output System. Pequeno firmware necessário para iniciar o hardware de sistemas como PlayStation, Saturn e Neo Geo. Emuladores precisam deste arquivo para funcionar corretamente.', 'Hardware', ARRAY['Firmware', 'ROM']),
('ROM Hack', 'Versão modificada de um jogo original criada por fãs: traduções, correções de bugs, novos níveis ou jogos completamente novos construídos sobre o engine original.', 'Geral', ARRAY['ROM', 'Patch', 'IPS'])
ON CONFLICT (term) DO NOTHING;

-- 1.5 — Inserir Screenshots para jogos existentes
-- Super Mario World
INSERT INTO game_screenshots (game_id, url, "order")
SELECT g.id, url, ord FROM games g,
(VALUES
  ('https://www.mobygames.com/images/shots/l/31466-super-mario-world-snes-screenshot-the-first-level.jpg', 1),
  ('https://www.mobygames.com/images/shots/l/31467-super-mario-world-snes-screenshot-yoshi-island.jpg', 2),
  ('https://www.mobygames.com/images/shots/l/31468-super-mario-world-snes-screenshot-vanilla-dome.jpg', 3)
) AS s(url, ord)
WHERE g.slug = 'super-mario-world'
ON CONFLICT DO NOTHING;

-- Final Fantasy VII
INSERT INTO game_screenshots (game_id, url, "order")
SELECT g.id, url, ord FROM games g,
(VALUES
  ('https://www.mobygames.com/images/shots/l/36697-final-fantasy-vii-playstation-screenshot-the-opening-cinematic.jpg', 1),
  ('https://www.mobygames.com/images/shots/l/36698-final-fantasy-vii-playstation-screenshot-midgar.jpg', 2)
) AS s(url, ord)
WHERE g.slug = 'final-fantasy-vii'
ON CONFLICT DO NOTHING;

-- Sonic the Hedgehog 2
INSERT INTO game_screenshots (game_id, url, "order")
SELECT g.id, url, ord FROM games g,
(VALUES
  ('https://www.mobygames.com/images/shots/l/105977-sonic-the-hedgehog-2-genesis-screenshot-emerald-hill-zone.jpg', 1),
  ('https://www.mobygames.com/images/shots/l/105978-sonic-the-hedgehog-2-genesis-screenshot-chemical-plant-zone.jpg', 2)
) AS s(url, ord)
WHERE g.slug = 'sonic-2'
ON CONFLICT DO NOTHING;

-- 1.6 — Inserir vídeos YouTube para jogos existentes
INSERT INTO game_videos (game_id, youtube_id, title, type)
SELECT g.id, yt_id, yt_title, yt_type FROM games g,
(VALUES
  ('super-mario-world', 'u66G6vXj6hY', 'Super Mario World - Full Playthrough', 'gameplay'),
  ('zelda-alttp', 'f-lMhkKFN1Y', 'Zelda: A Link to the Past - Official Trailer', 'trailer'),
  ('super-metroid', 'H0sGvDwS3bM', 'Super Metroid - Gameplay (SNES)', 'gameplay'),
  ('final-fantasy-vii', 'yDKTjVfUbDk', 'Final Fantasy VII - Opening Cinematic', 'trailer'),
  ('metal-gear-solid', '7UGzc6pXeSs', 'Metal Gear Solid - Gameplay PS1', 'gameplay'),
  ('crash-bandicoot', 'rAqM-Lc4T3k', 'Crash Bandicoot - PS1 Gameplay', 'gameplay'),
  ('sonic-2', 'jqrg7HMhT9Q', 'Sonic the Hedgehog 2 - Emerald Hill Zone', 'gameplay'),
  ('donkey-kong-country', 'mHCuLqWx5E0', 'Donkey Kong Country - SNES Gameplay', 'gameplay')
) AS v(slug, yt_id, yt_title, yt_type)
WHERE g.slug = v.slug
ON CONFLICT DO NOTHING;

-- 1.7 — Novos jogos para as novas plataformas
-- NES Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES
('Super Mario Bros.', 'super-mario-bros', (SELECT id FROM platforms WHERE short_name = 'NES'), 'https://www.igdb.com/games/super-mario-bros--1/cover', 'O jogo que salvou a indústria de videogames. Mario e Luigi devem resgatar a Princesa Peach das garras de Bowser atravessando o Reino Mushroom em 32 fases icônicas.', ARRAY['Platformer', 'Action'], 1985, 'Nintendo', 'Nintendo', 2, '{"cpu": "Ricoh 2A03 @ 1.79 MHz", "ppu": "Ricoh 2C02 @ 5.37 MHz", "resolution": "256×240", "colors": "52 disponíveis (25 simultâneas)", "sound_channels": "5 (2 pulse, 1 triangle, 1 noise, 1 DPCM)", "save_type": "Sem save (3 vidas)"}'),
('Mega Man 2', 'mega-man-2', (SELECT id FROM platforms WHERE short_name = 'NES'), 'https://upload.wikimedia.org/wikipedia/en/c/c6/Mega_Man_2_cover.jpg', 'Frequentemente citado como o melhor jogo do NES, Mega Man 2 apresenta 8 Robot Masters memoráveis, trilha sonora lendária e design de fases impecável.', ARRAY['Action', 'Platformer'], 1988, 'Capcom', 'Capcom', 1, '{"cpu": "Ricoh 2A03 @ 1.79 MHz", "resolution": "256×240", "colors": "52 na paleta", "sound_channels": 5, "save_type": "Password System"}'),
('Castlevania', 'castlevania', (SELECT id FROM platforms WHERE short_name = 'NES'), 'https://upload.wikimedia.org/wikipedia/en/5/55/Castlevania_NES_cover_art.jpg', 'Simon Belmont enfrenta o Conde Drácula no clássico de ação-plataforma da Konami. Um dos jogos mais desafiantes e icônicos do NES, com progressão de fases não-linear.', ARRAY['Action', 'Platformer', 'Horror'], 1987, 'Konami', 'Konami', 1, '{"cpu": "Ricoh 2A03 @ 1.79 MHz", "resolution": "256×240", "mapper": "MMC1 (128KB ROM)", "save_type": "Password System"}');

-- Game Boy Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES
('Tetris', 'tetris-gb', (SELECT id FROM platforms WHERE short_name = 'GB'), 'https://upload.wikimedia.org/wikipedia/en/4/4a/Tetris_Boxshot.jpg', 'O jogo perfeito para o portátil perfeito. Tetris foi incluído com o Game Boy e se tornou o jogo mais vendido do sistema, vendendo 35 milhões de cópias.', ARRAY['Puzzle'], 1989, 'Nintendo R&D1', 'Nintendo', 2, '{"cpu": "Sharp LR35902 @ 4.19 MHz", "resolution": "160×144", "colors": "4 tons de cinza", "sound_channels": 4, "battery": "AA × 4", "battery_life": "~35h"}'),
('Link''s Awakening', 'links-awakening-gb', (SELECT id FROM platforms WHERE short_name = 'GB'), 'https://upload.wikimedia.org/wikipedia/en/4/42/Links_Awakening_box.jpg', 'Zelda portátil e surpreendentemente profundo. Link acorda em Koholint Island após um naufrágio e deve despertar o Peixe do Vento para retornar à sua terra.', ARRAY['Action-Adventure', 'RPG'], 1993, 'Nintendo EAD', 'Nintendo', 1, '{"cpu": "Sharp LR35902 @ 4.19 MHz", "resolution": "160×144", "save_type": "SRAM Battery", "mapper": "MBC5"}');

-- GBA Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES
('Metroid Fusion', 'metroid-fusion', (SELECT id FROM platforms WHERE short_name = 'GBA'), 'https://upload.wikimedia.org/wikipedia/en/3/30/Metroid_Fusion_box_art.png', 'Samus é infectada pelo parasita X e deve explorar a BSL Research Station orbitando SR388. Considerado um dos melhores jogos portáteis de todos os tempos.', ARRAY['Action', 'Adventure', 'Metroidvania'], 2002, 'Nintendo R&D1', 'Nintendo', 1, '{"cpu": "ARM7TDMI @ 16.78 MHz", "resolution": "240×160", "colors": "32.768 simultâneas", "ram": "32KB WRAM + 96KB VRAM", "save_type": "Flash 128K"}'),
('Fire Emblem', 'fire-emblem-gba', (SELECT id FROM platforms WHERE short_name = 'GBA'), 'https://upload.wikimedia.org/wikipedia/en/f/f4/FireEmblemGBA.jpg', 'O primeiro Fire Emblem lançado no Ocidente. Lyn, Eliwood e Hector lideram exércitos em batalhas táticas onde a morte dos personagens é permanente.', ARRAY['Strategy', 'RPG', 'Tactical'], 2003, 'Intelligent Systems', 'Nintendo', 1, '{"cpu": "ARM7TDMI @ 16.78 MHz", "resolution": "240×160", "save_type": "Flash 128K", "permadeath": "true"}');

-- N64 Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES
('Super Mario 64', 'super-mario-64', (SELECT id FROM platforms WHERE short_name = 'N64'), 'https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg', 'O jogo que definiu o 3D moderno. Mario deve coletar as Power Stars espalhadas pelo Castelo da Princesa Peach para derrotar Bowser. Revolucionou os controles analógicos.', ARRAY['Platformer', '3D', 'Action'], 1996, 'Nintendo EAD', 'Nintendo', 1, '{"cpu": "NEC VR4300 @ 93.75 MHz", "rdp": "Reality Display Processor", "resolution": "240p / 480i", "ram": "4MB RDRAM (expansível para 8MB)", "polygons": "~100k/s", "save_type": "EEPROM 4KB"}'),
('The Legend of Zelda: Ocarina of Time', 'zelda-ocarina-of-time', (SELECT id FROM platforms WHERE short_name = 'N64'), 'https://upload.wikimedia.org/wikipedia/en/5/57/The_Legend_of_Zelda_Ocarina_of_Time.jpg', 'Frequentemente eleito o melhor jogo já criado. Link viaja entre passado e futuro para derrotar Ganondorf em Hyrule. Introduziu o Z-targeting que influencia jogos até hoje.', ARRAY['Action-Adventure', '3D'], 1998, 'Nintendo EAD', 'Nintendo', 1, '{"cpu": "NEC VR4300 @ 93.75 MHz", "resolution": "240p", "save_type": "EEPROM 16KB", "expansion_pak": "optional"}')
ON CONFLICT (slug) DO NOTHING;
