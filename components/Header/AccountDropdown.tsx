"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "../AuthProvider";


interface Props {
    open: boolean;
    onClose: () => void;
}

const AccountDropdown = ({ open, onClose }: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { logout } = useAuth();
    // click outside
    useEffect(() => {
        if (!open) return;

        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [open, onClose]);


    const handleLogout = async () => {
        await logout();   // 🔐 Firebase + backend logout
        onClose();
    };
    return (
        <div
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "absolute right-0 top-10 z-50 w-44",
                "rounded-b-md border border-(--border-strong)",
                "bg-(--linen-200) shadow-lg",
                "origin-top-right transform-gpu",
                "transition-all duration-200 ease-out",
                open
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
            )}
        >
            <Link
                href="/account/order"
                onClick={onClose}
                className="
                        flex items-center duration-500 font-medium gap-2 px-3 py-2 text-sm
                        text-foreground hover:bg-(--earth-sand)/40
                        "
            >
                <User size={18} />
                Account
            </Link>

            <button
                onClick={handleLogout}
                className="
                            w-full flex items-center gap-2 duration-500 font-medium px-3 py-2 text-sm
                            text-red-600 hover:bg-red-500/10
                            "
            >
                <LogOut size={18} />
                Sign Out
            </button>
        </div>
    );
};

export default AccountDropdown;
