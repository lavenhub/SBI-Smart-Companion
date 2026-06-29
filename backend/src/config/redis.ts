import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

class RedisClient {
  private client: Redis | null = null;
  private isConnected = false;

  connect(): Redis {
    if (this.client && this.isConnected) return this.client;

    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.warn('Redis unavailable — caching disabled, running in degraded mode');
          return null; // stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      logger.info('Redis connected');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      logger.warn('Redis error — cache operations will be skipped', { error: err.message });
    });

    this.client.on('close', () => {
      this.isConnected = false;
    });

    this.client.connect().catch((err) => {
      logger.warn('Redis initial connect failed', { error: err.message });
    });

    return this.client;
  }

  getClient(): Redis | null {
    return this.isConnected ? this.client : null;
  }
}

export const redisClient = new RedisClient();

// ─── Cache Helper ─────────────────────────────────────────────────────────────
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = redisClient.getClient();
    if (!client) return null;
    try {
      const val = await client.get(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const client = redisClient.getClient();
    if (!client) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await client.setex(key, ttlSeconds, serialized);
      } else {
        await client.set(key, serialized);
      }
    } catch {
      // silently fail — cache is best-effort
    }
  },

  async del(...keys: string[]): Promise<void> {
    const client = redisClient.getClient();
    if (!client) return;
    try {
      await client.del(...keys);
    } catch {
      // silently fail
    }
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const client = redisClient.getClient();
    if (!client) return;
    try {
      const keys = await client.keys(pattern);
      if (keys.length) await client.del(...keys);
    } catch {
      // silently fail
    }
  },

  async exists(key: string): Promise<boolean> {
    const client = redisClient.getClient();
    if (!client) return false;
    try {
      return (await client.exists(key)) === 1;
    } catch {
      return false;
    }
  },

  async incr(key: string): Promise<number> {
    const client = redisClient.getClient();
    if (!client) return 0;
    try {
      return await client.incr(key);
    } catch {
      return 0;
    }
  },

  async expire(key: string, ttlSeconds: number): Promise<void> {
    const client = redisClient.getClient();
    if (!client) return;
    try {
      await client.expire(key, ttlSeconds);
    } catch {
      // silently fail
    }
  },
};
