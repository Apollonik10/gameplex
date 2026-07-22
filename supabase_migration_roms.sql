-- GAMEPLEX — Migration: Launcher de Emuladores (ROMs cloud + local)
-- ✅ JÁ APLICADA no projeto Supabase (nznmpfuomfgzmunyhwjb) via MCP.
-- Este arquivo fica só como referência/histórico — não precisa rodar de novo.
-- (Causa do erro anterior: o projeto Supabase estava com status INACTIVE/pausado
-- por inatividade no tier free; foi restaurado antes de aplicar esta migration.)


-- 1) Tabela de ROMs -----------------------------------------------------
create table if not exists roms (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  game_id       uuid references games(id) on delete cascade,
  platform_id   uuid references platforms(id) on delete cascade,
  role          text not null default 'rom' check (role in ('rom', 'bios')),
  storage_type  text not null check (storage_type in ('cloud', 'local')),
  storage_path  text,              -- caminho no bucket 'roms' (só quando storage_type = 'cloud')
  filename      text not null,     -- nome do arquivo, usado pra localizar no modo 'local'
  file_size     bigint,
  checksum      text,
  created_at    timestamptz default now(),
  constraint roms_role_target_check check (
    (role = 'rom' and game_id is not null) or
    (role = 'bios' and platform_id is not null)
  )
);

create index if not exists roms_game_id_idx on roms(game_id);
create index if not exists roms_platform_id_idx on roms(platform_id);
create index if not exists roms_user_id_idx on roms(user_id);

alter table roms enable row level security;

drop policy if exists "Users manage their own roms" on roms;
create policy "Users manage their own roms" on roms
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2) Bucket de Storage para ROMs pequenas (consoles antigos) ------------
insert into storage.buckets (id, name, public)
values ('roms', 'roms', false)
on conflict (id) do nothing;

-- Cada usuário só lê/escreve dentro da própria pasta: roms/{user_id}/...
drop policy if exists "Users read their own rom files" on storage.objects;
create policy "Users read their own rom files" on storage.objects
  for select using (
    bucket_id = 'roms' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users upload their own rom files" on storage.objects;
create policy "Users upload their own rom files" on storage.objects
  for insert with check (
    bucket_id = 'roms' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete their own rom files" on storage.objects;
create policy "Users delete their own rom files" on storage.objects
  for delete using (
    bucket_id = 'roms' and (storage.foldername(name))[1] = auth.uid()::text
  );
