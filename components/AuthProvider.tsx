"use client"
import { auth } from "@/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"

interface BackendUser {
    id: string;
    phone: string;
}
interface AuthContextType {
    user: BackendUser | null;
    loading: boolean;
    syncUser: () => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<BackendUser | null>(null);
    const [loading, setLoading] = useState(true);

    const syncUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const res = await fetch("/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Session invalid");

            const data = await res.json();
            setUser(data.user);
        } catch {
            localStorage.removeItem("token");
            setUser(null);
        }
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                localStorage.removeItem("token");
                setUser(null);
                setLoading(false);
                return;
            }

            await syncUser();
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    console.log("AuthProvider user:", user);
    console.log("AuthProvider loading:", loading);

    const logout = async () => {
        await auth.signOut();
        localStorage.removeItem("token");
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, loading,syncUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
