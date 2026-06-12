# 📋 GAMEPLEX — Sincronização & Mudanças para Aplicar

> Gerado em: Junho 2026  
> Baseado em: Análise do repositório Daijishou + Estado atual do Supabase

---

## 📊 Estado Atual do Banco (Confirmado via MCP)

| Tabela | Registros | Status |
|--------|-----------|--------|
| `platforms` | 4 (GBC, PS1, Genesis, SNES) | ✅ |
| `games` | 13 jogos | ✅ |
| `glossary` | **3 termos** (faltam 10 do seed) | ⚠️ |
| `game_videos` | **0** | ❌ |
| `game_screenshots` | **0** | ❌ |
| `user_lists` | 0 | ⏳ |

---

## 🗄️ PARTE 1 — SQL para Rodar no Supabase Studio

### 1.1 — Adicionar coluna `emulator_core` e `rom_extensions` na tabela `platforms`

> **Por que?** Dados extraídos do Daijishou mostram que cada plataforma tem um core de emulação específico (RetroArch/EmulatorJS) e extensões de ROM aceitas. Isso alimentará o `EmulatorPlayer.jsx`.

```sql
ALTER TABLE platforms 
  ADD COLUMN IF NOT EXISTS emulator_core text,
  ADD COLUMN IF NOT EXISTS rom_extensions text[],
  ADD COLUMN IF NOT EXISTS retroarch_core text,
  ADD COLUMN IF NOT EXISTS emulatorjs_core text;
```

### 1.2 — Atualizar plataformas existentes com dados do Daijishou

```sql
-- Super Nintendo
UPDATE platforms SET
  emulator_core = 'snes9x',
  emulatorjs_core = 'snes9x',
  retroarch_core = 'snes9x_libretro',
  rom_extensions = ARRAY['.sfc', '.smc', '.zip', '.7z']
WHERE short_name = 'SNES';

-- PlayStation 1
UPDATE platforms SET
  emulator_core = 'pcsx_rearmed',
  emulatorjs_core = 'pcsx_rearmed',
  retroarch_core = 'pcsx_rearmed_libretro',
  rom_extensions = ARRAY['.bin', '.cue', '.iso', '.img', '.pbp', '.chd']
WHERE short_name = 'PS1';

-- Sega Genesis / Mega Drive
UPDATE platforms SET
  emulator_core = 'genesis_plus_gx',
  emulatorjs_core = 'genesis_plus_gx',
  retroarch_core = 'genesis_plus_gx_libretro',
  rom_extensions = ARRAY['.gen', '.md', '.smd', '.bin', '.zip']
WHERE short_name = 'Genesis';

-- Game Boy Color
UPDATE platforms SET
  emulator_core = 'gambatte',
  emulatorjs_core = 'gambatte',
  retroarch_core = 'gambatte_libretro',
  rom_extensions = ARRAY['.gbc', '.gb', '.zip']
WHERE short_name = 'GBC';
```

### 1.3 — Inserir novas plataformas (baseadas no catálogo do Daijishou)

