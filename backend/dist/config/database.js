"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
function createPrismaClient() {
    return new client_1.PrismaClient({
        log: env_1.env.NODE_ENV === 'development'
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
exports.prisma = env_1.env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (global.__prisma ?? (global.__prisma = createPrismaClient()));
if (env_1.env.NODE_ENV === 'development') {
    exports.prisma.$on('query', (e) => {
        if (e.duration > 200) {
            logger_1.logger.warn('Slow query detected', { query: e.query, durationMs: e.duration });
        }
    });
}
exports.prisma.$on('error', (e) => {
    logger_1.logger.error('Prisma error', { message: e.message });
});
async function connectDatabase() {
    await exports.prisma.$connect();
    logger_1.logger.info('Database connected');
}
async function disconnectDatabase() {
    await exports.prisma.$disconnect();
    logger_1.logger.info('Database disconnected');
}
//# sourceMappingURL=database.js.map