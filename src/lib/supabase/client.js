import { createClient } from '@supabase/supabase-js';

let client = null;

function createSupabaseClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === 'undefined' || key === 'undefined') {
    return null;
  }

  try {
    client = createClient(url, key);
    return client;
  } catch (e) {
    console.error('Failed to create Supabase client:', e.message);
    return null;
  }
}

export function getSupabase() {
  return createSupabaseClient();
}

const supabaseProxy = new Proxy({}, {
  get(_, prop) {
    const c = getSupabase();
    if (!c) return () => ({ data: { session: null }, error: null });
    return c[prop];
  },
});

export { supabaseProxy as supabase };
