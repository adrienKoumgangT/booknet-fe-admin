import NotificationPage from "../NotificationPage.tsx";
import { type AppRoute } from "../../../types/route/appRoute.ts";

export const ROUTES_NOTIFICATION = {
    notification: '/notification'
}

export const NotificationRouting = {
    pathNotification: () => ROUTES_NOTIFICATION.notification,
}

export const appRoutesNotification: AppRoute[] = [

    {
        path: ROUTES_NOTIFICATION.notification,
        requiresAuth: true,
        element: NotificationPage
    }

]
