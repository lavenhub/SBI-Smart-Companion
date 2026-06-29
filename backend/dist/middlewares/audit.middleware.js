"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = auditLog;
exports.createAuditEntry = createAuditEntry;
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
/**
 * Middleware factory that logs an audit trail entry after the request completes.
 */
function auditLog(action, entityType) {
    return async (req, res, next) => {
        res.on('finish', async () => {
            // Only log on successful responses
            if (res.statusCode >= 400)
                return;
            try {
                await database_1.prisma.auditLog.create({
                    data: {
                        userId: req.user?.userId,
                        action: action,
                        entityType: entityType ?? null,
                        entityId: req.params?.id ?? null,
                        description: `${action} — ${req.method} ${req.path}`,
                        ipAddress: req.headers['x-forwarded-for'] ?? req.ip ?? null,
                        userAgent: req.headers['user-agent'] ?? null,
                        deviceId: req.deviceId ?? null,
                        metadata: JSON.stringify({
                            method: req.method,
                            path: req.path,
                            statusCode: res.statusCode,
                        }),
                        severity: 'INFO',
                    },
                });
            }
            catch (err) {
                // Audit logging must never break the main flow
                logger_1.logger.warn('Failed to write audit log', { error: err.message });
            }
        });
        next();
    };
}
/**
 * Standalone function to create an audit log entry imperatively.
 */
async function createAuditEntry(opts) {
    try {
        await database_1.prisma.auditLog.create({
            data: {
                userId: opts.userId ?? null,
                action: opts.action,
                entityType: opts.entityType ?? null,
                entityId: opts.entityId ?? null,
                description: opts.description,
                ipAddress: opts.ipAddress ?? null,
                userAgent: opts.userAgent ?? null,
                deviceId: opts.deviceId ?? null,
                metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
                severity: opts.severity ?? 'INFO',
            },
        });
    }
    catch (err) {
        logger_1.logger.warn('Audit entry failed', { error: err.message });
    }
}
//# sourceMappingURL=audit.middleware.js.map