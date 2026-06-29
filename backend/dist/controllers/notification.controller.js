"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const notifService = new notification_service_1.NotificationService();
class NotificationController {
    async getAll(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || env_1.env.DEFAULT_PAGE_SIZE;
            const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
            const result = await notifService.getNotifications(req.user.userId, { page, pageSize }, { isRead, type: req.query.type });
            (0, response_1.sendSuccess)(res, { notifications: result.notifications, unreadCount: result.unreadCount }, 'Notifications retrieved', 200, (0, response_1.buildPaginationMeta)(result.total, page, pageSize));
        }
        catch (err) {
            next(err);
        }
    }
    async markRead(req, res, next) {
        try {
            const notification = await notifService.markAsRead(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, notification, 'Marked as read');
        }
        catch (err) {
            next(err);
        }
    }
    async markAllRead(req, res, next) {
        try {
            const result = await notifService.markAllAsRead(req.user.userId, req.body.ids);
            (0, response_1.sendSuccess)(res, result, 'All notifications marked as read');
        }
        catch (err) {
            next(err);
        }
    }
    async getUnreadCount(req, res, next) {
        try {
            const count = await notifService.getUnreadCount(req.user.userId);
            (0, response_1.sendSuccess)(res, { count });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map