```sql
INSERT INTO platforms (name, short_name, brand_color, manufacturer, year_released, emulator_core, emulatorjs_core, retroarch_core, rom_extensions) VALUES

-- Nintendo
('Nintendo Entertainment System', 'NES', '#E60012', 'Nintendo', 1985,
 'fceumm', 'fceumm', 'fceumm_libretro',
 ARRAY['.nes', '.fds', '.unf', '.zip']),

('Game Boy', 'GB', '#8BAC0F', 'Nintendo', 1989,
 'gambatte', 'gambatte', 'gambatte_libretro',
 ARRAY['.gb', '.zip']),

('Game Boy Advance', 'GBA', '#7C3F98', 'Nintendo', 2001,
 'mgba', 'mgba', 'mgba_libretro',
 ARRAY['.gba', '.zip']),

('Nintendo 64', 'N64', '#E60012', 'Nintendo', 1996,
 'mupen64plus_next', 'mupen64plus', 'mupen64plus_next_libretro',
 ARRAY['.n64', '.z64', '.v64', '.zip']),

('Nintendo DS', 'NDS', '#CC0000', 'Nintendo', 2004,
 'melonds', 'melonds', 'melonds_libretro',
 ARRAY['.nds', '.zip']),

-- Sega
('Sega Master System', 'SMS', '#000066', 'Sega', 1986,
 'genesis_plus_gx', 'genesis_plus_gx', 'genesis_plus_gx_libretro',
 ARRAY['.sms', '.bin', '.zip']),

('Sega Saturn', 'Saturn', '#1A3A6A', 'Sega', 1994,
 'mednafen_saturn', 'yabause', 'mednafen_saturn_libretro',
 ARRAY['.bin', '.cue', '.iso', '.img', '.chd']),

('Sega Game Gear', 'GG', '#000000', 'Sega', 1990,
 'genesis_plus_gx', 'genesis_plus_gx', 'genesis_plus_gx_libretro',
 ARRAY['.gg', '.bin', '.zip']),

('Sega 32X', '32X', '#1A1A1A', 'Sega', 1994,
 'picodrive', 'picodrive', 'picodrive_libretro',
 ARRAY['.32x', '.bin', '.zip']),

-- Sony
('PlayStation 2', 'PS2', '#00439C', 'Sony', 2000,
 'pcsx2', NULL, NULL,
 ARRAY['.iso', '.bin', '.img', '.mdf', '.gz', '.chd']),

('PlayStation Portable', 'PSP', '#003087', 'Sony', 2005,
 'ppsspp', 'ppsspp', 'ppsspp_libretro',
 ARRAY['.iso', '.cso', '.pbp', '.elf']),

-- Outros
('Atari 2600', 'Atari2600', '#FF6600', 'Atari', 1977,
 'stella2014', 'stella', 'stella2014_libretro',
 ARRAY['.a26', '.bin', '.zip']),

('Neo Geo', 'NeoGeo', '#CC0000', 'SNK', 1990,
 'fbneo', 'fbneo', 'fbneo_libretro',
 ARRAY['.zip', '.rom']),

('Arcade (MAME)', 'MAME', '#FF0000', 'Various', 1970,
 'mame2003_plus', 'mame2003', 'mame2003_plus_libretro',
 ARRAY['.zip', '.chd'])
ON CONFLICT (short_name) DO NOTHING;
```

### 1.4 — Completar o Glossário (10 termos faltando do seed original)

```sql
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
```

### 1.5 — Inserir Screenshots reais para jogos existentes

```sql
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
```

### 1.6 — Inserir vídeos YouTube para jogos existentes

```sql
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
```

### 1.7 — Novos jogos para as novas plataformas

