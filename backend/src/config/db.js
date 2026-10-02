import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgre@127.0.0.1:5432/nexora_db',
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    // Verified connection
  }
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected client error', err.message);
});

/**
 * Execute parameterized query safely
 */
export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development' && duration > 100) {
    console.debug('[PostgreSQL Query]: Executed slow query in %d ms', duration);
  }
  return res;
};

/**
 * Acquire a client for manual transaction control (BEGIN, COMMIT, ROLLBACK)
 */
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};
