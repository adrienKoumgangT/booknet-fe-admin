import API from "../../../api/api.ts";


const resourceUrl = "/auth";

export const AuthenticationService = {

    postLogin: async (username: string, password: string) => await API.post(
        `${resourceUrl}/login`,
        { username, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
    ),

    postLoginAlt: async (username: string, password: string) => await API.post(
        `${resourceUrl}/login-alt`,
        { username, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
    ),

}
