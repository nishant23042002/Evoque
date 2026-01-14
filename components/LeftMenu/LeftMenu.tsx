"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";


import {
    HiOutlineHome,
    HiOutlineHeart,
    HiOutlineUser,
} from "react-icons/hi";
import { MdFiberNew } from "react-icons/md";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_BREAKPOINT = 550;

/* ---------------- TYPES ---------------- */
interface Category {
    _id: string;
    name: string;
    slug: string;
    leftMenuCategoryImage: string;
}

interface StaticItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

/* ---------------- STATIC NAV ---------------- */
const PRIMARY_ITEMS: StaticItem[] = [
    { title: "Home", href: "/", icon: HiOutlineHome },
    { title: "New Arrivals", href: "/new-arrivals", icon: MdFiberNew },
    { title: "Best Sellers", href: "/best-sellers", icon: Flame },
];

const SECONDARY_ITEMS: StaticItem[] = [
    { title: "Wishlist", href: "/wishlist", icon: HiOutlineHeart },
    { title: "Account", href: "/account", icon: HiOutlineUser },
];


const LeftMenu = () => {
    const pathname = usePathname();
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    /* ---------- FETCH CATEGORIES ---------- */
    useEffect(() => {
        async function fetchCategories() {

            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        }

        if (isOpen) fetchCategories();
    }, [isOpen]);

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
            const target = e.target as HTMLElement;

            // ❗ Ignore menu button click
            if (target.closest("[data-menu-btn]")) return;

            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleNavClick = () => {
        setIsOpen(false);
    };


    /* ---------- WIDTH LOGIC ---------- */
    const SIDEBAR_WIDTH = isMobile ? "w-14" : "w-90";


    return (
        <>
            {/* MENU BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed left-2 top-0 z-50 py-2 duration-200 hover:text-brand-red cursor-pointer ${isOpen ? "left-4 top-5" : "top-12.25"}`}
            >
                {isOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M4 5h16" />
                        <path d="M4 12h16" />
                        <path d="M4 19h16" />
                    </svg>
                )}
            </button>

            <div
                className={cn(
                    "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* SIDEBAR */}
            <aside
                ref={sidebarRef}
                className={`
                                    fixed top-0 m-0 left-0 z-40 h-screen py-1
                                    bg-[#e2dfd6] border border-r-black/20
                                    ${SIDEBAR_WIDTH}

                                    transform transition-transform duration-300 ease-in-out
                                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                                `}
            >

                <nav className="flex flex-col pt-16 h-full min-[551px]:mx-2">

                    {/* ---------- TOP: PRIMARY ---------- */}
                    <div className="space-y-1 pt-2">
                        {!isMobile && (
                            <h2 className="select-none hover:text-brand-red duration-200 mx-1 text-sm tracking-widest font-extralight font-poppins text-neutral-700 mb-1.5">
                                The Layers
                            </h2>
                        )}
                        {PRIMARY_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className="relative flex items-center rounded-sm hover:bg-black/5 transition-all"
                                >
                                    {active && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-brand-red" />
                                    )}

                                    {isMobile ? (
                                        <Icon
                                            size={20}
                                            className={`m-3 ${active ? "text-brand-red" : "text-slate-700"
                                                }`}
                                        />
                                    ) : (
                                        <div
                                            className={`flex items-center gap-5 mx-1 px-3 py-2 w-full ${active ? "bg-brand-red/5" : ""
                                                }`}
                                        >
                                            <Icon
                                                size={20}
                                                className={
                                                    active
                                                        ? "text-brand-red scale-105"
                                                        : "text-slate-700"
                                                }
                                            />
                                            <span
                                                className={
                                                    active
                                                        ? "text-brand-red font-medium"
                                                        : "text-slate-800"
                                                }
                                            >
                                                {item.title}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* ---------- MIDDLE: CATEGORIES ---------- */}
                    <div className="mt-4">
                        {!isMobile && (
                            <h2 className="mx-1 text-sm tracking-widest font-extralight hover:text-brand-red select-none font-poppins text-neutral-700 mb-1.5">
                                Now Trending
                            </h2>
                        )}

                        <div className="space-y-1">
                            {categories.slice(0, 5).map((category, i) => {
                                const active =
                                    pathname === `/categories/${category.slug}`;

                                return (
                                    <Link
                                        key={category._id}
                                        href={`/categories/${category.slug}`}
                                        onClick={handleNavClick}
                                        className="relative flex items-center rounded-sm hover:bg-black/5 transition-all"
                                    >
                                        {active && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-brand-red" />
                                        )}

                                        <div className={`relative mx-1 w-full h-12 min-[551px]:h-14 rounded-md overflow-hidden`}>
                                            <Image
                                                src={category.leftMenuCategoryImage}
                                                alt={category.name}
                                                fill
                                                loading={i === 0 ? "eager" : "lazy"}
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className={active ? "absolute inset-0 bg-black/25" : ""} />
                                            <span className="absolute left-1 min-[551px]:left-3 bottom-2 text-[12px] min-[551px]:text-sm text-white font-medium">
                                                {category.name}
                                            </span>
                                        </div>

                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* ---------- BOTTOM: SECONDARY ---------- */}
                    <div className=" space-y-1 pb-4 mt-4">
                        {SECONDARY_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className="relative flex items-center rounded-sm hover:bg-black/5 transition-all"
                                >
                                    {active && (
                                        <span className="absolute left-0 top-5.5 -translate-y-1/2 h-6 w-1 bg-brand-red" />
                                    )}

                                    {isMobile ? (
                                        <Icon
                                            size={20}
                                            className={`m-3 ${active ? "text-brand-red" : "text-slate-700"
                                                }`}
                                        />
                                    ) : (
                                        <div className={`flex items-center gap-5 mx-1 px-3 py-2 w-full`}>
                                            <Icon
                                                size={20}
                                                className={
                                                    active
                                                        ? "text-brand-red scale-105"
                                                        : "text-slate-700"
                                                }
                                            />
                                            <span
                                                className={
                                                    active
                                                        ? "text-brand-red font-medium"
                                                        : "text-slate-800"
                                                }
                                            >
                                                {item.title}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default LeftMenu;
