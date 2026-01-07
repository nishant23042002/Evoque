"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import CometLogoLoader from "../FlashLogo/EvoqueLoader";

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
        default: 5,
        1200: 4,
        1000: 3,
        750: 2,
        550: 2,
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
                <CometLogoLoader />
            </div>
        );
    }


    return (
        <section className="px-2 w-full flex flex-col justify-center mb-12 py-16">
            {/* Heading */}
            <h2 className="text-center text-sm tracking-widest font-semibold text-neutral-700 mb-3">
                FEATURED CATEGORIES
            </h2>

            {/* Pinterest Grid */}
            <Masonry breakpointCols={breakpoints}
                className="flex gap-2 w-full"
                columnClassName="masonry-column"
            >
                {categories.map((item, index) => (
                    <Link
                        href={`/categories/${item.slug}`}
                        key={index}
                        className="mb-2 block break-inside-avoid"
                    >
                        <div className="group h-80 relative rounded-sm overflow-hidden bg-neutral-100">
                            {/* Image */}
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="
                                            w-full object-cover
                                            transition-transform duration-500
                                            group-hover:scale-105
                                            "
                            />

                            {/* Dark overlay */}
                            <div
                                className="
                                        absolute inset-0
                                        bg-black/15
                                        opacity-0
                                        group-hover:opacity-100
                                        transition-opacity duration-300
                                        "
                            />

                            {/* Tag */}
                            {item.name && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2     
        z-10 text-white text-sm bg-black/50 font-extrabold px-3 py-1 rounded-sm">
                                    <span>{item.name}</span>
                                </div>
                            )}

                        </div>
                    </Link>
                ))}
            </Masonry>
        </section>
    );
};

export default FeaturedCategories;
