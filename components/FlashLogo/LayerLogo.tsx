"use client";

import Image from "next/image";

export default function LayerLogo() {
    return (
        <div className="fixed z-9999 inset-0 transition-transform duration-700   flex items-center justify-center bg-white">
            <Image src="/images/thelayerflashlogo.gif" alt="logo" width={180} height={180} /> 
        </div>
    );
}
