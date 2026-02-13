"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "../AuthProvider";


interface Props {
    open: boolean;
    onClose: () => void;
}

const AccountDropdown = ({ open, onClose }: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
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
        await logout();  
        setShowConfirm(false);
        onClose();
    };
    return (
        <>
            <div
                ref={ref}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "absolute right-0 top-10 z-50 w-44 h-25 bg-white",
                    "border border-(--border-strong)",
                    "shadow-lg py-2",
                    "origin-top-right transform-gpu",
                    "transition-all duration-200 ease-out",
                    open
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                )}
            >
                <Link
                    href="/account"
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
                    onClick={() => setShowConfirm(true)}
                    className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
                    <div className="bg-white border p-6 w-[90%] max-w-sm space-y-5">
                        <h2 className="text-sm font-semibold uppercase tracking-widest">
                            Confirm Sign Out
                        </h2>

                        <p className="text-sm text-gray-600">
                            Are you sure you want to sign out?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border bg-black text-white text-xs uppercase tracking-widest"
                            >
                                Sign Out
                            </button>

                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default AccountDropdown;
