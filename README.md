# GamePlex — RetroVault

Catálogo de jogos retro estilo Netflix. PWA mobile-first com dark theme, carrosséis por plataforma, hero banner rotativo, página de detalhes com specs técnicas, vídeos do YouTube, conquistas RetroAchievements e sistema de favoritos.

**Demo:** [gameplex-ten.vercel.app](https://gameplex-ten.vercel.app)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Estilo | Tailwind CSS 4 |
| Animação | Framer Motion |
| Carrossel | Embla Carousel |
| Backend | Supabase (PostgreSQL + Auth) |
| Estado | Zustand |
| Data Fetching | TanStack React Query |
| PWA | @ducanh2912/next-pwa |
| Deploy | Vercel |

---

## Funcionalidades

- **Hero Banner rotativo** — troca automática a cada 20s com jogos aleatórios
- **Carrosséis por plataforma** (SNES, NES, PS1, Genesis, GB, GBA, N64...)
- **Busca** com debounce 300ms e filtros por URL
- **Página de detalhe** com specs técnicas JSONB, galeria de screenshots, YouTube embed
- **Glossário técnico** com navegação A-Z e tooltips inline
- **Sistema de favoritos** (auth obrigatória)
- **Histórico de jogos** — registra quando o usuário joga
- **RetroAchievements** — conquistas retro integradas com badges e progresso
- **Auth** via Magic Link e Google OAuth (sem cadastro obrigatório)
- **PWA** com service worker e manifest
- **14 plataformas** mapeadas com cores oficiais
- **Emulador** EmulatorJS com cores por plataforma
- **Enriquecimento automático** — RAWG API para covers e YouTube API para vídeos
- **22 jogos** catalogados com covers, vídeos e conquistas

---

## Arquitetura

```
src/
├── app/
│   ├── auth/          ← Magic Link + Google OAuth
│   ├── game/[slug]/   ← Detalhe do jogo + Emulador + Conquistas
│   ├── glossary/      ← Glossário técnico A-Z
│   ├── my-list/       ← Favoritos, Jogados, Wishlist, Histórico
│   └── platform/      ← Jogos por plataforma
├── components/
│   ├── achievements/  ← AchievementsPanel (RetroAchievements)
│   ├── carousel/      ← Carrossel horizontal por plataforma
│   ├── game-card/     ← Card com botão Jogar + Favoritar
│   ├── hero-banner/   ← Banner rotativo (20s) com navegação
│   ├── youtube-player/← Player de vídeo YouTube
│   └── EmulatorPlayer ← Player EmulatorJS (local + cloud)
├── services/
│   ├── retroachievements.service.js
│   ├── play-history.service.js
│   ├── rom.service.js
│   ├── game.service.js
│   ├── favorite.service.js
│   ├── rawg.service.js
│   └── youtube.service.js
├── hooks/
│   ├── useAuth.js
│   ├── useFavorites.js
│   ├── usePlayHistory.js
│   └── useGames.js
└── lib/
    └── constants.js   ← EJS_SYSTEMS, config
```

### Princípios SOLID aplicados

- **Single Responsibility**: Cada serviço tem uma única responsabilidade
- **Dependency Inversion**: Hooks dependem de services, não de Supabase direto
- **Open/Closed**: Config centralizada em `constants.js`, extensível sem modificar componentes

---

## Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher chaves (ver tabela abaixo)

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon key do Supabase |
| `SUPABASE_SERVICE_ROLE` | ✅ | Service role key (scripts) |
| `RAWG_API_KEY` | 🔧 Enrich | Chave RAWG (só para `npm run enrich`) |
| `YOUTUBE_API_KEY` | ✅ | Chave YouTube Data API v3 |
| `NEXT_PUBLIC_RA_USERNAME` | 🏆 | Username no RetroAchievements |
| `NEXT_PUBLIC_RA_API_KEY` | 🏆 | Web API Key do RetroAchievements |

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (webpack) |
| `npm run start` | Iniciar servidor de produção |
| `npm run enrich` | Enriquecer jogos via APIs RAWG/YouTube |
| `npm run enrich:covers` | Atualizar apenas covers |

---

## APIs Integradas

- **Supabase** — Banco de dados, autenticação, storage
- **RAWG Video Games Database** — Metadados, screenshots, ratings (+500k jogos)
- **YouTube Data API v3** — Trailers e gameplay
- **RetroAchievements** — Conquistas retro (API pública, sem backend)

---

## Launcher de Emuladores

O Gameplex **inicializa** os jogos via [EmulatorJS](https://emulatorjs.org) (frontend web para cores do RetroArch em WebAssembly, 100% no navegador).

**Estratégia de ROMs:**
- **ROMs pequenas** (SNES, NES, GB, GBA, Genesis...) → Supabase Storage (signed URL)
- **ROMs grandes** (PS1, PSP, N64, NDS...) → arquivo local no dispositivo
- **Sem login obrigatório** — basta selecionar o arquivo local

**Plataformas suportadas:** NES, SNES, GB, GBC, GBA, N64, NDS, Genesis, SMS, GG, PS1, PSP, Atari2600, NeoGeo, MAME

---

## Deploy

Projeto configurado para deploy automático na Vercel via GitHub.

```bash
vercel --prod
```

---

## Licença

Projeto pessoal — portfólio de desenvolvimento fullstack.
