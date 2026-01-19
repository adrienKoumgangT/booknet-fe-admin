import API from "../../../api/api.ts";
import { type Notification } from "../types/notification.ts";


const resourceUrl = "/notification";

export const NotificationService = {
    getNotifications: () => API.get<Notification[]>(`${resourceUrl}`),
    getNotificationsLatest: () => API.get<Notification[]>(`${resourceUrl}/latest`),
}
