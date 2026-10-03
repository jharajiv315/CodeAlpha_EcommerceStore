import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