```sql
-- NES Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES

('Super Mario Bros.', 'super-mario-bros', 
  (SELECT id FROM platforms WHERE short_name = 'NES'),
  'https://www.igdb.com/games/super-mario-bros--1/cover',
  'O jogo que salvou a indústria de videogames. Mario e Luigi devem resgatar a Princesa Peach das garras de Bowser atravessando o Reino Mushroom em 32 fases icônicas.',
  ARRAY['Platformer', 'Action'], 1985, 'Nintendo', 'Nintendo', 2,
  '{"cpu": "Ricoh 2A03 @ 1.79 MHz", "ppu": "Ricoh 2C02 @ 5.37 MHz", "resolution": "256×240", "colors": "52 disponíveis (25 simultâneas)", "sound_channels": "5 (2 pulse, 1 triangle, 1 noise, 1 DPCM)", "save_type": "Sem save (3 vidas)"}'),

('Mega Man 2', 'mega-man-2',
  (SELECT id FROM platforms WHERE short_name = 'NES'),
  'https://upload.wikimedia.org/wikipedia/en/c/c6/Mega_Man_2_cover.jpg',
  'Frequentemente citado como o melhor jogo do NES, Mega Man 2 apresenta 8 Robot Masters memoráveis, trilha sonora lendária e design de fases impecável.',
  ARRAY['Action', 'Platformer'], 1988, 'Capcom', 'Capcom', 1,
  '{"cpu": "Ricoh 2A03 @ 1.79 MHz", "resolution": "256×240", "colors": "52 na paleta", "sound_channels": 5, "save_type": "Password System"}'),

('Castlevania', 'castlevania',
  (SELECT id FROM platforms WHERE short_name = 'NES'),
  'https://upload.wikimedia.org/wikipedia/en/5/55/Castlevania_NES_cover_art.jpg',
  'Simon Belmont enfrenta o Conde Drácula no clássico de ação-plataforma da Konami. Um dos jogos mais desafiantes e icônicos do NES, com progressão de fases não-linear.',
  ARRAY['Action', 'Platformer', 'Horror'], 1987, 'Konami', 'Konami', 1,
  '{"cpu": "Ricoh 2A03 @ 1.79 MHz", "resolution": "256×240", "mapper": "MMC1 (128KB ROM)", "save_type": "Password System"}');

-- Game Boy Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES

('Tetris', 'tetris-gb',
  (SELECT id FROM platforms WHERE short_name = 'GB'),
  'https://upload.wikimedia.org/wikipedia/en/4/4a/Tetris_Boxshot.jpg',
  'O jogo perfeito para o portátil perfeito. Tetris foi incluído com o Game Boy e se tornou o jogo mais vendido do sistema, vendendo 35 milhões de cópias.',
  ARRAY['Puzzle'], 1989, 'Nintendo R&D1', 'Nintendo', 2,
  '{"cpu": "Sharp LR35902 @ 4.19 MHz", "resolution": "160×144", "colors": "4 tons de cinza", "sound_channels": 4, "battery": "AA × 4", "battery_life": "~35h"}'),

('Link''s Awakening', 'links-awakening-gb',
  (SELECT id FROM platforms WHERE short_name = 'GB'),
  'https://upload.wikimedia.org/wikipedia/en/4/42/Links_Awakening_box.jpg',
  'Zelda portátil e surpreendentemente profundo. Link acorda em Koholint Island após um naufrágio e deve despertar o Peixe do Vento para retornar à sua terra.',
  ARRAY['Action-Adventure', 'RPG'], 1993, 'Nintendo EAD', 'Nintendo', 1,
  '{"cpu": "Sharp LR35902 @ 4.19 MHz", "resolution": "160×144", "save_type": "SRAM Battery", "mapper": "MBC5"}');

-- GBA Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES

('Metroid Fusion', 'metroid-fusion',
  (SELECT id FROM platforms WHERE short_name = 'GBA'),
  'https://upload.wikimedia.org/wikipedia/en/3/30/Metroid_Fusion_box_art.png',
  'Samus é infectada pelo parasita X e deve explorar a BSL Research Station orbitando SR388. Considerado um dos melhores jogos portáteis de todos os tempos.',
  ARRAY['Action', 'Adventure', 'Metroidvania'], 2002, 'Nintendo R&D1', 'Nintendo', 1,
  '{"cpu": "ARM7TDMI @ 16.78 MHz", "resolution": "240×160", "colors": "32.768 simultâneas", "ram": "32KB WRAM + 96KB VRAM", "save_type": "Flash 128K"}'),

('Fire Emblem', 'fire-emblem-gba',
  (SELECT id FROM platforms WHERE short_name = 'GBA'),
  'https://upload.wikimedia.org/wikipedia/en/f/f4/FireEmblemGBA.jpg',
  'O primeiro Fire Emblem lançado no Ocidente. Lyn, Eliwood e Hector lideram exércitos em batalhas táticas onde a morte dos personagens é permanente.',
  ARRAY['Strategy', 'RPG', 'Tactical'], 2003, 'Intelligent Systems', 'Nintendo', 1,
  '{"cpu": "ARM7TDMI @ 16.78 MHz", "resolution": "240×160", "save_type": "Flash 128K", "permadeath": "true"}');

-- N64 Games
INSERT INTO games (title, slug, platform_id, cover_url, description, genre, year, developer, publisher, players, technical_specs) VALUES

('Super Mario 64', 'super-mario-64',
  (SELECT id FROM platforms WHERE short_name = 'N64'),
  'https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg',
  'O jogo que definiu o 3D moderno. Mario deve coletar as Power Stars espalhadas pelo Castelo da Princesa Peach para derrotar Bowser. Revolucionou os controles analógicos.',
  ARRAY['Platformer', '3D', 'Action'], 1996, 'Nintendo EAD', 'Nintendo', 1,
  '{"cpu": "NEC VR4300 @ 93.75 MHz", "rdp": "Reality Display Processor", "resolution": "240p / 480i", "ram": "4MB RDRAM (expansível para 8MB)", "polygons": "~100k/s", "save_type": "EEPROM 4KB"}'),

('The Legend of Zelda: Ocarina of Time', 'zelda-ocarina-of-time',
  (SELECT id FROM platforms WHERE short_name = 'N64'),
  'https://upload.wikimedia.org/wikipedia/en/5/57/The_Legend_of_Zelda_Ocarina_of_Time.jpg',
  'Frequentemente eleito o melhor jogo já criado. Link viaja entre passado e futuro para derrotar Ganondorf em Hyrule. Introduziu o Z-targeting que influencia jogos até hoje.',
  ARRAY['Action-Adventure', '3D'], 1998, 'Nintendo EAD', 'Nintendo', 1,
  '{"cpu": "NEC VR4300 @ 93.75 MHz", "resolution": "240p", "save_type": "EEPROM 16KB", "expansion_pak": "optional"}')

ON CONFLICT (slug) DO NOTHING;
```

