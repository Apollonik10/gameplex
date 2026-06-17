import { getSupabase } from '@/lib/supabase/client';

export async function getGlossaryTerms() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('glossary')
    .select('*')
    .order('term');

  return data || [];
}
