"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const database_1 = require("../config/database");
class NotificationRepository {
    async create(data) {
        return database_1.prisma.notification.create({ data });
    }
    async createMany(data) {
        await database_1.prisma.notification.createMany({ data });
    }
    async findByUserId(userId, pagination, filters) {
        const { page, pageSize } = pagination;
        const where = {
            userId,
            ...(filters.isRead !== undefined && { isRead: filters.isRead }),
            ...(filters.type && { type: filters.type }),
        };
        const [notifications, total, unreadCount] = await database_1.prisma.$transaction([
            database_1.prisma.notification.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            database_1.prisma.notification.count({ where }),
            database_1.prisma.notification.count({ where: { userId, isRead: false } }),
        ]);
        return { notifications, total, unreadCount };
    }
    async markAsRead(id, userId) {
        return database_1.prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        }).catch(() => null);
    }
    async markAllAsRead(userId, ids) {
        const result = await database_1.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
                ...(ids?.length ? { id: { in: ids } } : {}),
            },
            data: { isRead: true, readAt: new Date() },
        });
        return result.count;
    }
    async deleteExpired() {
        const result = await database_1.prisma.notification.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });
        return result.count;
    }
    async getUnreadCount(userId) {
        return database_1.prisma.notification.count({ where: { userId, isRead: false } });
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notification.repository.js.map