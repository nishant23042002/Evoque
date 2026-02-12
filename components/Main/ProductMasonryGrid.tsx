"use client";

import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectWishlistIds } from "@/store/wishlist/wishlist.selector";
import { addWishlistItem, removeWishlistItem } from "@/store/wishlist/wishlist.thunks";
import { useAuth } from "../AuthProvider";
import Product from "@/types/ProductTypes";
import { useProductHoverImage } from "@/src/useProductHoverImage";
import { getPrimaryImageFromVariant, getSecondaryImageFromVariant } from "@/lib/productImage";
import { showProductToast } from "@/store/ui/ui.slice";
const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });





interface ProductMasonryGridProps {
    products: Product[];
    showHeading?: boolean;
    fullWidth?: boolean;
}
const RATIOS = [
    "4/5",
    "3/4",
    "2/3",
    "5/6",
    "9/10",
    "3/5"];
function getAspectRatio(seed: string) {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0; // convert to 32bit int
    }

    return RATIOS[Math.abs(hash) % RATIOS.length];
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
    const breakpoints = { default: 5, 1600: 4, 1200: 3, 750: 2, 370: 1 };




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
                {products.map((item) => {
                    const variant = hoverVariants[item._id] ?? item.variants[0];
                    const primary = getPrimaryImageFromVariant(variant);
                    const secondary = getSecondaryImageFromVariant(variant);
                    const isWishlisted = wishlistIds.has(item._id);
                    const isColorHovering = !!hoverVariants[item._id];
                    const ratio = getAspectRatio(item._id);

                    return (
                        <div key={item._id}>
                            <div
                                onMouseEnter={() => onCardEnter(item._id)}
                                onMouseLeave={() => onCardLeave(item._id)}
                                className="relative mb-2 w-full overflow-hidden rounded-[2px] group bg-(--card-bg)"
                                style={{ aspectRatio: ratio }}
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
                                                dispatch(showProductToast({
                                                    name: item.productName,
                                                    image: primary,
                                                    type: "wishlist-remove"
                                                }));
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
                                                dispatch(showProductToast({
                                                    name: item.productName,
                                                    image: primary,
                                                    type: "wishlist"
                                                }));
                                            }
                                        }}
                                        className="p-1.5 border border-(--border-light) cursor-pointer rounded-full bg-secondary/50 shadow z-30"
                                    >
                                        <Heart
                                            strokeWidth={0.9}
                                            className="h-5 w-5 transition-all duration-200"
                                            style={
                                                isWishlisted
                                                    ? {
                                                        fill: variant?.color?.hex || "#000", // inside color
                                                        stroke: "var(--border-strong)", // border color (always visible)
                                                        transform: "scale(1.1)",
                                                    }
                                                    : {
                                                        fill: "transparent",
                                                        stroke: "var(--border-strong)",
                                                    }
                                            }
                                        />
                                    </button>
                                </div>


                                {/* DETAILS */}
                                <div className="bg-black/30 py-2 absolute bottom-0 text-white flex flex-col justify-center w-full pointer-events-none">
                                    <div className="mx-2">
                                        <p className="text-xs sm:text-sm font-light">{item.brand}</p>
                                        <p className="text-xs truncate sm:text-sm font-medium">{item.productName}</p>
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