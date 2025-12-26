"use client";

import CategoryCircles from "@/components/Category"
import { trousersCategories } from "@/constants/categoryItems"
import AnimatedRatingProgressBar from "@/constants/ratingBar";
import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });
import { clothingItems } from "@/data/clothingItems";

const Trousers = () => {
    const breakpoints = {
        default: 6,
        1300: 5,
        1100: 4,
        900: 3,
        650: 2,
        430: 1,
    };

    const [heights] = useState<number[]>(() =>
        clothingItems.map(() => 250 + Math.floor(Math.random() * 250))
    );

    return (
        <div className="max-[768px]:ml-17 ml-19 mr-2">
            <CategoryCircles
                title="ALL TROUSERS"
                categories={trousersCategories}
            />
            <div>
                <Masonry
                    breakpointCols={breakpoints}
                    className="flex gap-4 md:w-[90%] mx-auto"
                    columnClassName="masonry-column"
                >
                    {clothingItems.map((item, index) => (
                        <Link key={index} href={`/product/${item.slug}`} className="block">
                            <div
                                className="relative w-full my-4 rounded-xl overflow-hidden group"
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
                                    <div className="flex gap-1 opacity-100 transition-opacity duration-300">
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
                                <div className="absolute inset-0 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end text-white">
                                    <div className="bg-black/10 sm:bg-black/20 w-full p-2">
                                        <p className="text-sm font-semibold">{item.brand}</p>
                                        <p className="text-sm leading-tight tracking-tight my-1">{item.title}</p>
                                        <p className="text-md font-bold">{item.price}</p>
                                        {/* RATING BAR */}
                                        <AnimatedRatingProgressBar average={item.rating} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </Masonry>

            </div>
        </div>
    )
}

export default Trousers