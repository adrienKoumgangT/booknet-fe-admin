import SignInSidePage from "../SignInSidePage.tsx";
import SignInPage from "../SignInPage.tsx";
import SignUpPage from "../SignUpPage.tsx";
import { type AppRoute } from "../../../types/route/appRoute.ts";


export const ROUTES_AUTHENTICATION = {
    login: '/login',
    signIn: '/sign-in',
    signUp: '/sign-up',
}

export const AuthenticationRouting = {
    pathAuthenticationLogin: () => ROUTES_AUTHENTICATION.login,
    pathAuthenticationSignIn: () => ROUTES_AUTHENTICATION.signIn,
    pathAuthenticationSignUp: () => ROUTES_AUTHENTICATION.signUp,
}

export const appRoutesAuthentication: AppRoute[] = [
    {
        path: ROUTES_AUTHENTICATION.login,
        requiresAuth: false,
        element: SignInSidePage
    },
    {
        path: ROUTES_AUTHENTICATION.signIn,
        requiresAuth: false,
        element: SignInPage
    },
    {
        path: ROUTES_AUTHENTICATION.signUp,
        requiresAuth: false,
        element: SignUpPage
    }
]
