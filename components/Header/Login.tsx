"use client";

import { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";


type Step = "phone" | "otp";

const OTP_LENGTH = 6;

const LoginOtpModal = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
    const router = useRouter();

    /* ---------------- PHONE ---------------- */

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 10) setPhone(value);
    };

    const sendOtp = () => {
        if (phone.length !== 10) return;
        // 🔐 CALL SEND OTP API HERE
        setStep("otp");
    };

    /* ---------------- OTP ---------------- */

    const handleOtpChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value.replace(/\D/, "");
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpBackspace = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);

            if (index > 0) otpRefs.current[index - 1]?.focus();
        }
    };

    const verifyOtp = () => {
        if (otp.join("").length !== OTP_LENGTH) return;

        // ✅ TEMP redirect (until backend is wired)
        setOpen(false); // close modal (optional)
        router.push("/"); // redirect to home
    };


    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="cursor-pointer font-semibold text-slate-700 hover:text-brand-red"
            >
                Login
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-end min-[540px]:justify-center bg-black/80"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative mx-2 w-[250px] min-[540px]:w-[360px] bg-white px-8 py-10 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setOpen(false)}
                            className="cursor-pointer absolute right-4 top-4 text-gray-500 hover:text-black"
                        >
                            <IoClose size={20} />
                        </button>

                        {/* EVOQUE Animated Logo */}
                        <div className="flex justify-center gap-2 overflow-hidden">
                            {["E", "V", "O", "Q", "U", "E"].map((l, i) => (
                                <span key={i} className={`text-brand-red evoque-letter evoque-${i}`}>
                                    {l}
                                </span>
                            ))}
                        </div>

                        <p className="text-[10px] tracking-widest text-gray-500 mb-4">
                            DESIGNED TO EVOLVE
                        </p>

                        {/* PHONE STEP */}
                        {step === "phone" && (
                            <>
                                <h2 className="text-lg text-slate-700 font-semibold">
                                    Let&apos;s Evoque
                                </h2>

                                <p className="mt-4 text-sm font-medium underline underline-offset-4">
                                    Enter Mobile Number
                                </p>

                                <div className="mt-8 flex items-center gap-2 border-b border-black pb-2">
                                    <span className="text-sm">+91</span>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="Phone Number"
                                        className="w-full text-sm outline-none"
                                    />
                                </div>

                                <button
                                    disabled={phone.length !== 10}
                                    onClick={sendOtp}
                                    className="cursor-pointer mt-10 w-full bg-brand-red text-white py-3 text-sm font-semibold disabled:opacity-50"
                                >
                                    SEND OTP
                                </button>
                            </>
                        )}

                        {/* OTP STEP */}
                        {step === "otp" && (
                            <>
                                <h2 className="text-slate-700 text-lg font-semibold mb-6">
                                    Enter OTP
                                </h2>

                                <div className="flex justify-center gap-3 mb-8">
                                    {otp.map((_, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => {
                                                otpRefs.current[i] = el;
                                            }}
                                            type="text"
                                            maxLength={1}
                                            inputMode="numeric"
                                            value={otp[i]}
                                            onChange={(e) => handleOtpChange(e, i)}
                                            onKeyDown={(e) => handleOtpBackspace(e, i)}
                                            className="h-10 w-10 border-b-2 border-black text-center text-lg outline-none"
                                        />

                                    ))}
                                </div>

                                <button
                                    onClick={verifyOtp}
                                    disabled={otp.join("").length !== OTP_LENGTH}
                                    className="cursor-pointer w-full bg-brand-red text-white py-3 text-sm font-semibold disabled:opacity-50"
                                >
                                    VERIFY OTP
                                </button>

                                <button
                                    onClick={() => setStep("phone")}
                                    className="cursor-pointer mt-4 text-xs underline"
                                >
                                    Change number
                                </button>
                            </>
                        )}

                        {/* Legal */}
                        <p className="mt-6 text-[10px] text-gray-500 leading-relaxed">
                            By continuing, you agree to our{" "}
                            <span className="underline cursor-pointer">T&amp;C</span> and{" "}
                            <span className="underline cursor-pointer">Privacy Policy</span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginOtpModal;
