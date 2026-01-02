"use client";
import AnimatedRatingProgressBar from "@/constants/ratingBar";
import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CometLogoLoader from "../CometLoader";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

interface ColorVariant {
    slug: string;
    hex: string;
}

interface Products {
    images: string;
    brand: string;
    productName: string;
    price: string;
    originalPrice: string;
    slug: string;
    colors?: ColorVariant[];
    rating: number;
}



export default function MasonryGrid() {
    const [items, setItems] = useState<Products[]>([]);
    const [heights, setHeights] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const breakpoints = {
        default: 5,
        1300: 4,
        1000: 3,
        800: 2,
        410: 1,
    };
    useEffect(() => {
        // Fetch products from backend API
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setItems(data);

                // Random heights for Masonry layout
                setHeights(data.map(() => 250 + Math.floor(Math.random() * 250)));
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-nowrap items-center justify-center h-[70vh]">
                <CometLogoLoader  />
            </div>
        );
    }

    if (!items.length) return <p className="text-center my-10">Loading products...</p>;

    return (
        <div>
            <div>
                <h2 className="text-center text-sm tracking-widest font-semibold text-neutral-700 my-5">
                    New And Popular
                </h2>
                <div className="mb-5">
                    <ul className="flex flex-wrap justify-center text-[11px] p-2 gap-2">
                        <li className="border border-black p-1 sm:px-3 cursor-pointer hover:bg-black hover:text-white hoverEffect">ALL</li>
                        <li className="border border-black p-1 sm:px-3 cursor-pointer hover:bg-black hover:text-white hoverEffect">SHIRTS</li>
                        <li className="border border-black p-1 sm:px-3 cursor-pointer hover:bg-black hover:text-white hoverEffect">TROUSERS</li>
                        <li className="border border-black p-1 sm:px-3 cursor-pointer hover:bg-black hover:text-white hoverEffect">T-SHIRTS</li>
                        <li className="border border-black p-1 sm:px-3 cursor-pointer hover:bg-black hover:text-white hoverEffect">JEANS</li>
                        <li className="border border-black p-1 sm:px-3 cursor-pointer hover:bg-black hover:text-white hoverEffect">SWEATERS</li>
                    </ul>
                </div>
            </div>
            <Masonry
                breakpointCols={breakpoints}
                className="flex gap-4 md:w-[90%] mx-auto"
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
                                src={item.images[0]}
                                alt="product"
                                fill
                                className="object-cover transition-all duration-300 group-hover:scale-105"
                            />

                            {/* COLORS — NOT LINKS ANYMORE */}
                            <div className="absolute w-full flex justify-between items-center top-2 right-0 px-2">
                                <div className="flex gap-1">
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
                                <Heart className="text-brand-red" strokeWidth={0.9} />
                            </div>

                            {/* HOVER DETAILS */}
                            <div className="absolute inset-0 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end text-white">
                                <div className="text-[12px] bg-black/20 sm:bg-black/20 w-full p-2">
                                    <p className="font-semibold">{item.brand}</p>
                                    <p className="leading-tight tracking-tight my-1">{item.productName}</p>
                                    <p className="font-bold">{item.price}  <span className="decoration-red-500 ml-2 line-through">{item.originalPrice}</span></p>
                                    {/* RATING BAR */}
                                    <AnimatedRatingProgressBar average={item.rating} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </Masonry>
        </div>
    );
}
