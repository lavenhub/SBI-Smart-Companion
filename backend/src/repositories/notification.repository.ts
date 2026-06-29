import { Prisma, Notification } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationQuery } from '../types';

export class NotificationRepository {
  async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async createMany(data: any[]): Promise<void> {
    await prisma.notification.createMany({ data } as any);
  }

  async findByUserId(
    userId: string,
    pagination: PaginationQuery,
    filters: { isRead?: boolean; type?: string },
  ): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
    const { page, pageSize } = pagination;

    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(filters.isRead !== undefined && { isRead: filters.isRead }),
      ...(filters.type && { type: filters.type as any }),
    };

    const [notifications, total, unreadCount] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, unreadCount };
  }

  async markAsRead(id: string, userId: string): Promise<Notification | null> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    }).catch(() => null);
  }

  async markAllAsRead(userId: string, ids?: string[]): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
        ...(ids?.length ? { id: { in: ids } } : {}),
      },
      data: { isRead: true, readAt: new Date() },
    });
    return result.count;
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.notification.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }
}
