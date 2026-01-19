import { type AppRoute } from "../../../types/route/appRoute.ts";
import SourcesPage from "../SourcesPage.tsx";
import SourcePage from "../SourcePage.tsx";

export const ROUTES_SOURCE = {
    sources: '/sources',
    source: '/sources/:idSource',
}

export const SourceRouting = {
    pathSources: () => ROUTES_SOURCE.sources,
    pathSource: (idSource: string) => `${ROUTES_SOURCE.sources}/${idSource}`,
}

export const appRoutesSource: AppRoute[] = [

    {
        path: ROUTES_SOURCE.sources,
        requiresAuth: true,
        element: SourcesPage
    },
    {
        path: ROUTES_SOURCE.source,
        requiresAuth: true,
        element: SourcePage
    },

]
