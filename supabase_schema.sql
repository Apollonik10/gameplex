-- 1. Platforms
create table platforms (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  short_name    text not null unique,
  logo_url      text,
  brand_color   text,
  manufacturer  text,
  year_released int,
  created_at    timestamptz default now()
);

-- 2. Games
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

-- 3. Game Videos
create table game_videos (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid references games(id) on delete cascade,
  youtube_id  text not null,
  title       text,
  type        text check (type in ('trailer', 'gameplay', 'review')),
  created_at  timestamptz default now()
);

-- 4. Game Screenshots
create table game_screenshots (
  id        uuid primary key default gen_random_uuid(),
  game_id   uuid references games(id) on delete cascade,
  url       text not null,
  "order"   int default 0
);

-- 5. Glossary
create table glossary (
  id            uuid primary key default gen_random_uuid(),
  term          text not null unique,
  definition    text not null,
  category      text,
  related_terms text[],
  created_at    timestamptz default now()
);

-- 6. User Lists (Favorites, etc)
create table user_lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  game_id    uuid references games(id) on delete cascade,
  list_type  text check (list_type in ('favorites', 'played', 'wishlist')),
  created_at timestamptz default now(),
  unique(user_id, game_id, list_type)
);

-- Habilitar Row Level Security (RLS)
alter table platforms enable row level security;
alter table games enable row level security;
alter table game_videos enable row level security;
alter table game_screenshots enable row level security;
alter table glossary enable row level security;
alter table user_lists enable row level security;

-- Políticas de Leitura Pública
drop policy if exists "Platforms are viewable by everyone" on platforms;
create policy "Platforms are viewable by everyone" on platforms for select using (true);
create policy "Enable insert for authenticated users only" on platforms for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on platforms for update using (auth.role() = 'authenticated');

drop policy if exists "Games are viewable by everyone" on games;
create policy "Games are viewable by everyone" on games for select using (true);
create policy "Enable insert for authenticated users only" on games for insert with check (auth.role() = 'authenticated');

drop policy if exists "Videos are viewable by everyone" on game_videos;
create policy "Videos are viewable by everyone" on game_videos for select using (true);

drop policy if exists "Screenshots are viewable by everyone" on game_screenshots;
create policy "Screenshots are viewable by everyone" on game_screenshots for select using (true);

drop policy if exists "Glossary is viewable by everyone" on glossary;
create policy "Glossary is viewable by everyone" on glossary for select using (true);
create policy "Enable insert for authenticated users only" on glossary for insert with check (auth.role() = 'authenticated');


-- Política de Usuário para Favoritos
create policy "Users can manage their own lists" on user_lists
  for all using (auth.uid() = user_id);
