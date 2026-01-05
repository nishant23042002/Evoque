"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
    useEffect(() => {
        if (!open) return;

        // Lock scroll
        document.body.style.overflow = "hidden";

        // ESC close
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Overlay with blur */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal box */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-md animate-scaleIn rounded-xl bg-accent-rose p-6 shadow-2xl"
            >
                {children}
            </div>
        </div>,
        document.getElementById("modal-root")!
    );
}
