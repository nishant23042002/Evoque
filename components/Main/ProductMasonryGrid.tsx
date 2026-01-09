"use client";

import AnimatedRatingProgressBar from "@/constants/ratingBar";
import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

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
            const id = product?._id || "";

            // stable seed from id
            let seed = 0;
            for (let i = 0; i < id.length; i++) {
                seed = (seed << 5) - seed + id.charCodeAt(i);
            }

            const index = Math.abs(seed) % buckets.length;

            // small jitter so cards don't align too neatly
            const jitter = (Math.abs(seed) % 40) - 20;

            return buckets[index] + jitter;
        });
    }, [products]);




    const getPrimaryImage = (variants: Variant[]) => {
        const images = variants?.[0]?.color?.images;
        if (!images || images.length === 0) return "/images/placeholder.webp";
        return images.find(img => img.isPrimary)?.url || images[0].url;
    };

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
                    const colors = item.variants.map(v => v.color);

                    return (
                        <Link
                            key={item._id}
                            href={`/products/${item.slug}`}
                            className="block"
                        >
                            <div
                                className="relative mb-2 w-full rounded-sm overflow-hidden group"
                                style={{ height: heights[index] }}
                            >
                                {/* IMAGE */}
                                <Image
                                    src={getPrimaryImage(item.variants)}
                                    alt={item.productName}
                                    fill
                                    className="object-cover transition-all duration-300 group-hover:scale-105"
                                />

                                {/* COLOR DOTS */}
                                <div className="absolute w-full flex justify-between items-center top-2 right-0 px-2">
                                    <div className="flex gap-1">
                                        {colors.map(color => (
                                            <div
                                                key={color.slug}
                                                className="w-5 h-5 rounded-full border"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        ))}
                                    </div>
                                    <Heart
                                        className="text-brand-red"
                                        strokeWidth={0.9}
                                    />
                                </div>

                                {/* HOVER DETAILS */}
                                <div className="absolute inset-0 cursor-pointer opacity-100 min-[550px]:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end text-white">
                                    <div className="text-[12px] bg-black/75 sm:bg-black/40 w-full px-2 py-3">
                                        <p className="font-semibold">
                                            {item.brand}
                                        </p>
                                        <p className="leading-tight tracking-tight my-1">
                                            {item.productName}
                                        </p>
                                        <p className="font-bold">
                                            ₹{item.pricing.price}
                                            <span className="ml-2 line-through opacity-70">
                                                ₹{item.pricing.originalPrice}
                                            </span>
                                        </p>

                                        <AnimatedRatingProgressBar
                                            average={item.rating}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </Masonry>
        </div>
    );
}
