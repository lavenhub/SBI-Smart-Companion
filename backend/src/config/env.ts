import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_TTL_SECONDS: z.string().transform(Number).default('3600'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  AUTH_RATE_LIMIT_MAX: z.string().transform(Number).default('10'),

  STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.string().transform(Number).default('10'),

  SMTP_HOST: z.string().default('smtp.mailtrap.io'),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default('noreply@yono.sbi.co.in'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
  LOG_DIR: z.string().default('./logs'),

  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),

  OTP_EXPIRY_MINUTES: z.string().transform(Number).default('10'),
  OTP_LENGTH: z.string().transform(Number).default('6'),

  DRAFT_AUTO_SAVE_INTERVAL_SECONDS: z.string().transform(Number).default('20'),
  DRAFT_EXPIRY_DAYS: z.string().transform(Number).default('30'),

  DEFAULT_PAGE_SIZE: z.string().transform(Number).default('20'),
  MAX_PAGE_SIZE: z.string().transform(Number).default('100'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
