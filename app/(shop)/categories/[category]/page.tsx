"use client";

import EvoqueLogoLoader from "@/components/FlashLogo/LayerLogo";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    const [bannerImage, setBannerImage] = useState<string>("");
    const [loading, setLoading] = useState(true);


    const pathname = usePathname();
    const searchParams = useSearchParams();

    const categorySlug = pathname.split("/").pop();
    const activeSub = searchParams.get("sub") || "";

    //Sub-Category 
    useEffect(() => {
        async function fetchCategoryAndProducts() {
            setLoading(true);
            try {
                const url = activeSub
                    ? `/api/categories/${categorySlug}?sub=${activeSub}`
                    : `/api/categories/${categorySlug}`;

                const res = await fetch(url, { cache: "no-store" });
                const data = await res.json();
                const bannerImage = data.category?.categoryPageBanner;

                setBannerImage(
                    bannerImage || "/images/default-category-banner.png"
                );


                setSubCategories(
                    (data.category?.subCategories || []).filter(
                        (s: SubCategory) => s.isActive
                    )
                );

                setProducts(data.products || []);
            } catch (err) {
                console.error("Failed to fetch category/products", err);
            } finally {
                setLoading(false);
            }
        }

        if (categorySlug) fetchCategoryAndProducts();
    }, [categorySlug, activeSub]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <EvoqueLogoLoader />
            </div>
        );
    }

    return (
        <section className="">
            <div className="mx-auto">
                {bannerImage && (
                    <Image
                        src={bannerImage}
                        alt={`${categorySlug} banner`}
                        width={1600}
                        height={600}
                        priority
                        className="w-full h-70 max-[550px]:h-60 md:h-100 "
                    />
                )}
            </div>

            <div className="md:w-full mx-auto sticky top-24 py-2 z-30 bg-[#eceae3] mt-4">
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
                                className="object-center w-full h-full"
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
                {products.length === 0 ? (
                    <div className="flex items-center font-poppins justify-center h-[40vh] text-sm text-slate-800 font-bold">
                        Nothing Dropped Here Yet...
                    </div>
                ) : (
                    <ProductMasonryGrid products={products} showHeading={false} />
                )}
            </div>
        </section>
    );
};

export default ProductCategoryPage;
