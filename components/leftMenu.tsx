"use client";

import Image from "next/image";
import { leftNav } from "@/constants/leftNavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";

const LeftMenu = () => {
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size once + on resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 490);
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Derived state: sidebar open only when not mobile
    const isOpen = isMobile ? false : isSidebarOpen;

    return (
        <div
            className={`h-full
                border-r border-black/10 bg-red-100
                transition-all duration-300 relative
                ${isOpen ? "w-60 p-4" : "w-20 p-4"}
            `}
        >
            {/* Toggle button - disabled / hidden on mobile */}
            {!isMobile && (
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute right-0 top-6 z-50 translate-x-1/2 bg-red-100 shadow p-0.5 rounded-full border cursor-pointer"
                >
                    {isOpen ? <HiChevronLeft size={20} /> : <HiChevronRight size={20} />}
                </button>
            )}

            {/* Logo row */}
            <div className="p-1 flex items-center gap-2">
                <div className="w-[35px] h-[35px] shrink-0">
                    <Image src="/Evoque1.png" alt="logo" width={35} height={35} />
                </div>

                {/* Text only when expanded + not mobile */}
                {!isMobile && (
                    <div
                        className={`
                            overflow-hidden transition-all duration-300
                            ${isOpen ? "w-32 opacity-100" : "w-0 opacity-0"}
                        `}
                    >
                        <span className="font-light text-slate-700 text-md whitespace-nowrap">
                            The Evoque Store
                        </span>
                    </div>
                )}
            </div>

            {/* Menu items */}
            <div className="mt-8 flex flex-col gap-8 items-start">
                {leftNav.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`relative group flex items-center gap-3 p-2
                                ${active ? "text-brand-red" : "text-neutral-800"}`}
                        >
                            <Icon
                                size={22}
                                className={`group-hover:text-brand-red ${
                                    active ? "text-brand-red" : "text-slate-800"
                                }`}
                            />

                            {/* Text only when open */}
                            {isOpen && (
                                <span className="text-sm transition-opacity duration-300">
                                    {item.title}
                                </span>
                            )}

                            {/* Underline only when collapsed */}
                            {!isOpen && (
                                <>
                                    <span
                                        className={`
                                            bg-brand-red absolute -bottom-1 left-1/2 -translate-x-full
                                            h-0.5 w-0 group-hover:w-1/3 transition-all duration-300
                                            ${active && "w-1/3"}
                                        `}
                                    />
                                    <span
                                        className={`
                                            bg-brand-red absolute -bottom-1 left-1/2 translate-x-0
                                            h-0.5 w-0 group-hover:w-1/3 transition-all duration-300
                                            ${active && "w-1/3"}
                                        `}
                                    />
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Extras (desktop only + expanded) */}
            {!isMobile && isOpen && (
                <div className="mt-10 p-2 text-sm space-y-4">
                    <div className="font-medium text-gray-700">Extras</div>
                    <div className="text-gray-600 hover:text-brand-red cursor-pointer">Filters</div>
                    <div className="text-gray-600 hover:text-brand-red cursor-pointer">Notifications</div>
                    <div className="text-gray-600 hover:text-brand-red cursor-pointer">Settings</div>
                </div>
            )}
        </div>
    );
};

export default LeftMenu;
