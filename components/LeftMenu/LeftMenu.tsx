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
import { IoClose } from "react-icons/io5";
import { Category } from "@/types/ProductTypes";

const MOBILE_BREAKPOINT = 550;

/* ---------------- TYPES ---------------- */


interface StaticItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface LeftMenuProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

const LeftMenu = ({ isOpen, setIsOpen }: LeftMenuProps) => {

    const pathname = usePathname();
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
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
        <div>

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
                <button
                    aria-label="Close menu"
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer text-(--linen-700)
                            absolute top-2 left-2
                            z-50
                            rounded-md
                            p-2
                            hover:text-primary
                            transition-colors
                        "
                >
                    <IoClose size={22} />
                </button>
                <nav className="flex flex-col overflow-y-auto scrollbar-hide my-8 h-185 ">
                    {/* ---------- TOP ---------- */}
                    <div className="space-y-1 mt-4">
                        {PRIMARY_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className="relative flex items-center rounded-[3px] hover:bg-(--earth-sand)/50 transition-all"
                                >
                                    {active && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary" />
                                    )}

                                    <div className={`flex items-center gap-5 mx-1 px-3 py-2 w-full ${active ? "bg-(--primary)/20 rounded-[3px]" : ""}`}>
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

                                        <div
                                            className={`
                                                group
                                                relative mx-1 w-full h-12 min-[551px]:h-18
                                                rounded-[3px] overflow-hidden
                                                border border-(--border-strong)
                                                shadow-xs
                                                transition-all duration-300
                                                ${active ? "border-primary" : "hover:border-primary/60"}
                                            `}
                                        >
                                            {/* IMAGE */}
                                            <Image
                                                src={category.leftMenuCategoryImage}
                                                alt={category.name}
                                                fill
                                                sizes="(max-width: 550px) 280px, 360px"
                                                loading={i === 0 ? "eager" : "lazy"}
                                                className="
                                                        object-cover object-center
                                                        transition-transform duration-500 ease-out
                                                        group-hover:scale-105
                                                        "
                                            />

                                            {/* OVERLAY */}
                                            <div
                                                className={`
                                                        absolute inset-0
                                                        transition-all duration-300
                                                        ${active
                                                        ? "bg-black/30"
                                                        : isMobile
                                                            ? "bg-transparent"
                                                            : "bg-black/0 group-hover:bg-black/25"
                                                    }
                                                `}
                                            />

                                            {/* TEXT */}
                                            <p
                                                className="
                                                    pointer-events-none
                                                    absolute left-1 bottom-2
                                                    text-[10px] min-[551px]:text-sm
                                                    font-medium p-0.5 bg-(--linen-200)/60
                                                    text-(--linen-800) rounded-[3px]
                                                    transition-all duration-300
                                                    group-hover:-translate-y-0.5
                                                    "
                                            >
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
        </div>
    );
};

export default LeftMenu;
