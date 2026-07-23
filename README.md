# GamePlex — RetroVault

Catálogo de jogos retro estilo Netflix. PWA mobile-first com dark theme, carrosséis por plataforma, hero banner, página de detalhes com specs técnicas, vídeos do YouTube, glossário de termos de emulação e sistema de favoritos.

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

- **Hero Banner** animado com parallax
- **Carrosséis por plataforma** (SNES, NES, PS1, Genesis, GB, GBA, N64...)
- **Busca** com debounce 300ms e filtros por URL
- **Página de detalhe** com specs técnicas JSONB, galeria de screenshots, YouTube embed
- **Glossário técnico** com navegação A-Z e tooltips inline
- **Sistema de favoritos** (auth obrigatória)
- **Histórico de jogos** — registra quando o usuário joga
- **RetroAchievements** — conquistas retro integradas
- **Auth** via Magic Link e Google OAuth
- **PWA** com service worker e manifest
- **14 plataformas** mapeadas com cores oficiais
- **Emulador** EmulatorJS com cores por plataforma
- **Enriquecimento automático** — RAWG API para covers e metadados

---

## Arquitetura

```
src/
├── app/              ← Rotas (App Router)
├── components/       ← UI components
├── hooks/            ← Custom hooks (useAuth, useGames, useFavorites, useDebounce)
├── lib/              ← Constantes, tipos, clientes Supabase
├── services/         ← Camada de serviço (SRP, DIP)
│   ├── game.service.js
│   ├── platform.service.js
│   ├── favorite.service.js
│   ├── glossary.service.js
│   ├── enrichment.service.js
│   ├── rawg.service.js
│   ├── youtube.service.js
│   └── http.service.js
└── store/            ← Zustand store
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
# Preencher chaves: SUPABASE_URL, SUPABASE_ANON_KEY, RAWG_API_KEY, YOUTUBE_API_KEY

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

### Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key do Supabase |
| `RAWG_API_KEY` | Chave da API RAWG |
| `YOUTUBE_API_KEY` | Chave da YouTube Data API v3 |

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (webpack) |
| `npm run start` | Iniciar servidor de produção |
| `npm run enrich` | Enriquecer jogos via APIs RAWG/YouTube |

---

## APIs Integradas

- **Supabase** — Banco de dados, autenticação, storage
- **RAWG Video Games Database** — Metadados, screenshots, ratings (+500k jogos)
- **YouTube Data API v3** — Trailers e gameplay

---

## Launcher de Emuladores (novo)

O Gameplex agora também **inicializa** os jogos, não só cataloga. Baseado no
[EmulatorJS](https://emulatorjs.org) (frontend web para cores do RetroArch em WebAssembly,
100% no navegador, sem backend de emulação).

**Estratégia de armazenamento dupla:**
- **ROMs pequenas** (SNES, NES, GB, GBC, GBA, Genesis, SMS, GG, Atari2600...) →
  enviadas para um bucket privado no Supabase Storage, servidas via signed URL de curta duração.
- **ROMs grandes** (PS1, PSP, Saturn, N64, NDS...) → ficam **só no dispositivo**.
  O app guarda apenas o nome/tamanho do arquivo; na hora de jogar, você reseleciona a
  pasta local (`<input type="file" webkitdirectory>`) e o app localiza o arquivo pelo nome.
  Nada é enviado para a internet nesse fluxo.

> PS2 não está disponível: o EmulatorJS ainda não tem um core WebAssembly pra esse sistema.

**Setup necessário (uma vez):**
1. Rodar `supabase_migration_roms.sql` no SQL Editor do Supabase Studio — cria a tabela
   `roms` e o bucket `roms` no Storage, com RLS por usuário.
2. Pronto — o botão "Cadastrar ROM" aparece na página de detalhe de qualquer jogo com
   sistema suportado.

**Arquivos novos:**
- `src/services/rom.service.js` — upload/registro/signed URL de ROMs
- `src/hooks/useLocalRom.js` — seletor de pasta local + matching por nome de arquivo
- `src/components/EmulatorPlayer.jsx` — player real via EmulatorJS (antes era só uma simulação visual)
- `src/lib/constants.js` — novo `EJS_SYSTEMS` (mapa plataforma → sistema EmulatorJS)

## Deploy

Projeto configurado para deploy automático na Vercel via GitHub.

```bash
vercel --prod
```

---

## Licença

Projeto pessoal — portfólio de desenvolvimento fullstack.
