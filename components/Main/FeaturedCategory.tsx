"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import axios from "axios";
import { Category } from "@/types/ProductTypes";
import LayerLogo from "../FlashLogo/LayerLogo";



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
                const res = await axios.get<Category[]>("/api/categories");
                setCategories(res.data);
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
                <LayerLogo />
            </div>
        );
    }

    return (
        <section className="px-1 w-full my-2 mb-6 mx-auto flex flex-col justify-center ">
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
                <>
                    {/* MOBILE — HORIZONTAL SCROLL */}
                    <div className="md:hidden flex gap-1  overflow-x-auto pb-1 custom-scrollbar">
                        {categories.map((item) => (
                            <Link
                                href={`/categories/${item.slug}`}
                                key={item._id}
                                className="min-w-[49.5%] shrink-0"
                            >
                                <div
                                    className="
                                        border border-(--border-light)
                                        group relative aspect-3/5 min-[470px]:aspect-4/6
                                        rounded-[3px]
                                        overflow-hidden
                                        bg-(--linen-100)
                                        transition-all duration-300
                                        "
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-(--earth-charcoal) opacity-0 group-hover:opacity-15 transition-opacity duration-300" />

                                    <div className="absolute -bottom-px z-10 w-full bg-primary border-t border-(--border-strong) text-center px-2 py-1">
                                        <span className="text-xs font-semibold tracking-wide text-primary-foreground">
                                            {item.name}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* DESKTOP — MASONRY */}
                    <div className="hidden md:block">
                        <Masonry
                            breakpointCols={breakpoints}
                            className="flex gap-1 w-full"
                            columnClassName="masonry-column"
                        >
                            {categories.map((item) => (
                                <Link
                                    href={`/categories/${item.slug}`}
                                    key={item._id}
                                    className="mb-1 block break-inside-avoid"
                                >
                                    <div
                                        className="
                                            border 
                                            group relative aspect-4/5
                                            overflow-hidden
                                            bg-(--linen-100)
                                            transition-all duration-300
                                            "
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        <div className="absolute inset-0 bg-(--earth-charcoal) opacity-0 group-hover:opacity-15 transition-opacity duration-300" />

                                        <div className="absolute bottom-0 z-10 w-full bg-(--linen-100) border-t text-center px-2 py-1">
                                            <span className="text-xs font-semibold tracking-wide text-primary">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </Masonry>
                    </div>
                </>
            )}

        </section>
    );
};

export default FeaturedCategories;
