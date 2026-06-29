import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

type AuditableAction =
  | 'LOGIN' | 'LOGOUT' | 'TRANSFER_INITIATED' | 'DOCUMENT_ACCESSED'
  | 'DOCUMENT_DOWNLOADED' | 'SEARCH_PERFORMED' | 'VAULT_ACCESSED'
  | 'CARD_BLOCKED' | 'PROFILE_UPDATED';

/**
 * Middleware factory that logs an audit trail entry after the request completes.
 */
export function auditLog(action: AuditableAction, entityType?: string) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    res.on('finish', async () => {
      // Only log on successful responses
      if (res.statusCode >= 400) return;

      try {
        await prisma.auditLog.create({
          data: {
            userId: req.user?.userId,
            action: action as any,
            entityType: entityType ?? null,
            entityId: req.params?.id ?? null,
            description: `${action} — ${req.method} ${req.path}`,
            ipAddress: (req.headers['x-forwarded-for'] as string) ?? req.ip ?? null,
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
      } catch (err) {
        // Audit logging must never break the main flow
        logger.warn('Failed to write audit log', { error: (err as Error).message });
      }
    });

    next();
  };
}

/**
 * Standalone function to create an audit log entry imperatively.
 */
export async function createAuditEntry(opts: {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  metadata?: Record<string, unknown>;
  severity?: 'INFO' | 'WARN' | 'ERROR';
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: opts.userId ?? null,
        action: opts.action as any,
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
  } catch (err) {
    logger.warn('Audit entry failed', { error: (err as Error).message });
  }
}
