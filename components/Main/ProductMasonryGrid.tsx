"use client";

import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TbMenu } from "react-icons/tb";
import { FaAnglesDown } from "react-icons/fa6";
import { useMemo, useState } from "react";
import RatingBar from "@/constants/ratingBar";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectWishlistIds } from "@/store/wishlist/wishlist.selector";
import { addWishlistItem, removeWishlistItem } from "@/store/wishlist/wishlist.thunks";
import { useAuth } from "../AuthProvider";
import { Product, Variant, VariantImage } from "@/types/ProductTypes"

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });





interface ProductMasonryGridProps {
    products: Product[];
    showHeading?: boolean;
    fullWidth?: boolean;
}

/* =======================
   COMPONENT
======================= */

export default function ProductMasonryGrid({
    products,
    showHeading = true,
    fullWidth = true,
}: ProductMasonryGridProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoverVariants, setHoverVariants] = useState<Record<string, Variant>>({});
    const [transitioningProduct, setTransitioningProduct] = useState<string | null>(null);

    const { isAuthenticated, loading, openLogin } = useAuth();
    const wishlistIds = useAppSelector(selectWishlistIds);
    const dispatch = useAppDispatch();

    /* -------------------------
       MASONRY BREAKPOINTS
    ------------------------- */
    const breakpoints = { default: 5, 1300: 4, 1000: 3, 700: 2, 400: 1 };

    /* -------------------------
       DYNAMIC HEIGHTS
    ------------------------- */
    const heights = useMemo(() => {
        if (!products.length) return [];
        const buckets = [350, 365, 380, 400, 425, 450, 465, 480, 500, 525, 550];

        return products.map((product) => {
            let seed = 0;
            const id = product._id;
            for (let i = 0; i < id.length; i++) {
                seed = (seed << 5) - seed + id.charCodeAt(i);
            }
            const index = Math.abs(seed) % buckets.length;
            const jitter = (Math.abs(seed) % 40) - 20;
            return buckets[index] + jitter;
        });
    }, [products]);

    return (
        <div className={`my-4 md:my-10 ${fullWidth ? "px-2 mx-auto" : "w-full"}`}>
            {showHeading && (
                <h2 className="text-center py-3 text-md tracking-widest font-semibold font-poppins text-foreground">
                    Everything You Need
                </h2>
            )}

            <Masonry
                breakpointCols={breakpoints}
                className={`flex gap-2 ${!fullWidth ? "mx-2" : "mx-0"}`}
                columnClassName="masonry-column"
            >
                {products.map((item, index) => {
                    const isOpen = activeIndex === index;
                    const variant = hoverVariants[item._id] ?? item.variants[0];
                    const isWishlisted = wishlistIds.has(item._id);
                    const primaryImage: VariantImage | undefined = variant.color.images.find(
                        (i: VariantImage) => i.isPrimary
                    );

                    const imageUrl = primaryImage?.url ?? variant.color.images[0]?.url ?? "";



                    return (
                        <div key={item._id}>
                            <div
                                className="border border-(--border-light) relative mb-2 drop-shadow-xs fade-in-75 transition-all duration-300 rounded-[2px] overflow-hidden group cursor-pointer bg-(--card-bg)"
                                style={{ height: heights[index] }}
                            >
                                {/* IMAGE */}
                                <div
                                    className={`absolute inset-0 transition-opacity duration-300 ${transitioningProduct === item._id ? "opacity-0" : "opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={item.productName}
                                        fill
                                        sizes="(max-width: 400px) 100vw, (max-width: 700px) 50vw, (max-width: 1000px) 33vw, (max-width: 1300px) 25vw, 20vw"
                                        className="object-cover object-center duration-300 group-hover:scale-105"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-(--earth-charcoal)/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* COLOR DOTS & WISHLIST */}
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
                                            if (loading) return;
                                            if (!isAuthenticated) return openLogin();

                                            if (isWishlisted) {
                                                dispatch(removeWishlistItem(item._id));
                                            } else {
                                                dispatch(
                                                    addWishlistItem({
                                                        productId: item._id,
                                                        slug: item.slug,
                                                        name: item.productName,
                                                        image: imageUrl,
                                                        price: item.pricing?.price ?? 0,
                                                        originalPrice: item.pricing?.originalPrice ?? 0,
                                                        brand: item.brand,
                                                    })
                                                );
                                            }
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
                                        setActiveIndex(isOpen ? null : index);
                                    }}
                                    className="md:hidden absolute bottom-0 w-full z-20 bg-(--earth-charcoal)/30 p-1 flex justify-center"
                                >
                                    {isOpen ? <FaAnglesDown className="text-white" /> : <TbMenu className="text-white" />}
                                </button>

                                {/* DETAILS */}
                                <div
                                    className={`absolute inset-0 max-md:bottom-6 flex flex-col justify-end text-white transition-transform duration-300 ease-out md:opacity-0 md:translate-y-0 md:group-hover:opacity-100 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
                                        }`}
                                >
                                    <div className="bg-(--earth-charcoal)/40 backdrop-blur-xs px-2 py-3 text-xs text-(--text-inverse) will-change-transform">
                                        <p className="font-semibold">{item.brand}</p>
                                        <p className="my-1">{item.productName}</p>
                                        <p className="font-bold text-sm">
                                            ₹{variant.pricing?.price}
                                            <span className="ml-2 text-xs line-through text-(--linen-300)">
                                                ₹{variant.pricing?.originalPrice}
                                            </span>
                                        </p>
                                        <RatingBar value={item.rating ?? 0} />
                                    </div>
                                </div>

                                {!isOpen && (
                                    <div className="bg-black/30 py-1 absolute bottom-5.75 md:bottom-0 text-white flex flex-col justify-center items-center w-full transition-all duration-200 opacity-100 translate-y-0 md:group-hover:opacity-0 md:group-hover:translate-y-2 pointer-events-none">
                                        <p className="text-sm truncate text-nowrap font-medium">{item.productName}</p>
                                        <div className="flex gap-3 text-sm w-full justify-evenly z-999">
                                            <span>₹{variant.pricing?.price}</span>
                                            <span className="line-through text-gray-300">₹{variant.pricing?.originalPrice}</span>
                                        </div>
                                    </div>
                                )}

                                <Link href={`/products/${item.slug}`} className="absolute inset-0 z-10" />
                            </div>
                        </div>
                    );
                })}
            </Masonry>
        </div>
    );
}
