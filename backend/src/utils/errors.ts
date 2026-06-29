import { HTTP_STATUS } from '../constants';

// ─── Base Application Error ───────────────────────────────────────────────────
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Specific Error Classes ───────────────────────────────────────────────────
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT, 'CONFLICT');
  }
}

export class BusinessError extends AppError {
  constructor(message: string, code = 'BUSINESS_ERROR', details?: unknown) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, code, true, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED');
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details?: unknown) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'DATABASE_ERROR', false, details);
  }
}

export class StorageError extends AppError {
  constructor(message = 'File storage operation failed') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'STORAGE_ERROR', false);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      message ?? `External service error: ${service}`,
      HTTP_STATUS.BAD_GATEWAY,
      'EXTERNAL_SERVICE_ERROR',
      true,
    );
  }
}
