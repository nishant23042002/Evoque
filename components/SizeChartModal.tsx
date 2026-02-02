"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    label: string;
    image: string;
    productName: string;
}

export default function SizeChartModal({
    open,
    onClose,
    label,
    image,
    productName
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <div className="relative bg-[#edecebfb] w-full max-w-lg rounded-[3px] overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-semibold text-sm">{productName}</h3>
                    <button onClick={onClose} className="cursor-pointer">
                        <X />
                    </button>
                </div>

                {/* IMAGE */}
                <div className="relative w-full aspect-4/3 my-4 bg-gray-50">
                    <Image
                        src={image}
                        alt={label}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 500px"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
