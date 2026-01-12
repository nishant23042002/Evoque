"use client";

import Image from "next/image";

export default function LayerLogo() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f2efe9]">
            <Image src="/images/logo.gif" alt="logo" width={180} height={180} /> 
        </div>

    );
}
