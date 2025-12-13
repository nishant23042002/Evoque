"use client";
import AnimatedRatingProgressBar from "@/constants/ratingBar";
import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

interface ColorVariant {
    slug: string;
    hex: string;
}

interface ClothingItem {
    image: string;
    brand: string;
    title: string;
    price: string;
    slug: string;
    colors?: ColorVariant[];
    rating: number;
}

interface MasonryProps {
    items: ClothingItem[];
}

export default function MasonryGrid({ items }: MasonryProps) {
    const breakpoints = {
        default: 7,
        1600: 6,
        1400: 5,
        1200: 4,
        900: 3,
        700: 2,
        550: 1,
    };

    const [heights] = useState<number[]>(() =>
        items.map(() => 250 + Math.floor(Math.random() * 250))
    );

    return (
        <Masonry
            breakpointCols={breakpoints}
            className="flex gap-4 w-full"
            columnClassName="masonry-column"
        >
            {items.map((item, index) => (
                <Link key={index} href={`/product/${item.slug}`} className="block">
                    <div
                        className="relative w-full mb-4 rounded-xl overflow-hidden group"
                        style={{ height: heights[index] }}
                    >
                        {/* IMAGE */}
                        <Image
                            src={item.image}
                            alt="product"
                            fill
                            className="object-cover transition-all duration-300 group-hover:scale-105"
                        />

                        {/* COLORS — NOT LINKS ANYMORE */}
                        <div className="absolute w-full flex justify-between items-center top-2 right-0 px-2">
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.colors?.map((color) => (
                                    <div
                                        key={color.slug}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.location.href = `/product/${color.slug}`;
                                        }}
                                        className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-black cursor-pointer"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                ))}
                            </div>
                            <Heart strokeWidth={0.9} />
                        </div>

                        {/* HOVER DETAILS */}
                        <div className="absolute inset-0 bg-black/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 text-white">
                            <p className="text-sm font-semibold">{item.brand}</p>
                            <p className="text-sm leading-tight tracking-tight my-1">{item.title}</p>
                            <p className="text-md font-bold">{item.price}</p>

                            {/* RATING BAR */}
                            <AnimatedRatingProgressBar average={item.rating} />
                        </div>
                    </div>
                </Link>
            ))}
        </Masonry>
    );
}
