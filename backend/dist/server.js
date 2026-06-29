"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const logger_1 = require("./utils/logger");
const seedSearchIndex_1 = require("./database/seedSearchIndex");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function bootstrap() {
    // Ensure required directories exist
    const dirs = [env_1.env.UPLOAD_DIR, env_1.env.LOG_DIR];
    for (const dir of dirs) {
        fs_1.default.mkdirSync(path_1.default.resolve(dir), { recursive: true });
    }
    // Connect to PostgreSQL
    await (0, database_1.connectDatabase)();
    // Connect to Redis (best-effort — app runs without it)
    redis_1.redisClient.connect();
    // Seed search index if empty
    await (0, seedSearchIndex_1.seedSearchIndex)();
    const app = (0, app_1.createApp)();
    const server = app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`🚀 YONO Smart Companion Backend running`, {
            port: env_1.env.PORT,
            env: env_1.env.NODE_ENV,
            api: `http://localhost:${env_1.env.PORT}${env_1.env.API_PREFIX}`,
            docs: `http://localhost:${env_1.env.PORT}/api-docs`,
            health: `http://localhost:${env_1.env.PORT}/health`,
        });
    });
    // ── Graceful Shutdown ──────────────────────────────────────────────────────
    const gracefulShutdown = async (signal) => {
        logger_1.logger.info(`Received ${signal} — graceful shutdown initiated`);
        server.close(async () => {
            try {
                await (0, database_1.disconnectDatabase)();
                logger_1.logger.info('Database disconnected');
                process.exit(0);
            }
            catch (err) {
                logger_1.logger.error('Error during shutdown', { error: err.message });
                process.exit(1);
            }
        });
        // Force exit after 10 seconds
        setTimeout(() => {
            logger_1.logger.error('Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
        logger_1.logger.error('Unhandled promise rejection', { reason });
    });
    process.on('uncaughtException', (err) => {
        logger_1.logger.error('Uncaught exception', { error: err.message, stack: err.stack });
        process.exit(1);
    });
}
bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map