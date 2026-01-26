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
        default: 5,
        1300: 4,
        1000: 3,
        750: 3,
        550: 2,
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
        <section className="px-2 w-full my-4 md:my-10 mx-auto flex flex-col justify-center ">
            {/* Heading */}
            <h2 className="py-3 text-center text-md tracking-widest font-semibold font-poppins text-foreground">
                Your Wardrobe Starts Here
            </h2>

            {/* Fallback */}
            {categories.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <h2 className="text-center text-sm tracking-widest font-semibold font-poppins text-(--text-muted)">
                        Dropping Soon...
                    </h2>
                </div>
            ) : (
                <Masonry
                    breakpointCols={breakpoints}
                    className="flex gap-2 w-full"
                    columnClassName="masonry-column"
                >
                    {categories.map((item) => (
                        <Link
                            href={`/categories/${item.slug}`}
                            key={item._id}
                            className="mb-2 block break-inside-avoid"
                        >
                            <div
                                className="border border-(--border-light)
                                    group h-80 relative
                                    rounded-[3px]
                                    overflow-hidden
                                    bg-(--linen-100)                        
                                    transition-all duration-300
                                "
                            >
                                {/* Image */}
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="
                                        w-full object-cover object-center
                                        transition-transform duration-500
                                        group-hover:scale-105
                                    "
                                />

                                {/* Linen overlay */}
                                <div
                                    className="
                                        absolute inset-0
                                        bg-(--earth-charcoal)
                                        opacity-0
                                        group-hover:opacity-15
                                        transition-opacity duration-300
                                    "
                                />

                                {/* Category label */}
                                <div
                                    className="
                                        absolute -bottom-px z-10 w-full
                                        bg-primary
                                        backdrop-blur-[1px]
                                        border-t border-(--border-strong)
                                        text-center px-2 py-1
                                    "
                                >
                                    <span className="text-xs font-semibold tracking-wide text-primary-foreground">
                                        {item.name}
                                    </span>
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
