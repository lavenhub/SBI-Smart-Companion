import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// Attach a unique request ID to every request
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) ?? uuidv4();
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-Id', id);
  next();
}

// Morgan stream pointing to Winston
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Skip health-check noise
const skip = (req: Request) =>
  req.path === '/health' || req.path === '/ping';

export const httpLogger = morgan(
  env.NODE_ENV === 'development'
    ? 'dev'
    : ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);
