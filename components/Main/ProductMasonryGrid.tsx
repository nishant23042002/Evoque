"use client";

import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo } from "react";
import RatingBar from "@/constants/ratingBar";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectWishlistIds } from "@/store/wishlist/wishlist.selector";
import { addWishlistItem, removeWishlistItem } from "@/store/wishlist/wishlist.thunks";
import { useAuth } from "../AuthProvider";
import Product from "@/types/ProductTypes";
import { useProductHoverImage } from "@/src/useProductHoverImage";
import { getPrimaryImageFromVariant, getSecondaryImageFromVariant } from "@/lib/productImage";
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
    const {
        hoveredCard,
        hoverVariants,
        transitioning,
        onCardEnter,
        onCardLeave,
        onVariantHover,
    } = useProductHoverImage();

    const { isAuthenticated, loading, openLogin } = useAuth();
    const wishlistIds = useAppSelector(selectWishlistIds);
    const dispatch = useAppDispatch();

    /* -------------------------
       MASONRY BREAKPOINTS
    ------------------------- */
    const breakpoints = { default: 5, 1600: 4, 1200: 3, 750: 2, 400: 1 };

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
        <div className={`my-2 ${fullWidth ? "px-1 sm:px-2 mx-auto" : "w-full"}`}>
            {showHeading && (
                <h2 className="text-center py-3 text-md tracking-widest font-semibold font-poppins text-foreground">
                    Everything You Need
                </h2>
            )}

            <Masonry
                breakpointCols={breakpoints}
                className={`flex gap-1 sm:gap-2 ${!fullWidth ? "mx-1 sm:mx-2" : "mx-0"}`}
                columnClassName="masonry-column"
            >
                {products.map((item, index) => {
                    const variant = hoverVariants[item._id] ?? item.variants[0];
                    const primary = getPrimaryImageFromVariant(variant);
                    const secondary = getSecondaryImageFromVariant(variant);
                    const isWishlisted = wishlistIds.has(item._id);
                    const isColorHovering = !!hoverVariants[item._id];

                    return (
                        <div key={item._id}>
                            <div
                                onMouseEnter={() => onCardEnter(item._id)}
                                onMouseLeave={() => onCardLeave(item._id)}
                                className="border border-(--border-light) relative mb-1 sm:mb-2 drop-shadow-xs fade-in-75 transition-all duration-300 rounded-[2px] overflow-hidden group cursor-pointer bg-(--card-bg)"
                                style={{ height: heights[index] }}
                            >
                                {/* IMAGE */}
                                <div
                                    className={`absolute inset-0 transition-opacity duration-300 ${transitioning === item._id ? "opacity-0" : "opacity-100"
                                        }`}
                                >
                                    {/* PRIMARY IMAGE — ALWAYS */}
                                    <Image
                                        src={primary}
                                        alt={item.productName}
                                        fill
                                        sizes="(max-width: 400px) 100vw, (max-width: 700px) 50vw, (max-width: 1000px) 33vw, (max-width: 1300px) 25vw, 20vw"
                                        className={`object-cover duration-500 object-center transition-opacity ${hoveredCard === item._id && secondary && !isColorHovering
                                            ? "opacity-0"
                                            : "opacity-100"
                                            }`}

                                    />

                                    {/* SECONDARY IMAGE — ONLY ON CARD HOVER */}
                                    {secondary && hoveredCard === item._id && !isColorHovering && (
                                        <Image
                                            src={secondary}
                                            alt="secondary"
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>


                                <div className="absolute inset-0 bg-(--earth-charcoal)/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* COLOR DOTS & WISHLIST */}
                                <div className="absolute w-full flex justify-between items-center top-1 px-2 z-20">
                                    <div className="flex gap-0.5">
                                        {item.variants.map((v) => (
                                            <span
                                                key={v.color.slug}
                                                className={`w-5 h-4 rounded-[2px] border border-(--border-strong) cursor-pointer ${v.color.slug === variant.color.slug
                                                    ? "ring-1 ring-ring border-primary"
                                                    : "border-(--border-light)"
                                                    }`}
                                                style={{ backgroundColor: v.color.hex }}
                                                onMouseEnter={() => onVariantHover(item._id, v)}
                                                onMouseLeave={() => onVariantHover(item._id, undefined)}
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
                                                        product: item,
                                                        slug: item.slug,
                                                        name: item.productName,
                                                        image: primary,
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


                                {/* DETAILS */}
                                <div className="bg-black/30 py-2 absolute bottom-0 text-white flex flex-col justify-center w-full pointer-events-none">
                                    <div className="mx-2">
                                        <p className="text-xs sm:text-sm font-light">{item.brand}</p>
                                        <p className="text-xs sm:text-sm font-medium">{item.productName}</p>
                                        <div className="flex gap-3 items-center text-sm w-full">
                                            <span className="font-medium">₹ {variant.pricing?.price}</span>
                                            <span className="line-through text-xs font-extralight text-gray-300">₹{variant.pricing?.originalPrice}</span>
                                        </div>
                                    </div>
                                </div>


                                <Link href={`/products/${item.slug}`} className="absolute inset-0 z-10" />
                            </div>
                        </div>
                    );
                })}
            </Masonry>
        </div>
    );
}  