---

## 💻 PARTE 2 — Arquivos de Código para Criar/Atualizar

### 2.1 — `src/hooks/useDebounce.js` (NOVO — ainda pendente do Roadmap)

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 2.2 — `src/app/page.js` — Aplicar debounce e filtros por URL

Substituir o `useEffect` de filtro por:

```javascript
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import HeroBanner from "@/components/hero-banner/HeroBanner";
import Carousel from "@/components/carousel/Carousel";
import GameCard from "@/components/game-card/GameCard";
import { useGameStore } from "@/store/useGameStore";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const [data, setData] = useState({ featuredGame: null, platforms: [] });
  const [filteredGames, setFilteredGames] = useState([]);
  const { searchQuery } = useGameStore();
  
  // ✅ NOVO: debounce de 300ms no search
  const debouncedQuery = useDebounce(searchQuery, 300);

  // ✅ NOVO: filtros por URL
  const searchParams = useSearchParams();
  const genreFilter = searchParams.get("genre");
  const platformFilter = searchParams.get("platform");

  useEffect(() => {
    async function fetchData() {
      const { data: featured } = await supabase
        .from("games")
        .select("*")
        .limit(1)
        .single();

      let query = supabase.from("platforms").select(`id, name, games (*)`);
      if (platformFilter) {
        query = supabase
          .from("platforms")
          .select(`id, name, games (*)`)
          .eq("short_name", platformFilter);
      }

      const { data: plats } = await query;
      setData({ featuredGame: featured, platforms: plats || [] });
    }
    fetchData();
  }, [platformFilter]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setFilteredGames([]);
      return;
    }

    let allGames = data.platforms.flatMap((p) => p.games);

    // ✅ NOVO: filtro por gênero
    if (genreFilter) {
      allGames = allGames.filter((g) =>
        g.genre?.some((genre) =>
          genre.toLowerCase().includes(genreFilter.toLowerCase())
        )
      );
    }

    const filtered = allGames.filter((g) =>
      g.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [debouncedQuery, data.platforms, genreFilter]);

  // ... resto do JSX igual, mas trocando searchQuery por debouncedQuery nas condicionais
}
```

### 2.3 — `src/components/EmulatorPlayer.jsx` — Mapear cores por plataforma (dados Daijishou)

Atualizar o arquivo para usar os cores corretos por plataforma:

