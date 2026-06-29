"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const constants_1 = require("../constants");
const env_1 = require("../config/env");
function errorHandler(err, req, res, next) {
    // Already-sent response guard
    if (res.headersSent) {
        next(err);
        return;
    }
    let statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let code = 'INTERNAL_ERROR';
    let details;
    // ── Operational App Errors ────────────────────────────────────────────────
    if (err instanceof errors_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
        details = err.details;
        if (!err.isOperational) {
            logger_1.logger.error('Non-operational error', {
                error: err.message,
                stack: err.stack,
                path: req.path,
                method: req.method,
            });
        }
    }
    // ── Prisma Errors ─────────────────────────────────────────────────────────
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = constants_1.HTTP_STATUS.CONFLICT;
            message = 'A record with this value already exists';
            code = 'DUPLICATE_ENTRY';
            details = { fields: err.meta?.target };
        }
        else if (err.code === 'P2025') {
            statusCode = constants_1.HTTP_STATUS.NOT_FOUND;
            message = 'Record not found';
            code = 'NOT_FOUND';
        }
        else if (err.code === 'P2003') {
            statusCode = constants_1.HTTP_STATUS.BAD_REQUEST;
            message = 'Referenced record does not exist';
            code = 'FOREIGN_KEY_VIOLATION';
        }
        else {
            logger_1.logger.error('Prisma error', { code: err.code, meta: err.meta });
        }
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = constants_1.HTTP_STATUS.BAD_REQUEST;
        message = 'Database validation error';
        code = 'DB_VALIDATION_ERROR';
    }
    // ── Generic Errors ────────────────────────────────────────────────────────
    else {
        logger_1.logger.error('Unhandled error', {
            error: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });
    }
    const response = {
        success: false,
        message,
        code,
        timestamp: new Date().toISOString(),
    };
    // Only expose details in non-production
    if (details && env_1.env.NODE_ENV !== 'production') {
        response.details = details;
    }
    if (env_1.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);
}
/** Handle 404 — no route matched */
function notFoundHandler(req, res) {
    res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        code: 'ROUTE_NOT_FOUND',
        timestamp: new Date().toISOString(),
    });
}
//# sourceMappingURL=errorHandler.middleware.js.map