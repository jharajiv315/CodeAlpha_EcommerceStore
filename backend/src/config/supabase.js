import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Search and load environment variables across root and backend directories
const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../backend/.env')
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://fqpdjecqmgcxcycvdfgx.supabase.co';

const rawSecretKey = process.env.SUPABASE_SECRET_KEY || '';
const rawAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

// Provide a safe placeholder key if neither key is configured in dev/offline mode to prevent hard server crash
const adminKey = rawSecretKey || rawAnonKey || 'dummy_supabase_key_for_offline_dev';
const publicKey = rawAnonKey || rawSecretKey || 'dummy_supabase_key_for_offline_dev';

if (!rawSecretKey && !rawAnonKey) {
  console.warn(
    '[Supabase Config Warning] Neither SUPABASE_SECRET_KEY nor SUPABASE_ANON_KEY found in environment. Initialized in fallback mode.'
  );
}

/**
 * Privileged Admin client for server-side operations (verifying tokens, managing user profiles)
 */
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  adminKey,
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
  publicKey
);

