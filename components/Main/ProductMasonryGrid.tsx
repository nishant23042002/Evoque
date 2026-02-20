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


function getSmartAspectRatio(seed: string, category?: string) {
    const lower = category?.toLowerCase() || "";

    let ratios: string[] = [
        "4/5",
        "3/4",
        "2/3",
        "5/6",
        "9/10",
        "3/5"
    ]; // default

    // -------- PRIORITY MATCHES --------
    if (/\bt[-\s]?shirts\b/.test(lower)) {
        // t-shirt or tshirt
        ratios = ["2/2"]; // more square
    }
    else if (/\bshirts\b/.test(lower)) {
        // only shirt, not t-shirt
        ratios = ["5/7"]; // medium
    }
    else if (/\bsweatshirts|jackets\b/.test(lower)) {
        ratios = ["4/6"];
    }
    else if (/\bshorts\b/.test(lower)) {
        ratios = ["3/3"];
    }
    else if (/\bjeans|trousers|sweatpants\b/.test(lower)) {
        ratios = ["5/8"]; // tall
    }
    else if (/\bfootwear\b/.test(lower)) {
        ratios = ["1/1", "2/2"];
    }

    // -------- HASH RANDOMIZER --------
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }

    return ratios[Math.abs(hash) % ratios.length];
}


/* =======================
   COMPONENT
======================= */

export default function ProductMasonryGrid({
    products,
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
    const breakpoints = { default: 4, 1200: 3, 750: 2 };



    return (
        <div className={`my-2 ${fullWidth ? "" : "w-full"}`}>

            <Masonry
                breakpointCols={breakpoints}
                className={`flex ${!fullWidth ? "" : "mx-0"}`}
                columnClassName="masonry-column"
            >
                {products.map((item) => {
                    const variant = hoverVariants[item._id] ?? item.variants[0];
                    const primary = getPrimaryImageFromVariant(variant);
                    const secondary = getSecondaryImageFromVariant(variant);
                    const isWishlisted = wishlistIds.has(item._id);
                    const isColorHovering = !!hoverVariants[item._id];
                    const ratio = getSmartAspectRatio(
                        item._id,
                        item.subCategory?.slug || item.category?.slug
                    );


                    return (
                        <div key={item._id} className="mb-1">

                            <div className="flex flex-col w-full">

                                <div
                                    onMouseEnter={() => onCardEnter(item._id)}
                                    onMouseLeave={() => onCardLeave(item._id)}
                                    className="relative w-full overflow-hidden group"
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




                                    {/* COLOR DOTS & WISHLIST */}
                                    <div className="absolute w-full flex justify-between items-center top-1 px-2 z-20">
                                        <div className="hidden sm:flex gap-0.5">
                                            {item.variants.map((v) => (
                                                <span
                                                    key={v.color.slug}
                                                    className={`w-5 h-4 border border-(--border-strong) cursor-pointer ${v.color.slug === variant.color.slug
                                                        ? "ring-1 ring-ring border-primary"
                                                        : "border-(--border-light)"
                                                        }`}
                                                    style={{ backgroundColor: v.color.hex }}
                                                    onMouseEnter={() => onVariantHover(item._id, v)}
                                                    onMouseLeave={() => onVariantHover(item._id, undefined)}
                                                />
                                            ))}
                                        </div>

                                        {/* Mobile → Limit to 3 */}
                                        <div className="flex sm:hidden gap-0.5">
                                            {item.variants.slice(0, 3).map((v) => (
                                                <span
                                                    key={v.color.slug}
                                                    className={`w-5 h-4 border cursor-pointer ${v.color.slug === variant.color.slug
                                                            ? "ring-1 ring-ring border-primary"
                                                            : "border-(--border-light)"
                                                        }`}
                                                    style={{ backgroundColor: v.color.hex }}
                                                    onMouseEnter={() => onVariantHover(item._id, v)}
                                                    onMouseLeave={() => onVariantHover(item._id, undefined)}
                                                />
                                            ))}

                                            {item.variants.length > 3 && (
                                                <span className="text-[10px] font-medium px-1 h-4 flex items-center justify-center border border-(--border-light) bg-white">
                                                    +{item.variants.length - 3}
                                                </span>
                                            )}
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
                                            className=""
                                        >
                                            <Heart
                                                strokeWidth={1.4}
                                                className="cursor-pointer z-99 h-7 w-7 transition-all duration-200"
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
                                    <div className="absolute bg-black text-white p-0.5 px-1 bottom-0">
                                        <p className="text-xs">-{item.pricing.discountPercentage}%</p>
                                    </div>

                                    <Link href={`/products/${item.slug}`} className="absolute inset-0 z-10" />
                                </div>

                                {/* DETAILS */}
                                <div className="py-2 px-1 flex flex-col justify-center w-full pointer-events-none">
                                    <p className="text-primary max-[360px]:text-[10px] text-xs sm:text-sm font-medium">{item.brand}</p>
                                    <p className="text-xs max-[360px]:text-[12px] uppercase truncate sm:text-sm font-extralight">{item.productName}</p>
                                    <div className="flex gap-1 items-center text-sm w-full">
                                        <span className="max-[360px]:text-[11px] font-semibold text-red-600">Rs.{variant.pricing?.price}</span>
                                        <span className="max-[360px]:text-[10px] line-through font-extralight">Rs.{variant.pricing?.originalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Masonry>
        </div>
    );
}  