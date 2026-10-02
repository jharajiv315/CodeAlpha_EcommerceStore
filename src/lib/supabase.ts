import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fqpdjecqmgcxcycvdfgx.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_Yj2uk5zmCcnksPoeJ5vzlw_vR7czqgy';

/**
 * Canonical Supabase Client for NEXORA Frontend
 * Manages identity, session lifecycle, token refresh, and OAuth providers
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'nexora_supabase_auth_token',
  },
});
