import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
    errorFormat: 'pretty',
  });
}

// Prevent multiple Prisma instances in development (hot-reload)
export const prisma: PrismaClient =
  env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (global.__prisma ??= createPrismaClient());

if (env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: { query: string; duration: number }) => {
    if (e.duration > 200) {
      logger.warn('Slow query detected', { query: e.query, durationMs: e.duration });
    }
  });
}

(prisma as any).$on('error', (e: { message: string }) => {
  logger.error('Prisma error', { message: e.message });
});

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info('Database connected');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
