"use client";

import { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Modal from "../Modal";

type Step = "phone" | "otp";
const OTP_LENGTH = 6;

export default function LoginOtpModal() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="font-semibold text-slate-700 hover:text-brand-red"
            >
                Login
            </button>

            <Modal open={open} onClose={() => setOpen(false)}>
                {/* Close */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-black"
                >
                    <IoClose size={20} />
                </button>

                {/* LOGO */}
                <div className="flex justify-center gap-1 font-bold mb-1">
                    {"EVOQUE".split("").map((l, i) => (
                        <span key={i} className="text-brand-red text-lg tracking-wide">
                            {l}
                        </span>
                    ))}
                </div>

                <p className="text-[10px] tracking-widest text-gray-500 text-center mb-6">
                    DESIGNED TO EVOLVE
                </p>

                {step === "phone" && (
                    <>
                        <h2 className="text-center text-lg font-semibold">
                            Let&apos;s Evoque
                        </h2>

                        <div className="mt-8 flex items-center gap-2 border-b border-gray-800 pb-2">
                            <span>+91</span>
                            <input
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                                }
                                className="w-full bg-transparent outline-none"
                                placeholder="Phone number"
                            />
                        </div>

                        <button
                            onClick={() => setStep("otp")}
                            disabled={phone.length !== 10}
                            className="mt-8 w-full rounded-md bg-brand-red py-3 text-white disabled:opacity-50"
                        >
                            SEND OTP
                        </button>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <h2 className="text-center text-lg font-semibold mb-6">
                            Enter OTP
                        </h2>

                        <div className="flex justify-center gap-3 mb-8">
                            {otp.map((_, i) => (
                                <input
                                    key={i}
                                    ref={(el) => {
                                        otpRefs.current[i] = el;
                                    }}
                                    maxLength={1}
                                    className="h-11 w-11 text-center border rounded-md"
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push("/");
                            }}
                            className="w-full rounded-md bg-brand-red py-3 text-white"
                        >
                            VERIFY OTP
                        </button>
                    </>
                )}
            </Modal>
        </>
    );
}
