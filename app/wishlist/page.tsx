"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { clothingItems } from "@/data/clothingItems";


export default function WishlistPage() {
    const wishlistItems = clothingItems.slice(0, 4);

    return (
        <div className="ml-18 max-[490px]:ml-15 px-4 py-5 max-w-[1400px] mx-auto">
            {/* HEADER */}
            <h1 className="text-lg font-semibold mb-8">
                My Wishlist <span className="font-normal text-gray-500">999 items</span>
            </h1>

            {/* GRID */}
            <div className="grid max-[570]:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {wishlistItems.map(item => (
                    <div
                        key={item.title}
                        className="relative border rounded-sm bg-white hover:shadow-md transition"
                    >
                        {/* REMOVE BUTTON */}
                        <button className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full border bg-white flex items-center justify-center hover:bg-gray-100">
                            <X size={14} />
                        </button>

                        {/* IMAGE */}
                        <div className="relative w-full aspect-3/4 bg-gray-100">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain p-4"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="p-3">
                            <p className="text-sm truncate">{item.title}</p>

                            <div className="mt-1 flex items-center gap-2 text-sm">
                                <span className="font-semibold">Rs.{item.price}</span>

                                {item.price && (
                                    <span className="line-through text-gray-400 text-xs">
                                        Rs.{item.price}
                                    </span>
                                )}

                                {item.price && (
                                    <span className="text-xs text-orange-500">
                                        ({item.price})
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <button className="w-full border-t py-3 text-sm font-semibold text-brand-red hover:bg-red-50 transition">
                            MOVE TO BAG
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
