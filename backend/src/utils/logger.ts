import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env } from '../config/env';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// ─── Console Format (Dev) ────────────────────────────────────────────────────
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}]: ${stack || message}${metaStr}`;
  }),
);

// ─── JSON Format (Production) ────────────────────────────────────────────────
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

// ─── Rotating File Transports ─────────────────────────────────────────────────
const fileTransport = new DailyRotateFile({
  dirname: path.resolve(env.LOG_DIR),
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: prodFormat,
});

const errorFileTransport = new DailyRotateFile({
  dirname: path.resolve(env.LOG_DIR),
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: prodFormat,
});

// ─── Logger Instance ──────────────────────────────────────────────────────────
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  defaultMeta: { service: 'yono-backend' },
  transports: [
    env.NODE_ENV !== 'test'
      ? new winston.transports.Console({
          format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
        })
      : new winston.transports.Console({ silent: true }),
    fileTransport,
    errorFileTransport,
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      dirname: path.resolve(env.LOG_DIR),
      filename: 'exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: prodFormat,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      dirname: path.resolve(env.LOG_DIR),
      filename: 'rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: prodFormat,
    }),
  ],
});

// ─── Child Logger Factory ─────────────────────────────────────────────────────
export function createLogger(context: string) {
  return logger.child({ context });
}

export default logger;
