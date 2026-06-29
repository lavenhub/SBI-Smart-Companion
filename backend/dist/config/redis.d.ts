import Redis from 'ioredis';
declare class RedisClient {
    private client;
    private isConnected;
    connect(): Redis;
    getClient(): Redis | null;
}
export declare const redisClient: RedisClient;
export declare const cache: {
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
    del(...keys: string[]): Promise<void>;
    invalidatePattern(pattern: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    incr(key: string): Promise<number>;
    expire(key: string, ttlSeconds: number): Promise<void>;
};
export {};
//# sourceMappingURL=redis.d.ts.map