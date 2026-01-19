"use client";

import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";

interface LoginModalUIProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginModalUI({ open, onClose }: LoginModalUIProps) {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const SLIDES_COUNT = 3;

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const interval = setInterval(() => {
            setActiveIndex(prev => {
                const next = (prev + 1) % SLIDES_COUNT;
                slider.scrollTo({
                    left: slider.clientWidth * next,
                    behavior: "smooth",
                });
                return next;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center select-none">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                onClick={e => e.stopPropagation()}
                className="
                    relative w-225 max-w-[95vw] overflow-hidden rounded-[3px]
                    bg-linear-to-b
                    from-[var(--linen-800)]
                    to-[var(--primary)]
                    shadow-xl
                "
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="
                        absolute right-4 top-4 z-10 cursor-pointer
                        text-[var(--text-inverse)]
                        hover:text-[var(--linen-900)]
                        transition-colors
                    "
                >
                    <IoClose size={22} />
                </button>

                <div className="flex max-md:flex-col min-h-70">
                    {/* LEFT */}
                    <div className="p-6 md:p-10 text-[var(--text-inverse)]">
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center md:text-left">
                            Unlock Exclusive Benefits
                        </h2>

                        {/* DESKTOP GRID */}
                        <div className="hidden md:grid gap-5">
                            <FeatureCard
                                title="Free Shipping & Faster Delivery"
                                desc="Enjoy extra savings on premium orders."
                            />
                            <FeatureCard
                                title="Lowest Prices Guaranteed"
                                desc="Transparent pricing with no compromise."
                            />
                            <FeatureCard
                                title="New Styles Every Week"
                                desc="Fresh silhouettes curated weekly."
                            />
                        </div>

                        {/* MOBILE SLIDER */}
                        <div className="md:hidden w-full overflow-hidden">
                            <div
                                ref={sliderRef}
                                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                            >
                                {[
                                    {
                                        t: "Free Shipping & Faster Delivery",
                                        d: "Enjoy extra savings on premium orders.",
                                    },
                                    {
                                        t: "Lowest Prices Guaranteed",
                                        d: "Transparent pricing with no compromise.",
                                    },
                                    {
                                        t: "New Styles Every Week",
                                        d: "Fresh silhouettes curated weekly.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="min-w-full snap-center">
                                        <FeatureCard title={item.t} desc={item.d} />
                                    </div>
                                ))}
                            </div>

                            {/* DOTS */}
                            <div className="flex justify-center gap-2 mt-4">
                                {[0, 1, 2].map(i => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                                            activeIndex === i
                                                ? "bg-[var(--text-inverse)]"
                                                : "bg-[rgba(255,255,255,0.4)]"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-[var(--surface)] p-5 flex flex-col justify-center">
                        <h3 className="text-lg text-[var(--foreground)] font-semibold mb-3 text-center">
                            Enter Mobile Number
                        </h3>

                        <div className="flex items-center gap-2 border border-[var(--border)] rounded-md px-2 py-2 mb-5 bg-[var(--surface-muted)]">
                            <div className="flex flex-col items-center justify-center rounded-md relative">
                                <span className="text-sm font-medium">🇮🇳</span>
                                <p className="text-xs font-bold text-[var(--foreground)]">
                                    +91
                                </p>
                            </div>

                            <input
                                type="tel"
                                maxLength={12}
                                placeholder="Enter Mobile Number"
                                className="
                                    w-full p-3 rounded-sm outline-none text-sm
                                    bg-transparent
                                    border border-[var(--input-border)]
                                    text-[var(--foreground)]
                                    placeholder:text-[var(--input-placeholder)]
                                    focus:border-[var(--input-focus)]
                                "
                            />
                        </div>

                        <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
                            <input
                                type="checkbox"
                                className="accent-[var(--primary)] cursor-pointer"
                            />
                            Notify me for updates & offers
                        </label>

                        <button
                            className="
                                w-full rounded-md py-3 text-sm cursor-pointer
                                bg-[var(--primary)]
                                text-[var(--primary-foreground)]
                                hover:bg-[var(--btn-primary-hover)]
                                transition-colors
                            "
                        >
                            CONTINUE
                        </button>

                        <p className="mt-4 text-[11px] text-[var(--text-muted)] text-center">
                            By continuing, you agree to our{" "}
                            <span className="underline cursor-pointer">Privacy Policy</span>{" "}
                            &{" "}
                            <span className="underline cursor-pointer">T&Cs</span>
                        </p>

                        <p className="mt-3 text-xs text-center text-[var(--text-secondary)] underline cursor-pointer">
                            Trouble logging in?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------- */

function FeatureCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-xl bg-[rgba(255,255,255,0.15)] backdrop-blur-md p-5">
            <h4 className="font-semibold text-sm mb-1 text-[var(--text-inverse)]">
                ★ {title}
            </h4>
            <p className="text-xs opacity-90 leading-relaxed text-[var(--text-inverse)]">
                {desc}
            </p>
        </div>
    );
}
