# 🎮 gameplex — Roadmap & Plano de Ação

> Catálogo de emuladores estilo Netflix · Mobile-first · PWA · Portfólio

---

## Visão Geral do Projeto

RetroVault é uma plataforma pessoal de catalogação de jogos retro com UX inspirada no Netflix: carrosséis por plataforma, hero banner animado, página de detalhes com specs técnicas, vídeos do YouTube, glossário de termos técnicos e sistema de favoritos. Desenvolvido como PWA mobile-first para uso pessoal e portfólio.

---

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, PWA, roteamento por arquivo |
| Linguagem | TypeScript | Tipos + segurança |
| Estilo | Tailwind CSS + shadcn/ui | Rapid UI, dark theme nativo |
| Animação | Framer Motion | Page transitions, hero banner |
| Carrossel | Embla Carousel | Touch-native, mobile-first |
| Backend | Supabase | DB + Auth + Storage (free tier) |
| Estado | Zustand | Estado global simples |
| Data Fetching | TanStack Query | Cache + background refetch |
| Deploy | Vercel | CI/CD automático, grátis no hobby |

---

## APIs Integradas

### 1. Supabase
- **Uso:** Banco de dados PostgreSQL, autenticação de usuário, storage de covers customizadas, Realtime para favoritos
- **Custo:** Grátis — 500 MB DB + 1 GB Storage
- **Docs:** https://supabase.com/docs

### 2. YouTube Data API v3
- **Uso:** Busca automática de trailers e gameplay por nome do jogo, embed no app, thumbnails HD
- **Custo:** Grátis — 10.000 unidades/dia
- **Docs:** https://developers.google.com/youtube/v3

### 3. RAWG Video Games Database API
- **Uso:** Metadados (capa, screenshots, rating, gênero, developer, ano). +500k jogos incluindo retro
- **Custo:** Grátis — 20.000 req/mês
- **Docs:** https://rawg.io/apidocs

### 4. Internet Archive API
- **Uso:** Metadados de ROMs e jogos retro com informações históricas (jogos não cobertos pelo RAWG)
- **Custo:** Completamente grátis e público
- **Docs:** https://archive.org/developers/internetarchive/api.html

### 5. IGDB API (via Twitch Developer)
- **Uso:** Alternativa ao RAWG com dados mais ricos: modos multiplayer, engines, franquias, empresas
- **Custo:** Grátis com conta Twitch Developer
- **Docs:** https://api-docs.igdb.com

---

## Estrutura de Pastas

```
gameplex/
├── app/
│   ├── (home)/page.tsx            ← Home com carrosséis estilo Netflix
│   ├── game/[slug]/page.tsx       ← Página de detalhe do jogo
│   ├── platform/[id]/page.tsx     ← Catálogo filtrado por plataforma
│   ├── glossary/page.tsx          ← Glossário de termos técnicos
│   ├── my-list/page.tsx           ← Favoritos do usuário autenticado
│   └── layout.tsx                 ← Root layout + providers
├── components/
│   ├── carousel/                  ← Embla + cards + nav arrows
│   ├── game-card/                 ← Card com hover reveal de info
│   ├── hero-banner/               ← Banner fullscreen animado
│   ├── youtube-player/            ← Embed responsivo
│   ├── glossary-tooltip/          ← Termo inline com popover
│   └── platform-badge/            ← Badge com cor oficial da plataforma
├── lib/
│   ├── supabase/
│   │   ├── client.ts              ← Supabase browser client
│   │   └── server.ts              ← Supabase server client (SSR)
│   ├── rawg.ts                    ← Wrapper da RAWG API
│   ├── youtube.ts                 ← Busca e fetch de vídeos
│   └── types.ts                   ← Tipos TypeScript globais
├── store/
│   └── useGameStore.ts            ← Zustand (filtros, busca, UI state)
├── hooks/
│   ├── useGames.ts                ← TanStack Query — jogos
│   └── useFavorites.ts            ← TanStack Query + Realtime
├── public/
│   ├── manifest.json              ← PWA manifest
│   └── icons/                     ← Ícones PWA (192, 512px)
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql ← Schema inicial
```

---

## Schema do Banco de Dados (Supabase / PostgreSQL)

### `platforms`
```sql
create table platforms (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  short_name    text not null,
  logo_url      text,
  brand_color   text,
  manufacturer  text,
  year_released int,
  created_at    timestamptz default now()
);
```

### `games`
```sql
create table games (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  platform_id      uuid references platforms(id),
  cover_url        text,
  description      text,
  genre            text[],
  year             int,
  developer        text,
  publisher        text,
  players          int default 1,
  technical_specs  jsonb,
  rawg_id          text,
  created_at       timestamptz default now()
);
```

**Exemplo de `technical_specs` (JSONB flexível por plataforma):**
```json
{
  "cpu": "Ricoh 5A22 @ 3.58 MHz",
  "resolution": "256×224 até 512×448",
  "colors": "32.768 simultâneas",
  "sound_channels": 8,
  "save_type": "SRAM / Battery"
}
```

