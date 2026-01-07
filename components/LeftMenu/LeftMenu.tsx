"use client";

import Image from "next/image";
import { leftNav } from "@/constants/leftNavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";


const LeftMenu = () => {
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isSidebarOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 491);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isOpen = isMobile ? false : isSidebarOpen;

    return (
        <aside
            ref={sidebarRef}
            className={`
                h-screen fixed left-0 top-0 z-40
                backdrop-blur-xl bg-white/90
                border-r border-accent-rose
                transition-all duration-300 ease-in-out
                ${isOpen ? "w-90 px-2" : "w-12 min-[768px]:w-15 p-1"}
            `}
        >
            {/* Toggle Button */}
            {!isMobile && (
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="
                        absolute right-4 top-5
                        
                        p-1.5
                        
                        cursor-pointer
                    "
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
                    )}
                </button>
            )}

            {/* Logo */}
            <div className="h-12 flex items-center justify-center">
                {!isMobile && isOpen && (
                    <Image alt="text-logo" src="/images/text_logo.svg" width={80} height={80} priority />
                )}
            </div>

            {/* Navigation */}
            <nav className="mt-4 space-y-5">
                {leftNav.map((group) => (
                    <div key={group.section}>
                        {isOpen && (
                            <h4 className="px-3 mb-2 text-[10px] text-nowrap font-semibold text-slate-500 uppercase">
                                {group.section}
                            </h4>
                        )}

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const active = pathname === item.href;

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={`
                                            relative flex items-center gap-3
                                            rounded-lg p-2.5
                                            transition-all
                                            hover:bg-black/5
                                            ${active ? "bg-black/5" : ""}
                                        `}
                                    >
                                        {/* Active Indicator */}
                                        {active && (
                                            <>
                                                {/* Glow bar */}
                                                <span className="
                                                                absolute left-0 top-1/2 -translate-y-1/2
                                                                h-7 w-1 rounded-r-full
                                                              bg-brand-red
                                                                active-glow
                                                                " />

                                                {/* Soft background glow */}
                                                <span className="
                                                                absolute inset-0 rounded-lg
                                                                bg-linear-to-r from-brand-red/10 via-transparent to-transparent
                                                                pointer-events-none
                                                            " />
                                            </>
                                        )}


                                        {/* Image OR Icon */}
                                        {isOpen && item.image ? (
                                            <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className={`object-cover border duration-150 hover:border-brand-red ${active ? "border-2 border-brand-red" : ""}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative group flex justify-start w-full">
                                                <item.icon
                                                    size={20}
                                                    className={`
                                                            transition
                                                            ${active
                                                            ? "text-brand-red drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                                                            : "text-slate-700"
                                                        }
                                                   `}
                                                />


                                                {!isOpen && !isMobile && (
                                                    <span
                                                        className="
                                                            absolute left-7 top-1/2 -translate-y-1/2
                                                            bg-black/70 text-white
                                                            text-[11px] px-2.5 py-1
                                                            rounded-sm
                                                            opacity-0 group-hover:opacity-100
                                                            transition
                                                            whitespace-nowrap z-50
                                                        "
                                                    >
                                                        {item.title}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Title */}
                                        {isOpen && (
                                            <h1
                                                className={`text-sm text-nowrap w-full hover:text-brand-red ${active
                                                    ? "text-brand-red"
                                                    : "text-slate-800"
                                                    }`}
                                            >
                                                {item.title}
                                            </h1>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default LeftMenu;
