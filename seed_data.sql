-- Seed para Glossário
insert into glossary (term, definition, category, related_terms) values
('PPU', 'Picture Processing Unit. O chip responsável por gerar o sinal de vídeo em consoles como o NES e SNES.', 'Hardware', ARRAY['VDP', 'GPU']),
('VDP', 'Video Display Processor. Processador de vídeo comum em consoles da Sega (Master System, Mega Drive).', 'Hardware', ARRAY['PPU']),
('Mode 7', 'Modo gráfico do SNES que permite rotacionar e inclinar uma camada de fundo, criando um efeito 3D pseudo-espacial.', 'Rendering', ARRAY['SNES', 'Sprite']),
('Blast Processing', 'Termo de marketing usado pela Sega para descrever a alta velocidade de clock da CPU do Mega Drive comparada ao SNES.', 'Performance', ARRAY['CPU', 'Mega Drive']),
('Parallax Scrolling', 'Técnica onde as camadas de fundo se movem mais devagar que as de frente, criando ilusão de profundidade.', 'Rendering', ARRAY['Mode 7']),
('SRAM', 'Static Random Access Memory. Tipo de memória usada em cartuchos para salvar o progresso do jogo via bateria.', 'Hardware', ARRAY['Save State']),
('DMA', 'Direct Memory Access. Permite que o hardware transfira dados entre dispositivos sem passar pela CPU, acelerando o processamento.', 'Performance', ARRAY['CPU', 'Bus']),
('Framebuffer', 'Área de memória RAM que armazena os dados de um frame de vídeo completo antes de ser enviado ao monitor.', 'Rendering', ARRAY['PPU', 'VDP']),
('Scanline', 'Linhas horizontais individuais que compunham a imagem em monitores CRT. Emuladores costumam usar filtros para recriar este efeito.', 'Rendering', ARRAY['CRT', 'Filter']),
('CRT', 'Cathode Ray Tube. A tecnologia de monitores antigos que influenciou como os gráficos retro eram desenhados.', 'Hardware', ARRAY['Scanline']),
('Input Lag', 'O atraso entre o comando do jogador e a ação na tela. Emulação costuma introduzir mais lag que o hardware real.', 'Performance', ARRAY['Latency']),
('BIOS', 'Basic Input/Output System. Pequeno software necessário para iniciar o hardware de sistemas como PlayStation ou Saturn.', 'Hardware', ARRAY['Firmware']),
('ROM Hack', 'Uma versão modificada de um jogo original, criada por fãs para tradução, correção de bugs ou novas fases.', 'Geral', ARRAY['ROM', 'Patch']);

-- Seed para Vídeos de Exemplo (IDs do YouTube)
-- Super Mario World (Assumindo que o slug é 'super-mario-world')
insert into game_videos (game_id, youtube_id, title, type)
select id, 'u66G6vXj6hY', 'Super Mario World Gameplay', 'gameplay'
from games where slug = 'super-mario-world';

-- Pokémon Red/Blue
insert into game_videos (game_id, youtube_id, title, type)
select id, 'u_p0-UuV2-s', 'Pokemon Red/Blue Trailer', 'trailer'
from games where slug = 'pokemon-red-blue';

-- Seed para Screenshots de Exemplo
-- Super Mario World
insert into game_screenshots (game_id, url, "order")
select id, 'https://images.igdb.com/igdb/image/upload/t_720p/sc6v4p.jpg', 1 from games where slug = 'super-mario-world';
insert into game_screenshots (game_id, url, "order")
select id, 'https://images.igdb.com/igdb/image/upload/t_720p/sc6v4o.jpg', 2 from games where slug = 'super-mario-world';

-- Pokémon Red/Blue
insert into game_screenshots (game_id, url, "order")
select id, 'https://images.igdb.com/igdb/image/upload/t_720p/sc88f2.jpg', 1 from games where slug = 'pokemon-red-blue';
insert into game_screenshots (game_id, url, "order")
select id, 'https://images.igdb.com/igdb/image/upload/t_720p/sc88f1.jpg', 2 from games where slug = 'pokemon-red-blue';
