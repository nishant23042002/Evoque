"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import axios from "axios";
import { Category } from "@/types/ProductTypes";
import LayerLogo from "../FlashLogo/LayerLogo";
import { ArrowRight } from "lucide-react";

export interface FeaturedCategoryProduct {
    category: {
        _id: string;
        name: string;
        slug: string;
        image: string;
    };
    product: {
        _id: string;
        productName: string;
        slug: string;
        pricing?: {
            price: number;
            originalPrice?: number;
        };
        thumbnail: string
    } | null;
}

const FeaturedCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredWithProducts, setFeaturedWithProducts] = useState<FeaturedCategoryProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const breakpoints = {
        default: 5,
        450: 3
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

    useEffect(() => {
        async function fetchFeaturedProducts() {
            try {
                const res = await axios.get("/api/categories/featured-with-product");
                setFeaturedWithProducts(res.data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-nowrap items-center justify-center h-[70vh]">
                <LayerLogo />
            </div>
        );
    }

    return (
        <section className="w-full my-2 mb-6 mx-auto flex flex-col justify-center ">
            <div className="flex px-4 py-3 justify-between items-center">
                {/* Heading */}
                <h2 className="text-md uppercase tracking-widest font-light font-poppins text-foreground">
                    New In
                </h2>
                <Link href="/new-arrivals"><ArrowRight className="hover:text-black/60" size={24} /></Link>
            </div>

            {/* Fallback */}


            {categories.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <h2 className="text-center text-sm tracking-widest font-semibold font-poppins text-(--text-muted)">
                        Dropping Soon...
                    </h2>
                </div>
            ) : (
                <>
                    {/* DESKTOP — MASONRY */}
                    {/* FEATURED PRODUCTS PER CATEGORY */}
                    <div>
                        <Masonry
                            breakpointCols={breakpoints}
                            className="flex w-full"
                            columnClassName="masonry-column"
                        >
                            {featuredWithProducts.map((item) => {
                                if (!item.product) return null;

                                const primaryImage = item.product.thumbnail;

                                return (
                                    <div key={item.category.slug}>

                                        {/* Product */}
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="group block"
                                        >
                                            <div className="relative aspect-5/7 overflow-hidden">
                                                <Image
                                                    src={primaryImage}
                                                    alt={item.product.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="hidden md:block absolute inset-0 bg-(--earth-charcoal) opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </Masonry>
                    </div>
                    
                    <div className="w-full flex justify-center items-center">
                        <div className="grid grid-cols-2 w-full xl:w-[55%]">
                            {categories.map((item) => (
                                <Link
                                    href={`/categories/${item.slug}`}
                                    key={item._id}
                                    className="group block break-inside-avoid"
                                >
                                    <div
                                        className="                                   
                                            group relative aspect-12/21
                                            overflow-hidden
                                            transition-all duration-300
                                            "
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />

                                    <div className="hidden md:block absolute inset-0 bg-(--earth-charcoal) opacity-0 group-hover:opacity-15 transition-opacity duration-300" />
                                    </div>
                                    <div className="flex max-xl:px-4 py-3 flex-col justify-between mb-4">
                                        <h3 className="text-[17px] flex  flex-wrap group-hover:underline font-light uppercase tracking-tight">
                                            {item.name}
                                        </h3>

                                        <span
                                            className="text-xs tracking-wide font-light"
                                        >
                                            Explore
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}

        </section>
    );
};

export default FeaturedCategories;
