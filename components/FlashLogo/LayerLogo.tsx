"use client";

import Image from "next/image";

export default function LayerLogo() {
    return (
        <div className="fixed z-9999 inset-0 flex items-center justify-center bg-[var(--linen-100)]">
            <Image src="/images/thelayerflash.gif" alt="logo" width={180} height={180} /> 
        </div>
    );
}
