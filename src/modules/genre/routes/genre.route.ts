import { type AppRoute } from "../../../types/route/appRoute.ts";
import GenresPage from "../GenresPage.tsx";
import GenrePage from "../GenrePage.tsx";

export const ROUTES_GENRE = {
    genres: '/genres',
    genre: '/genres/:idGenre',
}

export const GenreRouting = {
    pathGenres: () => ROUTES_GENRE.genres,
    pathGenre: (idGenre: string) => `${ROUTES_GENRE.genres}/${idGenre}`,
}

export const appRoutesGenre: AppRoute[] = [

    {
        path: ROUTES_GENRE.genres,
        requiresAuth: true,
        element: GenresPage
    },
    {
        path: ROUTES_GENRE.genre,
        requiresAuth: true,
        element: GenrePage
    }

]
