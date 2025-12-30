"use client";

import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface Category {
    title: string;
    image: string;
    href: string;
    tag?: string;
}


const categories: Category[] = [
    {
        title: "Shirts",
        image: "/images/shirts.jpg",
        href: "/product-category/shirts",
    },
    {
        title: "Jackets",
        image: "/images/jackets.jpg",
        href: "/product-category/jackets",
    },
    {
        title: "T-Shirts",
        image: "/images/t-shirt.jpg",
        href: "/product-category/t-shirts",
    },
    {
        title: "Hoodies",
        image: "/images/hoodies.jpg",
        href: "/product-category/hoodies",
    },
    {
        title: "Trousers",
        image: "/images/trousers.jpg",
        href: "/product-category/trousers",
    },
    {
        title: "Jeans",
        image: "/images/jeans.jpg",
        href: "/product-category/jeans",
    },
    {
        title: "Essentials",
        image: "/images/essentials.jpg",
        href: "/product-category/essentials",
    },
    {
        title: "Limited Drop",
        image: "/images/limited-drops.png",
        href: "/product-category/limited-drops",
    },
];

const FeaturedCategories = () => {
    const breakpoints = {
        default: 4,
        1200: 4,
        1000: 3,
        750: 2,
        550: 1,
    };
    return (
        <section className="w-full flex flex-col justify-center py-10">
            {/* Heading */}
            <h2 className="text-center text-sm tracking-widest font-semibold text-neutral-700 mb-10">
                FEATURED CATEGORIES
            </h2>

            {/* Pinterest Grid */}
            <Masonry breakpointCols={breakpoints}
                className="mx-auto flex gap-4 w-full md:w-[90%]"
                columnClassName="masonry-column"
            >
                {categories.map((item, index) => (
                    <Link
                        href={item.href}
                        key={index}
                        className="mb-4 block break-inside-avoid"
                    >
                        <div className="group h-80 relative overflow-hidden rounded-xl bg-neutral-100">
                            {/* Image */}
                            <Image
                                src={item.image}
                                alt={item.title}
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
                            {item.tag && (
                                <div className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
                                    {item.tag}
                                </div>
                            )}

                            {/* Title */}
                            <div
                                className="
                                        absolute top-4 left-4 right-4
                                        text-white
                                        opacity-100
                                        "
                            >
                                <h3 className="text-sm font-semibold tracking-wide">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </Masonry>
        </section>
    );
};

export default FeaturedCategories;
