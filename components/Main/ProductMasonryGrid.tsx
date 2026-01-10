"use client";

import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TbMenu } from "react-icons/tb";
import { FaAnglesDown } from "react-icons/fa6";
import { useMemo, useState } from "react";
import RatingBar from "@/constants/ratingBar";
import Link from "next/link";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

/* =======================
   TYPES
======================= */

interface VariantImage {
    url: string;
    isPrimary?: boolean;
}

interface VariantColor {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
}

interface SizeVariant {
    size: string;
    stock: number;
    isAvailable?: boolean;
}

interface Variant {
    color: VariantColor;
    sizes?: SizeVariant[];
    pricing?: {
        price?: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    totalStock?: number;
}

interface Pricing {
    price: number;
    originalPrice: number;
    discountPercentage: number;
    currency: string;
}

export interface Product {
    _id: string;
    productName: string;
    slug: string;
    brand: string;
    pricing: Pricing;
    rating: number;
    variants: Variant[];
    subCategory?: {
        slug: string;
    };
}

interface ProductMasonryGridProps {
    products?: Product[];
}

/* =======================
   COMPONENT
======================= */

export default function ProductMasonryGrid({
    products = [],
}: ProductMasonryGridProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoverVariants, setHoverVariants] = useState<Record<string, Variant>>({});
    const breakpoints = {
        default: 5,
        1300: 4,
        1000: 3,
        800: 2,
        350: 1,
    };

    const heights = useMemo(() => {
        if (!Array.isArray(products) || products.length === 0) return [];
        const buckets = [250, 280, 300, 350, 380, 400, 450, 480, 500];

        return products.map((product) => {
            let seed = 0;
            const id = product?._id || "";
            for (let i = 0; i < id.length; i++) {
                seed = (seed << 5) - seed + id.charCodeAt(i);
            }
            const index = Math.abs(seed) % buckets.length;
            const jitter = (Math.abs(seed) % 40) - 20;
            return buckets[index] + jitter;
        });
    }, [products]);

    if (!products.length) {
        return <p className="text-center my-10">No products found</p>;
    }

    return (
        <div className="my-8 md:w-[90%] mx-auto">
            <Masonry
                breakpointCols={breakpoints}
                className="flex gap-2 mx-2"
                columnClassName="masonry-column"
            >
                {products.map((item, index) => {
                    const isOpen = activeIndex === index;
                    const variant = hoverVariants[item._id] ?? item.variants[0]; // default variant

                    return (
                        <div key={item._id} className="block">
                            <div
                                className="relative mb-2 w-full rounded-sm overflow-hidden group cursor-pointer"
                                style={{ height: heights[index] }}
                            >
                                {/* IMAGE */}
                                <Image
                                    src={
                                        variant.color.images.find((i) => i.isPrimary)?.url ??
                                        variant.color.images[0]?.url
                                    }
                                    alt={item.productName}
                                    fill
                                    className="object-cover transition-all duration-300 group-hover:scale-105"
                                />

                                {/* COLOR DOTS */}
                                <div className="absolute w-full flex justify-between items-center top-2 right-0 px-2 z-20">
                                    <div className="flex gap-1">
                                        {item.variants.map((v) => {
                                            const isSelected = v.color.slug === variant.color.slug;
                                            return (
                                                <span
                                                    key={v.color.slug}
                                                    className={`w-5 h-5 rounded-[2px] border ${isSelected
                                                        ? "ring ring-brand-red border-red-400"
                                                        : "border-gray-400"
                                                        }`}
                                                    style={{ backgroundColor: v.color.hex }}
                                                    onMouseEnter={() =>
                                                        setHoverVariants((prev) => ({ ...prev, [item._id]: v }))
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoverVariants((prev) => {
                                                            const { [item._id]: _, ...rest } = prev;
                                                            return rest;
                                                        })
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                    <Heart className="text-brand-red" strokeWidth={0.9} />
                                </div>

                                {/* MOBILE TOGGLE */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveIndex(activeIndex === index ? null : index);
                                    }}
                                    className="md:hidden absolute bottom-0 w-full right-0 z-20 bg-black/75 p-1 flex items-center justify-center"
                                >
                                    {!isOpen ? (
                                        <TbMenu className="w-4 h-4 text-white" />
                                    ) : (
                                        <FaAnglesDown className="w-4 h-4 text-white" />
                                    )}
                                </button>

                                {/* DETAILS */}
                                <div
                                    className={`absolute inset-0 max-md:bottom-6 cursor-pointer transition-all duration-300 flex flex-col justify-end text-white
                                        md:opacity-0 md:group-hover:opacity-100
                                        ${activeIndex === index ? "opacity-100" : "opacity-0"}
                                        md:pointer-events-auto`}
                                >
                                    <div className="text-[12px] bg-black/75 sm:bg-black/75 w-full px-2 py-3">
                                        <p className="font-semibold">{item.brand}</p>
                                        <p className="leading-tight tracking-tight my-1">
                                            {item.productName}
                                        </p>
                                        <p className="font-bold">
                                            ₹{variant.pricing?.price}
                                            <span className="line-through ml-2">
                                                ₹{variant.pricing?.originalPrice}
                                            </span>
                                        </p>
                                        <RatingBar value={item.rating} />
                                    </div>
                                </div>

                                {/* LINK overlay only for clickable area */}
                                <Link
                                    href={`/products/${item.slug}`}
                                    className="absolute inset-0 z-10"
                                    onClick={(e) => e.stopPropagation()} // let color dots hover still work
                                />
                            </div>
                        </div>

                    );
                })}
            </Masonry>
        </div>
    );
}