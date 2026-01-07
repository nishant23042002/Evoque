"use client";
import AnimatedRatingProgressBar from "@/constants/ratingBar";
import { Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import EvoqueLogoLoader from "../FlashLogo/EvoqueLoader";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

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
    sizes: SizeVariant[];
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

interface Products {
    productName: string;
    slug: string;
    brand: string;
    category: string;
    fit: string;
    pricing: Pricing;
    rating: number;
    variants: Variant[];
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
        550: 2,
    };

    const getPrimaryImage = (variants: Variant[]) => {
        const images = variants?.[0]?.color?.images;

        if (!images || images.length === 0) return "/placeholder.png";

        return images.find(img => img.isPrimary)?.url || images[0].url;
    };


    console.log(items);

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

    useEffect(() => {
        document.body.style.overflow = loading ? "hidden" : "auto";
    }, [loading]);


    if (loading) {
        return (
            <div className="flex flex-nowrap items-center justify-center h-[70vh]">
                <EvoqueLogoLoader />
            </div>
        );
    }

    if (!items.length) return <p className="text-center my-10">Loading products...</p>;

    return (
        <div className="mt-18 px-2">
            <div className="">
                <h2 className="text-center text-sm tracking-widest font-semibold text-neutral-700">
                    New And Popular
                </h2>
                <div>
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
                className="flex gap-2 pt-4"
                columnClassName="masonry-column"
            >
                {items.map((item, index) => {
                    const colors = item.variants.map(v => v.color);

                    return (
                        <Link key={index} href={`/products/${item.slug}`} className="block">
                            <div
                                className="relative w-full mb-2 rounded-sm overflow-hidden group"
                                style={{ height: heights[index] }}
                            >
                                {/* IMAGE */}
                                <Image
                                    src={getPrimaryImage(item.variants)}
                                    alt={item.productName}
                                    fill
                                    className="object-cover transition-all duration-300 group-hover:scale-105"
                                />

                                {/* COLORS — NOT LINKS ANYMORE */}
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
                                    <Heart className="text-brand-red" strokeWidth={0.9} />
                                </div>

                                {/* HOVER DETAILS */}
                                <div className="absolute inset-0 cursor-pointer opacity-100 min-[550px]:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end text-white">
                                    <div className="text-[12px] bg-black/75 sm:bg-black/40 w-full px-1 py-3">
                                        <p className="font-semibold">{item.brand}</p>
                                        <p className="leading-tight tracking-tight my-1">{item.productName}</p>
                                        <p className="font-bold">{item.pricing.price}  <span className="decoration-red-500 ml-2 line-through">{item.pricing.originalPrice}</span></p>
                                        {/* RATING BAR */}
                                        <AnimatedRatingProgressBar average={item.rating} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </Masonry>
        </div >
    );
}
