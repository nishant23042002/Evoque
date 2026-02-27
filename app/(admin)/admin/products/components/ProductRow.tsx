// /app/(admin)/admin/products/components/ProductRow.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import axios from "axios";
import Product from "@/types/ProductTypes";

interface Props {
    product: Product;
    refresh: () => void;
}



export default function ProductRow({ product, refresh }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function toggleActive() {
        setLoading(true);
        await axios.patch(
            `/api/admin/products/${product._id}`,
            { isActive: !product.isActive },
            { withCredentials: true }
        );
        setLoading(false);
        refresh();
    }

    async function softDelete() {
        const confirmDelete = confirm(
            "Are you sure you want to delete this product?"
        );
        if (!confirmDelete) return;

        setLoading(true);
        await axios.delete(
            `/api/admin/products/${product._id}`,
            { withCredentials: true }
        );
        setLoading(false);
        refresh();
    }

    async function hardDelete() {
        const confirmDelete = confirm(
            "⚠️ This will permanently delete the product and ALL images. Continue?"
        );
        if (!confirmDelete) return;

        setLoading(true);

        await axios.delete(
            `/api/admin/products/${product._id}?hard=true`,
            { withCredentials: true }
        );

        setLoading(false);
        refresh();
    }

    return (
        <tr className="border-t border-zinc-800 py-12 hover:bg-zinc-800/40 z-30 transition">
            <td className="p-4">
                <div className="flex items-center gap-4 h-30">
                    <div className="relative w-28 h-34 rounded-xs overflow-hidden">
                        <Image
                            src={product.thumbnail}
                            alt={product.productName}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-xs text-zinc-400">{product.subCategory.name}</p>
                    </div>
                </div>
            </td>

            <td className="p-4">Rs. {product.pricing.price}</td>

            <td className="p-4">
                {product.totalStock}
            </td>

            <td className="p-4">
                {product.isActive ? (
                    <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                        Active
                    </span>
                ) : (
                    <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                        Inactive
                    </span>
                )}
            </td>

            <td className="p-4 text-right relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 cursor-pointer hover:bg-zinc-700 rounded"
                >
                    <MoreVertical size={18} />
                </button>

                {open && (
                    <div className="absolute right-13 top-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded shadow-lg">
                        <button
                            onClick={() => {
                                setOpen(false);
                                window.location.href = `/admin/products/edit/${product._id}`;
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => {
                                setOpen(false);
                                toggleActive();
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm"
                            disabled={loading}
                        >
                            {product.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                            onClick={() => {
                                setOpen(false);
                                softDelete();
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 text-sm"
                            disabled={loading}
                        >
                            Soft Delete
                        </button>

                        <button
                            onClick={() => {
                                setOpen(false);
                                hardDelete();
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-600/20 text-red-500 text-sm"
                            disabled={loading}
                        >
                            Permanent Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}