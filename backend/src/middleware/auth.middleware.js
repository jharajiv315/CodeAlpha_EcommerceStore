import { supabaseAdmin } from '../config/supabase.js';
import { query } from '../config/db.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Ensures or creates a corresponding profile row in the PostgreSQL business database
 */
async function syncProfile(supabaseUser) {
  const userId = supabaseUser.id;
  const email = (supabaseUser.email || '').trim().toLowerCase();
  const name =
    supabaseUser.user_metadata?.name ||
    supabaseUser.user_metadata?.full_name ||
    email.split('@')[0] ||
    'Nexora Customer';

  const existing = await query(
    'SELECT id, name, email, joined_date, saved_addresses FROM profiles WHERE id = $1',
    [userId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  // Insert profile on first authenticated visit
  const joinedDate = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date());
  const inserted = await query(
    `INSERT INTO profiles (id, name, email, joined_date, saved_addresses)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email
     RETURNING id, name, email, joined_date, saved_addresses`,
    [userId, name, email, joinedDate, JSON.stringify([])]
  );

  return inserted.rows[0];
}

/**
 * Authentication Middleware: Validates Supabase Bearer token and attaches canonical user
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(
        res,
        'Authentication required. Please provide a valid Supabase Bearer token.',
        401,
        'AUTH_REQUIRED'
      );
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return sendError(
        res,
        'Invalid or expired Supabase authentication session. Please sign in again.',
        401,
        'INVALID_TOKEN'
      );
    }

    const profile = await syncProfile(data.user);

    req.user = {
      id: profile.id, // Supabase Auth UUID
      name: profile.name,
      email: profile.email,
      joinedDate: profile.joined_date,
      savedAddresses: profile.saved_addresses || [],
      supabaseUser: data.user,
    };

    next();
  } catch (err) {
    console.error('[Supabase Auth Middleware Error]:', err.message);
    return sendError(res, 'Authentication error.', 401, 'AUTH_FAILED');
  }
};

/**
 * Optional Authentication Middleware: Attaches req.user if a valid token is present
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data } = await supabaseAdmin.auth.getUser(token);
      if (data?.user) {
        const profile = await syncProfile(data.user);
        req.user = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          joinedDate: profile.joined_date,
          savedAddresses: profile.saved_addresses || [],
          supabaseUser: data.user,
        };
      }
    }
  } catch (err) {
    // Gracefully ignore optional auth failure
  }
  next();
};