```javascript
// Adicionar este mapa de cores ANTES do componente:
const EMULATORJS_CORES = {
  'SNES': { core: 'snes9x', extensions: ['.sfc', '.smc', '.zip'] },
  'NES':  { core: 'fceumm', extensions: ['.nes', '.zip'] },
  'GB':   { core: 'gambatte', extensions: ['.gb', '.zip'] },
  'GBC':  { core: 'gambatte', extensions: ['.gbc', '.gb', '.zip'] },
  'GBA':  { core: 'mgba', extensions: ['.gba', '.zip'] },
  'N64':  { core: 'mupen64plus', extensions: ['.n64', '.z64', '.v64'] },
  'PS1':  { core: 'pcsx_rearmed', extensions: ['.bin', '.cue', '.iso'] },
  'Genesis': { core: 'genesis_plus_gx', extensions: ['.gen', '.md', '.zip'] },
  'SMS':  { core: 'genesis_plus_gx', extensions: ['.sms', '.zip'] },
  'GG':   { core: 'genesis_plus_gx', extensions: ['.gg', '.zip'] },
  'PSP':  { core: 'ppsspp', extensions: ['.iso', '.cso', '.pbp'] },
  'Atari2600': { core: 'stella', extensions: ['.a26', '.bin', '.zip'] },
  'NeoGeo': { core: 'fbneo', extensions: ['.zip'] },
  'MAME': { core: 'mame2003', extensions: ['.zip', '.chd'] },
};

// No componente, substituir o texto hardcoded:
const platformShortName = game.platforms?.short_name;
const coreInfo = EMULATORJS_CORES[platformShortName] || { core: 'unknown', extensions: [] };
```

### 2.4 — `src/lib/supabase/server.js` (ainda vazio)

```javascript
// src/lib/supabase/server.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Para Server Components no App Router
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});
```

### 2.5 — `src/hooks/useGames.js` (ainda vazio)

```javascript
// src/hooks/useGames.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useGames(platformShortName = null) {
  return useQuery({
    queryKey: ['games', platformShortName],
    queryFn: async () => {
      let query = supabase
        .from('games')
        .select('*, platforms(name, short_name, brand_color)');

      if (platformShortName) {
        query = query.eq('platforms.short_name', platformShortName);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useGame(slug) {
  return useQuery({
    queryKey: ['game', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*, platforms(*), game_videos(*), game_screenshots(*)')
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('*, games(*)')
        .order('name');
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
```

### 2.6 — `src/hooks/useFavorites.js` (ainda vazio)

```javascript
// src/hooks/useFavorites.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useFavorites(userId) {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_lists')
        .select('*, games(*)')
        .eq('user_id', userId)
        .eq('list_type', 'favorites');
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const addFavorite = useMutation({
    mutationFn: async (gameId) => {
      const { error } = await supabase.from('user_lists').insert({
        user_id: userId,
        game_id: gameId,
        list_type: 'favorites',
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['favorites', userId]),
  });

  const removeFavorite = useMutation({
    mutationFn: async (gameId) => {
      const { error } = await supabase
        .from('user_lists')
        .delete()
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .eq('list_type', 'favorites');
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['favorites', userId]),
  });

  const isFavorite = (gameId) =>
    favorites.some((f) => f.game_id === gameId);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
```

### 2.7 — `public/manifest.json` (ainda não existe)

Criar o arquivo em `public/manifest.json`:

```json
{
  "name": "Gameplex",
  "short_name": "Gameplex",
  "description": "Catálogo de jogos retro estilo Netflix",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#09090b",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["games", "entertainment"],
  "lang": "pt-BR",
  "shortcuts": [
    {
      "name": "Minha Lista",
      "url": "/my-list",
      "description": "Ver favoritos"
    },
    {
      "name": "Glossário",
      "url": "/glossary",
      "description": "Termos técnicos"
    }
  ]
}
```

### 2.8 — `src/app/my-list/page.jsx` (ainda vazio)

