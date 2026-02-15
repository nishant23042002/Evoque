"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Variant } from "@/types/ProductTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductHoverImage } from "@/src/useProductHoverImage";
import { getPrimaryImageFromVariant, getSecondaryImageFromVariant } from "@/lib/productImage";


export type ProductCard = {
    _id: string;
    slug: string;
    productName: string;
    price: number;
    image: string;
    variants?: Variant[];
};

interface Props {
    title?: string;
    products: ProductCard[];
}


export default function ProductHorizontalScroller({
    title,
    products,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const {
        hoveredCard,
        hoverVariants,
        onCardEnter,
        onCardLeave,
    } = useProductHoverImage();



    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const width = el.clientWidth;
        el.scrollBy({
            left: dir === "left" ? -width * 0.8 : width * 0.8,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        updateScrollButtons(); // initial check

        const el = scrollRef.current;
        if (!el) return;

        // update buttons on scroll
        const onScroll = () => updateScrollButtons();
        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [products]);

    if (!products?.length) return null;

    return (
        <section className="relative w-full pt-20 px-1">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                {title && (
                    <h2 className="text-2xl font-light tracking-wide">
                        {title}
                    </h2>
                )}

                {/* DESKTOP ARROWS */}
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`
                            p-2 transition
                            ${canScrollLeft ? "cursor-pointer" : "cursor-not-allowed"}
                        `}
                    >
                        <ChevronLeft className={`${canScrollLeft ? "text-primary " : "text-gray-400"}`} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`
                            p-2 transition
                            ${canScrollRight ? "cursor-pointer" : "cursor-not-allowed"}
                        `}
                    >
                        <ChevronRight className={`${canScrollRight ? "text-primary" : "text-gray-400"}`} />
                    </button>
                </div>
            </div>

            {/* ROW */}
            <div
                ref={scrollRef}
                className="
                            flex gap-1
                            overflow-x-auto
                            snap-x snap-mandatory
                            scrollbar-hide
                            pb-2
                            "
            >
                {products.map((item) => {
                    const hasVariants = item.variants && item.variants.length > 0;

                    const variant = hasVariants
                        ? hoverVariants[item._id] ?? item.variants![0]
                        : null;

                    const primary = variant
                        ? getPrimaryImageFromVariant(variant)
                        : item.image;

                    const secondary = variant
                        ? getSecondaryImageFromVariant(variant)
                        : null;


                    return (
                        <Link
                            key={item._id}
                            href={`/products/${item.slug}`}
                            className="
                                shrink-0
                                w-50
                                sm:w-65
                                md:w-75
                                lg:w-90
                                snap-start
                                group
                            "
                        >

                            {/* IMAGE */}
                            <div
                                onMouseEnter={() => hasVariants && onCardEnter(item._id)}
                                onMouseLeave={() => hasVariants && onCardLeave(item._id)}
                                className="relative aspect-3/4 sm:aspect-2/3 md:aspect-3/4 lg:aspect-4/6 overflow-hidden rounded-[3px] border border-(--border-light) bg-card">
                                <Image
                                    src={primary}
                                    alt={item.productName}
                                    fill
                                    className={`object-cover transition-opacity duration-300 ${hoveredCard === item._id && secondary ? "opacity-0" : "opacity-100"
                                        }`}
                                />
                                {secondary && hoveredCard === item._id && (
                                    <Image
                                        src={secondary}
                                        alt="secondary"
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                <span className="absolute bottom-0 py-1 text-xs bg-black text-white px-1.5">-{variant?.pricing?.discountPercentage}%</span>
                            </div>

                            {/* INFO */}
                            <div className="mt-2 text-sm">
                                <p className="font-light uppercase truncate">
                                    {item.productName}
                                </p>

                                <div className="flex gap-2 items-center">
                                    <p className="text-red-600 font-semibold">
                                        Rs.{item.price}
                                    </p>
                                    <span className="line-through text-xs">Rs.{variant?.pricing?.originalPrice}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
