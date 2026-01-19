import React, { createContext, useContext, useState } from 'react';
import { AuthService } from "./auth.service.ts";
import Role from "../../types/user/Role.ts";

export interface AuthUser {
    idUser: string;

    name: string;
    username: string;

    role: Role;
}

interface AuthContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    const refreshUser = async () => {
        try {
            AuthService.getAuthMe()
                .then((res) => {
                    setUser(res.data);
                }).catch((err) => {
                console.error(err);
            });
        } catch (err) {
            console.error('Failed to fetch user:', err);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
