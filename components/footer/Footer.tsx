import Link from "next/link";
import { CiLinkedin, CiInstagram } from "react-icons/ci";

export default function Footer() {
    return (
        <footer>
            <div className="relative bg-black text-[#e6e6e6] overflow-hidden">
                {/* MAIN GRID */}
                <div
                    className="
                                relative z-10
                                mx-auto
                                px-5 sm:px-6 md:px-10
                                py-12 sm:py-14 md:py-20
                                grid grid-cols-1
                                gap-12 sm:gap-14 md:grid-cols-4 md:gap-16
                            "
                >
                    {/* BRAND / PHILOSOPHY */}
                    <div className="space-y-4 sm:space-y-6">
                        <p className="text-sm leading-relaxed text-neutral-300 max-w-sm">
                            The Layer Co. is a modern menswear label focused on restraint,
                            proportion, and purpose. Designed to layer, adapt, and endure —
                            each piece is built for everyday wear beyond trends.
                        </p>

                        <div className="text-sm text-neutral-400 space-y-1">
                            <p className="hover:text-white text-brand-red cursor-pointer">
                                <Link href="/">thelayerco.co.in</Link>
                            </p>
                            <p className="text-xs sm:text-sm">
                                Designed in India · Worn Everywhere
                            </p>
                        </div>
                    </div>


                    {/* PRIMARY NAV */}
                    <nav
                        className="flex flex-col flex-wrap gap-4                             
                                text-base sm:text-lg
                                tracking-tight
                            "
                    >
                        <p className="text-xs uppercase font-serif tracking-wider text-brand-red">The Layer Info
                        </p>
                        {[
                            "Home",
                            "Order Tracking",
                            "Returns & Exchange",
                            "About Us",
                            "Contact",
                        ].map((item) => (
                            <p
                                key={item}
                                className="
                                cursor-pointer transition
                                hover:opacity-70 hover:text-brand-red
                            "
                            >
                                {item}
                            </p>
                        ))}
                    </nav>


                    {/* CATEGORY NAV */}
                    <div className="space-y-3 sm:space-y-4">
                        <p className="text-xs uppercase font-serif tracking-wider text-brand-red">
                            The Wardrobe
                        </p>

                        <div className="
                                grid grid-cols-2 gap-y-2 gap-x-6
                                sm:block sm:space-y-2
                                text-base sm:text-lg
                            ">
                            {[
                                "Shirts",
                                "T-Shirts",
                                "Overshirts",
                                "Jackets",
                                "Trousers",
                                "Denim",
                                "Sweatshirts",
                                "Accessories",
                            ].map((item) => (
                                <p
                                    key={item}
                                    className="cursor-pointer text-neutral-300 hover:text-brand-red transition"
                                >
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* SOCIAL + LEGAL */}
                    <div className="flex flex-col gap-8 sm:gap-12 justify-between">

                        <div className="space-y-4">
                            <p className="text-xs uppercase font-serif  tracking-wider text-brand-red">
                                Follow Us
                            </p>

                            <div className="space-y-2 text-xs sm:text-sm text-white">

                                <p className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                                    <CiInstagram /> Instagram
                                </p>
                                <p className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                                    <CiLinkedin /> LinkedIn
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1 text-[11px] sm:text-xs">

                            <p className="cursor-pointer hover:text-white tracking-wider font-serif">Privacy & Policy</p>
                            <p className="cursor-pointer hover:text-white tracking-wider font-serif">Terms & Conditions</p>
                            <p className="cursor-pointer hover:text-white tracking-wider font-serif">
                                Shipping & Returns
                            </p>
                            <p className="cursor-pointer hover:text-white tracking-wider font-serif">Help</p>
                        </div>
                    </div>
                </div>

                {/* OVERSIZED BRAND WORDMARK */}
                <div className="absolute left-0 w-full text-center pointer-events-none select-none
                -bottom-2 sm:-bottom-3 md:-bottom-4.5">
                    <h1
                        className="
                        font-extrabold tracking-tight leading-none
                        text-white/20
                        text-[27vw] sm:text-[20vw] md:text-[14vw]
                        "
                    >
                        THE LAYER CO.
                    </h1>
                </div>


                {/* BASE BAR */}
                <div className="relative uppercase z-10 py-6 text-center tracking-wider font-serif text-xs">
                   Copyright © {new Date().getFullYear()} The Layer Co. · All rights reserved
                </div>
            </div>
        </footer>
    );
}
