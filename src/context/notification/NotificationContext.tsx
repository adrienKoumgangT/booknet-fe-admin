import React, {createContext, useContext, useState} from "react";
import { NotificationService } from "../../modules/notification/services/notification.service.ts";
import { type Notification } from "../../modules/notification/types/notification.ts";

interface NotificationContextType {

    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;

    unreadCount: number;
    setUnreadCount: (unreadCount: number) => void;

    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const refreshNotifications = async () => {
        try {
            NotificationService.getNotificationsLatest()
                .then((res) => {
                    // console.log(res.data);
                    setNotifications(res.data);
                    setUnreadCount(res.data.length);
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (err) {
            console.error('Failed to fetch notifications', err);
            setNotifications([]);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, unreadCount, setUnreadCount, refreshNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};


export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if(!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
    return ctx;
}
