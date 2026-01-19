import { type AppRoute } from "../../../types/route/appRoute.ts";
import AuthorsPage from "../AuthorsPage.tsx";
import AuthorPage from "../AuthorPage.tsx";


export const ROUTES_AUTHOR = {
    authors: '/authors',
    author: '/authors/:idAuthor',
}

export const AuthorRouting = {
    pathAuthors: () => ROUTES_AUTHOR.authors,
    pathAuthor: (idAuthor: string) => `${ROUTES_AUTHOR.authors}/${idAuthor}`,
}

export const appRoutesAuthor: AppRoute[] = [

    {
        path: ROUTES_AUTHOR.authors,
        requiresAuth: true,
        element: AuthorsPage
    },
    {
        path: ROUTES_AUTHOR.author,
        requiresAuth: true,
        element: AuthorPage
    }

]
