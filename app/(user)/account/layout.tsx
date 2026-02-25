// (user)/account/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Footer from "@/components/Footer/Footer";

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
            "px-3 sm:px-5 py-2 text-[10px] sm:text-xs tracking-widest uppercase border-b transition whitespace-nowrap",
            pathname === path
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
        );

    return (
        <div className="py-6 space-y-6 bg-white">
            {/* TITLE */}
            <div className="mx-2 flex justify-between items-center z-20">
                <h1 className="text-5xl tracking-wider font-bold">ACCOUNT</h1>
            </div>

            {/* NAV */}
            <div className="mx-2 relative border-b border-black/10 flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Tabs */}
                <div className="flex mb-2 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                    <Link href="/account" className={tabStyle("/account")}>
                        Account
                    </Link>

                    <Link href="/account/order" className={tabStyle("/account/order")}>
                        Orders
                    </Link>

                    <Link
                        href="/account/address"
                        className={tabStyle("/account/address")}
                    >
                        Address
                    </Link>
                </div>

                {/* Logout */}
                <button
                    onClick={() => setConfirmLogout(true)}
                    className="absolute right-0
                        cursor-pointer
                        text-[10px] sm:text-xs
                        uppercase tracking-widest
                        border border-black/10 px-3 sm:px-4 py-2
                        hover:bg-black hover:text-white
                        transition
                        sm:ml-auto
                        w-[20%] sm:w-auto
                    "
                >
                    Logout
                </button>
            </div>

            {/* CONTENT */}
            <div className="min-h-[55vh] sm:min-h-[60vh]">{children}</div>

            {/* MODAL */}
            {confirmLogout && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white border border-black/10 p-5 sm:p-8 w-full max-w-md space-y-5 sm:space-y-6">
                        <h2 className="text-base sm:text-lg font-semibold uppercase">
                            Confirm Logout
                        </h2>

                        <p className="text-sm text-gray-600">
                            Are you sure you want to logout?
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleLogout}
                                className="
                                    cursor-pointer
                                    px-5 py-2 border border-black/10
                                    bg-black text-white
                                    uppercase text-xs tracking-widest
                                    w-full
                                    "
                            >
                                Logout
                            </button>

                            <button
                                onClick={() => setConfirmLogout(false)}
                                className="
                                        cursor-pointer
                                        px-5 py-2 border border-black/10
                                        uppercase text-xs tracking-widest
                                        w-full
                                        "
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
