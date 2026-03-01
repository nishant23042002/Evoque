"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Loader2 } from "lucide-react";
import axios from "axios";
import Product from "@/types/ProductTypes";

interface Props {
    product: Product;
    refresh: () => void;
}

export default function ProductRowCard({ product, refresh }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleAction(action: () => Promise<void>) {
        if (loading) return;
        setLoading(true);
        setOpen(false);
        try {
            await action();
            refresh();
        } finally {
            setLoading(false);
        }
    }

    async function toggleActive() {
        await axios.patch(
            `/api/admin/products/${product._id}`,
            { isActive: !product.isActive },
            { withCredentials: true }
        );
    }

    async function toggleNewArrival() {
        await axios.patch(
            `/api/admin/products/${product._id}`,
            { isNewArrival: !product.isNewArrival },
            { withCredentials: true }
        );
    }

    async function softDelete() {
        if (!confirm("Delete this product?")) return;

        await axios.delete(
            `/api/admin/products/${product._id}`,
            { withCredentials: true }
        );
    }

    async function hardDelete() {
        if (
            !confirm(
                "⚠️ This will permanently delete the product and ALL images. Continue?"
            )
        )
            return;

        await axios.delete(
            `/api/admin/products/${product._id}?hard=true`,
            { withCredentials: true }
        );
    }

    return (
        <div
            className={`relative group border border-zinc-800 bg-zinc-900 mb-1 overflow-hidden transition-all duration-300
      ${loading
                    ? "opacity-60 pointer-events-none"
                    : ""
                }`}
        >
            {/* LOADING OVERLAY */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-white" size={24} />
                </div>
            )}

            {/* IMAGE SECTION */}
            <div className="relative w-full aspect-4/5 sm:aspect-4/5 overflow-hidden">
                <Image
                    src={product.thumbnail}
                    alt={product.productName}
                    fill
                    sizes="(max-width: 640px) 50vw,
                        (max-width: 1024px) 33vw,
                        (max-width: 1536px) 25vw,
                        20vw"
                    className={`object-cover cursor-pointer transition-transform duration-300`}
                />

                {/* Overlay */}
                <div
                    className={`absolute inset-0 transition ${product.isActive
                        ? "hover:bg-black/10"
                        : "bg-black/30"
                        }`}
                />

                {/* NEW Badge */}
                {product.isNewArrival && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-blue-100 text-[10px] sm:text-xs px-2 py-1">
                        NEW
                    </div>
                )}

                {/* Inactive Badge */}
                {!product.isActive && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] sm:text-xs px-2 py-1">
                        Inactive
                    </div>
                )}

                {/* Dropdown Trigger */}
                <button
                    disabled={loading}
                    onClick={() => setOpen(!open)}
                    className="absolute cursor-pointer bottom-1 right-1 p-1 bg-zinc-900/80 hover:bg-zinc-800 transition"
                >
                    <MoreVertical size={16} />
                </button>

                {/* Dropdown Menu */}
                {open && !loading && (
                    <div className="
                            absolute right-1 bottom-10
                            w-35 h-30
                            bg-zinc-900 border border-zinc-800
                            overflow-y-scroll scrollbar-hide overflow-x-hidden z-40
                            ">
                        <button
                            onClick={() =>
                                handleAction(async () => {
                                    window.location.href = `/admin/products/${product._id}`;
                                })
                            }
                            className="w-full px-4 py-2 text-left hover:bg-zinc-800 text-xs"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => handleAction(toggleNewArrival)}
                            className={`w-full px-4 py-2 text-left hover:bg-zinc-800 text-xs ${!product.isNewArrival ? "text-blue-500" : "text-red-500"
                                }`}
                        >
                            {product.isNewArrival
                                ? "Remove New Arrival"
                                : "Mark as New Arrival"}
                        </button>

                        <button
                            onClick={() => handleAction(toggleActive)}
                            className="w-full px-4 py-2 text-left hover:bg-zinc-800 text-xs"
                        >
                            {product.isActive ? "Deactivate" : "Activate"}
                        </button>

                      

                        <button
                            onClick={() => handleAction(softDelete)}
                            className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 text-xs"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => handleAction(hardDelete)}
                            className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-600/20 text-xs"
                        >
                            Permanent Delete
                        </button>
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="px-2 sm:px-3 py-2 sm:py-3 space-y-1 sm:space-y-2">
                <h3 className="text-[11px] sm:text-xs md:text-sm uppercase font-semibold text-zinc-100 line-clamp-1">
                    {product.productName}
                </h3>

                <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-1">
                    {product.subCategory.name}
                </p>

                <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold text-xs sm:text-sm text-zinc-100">
                        Rs. {product.pricing.price}
                    </span>

                    <span
                        className={`text-[10px] sm:text-xs font-medium ${product.totalStock === 0
                            ? "text-red-400"
                            : product.totalStock < 10
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                    >
                        Stock {product.totalStock}
                    </span>
                </div>
            </div>
        </div>
    );
}