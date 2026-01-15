"use client";


import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";



interface LoginModalUIProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginModalUI({
    open,
    onClose,
}: LoginModalUIProps) {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const SLIDES_COUNT = 3;


    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => {
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
                className="absolute inset-0 bg-black/30 backdrop-blur-xs"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-225 max-w-[95vw] overflow-hidden rounded-2xl bg-linear-to-b from-[#4d4b4b] to-[#ababab] shadow-xl"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="cursor-pointer  absolute right-4 top-4 z-10 text-white md:text-gray-700 md:hover:text-black"
                >
                    <IoClose size={22} />
                </button>

                <div className="flex max-md:flex-col min-h-70">
                    {/* LEFT */}
                    {/* LEFT */}
                    <div className="p-6 md:p-10 text-white">
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center md:text-left">
                            Unlock Exclusive Deals
                        </h2>

                        {/* DESKTOP GRID */}
                        <div className="hidden md:grid gap-5">
                            <FeatureCard
                                title="Free Shipping & Faster Delivery"
                                desc="Enjoy 5% off on orders above ₹2499 & 10% off on orders above ₹4499."
                            />
                            <FeatureCard
                                title="Lowest Prices Guaranteed"
                                desc="Always get the best deals, no exceptions."
                            />
                            <FeatureCard
                                title="New Styles Every Week"
                                desc="Discover fresh fashion trends with new arrivals every week."
                            />
                        </div>

                        {/* MOBILE SLIDER */}
                        <div className="md:hidden w-full overflow-hidden">

                            <div
                                ref={sliderRef}
                                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                            >
                                <div className="min-w-full snap-center">
                                    <FeatureCard
                                        title="Free Shipping & Faster Delivery"
                                        desc="Enjoy 5% off on orders above ₹2499 & 10% off on orders above ₹4499."
                                    />
                                </div>

                                <div className="min-w-full snap-center">
                                    <FeatureCard
                                        title="Lowest Prices Guaranteed"
                                        desc="Always get the best deals, no exceptions."
                                    />
                                </div>

                                <div className="min-w-full snap-center">
                                    <FeatureCard
                                        title="New Styles Every Week"
                                        desc="Discover fresh fashion trends with new arrivals every week."
                                    />
                                </div>
                            </div>

                            {/* DOTS */}
                            <div className="flex justify-center gap-2 mt-4">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full transition-all ${activeIndex === i ? "bg-white" : "bg-white/40"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>


                    {/* RIGHT */}
                    <div className="bg-[#E8E6DF] p-5 flex flex-col justify-center">
                        <h3 className="text-lg text-slate-800 font-semibold mb-3 text-center">
                            Enter Mobile Number
                        </h3>

                        <div className="flex items-center gap-2 border rounded-md px-2 py-2 mb-5">
                            <div className="flex flex-col items-center justify-center rounded-md relative">
                                <span className="text-lg font-extrabold">🇮🇳</span>
                                <p className="text-sm text-slate-800 font-extrabold">+91</p>

                                {/* Tricolor Accent */}
                                <div className="absolute top-1 flex flex-col items-center justify-center">
                                    <span className="w-8 h-2 bg-[#FF9933]/60" />
                                    <span className="w-8 h-2 bg-white/40" />
                                    <span className="w-8 h-2 bg-[#138808]/60" />
                                </div>
                            </div>
                            <input
                                type="tel"
                                maxLength={12}
                                placeholder="Enter Mobile Number"
                                className="w-full p-3 rounded-sm outline-none text-sm border border-black/20"
                            />


                        </div>

                        <label className="flex items-center gap-2 text-xs text-gray-600 mb-6">
                            <input type="checkbox" className="accent-black cursor-pointer " />
                            Notify me for any updates & offers
                        </label>

                        <button className="cursor-pointer w-full rounded-md bg-black py-3 text-white text-sm">
                            CONTINUE
                        </button>

                        <p className="mt-4 text-[11px] text-gray-500 text-center">
                            I accept that I have read & understood The Layer Co.{" "}
                            <span className="underline cursor-pointer">
                                Privacy Policy
                            </span>{" "}
                            &{" "}
                            <span className="underline cursor-pointer">T&Cs</span>
                        </p>

                        <p className="mt-3 text-xs text-center text-gray-500 underline cursor-pointer">
                            Trouble logging in?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------- */

function FeatureCard({
    title,
    desc,
}: {
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-xl bg-white/20 backdrop-blur p-5">
            <h4 className="font-semibold text-sm mb-1">⭐ {title}</h4>
            <p className="text-xs opacity-90 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}