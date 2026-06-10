import { supabase } from './src/lib/supabase/client.js';

async function verifyConnection() {
  try {
    const { data, error } = await supabase.from('platforms').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Erro ao conectar ao Supabase:', error.message);
      process.exit(1);
    }
    console.log('Conexão com Supabase verificada com sucesso!');
  } catch (err) {
    console.error('Erro inesperado:', err.message);
    process.exit(1);
  }
}

verifyConnection();
