import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError, ValidationError, ConflictError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../constants';
import { env } from '../config/env';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Already-sent response guard
  if (res.headersSent) {
    next(err);
    return;
  }

  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected error occurred';
  let code = 'INTERNAL_ERROR';
  let details: unknown;

  // ── Operational App Errors ────────────────────────────────────────────────
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.details;

    if (!err.isOperational) {
      logger.error('Non-operational error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
      });
    }
  }

  // ── Prisma Errors ─────────────────────────────────────────────────────────
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = HTTP_STATUS.CONFLICT;
      message = 'A record with this value already exists';
      code = 'DUPLICATE_ENTRY';
      details = { fields: (err.meta as any)?.target };
    } else if (err.code === 'P2025') {
      statusCode = HTTP_STATUS.NOT_FOUND;
      message = 'Record not found';
      code = 'NOT_FOUND';
    } else if (err.code === 'P2003') {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = 'Referenced record does not exist';
      code = 'FOREIGN_KEY_VIOLATION';
    } else {
      logger.error('Prisma error', { code: err.code, meta: err.meta });
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Database validation error';
    code = 'DB_VALIDATION_ERROR';
  }

  // ── Generic Errors ────────────────────────────────────────────────────────
  else {
    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  const response: Record<string, unknown> = {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
  };

  // Only expose details in non-production
  if (details && env.NODE_ENV !== 'production') {
    response.details = details;
  }
  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/** Handle 404 — no route matched */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
  });
}
