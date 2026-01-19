import { CiLinkedin, CiInstagram } from "react-icons/ci";

export default function Footer() {
    return (
        <footer>
            <div className="relative bg-[var(--linen-900)] text-[var(--linen-200)] overflow-hidden">

                {/* MAIN GRID */}
                <div
                    className="
                        relative z-10
                        mx-auto
                        px-5 sm:px-6 md:px-10
                        py-10
                        grid grid-cols-1
                        gap-12 sm:gap-14 md:grid-cols-4 md:gap-16
                    "
                >
                    {/* BRAND / PHILOSOPHY */}
                    <div className="space-y-6">
                        <p className="text-sm leading-relaxed text-[var(--text-muted)] max-w-sm">
                            <span className="block mb-2 text-xs uppercase font-serif tracking-wider text-[var(--earth-clay)]">
                                The Layer Co.
                            </span>
                            A modern menswear label focused on restraint, proportion,
                            and purpose. Designed to layer, adapt, and endure — each
                            piece is built for everyday wear beyond trends.
                        </p>

                        <div className="text-sm space-y-1 text-[var(--muted-foreground)]">
                            <a
                                href="https://thelayerco.co.in/"
                                className="hover:text-[var(--linen-100)] transition"
                            >
                                thelayerco.co.in
                            </a>
                            <p className="text-xs tracking-wide">
                                Designed in India · Worn Everywhere
                            </p>
                        </div>
                    </div>

                    {/* PRIMARY NAV */}
                    <nav className="flex flex-col gap-4 text-sm">
                        <span className="text-xs uppercase font-serif tracking-wider text-[var(--earth-clay)]">
                            The Layer
                        </span>

                        {[
                            "Home",
                            "Order Tracking",
                            "Returns & Exchange",
                            "About Us",
                            "Contact",
                        ].map((item) => (
                            <p
                                key={item}
                                className="cursor-pointer text-[var(--linen-50)]/50 hover:text-[var(--linen-200)] transition"
                            >
                                {item}
                            </p>
                        ))}
                    </nav>

                    {/* CATEGORY NAV */}
                    <div className="space-y-4">
                        <span className="text-xs uppercase font-serif tracking-wider text-[var(--earth-clay)]">
                            The Wardrobe
                        </span>

                        <div
                            className="
                                grid grid-cols-2 gap-y-2 gap-x-6
                                sm:block sm:space-y-2
                                text-sm
                            "
                        >
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
                                    className="cursor-pointer text-[var(--linen-50)]/60 hover:text-[var(--linen-200)] transition"
                                >
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* SOCIAL + LEGAL */}
                    <div className="flex flex-col justify-between gap-10">

                        <div className="space-y-4">
                            <span className="text-xs uppercase font-serif tracking-wider text-[var(--earth-clay)]">
                                Social Layer
                            </span>

                            <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2 cursor-pointer text-[var(--linen-200)] hover:text-[var(--linen-100)] transition">
                                    <CiInstagram /> Instagram
                                </p>
                                <p className="flex items-center gap-2 cursor-pointer text-[var(--linen-200)] hover:text-[var(--linen-100)] transition">
                                    <CiLinkedin /> LinkedIn
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1 text-[11px] text-[var(--text-muted)] font-serif tracking-wider">
                            <p className="cursor-pointer hover:text-[var(--linen-100)]">Privacy Policy</p>
                            <p className="cursor-pointer hover:text-[var(--linen-100)]">Terms & Conditions</p>
                            <p className="cursor-pointer hover:text-[var(--linen-100)]">Shipping & Returns</p>
                            <p className="cursor-pointer hover:text-[var(--linen-100)]">Help</p>
                        </div>
                    </div>
                </div>

                {/* OVERSIZED WORDMARK */}
                <div
                    className="
                        absolute left-0 w-full text-center pointer-events-none select-none
                        -bottom-2 sm:-bottom-3 md:-bottom-5
                    "
                >
                    <h1
                        className="
                            font-extrabold tracking-tight leading-none
                            text-[color:rgba(236,230,220,0.06)]
                            text-[27vw] sm:text-[20vw] md:text-[14vw]
                        "
                    >
                        THE LAYER CO.
                    </h1>
                </div>

                {/* BASE BAR */}
                <div
                    className="
                        relative z-10
                        py-3 text-center
                        text-[10px] uppercase tracking-widest font-serif
                        text-[var(--muted-foreground)]
                    "
                >
                    © {new Date().getFullYear()} The Layer Co. · All rights reserved
                </div>
            </div>
        </footer>
    );
}
