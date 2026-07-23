-- GAMEPLEX — Migration: Histórico de Jogos
-- Registra quando o usuário lança um jogo para jogar

-- 1) Criar tabela de histórico
CREATE TABLE IF NOT EXISTS play_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  played_at timestamptz DEFAULT now(),
  duration_seconds integer DEFAULT 0
);

-- 2) Índices para performance
CREATE INDEX IF NOT EXISTS idx_play_history_user ON play_history(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_game ON play_history(game_id);
CREATE INDEX IF NOT EXISTS idx_play_history_date ON play_history(played_at DESC);

-- 3) RLS (Row Level Security)
ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;

-- Usuário só vê seu próprio histórico
CREATE POLICY "Users can view own play history"
  ON play_history FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário só insere no seu próprio histórico
CREATE POLICY "Users can insert own play history"
  ON play_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuário só deleta do seu próprio histórico
CREATE POLICY "Users can delete own play history"
  ON play_history FOR DELETE
  USING (auth.uid() = user_id);
