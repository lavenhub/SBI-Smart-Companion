import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, buildPaginationMeta } from '../utils/response';
import { env } from '../config/env';

const notifService = new NotificationService();

export class NotificationController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || env.DEFAULT_PAGE_SIZE;
      const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;

      const result = await notifService.getNotifications(
        req.user.userId,
        { page, pageSize },
        { isRead, type: req.query.type as string },
      );

      sendSuccess(
        res,
        { notifications: result.notifications, unreadCount: result.unreadCount },
        'Notifications retrieved',
        200,
        buildPaginationMeta(result.total, page, pageSize),
      );
    } catch (err) {
      next(err);
    }
  }

  async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await notifService.markAsRead(req.params.id, req.user.userId);
      sendSuccess(res, notification, 'Marked as read');
    } catch (err) {
      next(err);
    }
  }

  async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await notifService.markAllAsRead(req.user.userId, req.body.ids);
      sendSuccess(res, result, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await notifService.getUnreadCount(req.user.userId);
      sendSuccess(res, { count });
    } catch (err) {
      next(err);
    }
  }
}
