"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('5000'),
    API_PREFIX: zod_1.z.string().default('/api/v1'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    REDIS_HOST: zod_1.z.string().default('127.0.0.1'),
    REDIS_PORT: zod_1.z.string().transform(Number).default('6379'),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    REDIS_TTL_SECONDS: zod_1.z.string().transform(Number).default('3600'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX: zod_1.z.string().transform(Number).default('100'),
    AUTH_RATE_LIMIT_MAX: zod_1.z.string().transform(Number).default('10'),
    STORAGE_PROVIDER: zod_1.z.enum(['local', 's3']).default('local'),
    UPLOAD_DIR: zod_1.z.string().default('./uploads'),
    MAX_FILE_SIZE_MB: zod_1.z.string().transform(Number).default('10'),
    SMTP_HOST: zod_1.z.string().default('smtp.mailtrap.io'),
    SMTP_PORT: zod_1.z.string().transform(Number).default('587'),
    SMTP_USER: zod_1.z.string().default(''),
    SMTP_PASS: zod_1.z.string().default(''),
    SMTP_FROM: zod_1.z.string().default('noreply@yono.sbi.co.in'),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
    LOG_DIR: zod_1.z.string().default('./logs'),
    BCRYPT_ROUNDS: zod_1.z.string().transform(Number).default('12'),
    OTP_EXPIRY_MINUTES: zod_1.z.string().transform(Number).default('10'),
    OTP_LENGTH: zod_1.z.string().transform(Number).default('6'),
    DRAFT_AUTO_SAVE_INTERVAL_SECONDS: zod_1.z.string().transform(Number).default('20'),
    DRAFT_EXPIRY_DAYS: zod_1.z.string().transform(Number).default('30'),
    DEFAULT_PAGE_SIZE: zod_1.z.string().transform(Number).default('20'),
    MAX_PAGE_SIZE: zod_1.z.string().transform(Number).default('100'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map