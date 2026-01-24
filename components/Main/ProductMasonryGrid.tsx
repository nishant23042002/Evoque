"use client";

import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TbMenu } from "react-icons/tb";
import { FaAnglesDown } from "react-icons/fa6";
import { useMemo, useState } from "react";
import RatingBar from "@/constants/ratingBar";
import Link from "next/link";
import { SlidersHorizontal } from 'lucide-react'
import { toggleWishlist } from "@/store/wishlist/wishlist.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";


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

interface Pricing {
    price: number
    originalPrice: number
    discountPercentage: number
    currency?: string
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


export interface Product {
    _id: string;
    productName: string;
    slug: string;
    brand: string;
    pricing: Pricing;
    rating: number;
    variants: Variant[];
    category?: {
        name: string;
        slug: string;
    };
    subCategory?: {
        slug: string;
    };
    isActive: string,
    isFeatured: string,
    isBestSeller: string,
    isNewArrival: string,
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [transitioningProduct, setTransitioningProduct] = useState<string | null>(null);

    const breakpoints = {
        default: 5,
        1300: 4,
        1000: 3,
        700: 2,
        400: 1,
    };

    const dispatch = useAppDispatch();

    const selectWishlistIds = (state: RootState) =>
        new Set(state.wishlist.items.map(i => i.productId));
    const wishlistIds = useAppSelector(selectWishlistIds);


    /* =======================
       CATEGORIES
    ======================= */

    const categories = useMemo(() => {
        const map = new Map<string, string>();

        products.forEach((p) => {
            if (p.category?.slug && p.category?.name) {
                map.set(p.category.slug, p.category.name);
            }
        });

        return [
            { slug: "all", name: "All" },
            ...Array.from(map, ([slug, name]) => ({ slug, name })),
        ];
    }, [products]);


    const filteredProducts = useMemo(() => {
        if (activeCategory === "all") return products;
        return products.filter(
            (p) => p.category?.slug === activeCategory
        );
    }, [products, activeCategory]);



    /* =======================
       MASONRY HEIGHTS
    ======================= */

    const heights = useMemo(() => {
        if (!Array.isArray(products) || products.length === 0) return [];
        const buckets = [350, 365, 380, 400, 425, 450, 465, 480, 500, 525, 550];

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
            <p className="flex items-center justify-center h-[40vh] text-sm font-semibold text-(--text-secondary)">
                No products found in this category
            </p>
        );
    }


