"use client";

import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState, useTransition } from "react";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import {
    InputOTP, InputOTPGroup, InputOTPSeparator,
    InputOTPSlot
} from "../ui/input-otp";




interface LoginModalUIProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginModalUI({ open, onClose }: LoginModalUIProps) {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);

    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);
    const [isPending, startTransition] = useTransition();
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | undefined>(undefined);

    const [step, setStep] = useState<"mobile" | "otp">("mobile");
    const SLIDES_COUNT = 3;


    useEffect(() => {
        if (!open) return;

        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                }
            );
        }
    }, [open]);

    /* ---------------- Slider ---------------- */
    useEffect(() => {
        if (!open) return;

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

    /* ---------------- Countdown ---------------- */
    useEffect(() => {
        if (resendCountdown <= 0) return;
        const timer = setTimeout(
            () => setResendCountdown(c => c - 1),
            1000
        );
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    /* ---------------- Verify OTP ---------------- */
    const verifyOtp = async () => {
        if (!confirmationResult) {
            setError("Please request OTP first");
            return;
        }

        try {
            setError("");

            await confirmationResult.confirm(otp);
            // ✅ user is now authenticated
            // result.user contains Firebase user

            onClose();              // ✅ close modal first
            router.replace("/");    // ✅ then navigate

        } catch (error) {
            console.error(error);
            setError("Failed to verify OTP. Please check the OTP.");
        }
    };


    /* ---------------- Auto Verify OTP ---------------- */
    useEffect(() => {
        if (otp.length !== 6 || !confirmationResult) return;

        const id = setTimeout(() => {
            verifyOtp();
        }, 0);

        return () => clearTimeout(id);
    }, [otp, confirmationResult]);


    if (!open) return null;


    /* ---------------- Send OTP ---------------- */
    const sendOtp = async () => {
        setError("");

        if (phoneNumber.length !== 10) {
            setError("Enter a valid 10-digit mobile number");
            return;
        }
        setResendCountdown(60);
        if (!recaptchaVerifierRef.current) {
            setError("reCAPTCHA not ready");
            return;
        }

        startTransition(async () => {

            try {
                const formattedPhone = `+91${phoneNumber}`;

                const confirmationResult = await signInWithPhoneNumber(
                    auth,
                    formattedPhone,
                    recaptchaVerifierRef.current
                );


                setConfirmationResult(confirmationResult);
                setStep("otp")
                setSuccess("OTP sent successfully");
            } catch (error) {
                console.log(error);
                setResendCountdown(0);
            }
        })
    }

    const Loader = (
        <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        </div>
    );


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
                    from-(--linen-800)
                    to-primary
                    shadow-xl
                "
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="
                        absolute right-4 top-4 z-10 cursor-pointer
                        text-(--text-inverse)
                        hover:text-(--linen-900)
                        transition-colors
                    "
                >
                    <IoClose size={22} />
                </button>

                <div className="flex max-md:flex-col min-h-70">
                    {/* LEFT */}
                    <div className="p-6 md:p-10 text-(--text-inverse)">
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
                                            ? "bg-(--text-inverse)"
                                            : "bg-[rgba(255,255,255,0.4)]"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div id="recaptcha-container" />

                    {/* RIGHT */}
                    <div className="bg-(--surface) p-5 flex flex-col justify-center">
                        {step === "mobile" ? (
                            <div className="w-full max-w-sm mx-auto px-2 sm:px-0">
                                <h3 className="text-base sm:text-lg font-semibold text-[var(--linen-800)] mb-4 text-center">
                                    Login with Mobile
                                </h3>

                                {/* Phone Input */}
                                <div className="relative flex items-center w-full border border-gray-300 rounded-md px-2 py-2 focus-within:border-primary transition">

                                    {/* Country Code */}
                                    <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
                                        <span className="text-base">🇮🇳</span>
                                        <span className="text-sm font-medium text-gray-700">+91</span>
                                    </div>

                                    {/* Input */}
                                    <input
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                        maxLength={10}
                                        inputMode="numeric"
                                        placeholder="Enter mobile number"
                                        className="
                                                flex-1 pl-3 text-sm sm:text-base
                                                outline-none bg-transparent
                                                placeholder:text-gray-400
                                            "
                                    />

                                    {/* Tricolor accent */}
                                    <div className="absolute left-2 bottom-7 flex gap-1">
                                        <span className="w-3 h-[3px] bg-orange-600" />
                                        <span className="w-3 h-[3px] bg-white border" />
                                        <span className="w-3 h-[3px] bg-green-600" />
                                    </div>
                                </div>

                                {/* Button */}
                                <button
                                    onClick={sendOtp}
                                    disabled={!phoneNumber || isPending || resendCountdown > 0}
                                    className="
                                        w-full mt-4 py-2 rounded-md
                                        text-sm sm:text-base font-medium
                                        bg-primary text-primary-foreground
                                        hover:bg-[var(--btn-primary-hover)]
                                        hover:disabled:opacity-80 disabled:cursor-not-allowed
                                        transition
                                        "
                                >
                                    {resendCountdown > 0
                                        ? `Resend OTP in ${resendCountdown}s`
                                        : isPending
                                            ? "Sending OTP…"
                                            : "Send OTP"}
                                </button>

                                {/* Status */}
                                <div className="mt-3 text-center text-xs sm:text-sm">
                                    {error && <p className="text-red-500">{error}</p>}
                                    {success && <p className="text-green-600">{success}</p>}
                                </div>

                                {isPending && (
                                    <div className="mt-3 flex justify-center">{Loader}</div>
                                )}
                            </div>

                        ) : (
                            <div className="w-full max-w-sm mx-auto px-2 sm:px-0">
                                <p className="text-xs sm:text-sm text-(--text-secondary)">
                                    OTP sent to{" "}
                                    <span className="font-medium text-(--linen-800)">
                                        +91 {phoneNumber}
                                    </span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("mobile");
                                        setOtp("");
                                        setError("");
                                        setSuccess("");
                                        setResendCountdown(0);
                                        setConfirmationResult(null);
                                    }}
                                    className="mt-1 text-xs sm:text-sm text-primary underline"
                                >
                                    Edit phone number
                                </button>
                                {/* OTP Inputs */}
                                <div className="w-full flex justify-center mb-4">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>

                                        <InputOTPSeparator className="opacity-80" />

                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                {/* Verify Button */}
                                <button
                                    onClick={verifyOtp}
                                    disabled={!phoneNumber || isPending || resendCountdown > 0}
                                    className="
                                            w-full py-2 rounded-md
                                        text-sm sm:text-base font-medium
                                        bg-primary text-primary-foreground
                                        hover:bg-(--btn-primary-hover)
                                        hover:disabled:opacity-80 disabled:cursor-not-allowed
                                        transition
                                            "
                                >
                                    {isPending ? "Verifying OTP…" : "Verify OTP"}
                                </button>
                            </div>

                        )}

                        <label className="min-[400px]:w-[80%] w-full mx-auto flex items-center gap-2 py-2 text-xs text-(--text-secondary) mb-6">
                            <input
                                type="checkbox"
                                className="accent-primary cursor-pointer"
                            />
                            Notify me for updates & offers
                        </label>


                        <p className="text-[11px] text-(--text-muted) text-center">
                            By continuing, you agree to our{" "}
                            <span className="underline cursor-pointer">Privacy Policy</span>{" "}
                            &{" "}
                            <span className="underline cursor-pointer">T&Cs</span>
                        </p>

                        <p className="mt-3 text-xs text-center text-(--text-secondary) underline cursor-pointer">
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
            <h4 className="font-semibold text-sm mb-1 text-(--text-inverse)">
                ★ {title}
            </h4>
            <p className="text-xs opacity-90 leading-relaxed text-(--text-inverse)">
                {desc}
            </p>
        </div>
    );
}
