import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class NotificationController {
    getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    markRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getUnreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notification.controller.d.ts.map