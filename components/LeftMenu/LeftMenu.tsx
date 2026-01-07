"use client";

import Image from "next/image";
import { leftNav } from "@/constants/leftNavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const MOBILE_BREAKPOINT = 550;

const LeftMenu = () => {
    const pathname = usePathname();
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    /* ---------- SCREEN SIZE ---------- */
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ---------- CLICK OUTSIDE ---------- */
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);



    /* ---------- WIDTH LOGIC ---------- */
    const sidebarWidth = !isOpen
        ? "w-0"
        : isMobile
            ? "w-12"
            : "w-90";

    return (
        <>
            {/* MENU BUTTON (VISIBLE ON ALL SCREENS) */}
            <button data-menu-btn
                onClick={() => setIsOpen(!isOpen)}
                className="
                    fixed left-1 top-3 z-50
                    p-2
                "
            >
                {isOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                        <path d="M4 5h16" />
                        <path d="M4 12h16" />
                        <path d="M4 19h16" />
                    </svg>
                )}
            </button>

            {/* SIDEBAR */}
            <aside
                ref={sidebarRef}
                className={`
                    fixed left-0 top-15 z-40 h-screen bg-white
                    overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${sidebarWidth}
                `}
            >
                <nav className="space-y-6">
                    {leftNav.map((group) => (
                        <div key={group.section}>
                            {/* SECTION TITLE (DESKTOP ONLY & OPEN) */}
                            {!isMobile && isOpen && (
                                <h4 className="px-4 mb-2 text-[10px] font-extrabold text-slate-700 uppercase">
                                    {group.section}
                                </h4>
                            )}

                            <div className="space-y-1 ">
                                {group.items.map((item) => {
                                    const active = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={`active:scale-[0.98] transition-transform
                                                        relative flex items-center
                                                        rounded-sm
                                                        hover:bg-black/5
                                                        ${active ? "bg-black/5" : ""}
                                                    `}
                                        >
                                            {/* ACTIVE BAR */}
                                            {active && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-brand-red" />
                                            )}

                                            {/* MOBILE → ICON ONLY */}
                                            {isMobile && (
                                                <item.icon
                                                    size={20}
                                                    className={`m-3 ${active ? "text-brand-red" : "text-slate-700"}`}
                                                />
                                            )}

                                            {/* DESKTOP → IMAGE OR ICON */}
                                            {!isMobile && (
                                                <>
                                                    {item.image ? (
                                                        <div
                                                            className={`
        relative mx-1 w-full h-14 overflow-hidden rounded-md group
        transition-all duration-300
        ${active ? "ring-1 ring-brand-red/40" : ""}
    `}
                                                        >
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                className={`
            object-cover transition-transform duration-300
            ${active ? "scale-105" : "group-hover:scale-105"}
        `}
                                                                sizes="(min-width: 640px) 100vw"
                                                            />

                                                            {/* OVERLAY */}
                                                            <div
                                                                className={`
                                                                                absolute inset-0 transition-all duration-300
                                                                                ${active ? "bg-black/45" : "bg-black/30 group-hover:bg-black/40"}
                                                                            `}
                                                            />

                                                            {/* ACTIVE ACCENT */}
                                                            {active && (
                                                                <span className="absolute left-0 top-0 h-full w-[3px] bg-brand-red" />
                                                            )}

                                                            {/* TITLE */}
                                                            <span
                                                                className={`
                                                                            absolute left-3 bottom-2
                                                                            text-sm font-medium tracking-wide drop-shadow-md
                                                                            transition-colors duration-200
                                                                            ${active ? "text-white" : "text-white/90"}
                                                                        `}
                                                            >
                                                                {item.title}
                                                            </span>
                                                        </div>

                                                    ) : (
                                                        <div
                                                            className={`
                                                                    flex items-center gap-6 mx-1 px-3 py-2 w-full
                                                                    transition-all duration-200
                                                                    ${active ? "bg-brand-red/5" : ""}
                                                                `}
                                                        >
                                                            <item.icon
                                                                size={20}
                                                                className={`
                                                                    transition-all duration-200
                                                                    ${active ? "text-brand-red scale-105" : "text-slate-700"}
                                                                `}
                                                            />

                                                            <span
                                                                className={`
                                                                    text-sm whitespace-nowrap transition-colors duration-200
                                                                    ${active ? "text-brand-red font-medium" : "text-slate-800"}
                                                                `}
                                                            >
                                                                {item.title}
                                                            </span>
                                                        </div>

                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default LeftMenu;
