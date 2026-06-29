import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
type AuditableAction = 'LOGIN' | 'LOGOUT' | 'TRANSFER_INITIATED' | 'DOCUMENT_ACCESSED' | 'DOCUMENT_DOWNLOADED' | 'SEARCH_PERFORMED' | 'VAULT_ACCESSED' | 'CARD_BLOCKED' | 'PROFILE_UPDATED';
/**
 * Middleware factory that logs an audit trail entry after the request completes.
 */
export declare function auditLog(action: AuditableAction, entityType?: string): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Standalone function to create an audit log entry imperatively.
 */
export declare function createAuditEntry(opts: {
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
}): Promise<void>;
export {};
//# sourceMappingURL=audit.middleware.d.ts.map