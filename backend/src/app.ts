import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware';
import { requestId, httpLogger } from './middlewares/requestLogger.middleware';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';
import router from './routes';
import { logger } from './utils/logger';

export function createApp(): Application {
  const app = express();

  // ── Security ──────────────────────────────────────────────────────────────
  app.use(helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Device-Id'],
  }));

  // HTTP Parameter Pollution protection
  app.use(hpp());

  // ── Parsing ───────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ── Compression ───────────────────────────────────────────────────────────
  app.use(compression());

  // ── Request Tracing ───────────────────────────────────────────────────────
  app.use(requestId);
  app.use(httpLogger);

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  app.use(globalRateLimiter);

  // ── Static Uploads ────────────────────────────────────────────────────────
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

  // ── Health Check ──────────────────────────────────────────────────────────
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'yono-smart-companion-backend',
      version: '1.0.0',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // ── Swagger Documentation ─────────────────────────────────────────────────
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'YONO Smart Companion API',
      customCss: '.swagger-ui .topbar { background: #003399; }',
      swaggerOptions: { persistAuthorization: true },
    }),
  );

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // ── API Routes ────────────────────────────────────────────────────────────
  app.use(env.API_PREFIX, router);

  // ── Not Found ─────────────────────────────────────────────────────────────
  app.use(notFoundHandler);

  // ── Error Handler ─────────────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
