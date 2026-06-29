import { Prisma, Notification } from '@prisma/client';
import { PaginationQuery } from '../types';
export declare class NotificationRepository {
    create(data: Prisma.NotificationCreateInput): Promise<Notification>;
    createMany(data: any[]): Promise<void>;
    findByUserId(userId: string, pagination: PaginationQuery, filters: {
        isRead?: boolean;
        type?: string;
    }): Promise<{
        notifications: Notification[];
        total: number;
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<Notification | null>;
    markAllAsRead(userId: string, ids?: string[]): Promise<number>;
    deleteExpired(): Promise<number>;
    getUnreadCount(userId: string): Promise<number>;
}
//# sourceMappingURL=notification.repository.d.ts.map