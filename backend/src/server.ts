import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { redisClient } from './config/redis';
import { logger } from './utils/logger';
import { seedSearchIndex } from './database/seedSearchIndex';
import fs from 'fs';
import path from 'path';

async function bootstrap() {
  // Ensure required directories exist
  const dirs = [env.UPLOAD_DIR, env.LOG_DIR];
  for (const dir of dirs) {
    fs.mkdirSync(path.resolve(dir), { recursive: true });
  }

  // Connect to PostgreSQL
  await connectDatabase();

  // Connect to Redis (best-effort — app runs without it)
  redisClient.connect();

  // Seed search index if empty
  await seedSearchIndex();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 YONO Smart Companion Backend running`, {
      port: env.PORT,
      env: env.NODE_ENV,
      api: `http://localhost:${env.PORT}${env.API_PREFIX}`,
      docs: `http://localhost:${env.PORT}/api-docs`,
      health: `http://localhost:${env.PORT}/health`,
    });
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal} — graceful shutdown initiated`);

    server.close(async () => {
      try {
        await disconnectDatabase();
        logger.info('Database disconnected');
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown', { error: (err as Error).message });
        process.exit(1);
      }
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { error: err.message, stack: err.stack });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
