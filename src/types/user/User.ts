import Role from "./Role.ts";

export interface UserSimple {

    idUser: string;
    email: string;
    imageUrl: string;

}

export interface User extends UserSimple {
    username: string;
    role: Role;
}


export function isAdmin(role: Role): boolean {
    return role == Role.ADMIN;
}
