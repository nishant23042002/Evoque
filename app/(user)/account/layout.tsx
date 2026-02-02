"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const [confirmLogout, setConfirmLogout] = useState(false);
    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        window.location.replace("/");
    };

    const tabStyle = (path: string) =>
        clsx(
            "px-4 py-2 text-sm font-medium rounded-[3px] transition",
            pathname === path
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--card-hover)]"
        );

    return (
        <div className="max-w-5xl h-[95vh] mx-auto px-4 md:px-6 py-3 space-y-3">
            {/* HEADER NAV */}
            <h1 className="text-3xl font-semibold text-foreground">
                My Account
            </h1>
            <div
                className="flex gap-3 p-2  rounded-[3px] border"
                style={{
                    background: "var(--linen-100)",
                    borderColor: "var(--border-strong)",
                }}
            >
                <Link href="/account/order" className={tabStyle("/account/order")}>
                    Orders
                </Link>

                <Link href="/account/address" className={tabStyle("/account/address")}>
                    Address
                </Link>

                <button
                    onClick={() => setConfirmLogout(true)}
                    className="ml-auto px-4 py-2 text-sm font-medium rounded-md text-destructive hover:bg-[rgba(158,42,43,0.08)]"
                >
                    Logout
                </button>
            </div>

            {/* PAGE CONTENT */}
            {children}

            {/* LOGOUT MODAL */}
            {confirmLogout && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div
                        className="p-6 rounded-xl border space-y-4"
                        style={{
                            background: "var(--surface)",
                            borderColor: "var(--border-light)",
                        }}
                    >
                        <h2 className="font-semibold text-foreground">
                            Confirm Logout
                        </h2>
                        <p className="text-sm text-(--text-secondary)">
                            Are you sure you want to logout?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md bg-destructive text-white"
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={() => setConfirmLogout(false)}
                                className="px-4 py-2 rounded-md border border-border"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
