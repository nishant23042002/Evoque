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

    const [step, setStep] = useState<"mobile" | "otp">("mobile");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
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

    const sendOtp = async () => {
        if (mobile.length !== 10) return alert("Enter valid mobile number");

        try {
            setLoading(true);

            await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: {
                    "authorization": "89odhN3XyvoTzRYLc7OYihR3Zvd6jZ24fuTmmtXezVc8LBpYxslSTCUpkxTN",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mobile }),
            });

            setStep("otp");
        } catch {
            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };
    const verifyOtp = async () => {
        if (otp.length !== 6) return alert("Enter valid OTP");

        try {
            setLoading(true);

            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile, otp }),
            });

            if (!res.ok) throw new Error();

            onClose(); // Logged in 🎉
        } catch {
            alert("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

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
                                        className={`h-1.5 w-1.5 rounded-full transition-all ${activeIndex === i
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
                        {step === "mobile" ? (
                            <>
                                <h3 className="text-lg font-semibold mb-4 text-center">
                                    Login with WhatsApp
                                </h3>

                                <div className="relative flex gap-2 border rounded-[3px] p-1 mb-5">
                                    <span className="text-sm font-extraboldbold z-99"><span className="font-bold text-[var(--secondory)]">🇮🇳</span> +91</span>
                                    <input
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                                        maxLength={10}
                                        placeholder="Enter Mobile Number"
                                        className="w-full outline-none text-center"
                                    />

                                    <span className="absolute bottom-9 w-5 h-1 bg-orange-700"></span>
                                    <span className="absolute bottom-8 w-5 h-1 bg-white"></span>
                                    <span className="absolute bottom-7 w-5 h-1 bg-green-700"></span>
                                </div>

                                <button
                                    onClick={sendOtp}
                                    disabled={loading}
                                    className="
                                                    w-full rounded-[3px] py-3 text-sm cursor-pointer
                                                    bg-[var(--primary)]
                                                    text-[var(--primary-foreground)]
                                                    hover:bg-[var(--btn-primary-hover)]
                                                    transition-colors
                                                "
                                >
                                    {loading ? "Sending OTP..." : "Continue"}
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold mb-4 text-center">
                                    Enter OTP
                                </h3>

                                <input
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                                    maxLength={6}
                                    placeholder="6-digit OTP"
                                    className="border rounded-[3px] p-3 text-center tracking-widest mb-4"
                                />

                                <button
                                    onClick={verifyOtp}
                                    disabled={loading}
                                    className="
                                                    w-full rounded-[3px] py-3 text-sm cursor-pointer
                                                    bg-[var(--primary)]
                                                    text-[var(--primary-foreground)]
                                                    hover:bg-[var(--btn-primary-hover)]
                                                    transition-colors
                                                "
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>

                                <p
                                    onClick={sendOtp}
                                    className="text-xs text-center underline cursor-pointer mt-4"
                                >
                                    Resend OTP
                                </p>
                            </>
                        )}

                        <label className="flex items-center gap-2 py-2 text-xs text-[var(--text-secondary)] mb-6">
                            <input
                                type="checkbox"
                                className="accent-[var(--primary)] cursor-pointer"
                            />
                            Notify me for updates & offers
                        </label>


                        <p className="text-[11px] text-[var(--text-muted)] text-center">
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
