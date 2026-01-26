"use client";

import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchWishlist } from "@/store/wishlist/wishlist.thunks";
import { clearWishlist } from "@/store/wishlist/wishlist.slice";
export const dynamic = "force-dynamic";

interface BackendUser {
    id: string;
    phone: string;
}

interface AuthContextType {
    user: BackendUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    syncUser: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<BackendUser | null>(null);
    const [loading, setLoading] = useState(true);
    const mounted = useRef(true);
    const dispatch = useAppDispatch();

    const syncUser = async () => {
        try {
            const res = await fetch("/api/auth/me", {
                credentials: "include"
            });

            if (!res.ok) throw new Error("Session invalid");

            const data = await res.json();

            if (mounted.current) {
                setUser(data.user);
                dispatch(fetchWishlist()); // ✅ FETCH WISHLIST
            }
        } catch (err) {
            console.warn("Auth sync failed", err);
            if (mounted.current) {
                setUser(null);
                dispatch(clearWishlist()); // ✅ CLEAR WISHLIST
            }
        }
    };

    useEffect(() => {
        mounted.current = true;

        // 🔹 Initial hydration
        syncUser().finally(() => {
            setLoading(false);
        });

        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                if (!firebaseUser) {
                    setUser(null);
                    dispatch(clearWishlist()); // ✅ CLEAR ON LOGOUT
                    setLoading(false);
                    return;
                }

                await syncUser();
                setLoading(false);
            }
        );

        return () => {
            mounted.current = false;
            unsubscribe();
        };
    }, [dispatch]);

    const logout = async () => {
        await auth.signOut();
        await fetch("/api/auth/logout", { method: "POST" });
        dispatch(clearWishlist()); // ✅ CLEAR REDUX
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                syncUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }
    return ctx;
}
