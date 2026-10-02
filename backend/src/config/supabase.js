import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fqpdjecqmgcxcycvdfgx.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_SECRET_KEY && !SUPABASE_ANON_KEY) {
  console.warn('[Supabase Config] Missing Supabase API keys in backend environment');
}

/**
 * Privileged Admin client for server-side operations (verifying tokens, managing user profiles)
 */
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY || SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Public client for client-scoped operations
 */
export const supabasePublic = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || SUPABASE_SECRET_KEY
);
