# GAMEPLEX — Roadmap

## 📋 Regra de Sessão

> **Ao iniciar uma sessão com IA (MiMo, Claude, etc.), o agente DEVE invocar o arquivo `AI_CONTEXT.md` do AI Workspace (`/data/data/com.termux/files/home/projects/ai-workspace/AI_CONTEXT.md`) antes de qualquer alteração no código.**
>
> Isso garante que todas as decisões sigam as diretrizes do projeto: Mobile First, Termux + Acode, código limpo, modular, performance, e explicar decisões antes de alterar código.

---

## ✅ Concluído

### v1 — Catálogo Base
- [x] Hero Banner animado com parallax
- [x] Carrosséis por plataforma (SNES, NES, PS1, Genesis, GB, GBA, N64...)
- [x] Busca com debounce 300ms e filtros por URL
- [x] Página de detalhe com specs técnicas, galeria, YouTube embed
- [x] Glossário técnico com navegação A-Z e tooltips inline
- [x] Sistema de favoritos (autenticação via magic link + Google OAuth)
- [x] PWA com service worker e manifest
- [x] 14 plataformas mapeadas com cores oficiais
- [x] Deploy automático na Vercel via GitHub

### v2 — Launcher de Emuladores
- [x] Integração com EmulatorJS (cores RetroArch via WebAssembly)
- [x] Estratégia dupla de ROMs: cloud (Supabase Storage) + local
- [x] Migration SQL para tabela `roms` e bucket no Supabase Storage
- [x] BIOS upload por plataforma (opcional)
- [x] `next.config.js` com `remotePatterns` para imagens externas (RAWG, Supabase, Google)
- [x] Headers CORS (`Cross-Origin-Opener-Policy` + `Cross-Origin-Embedder-Policy: credentialless`) para SharedArrayBuffer + YouTube embed

### v3 — Refatoração & RetroAchievements
- [x] **Imagens corrigidas** — `next.config.js` com `remotePatterns` para todos os domínios usados
- [x] **Sistema de Cadastro de ROM removido** — sem obrigatoriedade de login para jogar
- [x] **Botão "Jogar" em todos os jogos** — nos GameCards e na página de detalhe
- [x] **`EmulatorPlayer` refatorado** — aceita `localFile` (File object) direto via props
- [x] **Integração RetroAchievements** — `retroachievements.service.js` criado
- [x] **Componente `AchievementsPanel`** — exibido na página de detalhe
- [x] **Página de Auth atualizada** — removido texto de "Assine agora" / registro
- [x] **`.env.local` configurado** — todas as chaves de API adicionadas
- [x] **API RetroAchievements testada** — conexão validada com sucesso
- [x] **Migration SQL executada** — `ra_game_id` adicionado na tabela `games`

### v4 — Infraestrutura & Dados
- [x] **Tabela `play_history` criada** — com RLS, indexes e políticas de segurança
- [x] **`ra_game_id` mapeado** — 6 jogos com IDs do RetroAchievements no Supabase
- [x] **YouTube API Key configurada** — vídeos adicionados para todos os 22 jogos
- [x] **Hero Banner rotativo** — troca automática a cada 20 segundos com jogos aleatórios
- [x] **Correção de sobreposição** — removido `mt-[-100px]` que causava overlap
- [x] **Player de vídeo corrigido** — COEP `credentialless` permite YouTube em iframe
- [x] **Auth page limpa** — removidos textos de assinatura/cadastro

---

## 🔜 Próximos Passos

### 🔧 Melhorias de UX
- [x] **Lembrar pasta de ROMs** — File System Access API + IndexedDB. Na primeira vez pede acesso, depois procura ROM automaticamente pelo nome do jogo
- [ ] **Streaming de ROMs do Supabase** — jogar direto do cloud sem precisar ter o arquivo local
- [ ] **Covers originais via IGDB/TheGamesDB** — RAWG retorna screenshots para muitos jogos retro. Integrar IGDB (Twitch API) ou TheGamesDB para box art real

### 🖼️ Covers & Mídia
- [ ] **IGDB API** — box art oficial para jogos retro (requer Twitch Client ID). Melhor cobertura que RAWG para títulos antigos
- [ ] **TheGamesDB API** — alternativa gratuita com covers, fanart e banners por plataforma
- [ ] **ScreenScraper.fr** — screenshots, covers e vídeos para ROMs (baseada em hash do arquivo)

### 🎮 Funcionalidades
- [ ] **Salvar saves automaticamente** no Supabase Storage (EmulatorJS export save state)
- [ ] **Wishlist e listas personalizadas** — expandir `my-list`
- [ ] **Busca por conquistas** — filtrar jogos que têm RetroAchievements mapeado
- [ ] **Perfil de usuário** — página com estatísticas, jogos jogados, conquistas
- [ ] **Modo offline** — cache de metadados via PWA para navegar sem conexão
- [ ] **Multi-disco PS1** — suporte a CUE+BIN multi-arquivo
- [ ] **Controle por gamepad** — mapeamento customizado de botões no EmulatorJS
- [ ] **Cheats e Game Genie** — integração com a base de cheats do RetroAchievements

---

## 🏗️ Arquitetura Atual

```
src/
├── app/
│   ├── auth/          ← Magic Link + Google OAuth (sem cadastro)
│   ├── game/[slug]/   ← Detalhe do jogo + Emulador + Conquistas
│   ├── glossary/      ← Glossário técnico A-Z
│   ├── my-list/       ← Favoritos, Jogados, Wishlist, Histórico
│   └── platform/      ← Jogos por plataforma
├── components/
│   ├── achievements/  ← AchievementsPanel (RetroAchievements)
│   ├── carousel/      ← Carrossel horizontal por plataforma
│   ├── game-card/     ← Card com botão Jogar + Favoritar + Histórico
│   ├── hero-banner/   ← Banner rotativo (20s) com jogos aleatórios
│   ├── platform-bios/ ← Upload de BIOS (opcional)
│   ├── youtube-player/← Player de vídeo com thumbnail + embed
│   └── EmulatorPlayer ← Player EmulatorJS refatorado
├── services/
│   ├── retroachievements.service.js  ← Conquistas
│   ├── play-history.service.js       ← Histórico de jogos
│   ├── rom.service.js                ← BIOS + ROMs cloud
│   ├── game.service.js
│   ├── favorite.service.js
│   └── ...
└── hooks/
    ├── useAuth.js
    ├── useFavorites.js
    ├── usePlayHistory.js             ← Histórico
    └── ...
```

## 🔑 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon key do Supabase |
| `SUPABASE_SERVICE_ROLE` | ✅ | Service role key (scripts) |
| `RAWG_API_KEY` | 🔧 Enrich | Chave RAWG (só para `npm run enrich`) |
| `YOUTUBE_API_KEY` | ✅ | Chave YouTube Data API v3 |
| `NEXT_PUBLIC_RA_USERNAME` | 🏆 RetroAch. | Username no RetroAchievements |
| `NEXT_PUBLIC_RA_API_KEY` | 🏆 RetroAch. | Web API Key do RetroAchievements |
