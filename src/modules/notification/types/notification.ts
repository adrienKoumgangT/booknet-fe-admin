import type { NotificationAuthor } from "./notificationAuthor.ts";

export interface NotificationData {
    data?: string;
}

export interface Notification {
    idNotification: string;

    title: string;
    message: string;

    author: NotificationAuthor;

    createdAt: string;

    read: boolean;

    type: string;
    data?: NotificationData;
}
