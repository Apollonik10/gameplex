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
- [x] Headers CORS (`Cross-Origin-Opener-Policy` + `Cross-Origin-Embedder-Policy`) para SharedArrayBuffer

### v3 — Refatoração & RetroAchievements (atual)
- [x] **Imagens corrigidas** — `next.config.js` com `remotePatterns` para todos os domínios usados
- [x] **Sistema de Cadastro de ROM removido** — sem obrigatoriedade de login para jogar
- [x] **Botão "Jogar" em todos os jogos** — nos GameCards e na página de detalhe
  - Ao clicar, abre seletor de arquivo local direto (sem upload, sem servidor)
  - Lança o EmulatorJS automaticamente com o arquivo selecionado
- [x] **`EmulatorPlayer` refatorado** — aceita `localFile` (File object) direto via props
- [x] **Integração RetroAchievements** — `retroachievements.service.js` criado
  - API pública REST, sem backend necessário
  - `getGameAchievements(raGameId)` — conquistas por jogo
  - `getGameWithUserProgress(raGameId, username)` — progresso do usuário
- [x] **Componente `AchievementsPanel`** — exibido na página de detalhe
  - Barra de progresso, grid de badges, pontos por conquista
  - Link direto para retroachievements.org
- [x] **Página de Auth atualizada** — removido texto de "Assine agora" / registro
- [x] **`.env.local` configurado** — todas as chaves de API adicionadas (Supabase, RAWG, RetroAchievements)
- [x] **API RetroAchievements testada** — conexão validada com sucesso (Super Mario Bros: 76 conquistas)
- [x] **Migration SQL criada** — `supabase_migration_retroachievements.sql` pronta para executar

---

## 🔜 Próximos Passos

### ⚡ PRIORIDADE IMEDIATA — Ativar RetroAchievements

> As conquistas já estão integradas no código. Configuração parcialmente concluída:

1. ~~**Criar conta no RetroAchievements**~~ ✅
   - Conta criada: `apollonik10`

2. ~~**Adicionar variáveis de ambiente**~~ ✅
   - `.env.local` configurado com todas as chaves

3. **Adicionar `ra_game_id` nos jogos do Supabase** ← **PRÓXIMO PASSO**
   - Execute no SQL Editor do Supabase ([link direto](https://supabase.com/dashboard/project/nznmpfuomfgzmunyhwjb/sql/new)):
     ```sql
     ALTER TABLE games ADD COLUMN IF NOT EXISTS ra_game_id integer;
     CREATE INDEX IF NOT EXISTS idx_games_ra_game_id ON games(ra_game_id);

     UPDATE games SET ra_game_id = 7346 WHERE slug = 'super-mario-world';
     UPDATE games SET ra_game_id = 1446 WHERE slug = 'super-mario-bros';
     UPDATE games SET ra_game_id = 1 WHERE slug = 'sonic-the-hedgehog';
     UPDATE games SET ra_game_id = 11240 WHERE slug = 'castlevania-symphony-of-the-night';
     UPDATE games SET ra_game_id = 4748 WHERE slug = 'pokemon-red';
     UPDATE games SET ra_game_id = 10087 WHERE slug = 'the-legend-of-zelda-ocarina-of-time';
     ```
   - Exemplos de IDs conhecidos:
     | Jogo | Platform | ra_game_id |
     |------|----------|-----------|
     | Super Mario World | SNES | 7346 |
     | Super Mario Bros | NES | 1446 |
     | Sonic the Hedgehog | Genesis | 1 |
     | Castlevania: SotN | PS1 | 11240 |
     | Pokémon Red | GB | 4748 |
     | The Legend of Zelda: OoT | N64 | 10087 |

---

### 🔜 Melhorias Futuras

- [ ] **Salvar saves automaticamente** no Supabase Storage (EmulatorJS export save state)
- [ ] **Histórico de jogados** — registrar quando o usuário lança um jogo
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
│   ├── my-list/       ← Favoritos, Jogados, Wishlist
│   └── platform/      ← Jogos por plataforma
├── components/
│   ├── achievements/  ← AchievementsPanel (RetroAchievements)  ← NOVO
│   ├── carousel/      ← Carrossel horizontal por plataforma
│   ├── game-card/     ← Card com botão Jogar + Favoritar       ← ATUALIZADO
│   ├── hero-banner/   ← Banner principal animado
│   ├── platform-bios/ ← Upload de BIOS (opcional)
│   └── EmulatorPlayer ← Player EmulatorJS refatorado           ← ATUALIZADO
├── services/
│   ├── retroachievements.service.js  ← Conquistas               ← NOVO
│   ├── rom.service.js                ← BIOS + ROMs cloud
│   ├── game.service.js
│   ├── favorite.service.js
│   └── ...
└── hooks/
    ├── useAuth.js
    ├── useFavorites.js
    └── ...
```

## 🔑 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon key do Supabase |
| `RAWG_API_KEY` | 🔧 Enrich | Chave RAWG (só para `npm run enrich`) |
| `YOUTUBE_API_KEY` | 🔧 Enrich | Chave YouTube (só para `npm run enrich`) |
| `NEXT_PUBLIC_RA_USERNAME` | 🏆 RetroAch. | Username no RetroAchievements |
| `NEXT_PUBLIC_RA_API_KEY` | 🏆 RetroAch. | Web API Key do RetroAchievements |
