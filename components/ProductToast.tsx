"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideProductToast } from "@/store/ui/ui.slice";

export default function ProductToast() {
    const dispatch = useAppDispatch();
    const toast = useAppSelector((state) => state.ui.productToast);

    useEffect(() => {
        if (!toast) return;

        // ✅ Duration logic
        const duration =
            toast.duration ??
            (toast.type === "error" ? 3500 : 2500);

        const t = setTimeout(() => {
            dispatch(hideProductToast());
        }, duration);

        return () => clearTimeout(t);
    }, [toast, dispatch]);

    if (!toast) return null;

    const isError = toast.type === "error";
    const isRemove =
        toast.type === "wishlist-remove" ||
        toast.type === "cart-remove";

    const titleMap: Record<string, string> = {
        cart: "Added to Bag",
        wishlist: "Added to Wishlist",
        "wishlist-remove": "Removed from Wishlist",
        "cart-remove": "Removed from Cart",
        error: "Action Failed",
        success: "Success",
        info: "Information",
        warning: "Warning",
    };

    return (
        <div
            className={`
                fixed z-999
                bottom-4 left-1/2 -translate-x-1/2
                sm:top-16 sm:bottom-auto sm:right-13 sm:left-auto sm:translate-x-0          
                w-[92%] max-w-sm
                bg-white
                border
                p-3
                shadow-lg
                animate-slideIn
                ${isError
                    ? "border-red-500"
                    : toast.type === "warning"
                        ? "border-yellow-500"
                        : toast.type === "info"
                            ? "border-blue-500"
                            : "border-border"
                }
            `}
        >
            <div className="flex gap-3 items-center">
                {/* IMAGE (hide for error/info/warning) */}
                {!isError && toast.image?.length > 0 && (
                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 shrink-0">
                        <Image
                            src={toast.image}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-col flex-1 min-w-0">
                    <span
                        className={`
                            font-medium text-xs sm:text-base
                            ${isError
                                ? "text-red-600"
                                : toast.type === "warning"
                                    ? "text-yellow-600"
                                    : toast.type === "info"
                                        ? "text-blue-600"
                                        : isRemove
                                            ? "text-red-500"
                                            : "text-green-700"
                            }
                        `}
                    >
                        {titleMap[toast.type] ?? "Notification"}
                    </span>

                    {isError || toast.type === "warning" || toast.type === "info" ? (
                        <span className="text-sm font-light mt-1">
                            {toast.message || "Something went wrong."}
                        </span>
                    ) : (
                        <>
                            {toast.name && (
                                <span className="text-sm font-light uppercase truncate">
                                    {toast.name}
                                </span>
                            )}

                            {toast.size && (
                                <span className="text-xs text-gray-500">
                                    Size: {toast.size}
                                </span>
                            )}

                            {toast.price && (
                                <span className="font-semibold text-red-600 mt-1 text-sm">
                                    Rs.{toast.price}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}