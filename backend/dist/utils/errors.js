"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalServiceError = exports.StorageError = exports.DatabaseError = exports.RateLimitError = exports.BusinessError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
const constants_1 = require("../constants");
// ─── Base Application Error ───────────────────────────────────────────────────
class AppError extends Error {
    constructor(message, statusCode, code, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// ─── Specific Error Classes ───────────────────────────────────────────────────
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, constants_1.HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', true, details);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, constants_1.HTTP_STATUS.UNAUTHORIZED, 'AUTHENTICATION_ERROR');
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, constants_1.HTTP_STATUS.FORBIDDEN, 'AUTHORIZATION_ERROR');
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, constants_1.HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, constants_1.HTTP_STATUS.CONFLICT, 'CONFLICT');
    }
}
exports.ConflictError = ConflictError;
class BusinessError extends AppError {
    constructor(message, code = 'BUSINESS_ERROR', details) {
        super(message, constants_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, code, true, details);
    }
}
exports.BusinessError = BusinessError;
class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, constants_1.HTTP_STATUS.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED');
    }
}
exports.RateLimitError = RateLimitError;
class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', details) {
        super(message, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, 'DATABASE_ERROR', false, details);
    }
}
exports.DatabaseError = DatabaseError;
class StorageError extends AppError {
    constructor(message = 'File storage operation failed') {
        super(message, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, 'STORAGE_ERROR', false);
    }
}
exports.StorageError = StorageError;
class ExternalServiceError extends AppError {
    constructor(service, message) {
        super(message ?? `External service error: ${service}`, constants_1.HTTP_STATUS.BAD_GATEWAY, 'EXTERNAL_SERVICE_ERROR', true);
    }
}
exports.ExternalServiceError = ExternalServiceError;
//# sourceMappingURL=errors.js.map