import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variáveis SUPABASE não configuradas');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const migrations = [
  // Play History
  `CREATE TABLE IF NOT EXISTS play_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    played_at timestamptz DEFAULT now(),
    duration_seconds integer DEFAULT 0
  );`,
  
  `CREATE INDEX IF NOT EXISTS idx_play_history_user ON play_history(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_play_history_game ON play_history(game_id);`,
  `CREATE INDEX IF NOT EXISTS idx_play_history_date ON play_history(played_at DESC);`,
  
  `ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;`,
  
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own play history' AND tablename = 'play_history') THEN
      CREATE POLICY "Users can view own play history" ON play_history FOR SELECT USING (auth.uid() = user_id);
    END IF;
  END $$;`,
  
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own play history' AND tablename = 'play_history') THEN
      CREATE POLICY "Users can insert own play history" ON play_history FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
  END $$;`,
  
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own play history' AND tablename = 'play_history') THEN
      CREATE POLICY "Users can delete own play history" ON play_history FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END $$;`,
];

async function runMigrations() {
  console.log('🚀 Executando migrations...\n');
  
  for (let i = 0; i < migrations.length; i++) {
    const sql = migrations[i];
    const preview = sql.substring(0, 60).replace(/\n/g, ' ');
    console.log(`[${i + 1}/${migrations.length}] ${preview}...`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      if (error) {
        // Try direct query if rpc fails
        const { error: directError } = await supabase.from('_migration').select().limit(0);
        console.log(`  ⚠️  Execute manualmente no SQL Editor`);
      } else {
        console.log(`  ✅ OK`);
      }
    } catch (err) {
      console.log(`  ⚠️  Execute manualmente no SQL Editor`);
    }
  }
  
  console.log('\n📋 SQL para executar manualmente no Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/nznmpfuomfgzmunyhwjb/sql/new\n');
  console.log(migrations.join('\n\n'));
}

runMigrations().catch(console.error);
