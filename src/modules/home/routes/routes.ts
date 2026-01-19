import HomePage from "../HomePage.tsx";
import { type AppRoute } from "../../../types/route/appRoute.ts";


export const ROUTES_HOME = {
    home: '/home',
}


export const HomeRouting = {
    pathHome: () => ROUTES_HOME.home,
}


export const appRoutesHome: AppRoute[] = [

    {
        path: ROUTES_HOME.home,
        requiresAuth: true,
        element: HomePage
    },

]
