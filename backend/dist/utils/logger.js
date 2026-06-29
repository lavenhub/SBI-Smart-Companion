"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createLogger = createLogger;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const { combine, timestamp, errors, json, colorize, printf } = winston_1.default.format;
// ─── Console Format (Dev) ────────────────────────────────────────────────────
const devFormat = combine(colorize({ all: true }), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}]: ${stack || message}${metaStr}`;
}));
// ─── JSON Format (Production) ────────────────────────────────────────────────
const prodFormat = combine(timestamp(), errors({ stack: true }), json());
// ─── Rotating File Transports ─────────────────────────────────────────────────
const fileTransport = new winston_daily_rotate_file_1.default({
    dirname: path_1.default.resolve(env_1.env.LOG_DIR),
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
    format: prodFormat,
});
const errorFileTransport = new winston_daily_rotate_file_1.default({
    dirname: path_1.default.resolve(env_1.env.LOG_DIR),
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: prodFormat,
});
// ─── Logger Instance ──────────────────────────────────────────────────────────
exports.logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL,
    defaultMeta: { service: 'yono-backend' },
    transports: [
        env_1.env.NODE_ENV !== 'test'
            ? new winston_1.default.transports.Console({
                format: env_1.env.NODE_ENV === 'development' ? devFormat : prodFormat,
            })
            : new winston_1.default.transports.Console({ silent: true }),
        fileTransport,
        errorFileTransport,
    ],
    exceptionHandlers: [
        new winston_daily_rotate_file_1.default({
            dirname: path_1.default.resolve(env_1.env.LOG_DIR),
            filename: 'exceptions-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            format: prodFormat,
        }),
    ],
    rejectionHandlers: [
        new winston_daily_rotate_file_1.default({
            dirname: path_1.default.resolve(env_1.env.LOG_DIR),
            filename: 'rejections-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            format: prodFormat,
        }),
    ],
});
// ─── Child Logger Factory ─────────────────────────────────────────────────────
function createLogger(context) {
    return exports.logger.child({ context });
}
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map