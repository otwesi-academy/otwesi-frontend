"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
    fullname: string;
    email: string;
    id: string;
    is_admin: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean; // new
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // new: loading flag

    // Load user info from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // done loading
    }, []);

    const login = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        try {
            // Call backend to delete HttpOnly cookie
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
                method: "POST",
                credentials: "include", // Important to send cookie
            });
        } catch (err) {
            console.error("Error logging out:", err);
        }
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
