"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import LayerLogoLoader from "../FlashLogo/LayerLogo";

interface Category {
    name: string;
    image: string;
    slug: string;
    _id: string;
}



const FeaturedCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);


    const breakpoints = {
        default: 6,
        1450: 5,
        1200: 4,
        1000: 3,
        750: 3,
        550:2,
        350: 1,
    };

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-nowrap items-center justify-center h-[70vh]">
                <LayerLogoLoader />
            </div>
        );
    }


    return (
        <section className="max-md:px-2 py-2 w-full md:w-[85%] mx-auto flex flex-col justify-center my-8">
            {/* Heading */}
            <h2 className="py-3 text-center text-md tracking-widest font-semibold font-poppins text-slate-800">
                Your Wardrobe Starts Here
            </h2>

            {/* Fallback */}
            {categories.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-neutral-500 text-sm tracking-wide">
                    <h2 className="text-center text-sm tracking-widest font-semibold font-poppins text-neutral-700 mb-1.5">
                        Dropping Soon...
                    </h2>
                </div>
            ) : (
                <Masonry
                    breakpointCols={breakpoints}
                    className="flex gap-2 md:gap-4 w-full"
                    columnClassName="masonry-column"
                >
                    {categories.map((item) => (
                        <Link
                            href={`/categories/${item.slug}`}
                            key={item._id}
                            className="mb-2 md:mb-4 block break-inside-avoid"
                        >
                            <div className="group h-80 relative rounded-[3px] drop-shadow-sm overflow-hidden bg-neutral-100">
                                {/* Image */}
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Tag */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-slate-800 text-sm bg-white/50 font-semibold tracking-wider px-2 py-0.5 rounded-sm">
                                    {item.name}
                                </div>
                            </div>
                        </Link>
                    ))}
                </Masonry>
            )}
        </section>
    );
};

export default FeaturedCategories;