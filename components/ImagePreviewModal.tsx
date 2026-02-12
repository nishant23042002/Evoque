"use client";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

type Props = {
    images: string[];
    index: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
};

export default function ImagePreviewModal({
    images,
    index,
    onClose,
    onNext,
    onPrev,
}: Props) {
    // ESC key close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose, onNext, onPrev]);

    useEffect(() => {
        // LOCK SCROLL
        document.body.style.overflow = "hidden";

        return () => {
            // UNLOCK SCROLL
            document.body.style.overflow = "auto";
        };
    }, []);


    return (
        <div className="fixed inset-0 bg-white z-99 flex items-center justify-center animate-fadeIn">
            {/* CONTROLS */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-white/80 backdrop-blur px-4 py-2 rounded-full border shadow">

                {/* PREV */}
                <button
                    onClick={onPrev}
                    className="cursor-pointer p-2 hover:bg-gray-100 transition"
                >
                    <ChevronLeft size={26} />
                </button>

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="cursor-pointer p-2 hover:bg-gray-100 transition"
                >
                    <X size={26} />
                </button>

                {/* NEXT */}
                <button
                    onClick={onNext}
                    className="cursor-pointer p-2 hover:bg-gray-100 transition"
                >
                    <ChevronRight size={26} />
                </button>

            </div>


            {/* IMAGE */}
            <div className="relative w-[90%] h-[90%] animate-zoomIn">
                <Image
                    src={images[index]}
                    alt="preview"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
