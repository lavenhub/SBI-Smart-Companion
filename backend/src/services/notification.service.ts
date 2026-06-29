import { NotificationRepository } from '../repositories/notification.repository';
import { cache } from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../constants';
import { SendNotificationDto, PaginationQuery } from '../types';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

const notifRepo = new NotificationRepository();

export class NotificationService {
  async send(dto: SendNotificationDto) {
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
    } as any);

    // Invalidate notification cache
    await cache.del(CACHE_KEYS.USER_NOTIFICATIONS(dto.userId));

    // In production: call FCM / SMS / Email providers here
    this.dispatchExternalNotification(dto).catch((err) => {
      logger.warn('External notification failed', { error: err.message });
    });

    return notification;
  }

  async sendBulk(notifications: SendNotificationDto[]): Promise<void> {
    const data = notifications.map((n) => ({
      userId: n.userId,
      type: n.type as any,
      channel: (n.channel ?? 'IN_APP') as any,
      title: n.title,
      body: n.body,
      data: (n.data ?? null) as any,
      isSent: true,
      sentAt: new Date(),
    }));
    await notifRepo.createMany(data);
  }

  async getNotifications(
    userId: string,
    pagination: PaginationQuery,
    filters: { isRead?: boolean; type?: string },
  ) {
    return notifRepo.findByUserId(userId, pagination, filters);
  }

  async markAsRead(id: string, userId: string) {
    const notification = await notifRepo.markAsRead(id, userId);
    if (!notification) throw new NotFoundError('Notification');
    await cache.del(CACHE_KEYS.USER_NOTIFICATIONS(userId));
    return notification;
  }

  async markAllAsRead(userId: string, ids?: string[]) {
    const count = await notifRepo.markAllAsRead(userId, ids);
    await cache.del(CACHE_KEYS.USER_NOTIFICATIONS(userId));
    return { marked: count };
  }

  async getUnreadCount(userId: string): Promise<number> {
    const cached = await cache.get<number>(`notif:unread:${userId}`);
    if (cached !== null) return cached;
    const count = await notifRepo.getUnreadCount(userId);
    await cache.set(`notif:unread:${userId}`, count, 60);
    return count;
  }

  private async dispatchExternalNotification(dto: SendNotificationDto): Promise<void> {
    if (dto.channel === 'EMAIL') {
      // await emailService.send(...)
    } else if (dto.channel === 'SMS') {
      // await smsService.send(...)
    } else if (dto.channel === 'PUSH') {
      // await fcmService.send(...)
    }
  }
}
