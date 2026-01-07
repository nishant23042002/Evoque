"use client";

import Image from "next/image";

export default function EvoqueLogoLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <Image src="/images/logo.gif" alt="logo" width={180} height={180} /> 
        </div>

    );
}