### `game_videos`
```sql
create table game_videos (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid references games(id) on delete cascade,
  youtube_id  text not null,
  title       text,
  type        text check (type in ('trailer', 'gameplay', 'review')),
  created_at  timestamptz default now()
);
```

### `game_screenshots`
```sql
create table game_screenshots (
  id        uuid primary key default gen_random_uuid(),
  game_id   uuid references games(id) on delete cascade,
  url       text not null,
  "order"   int default 0
);
```

### `glossary`
```sql
create table glossary (
  id            uuid primary key default gen_random_uuid(),
  term          text not null unique,
  definition    text not null,
  category      text,
  related_terms text[],
  created_at    timestamptz default now()
);
```

### `user_lists`
```sql
create table user_lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  game_id    uuid references games(id) on delete cascade,
  list_type  text check (list_type in ('favorites', 'played', 'wishlist')),
  created_at timestamptz default now(),
  unique(user_id, game_id, list_type)
);
```

---

## Telas da Aplicação

| Tela | Rota | Funcionalidades |
|---|---|---|
| Home / Discover | `/` | Hero banner, carrosséis por plataforma/gênero, busca, filtros |
| Detalhe do Jogo | `/game/[slug]` | Specs técnicas, galeria, YouTube embed, glossário inline, plataforma |
| Por Plataforma | `/platform/[id]` | Grid de jogos filtrados, info da plataforma |
| Glossário | `/glossary` | Lista A-Z, busca, categorias, termos relacionados |
| Minha Lista | `/my-list` | Favoritos, jogados, wishlist (auth obrigatório) |

---

## Sequência de Build — 5 Semanas

### Semana 1 — Setup & Fundação
- [x] Criar projeto: `npx create-next-app@latest retrovault --typescript --tailwind --app`
- [x] Instalar dependências: `framer-motion embla-carousel-react @supabase/supabase-js zustand @tanstack/react-query`
- [x] Configurar Supabase: criar projeto, copiar URL + anon key para `.env.local`
- [x] Rodar migration SQL inicial no Supabase Studio
- [x] Seed manual de ~10 jogos e 4–5 plataformas para testes
- [x] Configurar PWA: `manifest.json` + `next-pwa` ou `@ducanh2912/next-pwa`
- [x] Dark theme base no Tailwind (`darkMode: 'class'`)

### Semana 2 — Home Netflix
- [x] Componente `HeroBanner` com Framer Motion (parallax + fade)
- [x] Componente `GameCard` com hover reveal (título, plataforma, gênero)
- [x] Componente `Carousel` com Embla (swipe touch, setas desktop)
- [x] Página Home com carrosséis por plataforma buscando do Supabase
- [x] Barra de busca com debounce (300ms)
- [x] Filtros por gênero e plataforma na URL (searchParams)

### Semana 3 — Página de Detalhe
- [x] Rota `/game/[slug]` com SSR (generateStaticParams)
- [x] Seção de specs técnicas renderizando o JSONB
- [x] Galeria de screenshots swipeable (Embla)
- [x] Componente `YouTubePlayer` responsivo (lazy loaded)
- [x] `GlossaryTooltip` — detecta termos no texto e exibe popover
- [x] `PlatformBadge` com cor oficial via `brand_color`
- [x] Página de Glossário com navegação por letras e categorias

### Semana 4 — APIs Externas
- [x] Integração RAWG: enriquecer jogos com covers, screenshots, ratings
- [x] Script de seed automatizado via RAWG por nome
- [x] YouTube Data API: buscar trailers por `{nome do jogo} {plataforma} trailer`
- [x] Salvar youtube_id no Supabase após busca
- [x] Página de Glossário com termos de emulação (PPU, VDP, DMA, blast processing…)

### Semana 5 — Polish & Portfólio
- [ ] Auth Supabase (magic link ou Google OAuth)
- [ ] Sistema de favoritos com Realtime (coração animado)
- [ ] Animações de página: `AnimatePresence` + `motion.div` em todas as rotas
- [ ] Skeleton loaders para estados de loading
- [ ] Testes de Lighthouse (PWA score, Performance, Accessibility)
- [ ] Deploy na Vercel + configurar variáveis de ambiente
- [ ] README do projeto para portfólio

---

## Notas de Desenvolvimento

**Mobile-first:** Todos os componentes devem ser desenhados para 375px+ primeiro. Usar `sm:` do Tailwind apenas para ajustes desktop.

**Dark theme:** Usar `bg-zinc-950` como base. Cores de acento por plataforma via `brand_color` da tabela `platforms` (ex: SNES → `#E60012`, Game Boy → `#8BAC0F`).

**Performance:** Usar `next/image` para todas as covers e screenshots. Lazy loading em todos os YouTubePlayer (só carrega o iframe após clique).

**Portfólio:** Documentar o projeto com prints no README. Destacar: integração multi-API, PWA offline, dark theme, animações, Supabase Realtime.

---

*Gerado em: Junho 2026 · RetroVault v1.0 Roadmap*
