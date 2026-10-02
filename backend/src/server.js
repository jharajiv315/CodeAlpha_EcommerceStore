import app from './app.js';
import { pool } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connectivity
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log(
      `[PostgreSQL Connected]: Database "${res.rows[0].db_name}" ready at ${res.rows[0].current_time}`
    );

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[NEXORA API Server]: Listening on port ${PORT} (http://localhost:${PORT})`);
      console.log(`[Health Check]: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n[NEXORA Server]: Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        console.log('[NEXORA Server]: HTTP server closed.');
        try {
          await pool.end();
          console.log('[PostgreSQL Pool]: Connection pool drained.');
        } catch (err) {
          console.error('[PostgreSQL Pool]: Error draining pool', err);
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('[NEXORA Server Startup Failed]:', err.message);
    process.exit(1);
  }
}

startServer();
