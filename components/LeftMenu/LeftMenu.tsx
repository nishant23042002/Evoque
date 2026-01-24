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
import { Menu } from "lucide-react";

const MOBILE_BREAKPOINT = 550;

/* ---------------- TYPES ---------------- */
interface Category {
    _id: string;
    name: string;
    slug: string;
    isTrending: boolean;
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
                const isTrendingCategory = data.filter(
                    (cat: Category) => cat?.isTrending
                );
                setCategories(isTrendingCategory);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        }
        fetchCategories();
    }, []);

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
            if (target.closest("[data-menu-btn]")) return;

            if (sidebarRef.current && !sidebarRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);


    const handleNavClick = () => setIsOpen(false);

    const SIDEBAR_WIDTH = isMobile ? "w-70" : "w-90";

    return (
        <>
            {/* MENU BUTTON */}
            <button
                data-menu-btn
                onClick={() => setIsOpen(v => !v)}
                className={"fixed max-[550px]:left-1.5 left-3 top-5 z-50 cursor-pointer rounded-md text-foreground hover:text-primary transition-transform duration-300 ease-in-out"}
            >
                <span
                    className={cn(
                        "inline-block transition-transform duration-300",
                        isOpen && "rotate-90"
                    )}
                >
                    {isOpen ? (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    ) : (
                        <Menu size={20} />
                    )}
                </span>
            </button>


            {/* BACKDROP */}
            <div
                className={cn(
                    "fixed inset-0 z-30",
                    "bg-(--earth-charcoal)/40",
                    "transition-opacity duration-300 ease-in-out",
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />


            {/* SIDEBAR */}
            <aside
                ref={sidebarRef}
                className={cn(
                    "fixed top-0 left-0 z-40 h-dvh py-1",
                    "bg-(--linen-200) border-r border-(--border-strong)",
                    SIDEBAR_WIDTH,
                    "will-change-transform transform-gpu",
                    "transition-transform duration-500 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <nav className="flex flex-col mt-6 h-full min-[551px]:mx-2">
                    {/* ---------- TOP ---------- */}
                    <div className="space-y-1 mt-10">
                        {PRIMARY_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className="relative flex items-center rounded-sm hover:bg-(--earth-sand)/50 transition-all"
                                >
                                    {active && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary" />
                                    )}

                                    <div className={`flex items-center gap-5 mx-1 px-3 py-2 w-full ${active ? "bg-(--primary)/20 rounded-sm" : ""}`}>
                                        <Icon
                                            size={20}
                                            className={active ? "text-primary" : "text-(--text-secondary)"}
                                        />
                                        <span className={active ? "text-primary font-medium" : `${isMobile ? "text-foreground text-xs" : ""}`}>
                                            {item.title}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* ---------- MIDDLE ---------- */}
                    <div className="mt-4">
                        <h2 className="text-center mx-1 text-sm tracking-widest font-semibold font-poppins text-primary mb-1.5">
                            Trending Layer
                        </h2>

                        <div className="space-y-1">
                            {categories.slice(0, 5).map((category, i) => {
                                const active = pathname === `/categories/${category.slug}`;

                                return (
                                    <Link
                                        key={category._id}
                                        href={`/categories/${category.slug}`}
                                        onClick={handleNavClick}
                                        className="relative flex items-center rounded-sm transition-all"
                                    >
                                        {active && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary" />
                                        )}

                                        <div className={`shadow-xs border border-(--border-strong) ${active ? "border border-primary" : ""} relative mx-1 w-full h-12 min-[551px]:h-14 rounded-md overflow-hidden`}>
                                            <Image
                                                src={category.leftMenuCategoryImage}
                                                alt={category.name}
                                                fill
                                                loading={i === 0 ? "eager" : "lazy"}
                                                className="object-cover object-center"
                                            />
                                            {!active && (
                                                <div className={`${isMobile ? "absolute inset-0 transition-all duration-300 bg-transparent" : "absolute inset-0 transition-all duration-300 bg-black/25 hover:bg-transparent"}`} />
                                            )}
                                            <p className="absolute truncate left-1 min-[551px]:left-3 bottom-2 text-[10px] min-[551px]:text-sm text-(--text-inverse) font-medium">
                                                {category.name}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* ---------- BOTTOM ---------- */}
                    <div className="space-y-1 pb-4 mt-4">
                        <h2 className="text-center mx-1 text-sm tracking-widest font-semibold font-poppins text-primary mb-1.5">
                            Social Layer
                        </h2>

                        {SECONDARY_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className="relative flex items-center rounded-sm hover:bg-(--earth-sand)/50 transition-all"
                                >
                                    {active && (
                                        <span className="absolute left-0 top-5.5 -translate-y-1/2 h-6 w-1 bg-primary" />
                                    )}

                                    <div className={`flex items-center gap-5 mx-1 px-3 py-2 w-full ${active ? "bg-(--primary)/20 rounded-sm" : ""}`}>
                                        <Icon
                                            size={20}
                                            className={active ? "text-primary" : "text-(--text-secondary)"}
                                        />
                                        <span className={active ? "text-primary font-medium" : `${isMobile ? "text-foreground text-xs" : ""}`}>
                                            {item.title}
                                        </span>
                                    </div>

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
