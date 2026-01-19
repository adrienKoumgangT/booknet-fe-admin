import API from "../../api/api.ts";
import type { AuthUser } from "./AuthContext.tsx";

const resourceUrl = "/auth";

export const AuthService = {
    getAuthMe: () => API.get<AuthUser>(`${resourceUrl}/me`),
}
