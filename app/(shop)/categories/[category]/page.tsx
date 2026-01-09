"use client";

import EvoqueLogoLoader from "@/components/FlashLogo/EvoqueLoader";
import BannerSlider from "@/components/Main/Banner";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* ---------------- TYPES ---------------- */

interface SubCategory {
    name: string;
    slug: string;
    image: string;
    isActive: boolean;
}

interface Pricing {
    price: number;
    originalPrice: number;
    discountPercentage: number;
    currency: string;
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

export interface Product {
    _id: string;
    productName: string;
    slug: string;
    brand: string;
    category: string;
    pricing: Pricing;
    rating: number;
    variants: Variant[];
    subCategory?: {
        slug: string;
    };
}


/* ---------------- COMPONENT ---------------- */

const ProductCategoryPage = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);


    const pathname = usePathname();
    const searchParams = useSearchParams();

    const categorySlug = pathname.split("/").pop();
    const activeSub = searchParams.get("sub") || "";

    //Sub-Category 
    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await fetch(`/api/categories/${categorySlug}`);
                const data = await res.json();
                console.log(data);

                setSubCategories(
                    (data.category.subCategories || []).filter(
                        (s: SubCategory) => s.isActive
                    )
                );
                setProducts(data.products || []);
            } catch (err) {
                console.error("Failed to fetch subCategories", err);
            } finally {
                setLoading(false);
            }
        }

        if (categorySlug) fetchCategory();
    }, [categorySlug]);

    const filteredProducts = useMemo(() => {
        if (!activeSub) return products;

        return products.filter(
            (p) => p.subCategory?.slug === activeSub
        );
    }, [products, activeSub]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <EvoqueLogoLoader />
            </div>
        );
    }

    return (
        <section>
            <div className="mx-auto">
                <Image className="w-full h-90 md:h-140 sm:object-cover" alt="" src={'/images/banner-shirt.png'} width={800} height={600} />
            </div>
            
            <div className="md:w-[50%] mx-auto mt-4">
                <div className="mx-2 px-0.5 flex flex-nowrap overflow-auto items-center sm:justify-center gap-2 py-1 scrollbar-hide">
                    {/* ALL */}
                    <Link
                        href={`/categories/${categorySlug}`}
                        scroll={false}
                        className="flex flex-col items-center min-w-20"
                    >
                        <div
                            className={clsx(
                                "w-20 h-25 mx-1 rounded-sm overflow-hidden border",
                                !activeSub
                                    ? "border-brand-red ring-1 ring-brand-red"
                                    : "border-2 border-accent-rose hover:border-brand-red"
                            )}
                        >
                            <Image
                                src="/images/all-shirts.png"
                                alt="All"
                                width={80}
                                height={80}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <span
                            className={clsx(
                                "mt-1 text-[11px] font-extralight",
                                !activeSub ? "text-brand-red" : "text-slate-800"
                            )}
                        >
                            All <span>{categorySlug}</span>
                        </span>

                    </Link>

                    {/* SUB CATEGORIES */}
                    {subCategories.map((item) => {
                        const isActive = activeSub === item.slug;

                        return (
                            <Link
                                key={item.slug}
                                href={`/categories/${categorySlug}?sub=${item.slug}`}
                                scroll={false}
                                className="flex flex-col items-center min-w-20"
                            >
                                <div
                                    className={clsx(
                                        "w-20 h-25 overflow-hidden rounded-sm border transition-all",
                                        isActive
                                            ? "border-brand-red ring-1 ring-brand-red"
                                            : "border-2 border-accent-rose hover:border-brand-red"
                                    )}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                <span
                                    className={clsx(
                                        "mt-1 text-[11px] truncate font-extralight",
                                        isActive ? "text-brand-red" : "text-slate-700"
                                    )}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div>
                <ProductMasonryGrid products={filteredProducts} />
            </div>
        </section>
    );
};

export default ProductCategoryPage;