```jsx
// src/app/my-list/page.jsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import GameCard from "@/components/game-card/GameCard";
import { Heart, Gamepad2, Star } from "lucide-react";
import Link from "next/link";

const TABS = [
  { key: "favorites", label: "Favoritos", icon: Heart },
  { key: "played", label: "Jogados", icon: Gamepad2 },
  { key: "wishlist", label: "Wishlist", icon: Star },
];

export default function MyListPage() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchList() {
      const { data } = await supabase
        .from("user_lists")
        .select("*, games(*)")
        .eq("user_id", user.id)
        .eq("list_type", activeTab);
      setGames(data?.map((d) => d.games) || []);
    }
    fetchList();
  }, [user, activeTab]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
    </div>
  );

  if (!user) return (
    <main className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-white gap-6">
      <Gamepad2 size={64} className="text-zinc-700" />
      <h1 className="text-2xl font-bold">Entre para ver sua lista</h1>
      <p className="text-zinc-500">Faça login para salvar seus jogos favoritos.</p>
      <Link href="/auth" className="rounded bg-red-600 px-8 py-3 font-bold hover:bg-red-700 transition">
        Entrar
      </Link>
    </main>
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 md:px-16">
      <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
        Minha <span className="text-red-600">Lista</span>
      </h1>

      <div className="flex gap-2 mb-12 border-b border-zinc-900 pb-4">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition ${
              activeTab === key
                ? "bg-red-600 text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {games.length === 0 ? (
        <p className="text-zinc-600 italic">Nenhum jogo nesta lista ainda.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {games.map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      )}
    </main>
  );
}
```

### 2.9 — `src/app/platform/[id]/page.jsx` (ainda vazio)

```jsx
// src/app/platform/[id]/page.jsx
import { supabase } from "@/lib/supabase/client";
import GameCard from "@/components/game-card/GameCard";
import PlatformBadge from "@/components/platform-badge/PlatformBadge";
import { notFound } from "next/navigation";

async function getPlatform(id) {
  const { data } = await supabase
    .from("platforms")
    .select("*, games(*)")
    .eq("id", id)
    .single();
  return data;
}

export default async function PlatformPage({ params }) {
  const platform = await getPlatform(params.id);
  if (!platform) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 md:px-16">
      <header className="mb-16">
        <PlatformBadge platform={platform} />
        <h1
          className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mt-4"
          style={{ color: platform.brand_color || "#fff" }}
        >
          {platform.name}
        </h1>
        <p className="text-zinc-500 mt-2">
          {platform.manufacturer} · {platform.year_released} · {platform.games?.length} jogos
        </p>
        {platform.rom_extensions && (
          <p className="text-zinc-700 text-xs mt-1 font-mono">
            ROMs: {platform.rom_extensions.join(" · ")}
          </p>
        )}
      </header>

      <div className="flex flex-wrap gap-6">
        {platform.games?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
}
```

### 2.10 — `src/store/useGameStore.js` — Adicionar filtros ao store

```javascript
// src/store/useGameStore.js
import { create } from "zustand";

export const useGameStore = create((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  isSearchVisible: false,
  setSearchVisible: (visible) => set({ isSearchVisible: visible }),

  // ✅ NOVO: filtros de plataforma e gênero
  selectedPlatform: null,
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  
  selectedGenre: null,
  setSelectedGenre: (genre) => set({ selectedGenre: genre }),
  
  clearFilters: () => set({ selectedPlatform: null, selectedGenre: null, searchQuery: "" }),
}));
```

---

## 🗂️ PARTE 3 — Dados do Daijishou Extraídos

### O que foi aproveitado do Daijishou

O repositório Daijishou bloqueou acesso automatizado, mas via análise do wiki e search, extraímos:

| Dado | Fonte Daijishou | Aplicado no Gameplex |
|------|-----------------|----------------------|
| Emuladores por plataforma | `Start Arguments` wiki | `emulatorjs_core` em `platforms` |
| Extensões de ROM | `Players and File Extensions` wiki | `rom_extensions` em `platforms` |
| Package names Android | Start Arguments | Documentado em `EmulatorPlayer.jsx` |
| Lista de plataformas suportadas | `/platforms/` folder | 14 novas plataformas no seed |
| Core RetroArch por sistema | Wiki | `retroarch_core` em `platforms` |

### Mapa de Cores de Plataforma (brand_color)

