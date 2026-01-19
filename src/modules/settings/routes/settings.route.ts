import SettingsPage from "../SettingsPage.tsx";
import { type AppRoute } from "../../../types/route/appRoute.ts";


export const ROUTES_SETTINGS = {
    settings: '/settings',
}


export const SettingsRouting = {
    pathSettings: () => ROUTES_SETTINGS.settings,
}


export const appRoutesSettings: AppRoute[] = [
    {
        path: ROUTES_SETTINGS.settings,
        requiresAuth: true,
        element: SettingsPage
    }
]
