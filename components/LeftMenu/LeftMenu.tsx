"use client";

import Image from "next/image";
import { leftNav } from "@/constants/leftNavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";




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

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    // Detect screen size once + on resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 491);
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Derived state: sidebar open only when not mobile
    const isOpen = isMobile ? false : isSidebarOpen;

    return (
        <div
            ref={sidebarRef}
            className={`h-screen border-r border-gray-400/20 bg-accent-rose
                transition-all duration-300 relative 
                ${isOpen ? "w-60 p-1" : "w-12 min-[768px]:w-15 p-1"}
            `}
        >
            {/* Toggle button - disabled / hidden on mobile */}
            {!isMobile && (
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`${isSidebarOpen ? "absolute rounded-xs bg-brand-red text-white right-0 top-6 z-50 py-1 px-0.5 translate-x-1/2 shadow cursor-pointer" : "absolute rounded-xs bg-brand-red py-1 px-0.5 text-white right-0 top-6 z-50 translate-x-1/2 shadow cursor-pointer"}`}
                >
                    {isOpen ? <MdCancelPresentation size={16} /> : <GiHamburgerMenu size={14} />}
                </button>
            )}

            {/* Logo row */}
            <div className="py-2 flex items-center justify-center gap-2">
                <div className="w-7.5 h-7.5 shrink-0">
                    <Image src="/images/Evoque1.png" alt="logo" width={30} height={30} />
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
            <div className={`h-full ${isSidebarOpen ? "flex flex-col items-center gap-2 mt-2" : "my-6 flex flex-col items-center gap-2"}`}>
                {leftNav.map((group) => (
                    <div key={group.section} className="w-full mb-3">
                        {/* Section title (only when expanded) */}
                        {isOpen && (
                            <p className="text-xs uppercase tracking-widest text-slate-700 font-semibold mb-1 px-3">
                                {group.section}
                            </p>
                        )}

                        <div className={`${isOpen ? "flex flex-col gap-1 md:items-center justify-center items-center" : "flex flex-col gap-3 md:items-center justify-center items-start mb-4"}`}>
                            {group.items.map((item) => {

                                const active = pathname === item.href;

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={`${isSidebarOpen ? "py-1 group flex gap-2 w-full items-center px-3 hover:text-brand-red" : "mb-2 group flex gap-2 justify-center w-full"}
                                                                ${active ? "text-brand-red" : "text-slate-800"}
                                                                `}
                                    >
                                        {isOpen && item.image ? (
                                            <div className="w-11 h-10 relative shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-fill"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative group">
                                                <item.icon
                                                    size={22}
                                                    className={`transition
                                                                group-hover:text-brand-red
                                                                ${active ? "text-brand-red" : "text-slate-800"}
                                                                `}
                                                />

                                                {/* Tooltip – ONLY when sidebar is closed */}
                                                {!isOpen && !isMobile && (
                                                    <span
                                                        className="
                                                                    absolute left-7 top-1/2 -translate-y-1/2
                                                                    bg-black text-white text-[11px]
                                                                    px-2 py-1 rounded-sm
                                                                    opacity-0 pointer-events-none
                                                                    transition-opacity duration-200
                                                                    group-hover:opacity-100
                                                                    whitespace-nowrap z-50
                                                                "
                                                    >
                                                        {item.title}
                                                    </span>
                                                )}
                                            </div>

                                        )}

                                        {isOpen && (
                                            <span className="text-sm whitespace-nowrap">
                                                {item.title}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftMenu;
