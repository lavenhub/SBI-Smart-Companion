import { SendNotificationDto, PaginationQuery } from '../types';
export declare class NotificationService {
    send(dto: SendNotificationDto): Promise<{
        type: string;
        id: string;
        userId: string;
        failureReason: string | null;
        createdAt: Date;
        expiresAt: Date | null;
        data: string | null;
        title: string;
        channel: string;
        body: string;
        imageUrl: string | null;
        actionUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        isSent: boolean;
        sentAt: Date | null;
    }>;
    sendBulk(notifications: SendNotificationDto[]): Promise<void>;
    getNotifications(userId: string, pagination: PaginationQuery, filters: {
        isRead?: boolean;
        type?: string;
    }): Promise<{
        notifications: import(".prisma/client").Notification[];
        total: number;
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        type: string;
        id: string;
        userId: string;
        failureReason: string | null;
        createdAt: Date;
        expiresAt: Date | null;
        data: string | null;
        title: string;
        channel: string;
        body: string;
        imageUrl: string | null;
        actionUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        isSent: boolean;
        sentAt: Date | null;
    }>;
    markAllAsRead(userId: string, ids?: string[]): Promise<{
        marked: number;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    private dispatchExternalNotification;
}
//# sourceMappingURL=notification.service.d.ts.map