    return (
        <div className={`${fullWidth ? "md:w-[85%] max-md:px-2 mx-auto" : "w-full"}`}>
            {showHeading && (
                <h2 className="text-center py-3 text-md tracking-widest font-semibold font-poppins text-foreground">
                    Everything You Need
                </h2>
            )}

            {/* =======================
               CATEGORY FILTER
            ======================= */}
            <div className="flex mb-2 items-center gap-3 relative">
                {/* FILTER BUTTON */}
                {showFilter && (
                    <button
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="flex justify-center items-center gap-2 cursor-pointer shrink-0"
                    >
                        <SlidersHorizontal
                            className={`w-4 h-6 transition-transform duration-300 ${isFilterOpen
                                ? "rotate-180 text-primary"
                                : "text-(--text-secondary)"
                                }`}
                        />

                        <span className="text-md font-medium text-(--text-secondary)">
                            Filter
                        </span>

                    </button>
                )}

                {/* CATEGORY FILTER BAR */}
                {showFilter && (
                    <div className="relative flex-1 overflow-hidden">
                        <div
                            className={`
                                    transition-all duration-300 ease-out
                                    ${isFilterOpen
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-4 pointer-events-none"
                                }
                                `}
                        >
                            <div
                                className="
                                            flex gap-8 whitespace-nowrap
                                            overflow-x-auto
                                            px-2
                                            scrollbar-modern md:scrollbar-hide
                                        "
                            >
                                {categories.map((cat) => (
                                    <button
                                        key={cat.slug}
                                        onClick={() => {
                                            setActiveCategory(cat.slug);
                                            setIsFilterOpen(false);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <p
                                            className={`text-md truncate transition-colors ${activeCategory === cat.slug
                                                ? "text-primary font-semibold"
                                                : "text-(--text-muted) hover:text-primary"
                                                }`}
                                        >
                                            {cat.name}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <span className="font-semibold text-sm mx-2 text-[oklch(0.45_0.01_85)]">{products?.length}</span>
            </div>





            {/* =======================
               ANIMATED GRID WRAPPER
            ======================= */}
            <div
                key={activeCategory}
                className="animate-fade-in-up"
            >
                <Masonry
                    breakpointCols={breakpoints}
                    className={`flex gap-2 md:gap-4 ${!fullWidth ? "mx-2" : "mx-0"}`}
                    columnClassName="masonry-column"
                >
                    {filteredProducts.map((item, index) => {
                        const isOpen = activeIndex === index;
                        const variant =
                            hoverVariants[item._id] ?? item.variants[0];
                        const isWishlisted = wishlistIds.has(item._id);

                        return (
                            <div key={item._id}>
                                <div
                                    className="border border-(--border-light)
                                        relative mb-2 md:mb-4
                                        drop-shadow-xs
                                        fade-in-75
                                        transition-all duration-300
                                        rounded-[2px]
                                        overflow-hidden
                                        group cursor-pointer
                                        bg-(--card-bg)
                                    "
                                    style={{ height: heights[index] }}
                                >
                                    {/* IMAGE */}
                                    <div
                                        className={`absolute inset-0 transition-opacity duration-300
                                            ${transitioningProduct === item._id ? "opacity-0" : "opacity-100"}
                                        `}
                                    >
                                        <Image
                                            src={
                                                variant.color.images.find((i) => i.isPrimary)?.url ??
                                                variant.color.images[0]?.url
                                            }
                                            alt={item.productName}
                                            fill
                                            className="object-cover  object-center duration-300 group-hover:scale-105"
                                        />
                                    </div>


                                    <div className="absolute inset-0 bg-(--earth-charcoal)/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* COLOR DOTS */}
                                    <div className="absolute w-full flex justify-between items-center top-1 px-2 z-20">
                                        <div className="flex gap-0.5">
                                            {item.variants.map((v) => (
                                                <span
                                                    key={v.color.slug}
                                                    className={`w-5 h-4 rounded-[2px] border cursor-pointer ${v.color.slug === variant.color.slug
                                                        ? "ring-1 ring-ring border-primary"
                                                        : "border-(--border-light)"
                                                        }`}
                                                    style={{ backgroundColor: v.color.hex }}
                                                    onMouseEnter={() => {
                                                        setTransitioningProduct(item._id);

                                                        setTimeout(() => {
                                                            setHoverVariants((prev) => ({
                                                                ...prev,
                                                                [item._id]: v,
                                                            }));
                                                            setTransitioningProduct(null);
                                                        }, 150);
                                                    }}

                                                    onMouseLeave={() => {
                                                        setTransitioningProduct(item._id);

                                                        setTimeout(() => {
                                                            setHoverVariants((prev) => {
                                                                const { [item._id]: _, ...rest } = prev;
                                                                return rest;
                                                            });
                                                            setTransitioningProduct(null);
                                                        }, 150);
                                                    }}

                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("🖤 Wishlist clicked:", item._id);
                                                const image =
                                                    variant.color.images.find(i => i.isPrimary)?.url ??
                                                    variant.color.images[0]?.url ??
                                                    "";

                                                dispatch(
                                                    toggleWishlist({
                                                        productId: item?._id,
                                                        slug: item?.slug,
                                                        name: item?.productName,
                                                        image,
                                                        price: item?.pricing?.price,
                                                        originalPrice: item?.pricing?.originalPrice,
                                                        brand: item?.brand
                                                    })
                                                );
                                            }}
                                            className="p-1.5 border border-(--border-light) cursor-pointer rounded-full bg-(--surface) shadow z-30"
                                        >
                                            <Heart
                                                strokeWidth={0.9}
                                                className={`h-5 w-5 transition ${isWishlisted
                                                    ? "fill-primary text-primary scale-110"
                                                    : "text-(--text-secondary) hover:text-primary"
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* MOBILE TOGGLE */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveIndex(
                                                isOpen ? null : index
                                            );
                                        }}
                                        className="md:hidden absolute bottom-0 w-full z-20 bg-(--earth-charcoal)/30 p-1 flex justify-center"
                                    >
                                        {isOpen ? (
                                            <FaAnglesDown className="text-white" />
                                        ) : (
                                            <TbMenu className="text-white" />
                                        )}
                                    </button>


                                    {/* DETAILS */}
                                    <div
                                        className={`
                                                absolute inset-0 max-md:bottom-6
                                                flex flex-col justify-end text-white
                                                transition-transform duration-300 ease-out

                                                md:opacity-0 md:translate-y-0
                                                md:group-hover:opacity-100

                                         ${isOpen
                                                ? "opacity-100 translate-y-0"
                                                : "opacity-0 translate-y-6 pointer-events-none"}
                                        `}
                                    >
                                        <div className="
                                                bg-(--earth-charcoal)/40
                                                backdrop-blur-xs
                                                px-2 py-3
                                                text-xs
                                                text-(--text-inverse)
                                                will-change-transform
                                            ">
                                            <p className="font-semibold">{item.brand}</p>

                                            <p className="my-1">{item.productName}</p>

                                            <p className="font-bold text-sm">
                                                ₹{variant.pricing?.price}
                                                <span className="ml-2 text-xs font-semibold line-through text-(--earth-olive)">
                                                    ₹{variant.pricing?.originalPrice}
                                                </span>
                                            </p>

                                            <RatingBar value={item.rating} />
                                        </div>
                                    </div>

                                    {!isOpen && (
                                        <div
                                            className="bg-black/30 py-1
                                                    absolute bottom-5.75 md:bottom-0 text-white
                                                    flex flex-col justify-center items-center w-full
                                                    transition-all duration-200
                                                    opacity-100 translate-y-0
                                                    md:group-hover:opacity-0 md:group-hover:translate-y-2
                                                    pointer-events-none
                                                    "
                                        >
                                            <p className="text-sm truncate text-nowrap font-medium">
                                                {item.productName}
                                            </p>

                                            <div className="flex gap-3 text-sm w-full justify-evenly z-999">
                                                <span>₹{variant.pricing?.price}</span>
                                                <span className="line-through text-gray-300">
                                                    ₹{variant.pricing?.originalPrice}
                                                </span>
                                            </div>
                                        </div>
                                    )}



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
