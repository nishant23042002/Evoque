"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideProductToast } from "@/store/ui/ui.slice";

export default function ProductToast() {
    const dispatch = useAppDispatch();
    const toast = useAppSelector(s => s.ui.productToast);

    useEffect(() => {
        if (!toast) return;

        const t = setTimeout(() => {
            dispatch(hideProductToast());
        }, 2500);

        return () => clearTimeout(t);
    }, [toast, dispatch]);


    if (!toast) return null;

    return (
        <div
            className="
            fixed z-999
            bottom-4 left-1/2 -translate-x-1/2
            sm:top-16 sm:bottom-auto sm:right-1 sm:left-auto sm:translate-x-0          
            w-[92%] max-w-sm
            bg-white
            border border-border      
            p-3
            animate-slideIn
        "
        >
            <div className="flex gap-3 items-center">
                {/* IMAGE */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 shrink-0">
                    <Image
                        src={toast.image}
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

                {/* TEXT */}
                <div className="flex flex-col flex-1 min-w-0">
                    <span
                        className={`font-semibold text-sm sm:text-base ${toast.type === "wishlist-remove" ? "text-red-500" : ""
                            } ${toast.type === "cart-remove" ? "text-red-500" : ""
                            }`}
                    >
                        {toast.type === "cart" && "Added to Bag"}
                        {toast.type === "wishlist" && "Added to Wishlist"}
                        {toast.type === "wishlist-remove" && "Removed from Wishlist"}
                        {toast.type === "cart-remove" && "Removed from Cart"}
                    </span>

                    <span className="text-sm font-medium truncate">
                        {toast.name}
                    </span>

                    {toast.size && (
                        <span className="text-xs text-gray-500">
                            Size: {toast.size}
                        </span>
                    )}

                    {toast.price && (
                        <span className="font-bold mt-1 text-sm">
                            ₹ {toast.price}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
