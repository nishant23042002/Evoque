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
        const t = setTimeout(() => dispatch(hideProductToast()), 2500);
        return () => clearTimeout(t);
    }, [toast]);

    if (!toast) return null;

    return (
        <div className="
      fixed z-999
      right-4 top-4
      sm:right-2 sm:top-16
      w-110
      bg-white
      border border-border
      p-3
      animate-slideIn
    ">
            <div className="flex gap-3">
                <div className="relative w-24 h-30 border">
                    <Image src={toast.image} alt="" fill className="object-cover" />
                </div>

                <div className="flex flex-col flex-1">
                    <span
                        className={`font-semibold ${toast.type === "wishlist-remove" ? "text-red-500" : ""
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
                        <span className="font-bold mt-1">₹ {toast.price}</span>
                    )}
                </div>
            </div>
        </div>
    );
}