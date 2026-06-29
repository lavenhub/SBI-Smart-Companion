"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_repository_1 = require("../repositories/notification.repository");
const redis_1 = require("../config/redis");
const constants_1 = require("../constants");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const notifRepo = new notification_repository_1.NotificationRepository();
class NotificationService {
    async send(dto) {
        const notification = await notifRepo.create({
            user: { connect: { id: dto.userId } },
            type: dto.type,
            channel: dto.channel ?? 'IN_APP',
            title: dto.title,
            body: dto.body,
            data: dto.data ? JSON.stringify(dto.data) : null,
            actionUrl: dto.actionUrl,
            isSent: true,
            sentAt: new Date(),
        });
        // Invalidate notification cache
        await redis_1.cache.del(constants_1.CACHE_KEYS.USER_NOTIFICATIONS(dto.userId));
        // In production: call FCM / SMS / Email providers here
        this.dispatchExternalNotification(dto).catch((err) => {
            logger_1.logger.warn('External notification failed', { error: err.message });
        });
        return notification;
    }
    async sendBulk(notifications) {
        const data = notifications.map((n) => ({
            userId: n.userId,
            type: n.type,
            channel: (n.channel ?? 'IN_APP'),
            title: n.title,
            body: n.body,
            data: (n.data ?? null),
            isSent: true,
            sentAt: new Date(),
        }));
        await notifRepo.createMany(data);
    }
    async getNotifications(userId, pagination, filters) {
        return notifRepo.findByUserId(userId, pagination, filters);
    }
    async markAsRead(id, userId) {
        const notification = await notifRepo.markAsRead(id, userId);
        if (!notification)
            throw new errors_1.NotFoundError('Notification');
        await redis_1.cache.del(constants_1.CACHE_KEYS.USER_NOTIFICATIONS(userId));
        return notification;
    }
    async markAllAsRead(userId, ids) {
        const count = await notifRepo.markAllAsRead(userId, ids);
        await redis_1.cache.del(constants_1.CACHE_KEYS.USER_NOTIFICATIONS(userId));
        return { marked: count };
    }
    async getUnreadCount(userId) {
        const cached = await redis_1.cache.get(`notif:unread:${userId}`);
        if (cached !== null)
            return cached;
        const count = await notifRepo.getUnreadCount(userId);
        await redis_1.cache.set(`notif:unread:${userId}`, count, 60);
        return count;
    }
    async dispatchExternalNotification(dto) {
        if (dto.channel === 'EMAIL') {
            // await emailService.send(...)
        }
        else if (dto.channel === 'SMS') {
            // await smsService.send(...)
        }
        else if (dto.channel === 'PUSH') {
            // await fcmService.send(...)
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map