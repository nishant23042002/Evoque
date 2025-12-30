"use client";

import Image from "next/image";

export default function CometLogoLoader() {
    return (
        <div className="relative w-28 h-28 flex items-center justify-center overflow-hidden">
            {/* Glow pulse */}
            <div className="absolute inset-0 rounded-full bg-black/10 blur-xl comet" />

            {/* Logo */}
            <Image
                src="/logo.svg"
                alt="Loading"
                width={120}
                height={120}
                className="relative z-10 logo"
                priority
            />

            {/* COMET FLASH */}
            <span className="absolute inset-0 pointer-events-none">
                <span className="comet" />
            </span>
        </div>
    );
}
