"use client"

import Link from "next/link";
import { CiLinkedin, CiInstagram } from "react-icons/ci";





const navItems = [
    { label: "Home", href: "/" },
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "Returns & Exchange", href: "/pages/shipping-returns" },
    { label: "About Us", href: "/pages/about-us" },
    { label: "Contact", href: "/pages/contact" },
];

const layerItem = [
    { category: "Shirts", href: "/categories/shirts" },
    { category: "T-Shirts", href: "/categories/t-shirts" },
    { category: "Jackets", href: "/categories/jackets" },
    { category: "Trousers", href: "/categories/trousers" },
    { category: "Jeans", href: "/categories/jeans" },
    { category: "Sweatshirts", href: "/categories/sweatshirts" },
    { category: "Footwear", href: "/categories/footwear" },
]

export default function Footer() {
    return (
        <footer>
            <div className="relative bg-white border-t border-(--border-light) text-(--linen-700) mt-12 overflow-hidden">

                {/* MAIN GRID */}
                <div
                    className="
                        relative z-10
                        mx-auto w-full
                        px-5 sm:px-6 md:px-10
                        py-12
                        grid grid-cols-1 
                        sm:grid-cols-2 
                        lg:grid-cols-3
                        gap-12 sm:gap-14 lg:gap-16
                    "
                >
                    {/* BRAND */}
                    <div className="space-y-6">
                        <p className="text-sm leading-relaxed text-(--text-linen-300) max-w-sm">
                            <span className="block text-xs uppercase font-serif tracking-wider text-(--earth-clay)">
                                The Layer Co.
                            </span>
                            A modern menswear label focused on restraint, proportion,
                            and purpose. Designed to layer, adapt, and endure — each
                            piece is built for everyday wear beyond trends.
                        </p>

                        <div className="text-sm space-y-1 text-(--text-secondary)">
                            <a
                                href="https://thelayerco.co.in/"
                                className="hover:text-(--linen-600)/30 transition"
                            >
                                thelayerco.co.in
                            </a>
                            <p className="text-xs tracking-wide">
                                Designed in India · Worn Everywhere
                            </p>
                        </div>
                    </div>

                    {/* NAV + WARDROBE */}
                    <div className="flex flex-col sm:flex-row gap-12 sm:gap-16">
                        {/* PRIMARY NAV */}
                        <nav className="flex flex-col text-sm">
                            <span className="text-xs uppercase font-serif tracking-wider text-(--earth-clay)">
                                The Layer
                            </span>

                            {navItems.map((item) => (
                                <div key={item.label} className="relative mb-2 group w-fit">
                                    <Link
                                        href={item.href}
                                        className="cursor-pointer text-(--text-secondary) hover:text-(--linen-600)/30 transition"
                                    >
                                        {item.label}
                                    </Link>

                                    <span className="absolute left-0 bottom-0.5 h-0.5 w-1/2 bg-(--earth-clay) scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                                </div>
                            ))}
                        </nav>

                        {/* CATEGORY NAV */}
                        <div className="space-y-4">
                            <span className="text-xs uppercase font-serif tracking-wider text-(--earth-clay)">
                                The Wardrobe
                            </span>

                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-y-2 gap-x-6 text-sm">
                                {layerItem.map((item) => (
                                    <div className="relative group w-fit" key={item.category}>
                                        <Link
                                            href={item.href}
                                            className="cursor-pointer text-(--text-secondary) hover:text-(--linen-600)/30 transition"
                                        >
                                            {item.category}
                                        </Link>
                                        <span className="absolute left-0 bottom-px h-0.5 w-1/2 bg-(--earth-clay) scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SOCIAL + LEGAL */}
                    <div className="flex justify-between gap-10">
                        <div className="space-y-4">
                            <span className="text-xs uppercase font-serif tracking-wider text-(--earth-clay)">
                                Social Layer
                            </span>

                            <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2 cursor-pointer text-(--text-secondary) hover:text-(--linen-600)/30 transition">
                                    <CiInstagram /> Instagram
                                </p>
                                <p className="flex items-center gap-2 cursor-pointer text-(--text-secondary) hover:text-(--linen-600)/30 transition">
                                    <CiLinkedin /> LinkedIn
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1 flex flex-col text-[11px] text-(--text-secondary) font-serif tracking-wider">
                            <a href="/pages/privacy-policy" className="hover:underline">Privacy Policy</a>
                            <a href="/pages/terms-conditions" className="hover:underline">Terms & Conditions</a>
                            <a href="/pages/shipping-returns" className="hover:underline">Shipping & Returns</a>
                            <a href="/pages/help" className="hover:underline">Help</a>
                        </div>
                    </div>
                </div>

                {/* WORDMARK */}
                <div className="absolute left-0 w-full text-center pointer-events-none select-none -bottom-1 sm:-bottom-3 md:-bottom-5">
                    <h1 className="font-extrabold tracking-tight leading-none text-(--linen-200)
        text-[32vw] sm:text-[20vw] md:text-[14vw]">
                        THE LAYER CO.
                    </h1>
                </div>

                {/* BASE BAR */}
                <div className="relative z-10 py-3 text-center text-[10px] uppercase tracking-widest font-serif text-(--text-secondary)">
                    © {new Date().getFullYear()} The Layer Co. · All rights reserved
                </div>
            </div>
        </footer>

    );
}