| Plataforma | Cor | Referência |
|-----------|-----|-----------|
| SNES | `#E60012` | Vermelho Nintendo |
| NES | `#E60012` | Vermelho Nintendo |
| N64 | `#E60012` | Vermelho Nintendo |
| GB | `#8BAC0F` | Verde LCD original |
| GBC | `#FB0081` | Rosa GBC |
| GBA | `#7C3F98` | Roxo GBA |
| Genesis/MD | `#000000` | Preto Sega |
| SMS | `#000066` | Azul Master System |
| Saturn | `#1A3A6A` | Azul Saturn |
| PS1 | `#003087` | Azul PlayStation |
| PS2 | `#00439C` | Azul PlayStation |
| PSP | `#003087` | Azul PlayStation |
| Atari 2600 | `#FF6600` | Laranja Atari |
| Neo Geo | `#CC0000` | Vermelho SNK |

---

## 📝 PARTE 4 — Checklist de Aplicação

### No Supabase Studio (SQL Editor):
- [ ] **1.1** — Adicionar colunas `emulator_core`, `rom_extensions`, etc. em `platforms`
- [ ] **1.2** — Atualizar 4 plataformas existentes com dados do Daijishou
- [ ] **1.3** — Inserir 14 novas plataformas
- [ ] **1.4** — Completar glossário com 13 termos (os 3 existentes têm ON CONFLICT)
- [ ] **1.5** — Inserir screenshots para jogos existentes
- [ ] **1.6** — Inserir vídeos YouTube para jogos existentes
- [ ] **1.7** — Inserir novos jogos (NES, GB, GBA, N64)

### No Repositório (código):
- [ ] **2.1** — Criar `src/hooks/useDebounce.js`
- [ ] **2.2** — Atualizar `src/app/page.js` com debounce + URL filters
- [ ] **2.3** — Atualizar `src/components/EmulatorPlayer.jsx` com mapa de cores
- [ ] **2.4** — Preencher `src/lib/supabase/server.js`
- [ ] **2.5** — Preencher `src/hooks/useGames.js`
- [ ] **2.6** — Preencher `src/hooks/useFavorites.js`
- [ ] **2.7** — Criar `public/manifest.json`
- [ ] **2.8** — Preencher `src/app/my-list/page.jsx`
- [ ] **2.9** — Preencher `src/app/platform/[id]/page.jsx`
- [ ] **2.10** — Atualizar `src/store/useGameStore.js`

### Ícones PWA (criar manualmente):
- [ ] Criar pasta `public/icons/`
- [ ] Adicionar `icon-192.png` (192×192px, logo Gameplex)
- [ ] Adicionar `icon-512.png` (512×512px, logo Gameplex)

---

## 🔄 Status Atualizado do Roadmap

### Semana 1 — COMPLETA ✅
- [x] Setup Next.js + Tailwind + dependências
- [x] Supabase client configurado
- [x] Schema aplicado com RLS
- [x] Dados seed: 4 plataformas, 13 jogos
- [x] PWA configurado no `next.config.mjs`
- [ ] `manifest.json` ← **pendente (2.7)**
- [ ] Ícones PWA ← **pendente**

### Semana 2 — PARCIAL ⚠️
- [x] HeroBanner, GameCard, Carousel implementados
- [x] Navbar com busca funcional
- [ ] Debounce 300ms ← **pendente (2.1 + 2.2)**
- [ ] Filtros por URL ← **pendente (2.2)**

### Semana 3 — PARCIAL ⚠️
- [x] Página `/game/[slug]` com SSR
- [x] GlossaryTooltip, PlatformBadge, YouTubePlayer implementados
- [x] Galeria de screenshots estruturada
- [ ] `/platform/[id]` ← **pendente (2.9)**
- [ ] `/glossary` ← já tem código, mas glossário vazio no DB
- [ ] `/my-list` ← **pendente (2.8)**

### Semana 4 — PARCIAL ⚠️
- [x] `rawg.js` e `youtube.js` implementados
- [x] `enrichment.js` criado
- [ ] Vídeos no banco ← **pendente (1.6)**
- [ ] Screenshots no banco ← **pendente (1.5)**

### Semanas 5 — NÃO INICIADA ⏳
- [ ] Auth Supabase
- [ ] useFavorites com Realtime
- [ ] AnimatePresence nas rotas
- [ ] Skeleton loaders
- [ ] Deploy Vercel
- [ ] Lighthouse + README portfólio

---

*Documento gerado: Junho 2026 · Gameplex v1.1-sync*
