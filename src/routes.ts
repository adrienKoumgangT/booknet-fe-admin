import { type AppRoute } from "./types/route/appRoute.ts";
import { appRoutesNotification, ROUTES_NOTIFICATION } from "./modules/notification/routes/notification.route.ts";
import { appRoutesHome, ROUTES_HOME } from "./modules/home/routes/routes.ts";
import { appRoutesSettings, ROUTES_SETTINGS } from "./modules/settings/routes/settings.route.ts";
import { appRoutesAuthentication, ROUTES_AUTHENTICATION } from "./modules/authentication/routes/routes.ts";
import { appRoutesSource, ROUTES_SOURCE } from "./modules/source/routes/source.route.ts";
import { appRoutesGenre, ROUTES_GENRE } from "./modules/genre/routes/genre.route.ts";
import {appRoutesAuthor, ROUTES_AUTHOR} from "./modules/author/routes/author.route.ts";


export const ROUTES = {
    test: '/test',

    analytics: '/analytics',
    dashboard: '/dashboard',

    ...ROUTES_AUTHENTICATION,

    ...ROUTES_AUTHOR,

    ...ROUTES_GENRE,

    ...ROUTES_HOME,

    ...ROUTES_NOTIFICATION,

    ...ROUTES_SETTINGS,

    ...ROUTES_SOURCE,


    // Functionality pages
    settings: '/settings',
    assistance: '/assistance',
    about: '/about',
    feedback: '/feedback',

}


export const appRoutes: AppRoute[] = [

    ...appRoutesAuthentication,

    ...appRoutesAuthor,

    ...appRoutesGenre,

    ...appRoutesHome,

    ...appRoutesNotification,

    ...appRoutesSettings,

    ...appRoutesSource,

]

export function getUnAuthRoutes(): AppRoute[] {
    return appRoutes.filter(appRoute => !appRoute.requiresAuth);
}
