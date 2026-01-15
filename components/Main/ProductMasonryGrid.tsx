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
}

interface Variant {
    color: VariantColor;
    sizes?: SizeVariant[];
    pricing?: {
        price?: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
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
    showHeading?: boolean;
    showFilter?: boolean;
    fullWidth?: boolean
}

/* =======================
   COMPONENT
======================= */

export default function ProductMasonryGrid({
    products = [],
    showHeading = true,
    showFilter = true,
    fullWidth = true
}: ProductMasonryGridProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoverVariants, setHoverVariants] = useState<Record<string, Variant>>(
        {}
    );
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const breakpoints = {
        default: 5,
        1300: 4,
        1000: 3,
        800: 2,
        350: 1,
    };

    /* =======================
       CATEGORIES
    ======================= */

    const categories = useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => {
            if (p.subCategory?.slug) {
                set.add(p.subCategory.slug);
            }
        });
        return ["all", ...Array.from(set)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === "all") return products;
        return products.filter(
            (p) => p.subCategory?.slug === activeCategory
        );
    }, [products, activeCategory]);

    /* =======================
       MASONRY HEIGHTS
    ======================= */

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

    if (!filteredProducts.length) {
        return (
            <p className="flex items-center justify-center h-[40vh] text-sm font-semibold text-slate-700">
                No products found in this category
            </p>
        );
    }

    return (
        <div className={`${fullWidth ? "md:w-[85%] max-md:px-2 mx-auto my-10" : "w-full"}`}>
            {showHeading && (
                <h2 className="py-2 text-center text-md tracking-widest font-semibold font-poppins text-slate-800">
                    Everything You Need
                </h2>
            )}

            {/* =======================
               CATEGORY FILTER
            ======================= */}
            {
                showFilter && (
                    <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden justify-center gap-2 mb-8 px-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`cursor-pointer px-4 py-1.5 rounded-[2px] text-xs uppercase tracking-wider font-semibold border transition-all duration-300
                            ${activeCategory === cat
                                        ? "bg-black text-white border-black scale-105"
                                        : "text-black border-gray-300 hover:bg-gray-100/60"
                                    }
                        `}
                            >
                                {cat === "all" ? "All" : cat.replace("-", " ")}
                            </button>
                        ))}
                    </div>
                )
            }

            {/* =======================
               ANIMATED GRID WRAPPER
            ======================= */}
            <div
                key={activeCategory}
                className="animate-fade-in-up"
            >
                <Masonry
                    breakpointCols={breakpoints}
                    className={`flex gap-2 ${!fullWidth ? "mx-2" : "mx-0"}`}
                    columnClassName="masonry-column"
                >
                    {filteredProducts.map((item, index) => {
                        const isOpen = activeIndex === index;
                        const variant =
                            hoverVariants[item._id] ?? item.variants[0];

                        return (
                            <div key={item._id}>
                                <div
                                    className="relative mb-2 fade-in-75 transition-all duration-300 rounded-[2px] overflow-hidden group cursor-pointer"
                                    style={{ height: heights[index] }}
                                >
                                    {/* IMAGE */}
                                    <Image
                                        src={
                                            variant.color.images.find(
                                                (i) => i.isPrimary
                                            )?.url ??
                                            variant.color.images[0]?.url
                                        }
                                        alt={item.productName}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {/* COLOR DOTS */}
                                    <div className="absolute w-full flex justify-between items-center top-2 px-2 z-20">
                                        <div className="flex gap-1">
                                            {item.variants.map((v) => (
                                                <span
                                                    key={v.color.slug}
                                                    className={`w-4 h-4 rounded-[2px] border cursor-pointer ${v.color.slug ===
                                                        variant.color.slug
                                                        ? "ring ring-brand-red border-red-400"
                                                        : "border-gray-400"
                                                        }`}
                                                    style={{
                                                        backgroundColor:
                                                            v.color.hex,
                                                    }}
                                                    onMouseEnter={() =>
                                                        setHoverVariants(
                                                            (prev) => ({
                                                                ...prev,
                                                                [item._id]: v,
                                                            })
                                                        )
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoverVariants(
                                                            (prev) => {
                                                                const {
                                                                    [item._id]:
                                                                    _,
                                                                    ...rest
                                                                } = prev;
                                                                return rest;
                                                            }
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <Heart
                                            className="text-brand-red"
                                            strokeWidth={0.9}
                                        />
                                    </div>

                                    {/* MOBILE TOGGLE */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveIndex(
                                                isOpen ? null : index
                                            );
                                        }}
                                        className="md:hidden absolute bottom-0 w-full z-20 bg-black/70 p-1 flex justify-center"
                                    >
                                        {isOpen ? (
                                            <FaAnglesDown className="text-white" />
                                        ) : (
                                            <TbMenu className="text-white" />
                                        )}
                                    </button>

                                    {/* DETAILS */}
                                    <div
                                        className={`absolute inset-0 max-md:bottom-6 transition-all duration-300 flex flex-col justify-end text-white
                                            md:opacity-0 md:group-hover:opacity-100
                                            ${isOpen
                                                ? "opacity-100"
                                                : "opacity-0"
                                            }
                                        `}
                                    >
                                        <div className="bg-black/75 px-2 py-3 text-xs">
                                            <p className="font-semibold">
                                                {item.brand}
                                            </p>
                                            <p className="my-1">
                                                {item.productName}
                                            </p>
                                            <p className="font-bold">
                                                ₹{variant.pricing?.price}
                                                <span className="line-through ml-2">
                                                    ₹
                                                    {
                                                        variant.pricing
                                                            ?.originalPrice
                                                    }
                                                </span>
                                            </p>
                                            <RatingBar value={item.rating} />
                                        </div>
                                    </div>

                                    <Link
                                        href={`/products/${item.slug}`}
                                        className="absolute inset-0 z-10"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </Masonry>
            </div>
        </div>
    );
}
