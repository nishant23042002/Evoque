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
import { FirebaseError } from "firebase/app";
import { useAuth } from "../AuthProvider";
import { useLockBodyScroll } from "@/src/useLockBodyScroll";




export default function LoginModalUI() {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const { showLogin, closeLogin, syncUser } = useAuth();

    const [resendCountdown, setResendCountdown] = useState(0);

    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);
    const [isPending, startTransition] = useTransition();
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | undefined>(undefined);

    const [step, setStep] = useState<"mobile" | "otp">("mobile");
    const SLIDES_COUNT = 3;


    /* ------------------ reCAPTCHA helpers ------------------ */

    const resetRecaptcha = () => {
        if (recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear();
            recaptchaVerifierRef.current = undefined;
        }
    };

    const initRecaptcha = () => {
        resetRecaptcha();
        recaptchaVerifierRef.current = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            { size: "invisible" }
        );
    };
    /* ---------------- Slider ---------------- */
    useEffect(() => {
        if (!showLogin) return;

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
    }, [showLogin]);

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
            setSuccess("");

            await confirmationResult.confirm(otp);
            resetRecaptcha();
            // ✅ user is now authenticated
            // result.user contains Firebase user
            setSuccess("✅ OTP verified successfully!");

            const firebaseUser = auth.currentUser;
            if (!firebaseUser) {
                setError("Authentication failed");
                return;
            }
            const idToken = await firebaseUser?.getIdToken(true);
            console.log("firebaseID: ", auth.currentUser);

            const res = await fetch("/api/auth/phone-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // 👈 IMPORTANT
                body: JSON.stringify({ firebaseToken: idToken }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.message || "Login failed");
            }

            const data = await res.json();
            console.log("BACKEND LOGIN RESPONSE:", data);
            if (!res.ok) {
                throw new Error(data?.error || "Backend login failed");
            }

            await syncUser();

            setTimeout(() => {
                closeLogin();
                router.replace("/");
            }, 800);

        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                if (err.code === "auth/invalid-verification-code") {
                    setError("Incorrect OTP");
                } else if (err.code === "auth/code-expired") {
                    setError("OTP expired");
                } else {
                    setError("Verification failed");
                }
            }
        }
    };

    useLockBodyScroll(showLogin)
    /* ---------------- Auto Verify OTP ---------------- */
    useEffect(() => {
        if (otp.length !== 6 || !confirmationResult) return;

        const id = setTimeout(() => {
            verifyOtp();
        }, 0);

        return () => clearTimeout(id);
    }, [otp, confirmationResult]);


    /* ---------------- Send OTP ---------------- */
    const sendOtp = async () => {
        setError("");
        setSuccess("");


        if (phoneNumber.length !== 10) {
            setError("Enter a valid 10-digit mobile number");
            return;
        }

        startTransition(async () => {

            try {
                resetRecaptcha();
                initRecaptcha();

                const formattedPhone = `+91${phoneNumber}`;

                const confirmationResult = await signInWithPhoneNumber(
                    auth,
                    formattedPhone,
                    recaptchaVerifierRef.current!
                );


                setConfirmationResult(confirmationResult);
                setStep("otp")
                setResendCountdown(30)
                setSuccess("OTP sent successfully");
            } catch (err) {
                resetRecaptcha();
                setResendCountdown(0);

                if (err instanceof FirebaseError) {
                    setError(err.message);
                } else {
                    setError("Failed to send OTP. Try again.");
                }
            }
        })
    }

    const handleClose = () => {
        resetRecaptcha();
        setPhoneNumber("");
        setOtp("");
        setError("");
        setSuccess("");
        setResendCountdown(0);
        setConfirmationResult(null);
        setStep("mobile");
        closeLogin();
    };

    if (!showLogin) return null;


    const Loader = (
        <div className="flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        </div>
    );


    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center select-none">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30"
                onClick={handleClose}
            />

            <div id="recaptcha-container"></div>
            {/* Modal */}
            <div
                onClick={e => e.stopPropagation()}
                className="
                    relative w-225 max-w-[95vw] overflow-hidden rounded-[3px]
                    bg-linear-to-b
                    bg-black
                "
            >
                {/* Close */}
                <button
                    onClick={handleClose}
                    className="
                        absolute right-2 top-2 z-10 cursor-pointer text-white
                        hover:text-(--linen-500)
                        transition-colors
                    "
                >
                    <IoClose size={22} />
                </button>

                <div className="flex justify-evenly max-md:flex-col min-h-70">
                    {/* LEFT */}
                    <div className="p-6 md:p-12 text-(--text-inverse)">
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


                    {/* RIGHT */}
                    <div className="bg-white md:mb-6 md:rounded-b-sm p-5 flex flex-col py-9">
                        {step === "mobile" ? (
                            <div className="w-full max-w-sm mx-auto px-2 sm:px-0">
                                <h3 className="text-base uppercase tracking-wider sm:text-sm font-semibold text-(--linen-800) mb-4 text-center">
                                    Login with Mobile
                                </h3>

                                {/* Phone Input */}
                                <div className="relative flex items-center w-full border border-gray-300 px-2 py-2 focus-within:border-primary transition">

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
                                        <span className="w-3 h-0.75 bg-orange-600" />
                                        <span className="w-3 h-0.75 bg-white border" />
                                        <span className="w-3 h-0.75 bg-green-600" />
                                    </div>
                                </div>

                                {/* Button */}
                                <button
                                    onClick={sendOtp}
                                    disabled={!phoneNumber || isPending || resendCountdown > 0}
                                    className="relative
                                        w-full mt-4 py-2
                                        text-sm sm:text-base font-medium
                                        bg-black text-primary-foreground
                                       hover:bg-(--btn-primary-hover)
                                        hover:disabled:opacity-90 disabled:cursor-not-allowed
                                        transition
                                        "
                                >
                                    {isPending
                                        ? "Sending OTP..."
                                        : resendCountdown > 0
                                            ? `Resend OTP in ${resendCountdown}s`
                                            : confirmationResult
                                                ? "Resend OTP"
                                                : "Send OTP"
                                    }

                                    {isPending && (
                                        <div className="absolute right-12 top-2.5">{Loader}</div>
                                    )}
                                </button>

                                {/* Status */}
                                <div className="mt-3 text-center text-xs sm:text-sm">
                                    {error && <p className="text-red-500">{error}</p>}
                                    {success && <p className="text-green-600">{success}</p>}
                                </div>



                                <label className="mt-4 w-full mx-auto flex items-center gap-2 py-2 text-xs">
                                    <input
                                        type="checkbox"
                                        className="accent-primary cursor-pointer"
                                    />
                                    Notify me for updates & offers
                                </label>


                                <p className="text-[11px] text-center">
                                    By continuing, you agree to our{" "}
                                    <span className="underline cursor-pointer">Privacy Policy</span>{" "}
                                    &{" "}
                                    <span className="underline cursor-pointer">T&Cs</span>
                                </p>
                            </div>

                        ) : (
                            <div className="w-full max-w-sm mx-auto px-2 sm:px-0">
                                <div className="flex flex-col justify-between items-center py-2">
                                    <p className="font-semibold mb-3">OTP Verification</p>
                                    <p className="text-xs sm:text-sm">
                                        We have sent verification code to {" "}
                                    </p>
                                    <div className="flex gap-4">
                                        <span className="font-medium text-(--linen-800)">
                                            +91 {phoneNumber}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetRecaptcha();
                                                setStep("mobile");
                                                setOtp("");
                                                setError("");
                                                setSuccess("");
                                                setResendCountdown(0);
                                                setConfirmationResult(null);
                                            }}
                                            className="uppercase border cursor-pointer font-semibold border-black/20 px-2 text-xs hover:text-primary"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                                {/* OTP Inputs */}
                                <div className="w-full flex justify-center mb-2">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                        className="gap-1"
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot
                                                index={0}
                                                className="sm:h-10 sm:w-12 border-black/20 text-lg font-semibold focus:border-black"
                                            />
                                            <InputOTPSlot
                                                index={1}
                                                className="sm:h-10 sm:w-12 border-black/20 text-lg font-semibold"
                                            />
                                            <InputOTPSlot
                                                index={2}
                                                className="sm:h-10 sm:w-12 border-black/20  text-lg font-semibold"
                                            />
                                        </InputOTPGroup>

                                        <InputOTPSeparator className="text-xl">
                                            -
                                        </InputOTPSeparator>

                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="sm:h-10 sm:w-12 border-black/20 text-lg font-semibold" />
                                            <InputOTPSlot index={4} className="sm:h-10 sm:w-12 border-black/20  text-lg font-semibold" />
                                            <InputOTPSlot index={5} className="sm:h-10 sm:w-12 border-black/20  text-lg font-semibold" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <div className="my-2">
                                    <button
                                        onClick={sendOtp}
                                        disabled={resendCountdown > 0 || isPending}
                                        className="text-xs cursor-pointer font-medium text-black hover:underline underline-offset-2 disabled:opacity-50"
                                    >
                                        {resendCountdown > 0
                                            ? `Resend OTP in ${resendCountdown}s`
                                            : "Resend OTP"}
                                    </button>
                                </div>

                                {/* Verify Button */}
                                <button
                                    onClick={verifyOtp}
                                    disabled={otp.length !== 6 || isPending}
                                    className="
                                            w-full py-2
                                        text-sm sm:text-base font-medium
                                        bg-black text-primary-foreground
                                        hover:bg-(--btn-primary-hover)
                                        hover:disabled:opacity-90 disabled:cursor-not-allowed
                                        transition
                                            "
                                >
                                    {isPending ? "Verifying OTP…" : "Verify OTP"}
                                </button>

                                {success && (
                                    <div
                                        role="status"
                                        className="
                                                mt-2 uppercase font-bold text-center border border-green-500/30
                                                bg-green-500/10 px-3 py-1 text-xs text-green-700
                                                transition-all duration-200
                                            "
                                    >
                                        {success}
                                    </div>
                                )}


                                {error && (
                                    <div
                                        role="alert"
                                        className="
                                                mt-2 uppercase font-bold text-center border border-red-500/30
                                                bg-red-500/10 px-3 py-1 text-xs text-red-600
                                                transition-all duration-200
                                            "
                                    >
                                        {error}
                                    </div>
                                )}

                            </div>

                        )}


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
