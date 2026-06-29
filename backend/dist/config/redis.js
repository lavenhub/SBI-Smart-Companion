"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }
    connect() {
        if (this.client && this.isConnected)
            return this.client;
        this.client = new ioredis_1.default({
            host: env_1.env.REDIS_HOST,
            port: env_1.env.REDIS_PORT,
            password: env_1.env.REDIS_PASSWORD || undefined,
            retryStrategy: (times) => {
                if (times > 3) {
                    logger_1.logger.warn('Redis unavailable — caching disabled, running in degraded mode');
                    return null; // stop retrying
                }
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
            enableOfflineQueue: false,
        });
        this.client.on('connect', () => {
            this.isConnected = true;
            logger_1.logger.info('Redis connected');
        });
        this.client.on('error', (err) => {
            this.isConnected = false;
            logger_1.logger.warn('Redis error — cache operations will be skipped', { error: err.message });
        });
        this.client.on('close', () => {
            this.isConnected = false;
        });
        this.client.connect().catch((err) => {
            logger_1.logger.warn('Redis initial connect failed', { error: err.message });
        });
        return this.client;
    }
    getClient() {
        return this.isConnected ? this.client : null;
    }
}
exports.redisClient = new RedisClient();
// ─── Cache Helper ─────────────────────────────────────────────────────────────
exports.cache = {
    async get(key) {
        const client = exports.redisClient.getClient();
        if (!client)
            return null;
        try {
            const val = await client.get(key);
            return val ? JSON.parse(val) : null;
        }
        catch {
            return null;
        }
    },
    async set(key, value, ttlSeconds) {
        const client = exports.redisClient.getClient();
        if (!client)
            return;
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await client.setex(key, ttlSeconds, serialized);
            }
            else {
                await client.set(key, serialized);
            }
        }
        catch {
            // silently fail — cache is best-effort
        }
    },
    async del(...keys) {
        const client = exports.redisClient.getClient();
        if (!client)
            return;
        try {
            await client.del(...keys);
        }
        catch {
            // silently fail
        }
    },
    async invalidatePattern(pattern) {
        const client = exports.redisClient.getClient();
        if (!client)
            return;
        try {
            const keys = await client.keys(pattern);
            if (keys.length)
                await client.del(...keys);
        }
        catch {
            // silently fail
        }
    },
    async exists(key) {
        const client = exports.redisClient.getClient();
        if (!client)
            return false;
        try {
            return (await client.exists(key)) === 1;
        }
        catch {
            return false;
        }
    },
    async incr(key) {
        const client = exports.redisClient.getClient();
        if (!client)
            return 0;
        try {
            return await client.incr(key);
        }
        catch {
            return 0;
        }
    },
    async expire(key, ttlSeconds) {
        const client = exports.redisClient.getClient();
        if (!client)
            return;
        try {
            await client.expire(key, ttlSeconds);
        }
        catch {
            // silently fail
        }
    },
};
//# sourceMappingURL=redis.js.map