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
        <section>
            <div>
                {bannerImage && (
                    <Image
                        src={bannerImage}
                        alt={`${categorySlug} banner`}
                        width={800}
                        height={800}
                        priority
                        className="w-full object-cover max-[550px]:h-60 h-90 "
                    />
                )}
            </div>

            <div className="md:w-full mx-auto sticky top-17 py-2 z-30 bg-[#eceae3] mt-4">
                <div className="mx-2 px-0.5 flex flex-nowrap overflow-auto items-center sm:justify-center gap-2 py-1 scrollbar-hide">
                    {/* ALL */}
                    <Link
                        href={`/categories/${categorySlug}`}
                        scroll={false}
                        className="flex flex-col items-center min-w-20"
                    >
                        <div
                            className={clsx(
                                "flex justify-center transition-all bg-brand-red text-white items-center mb-3.75 w-20 h-25 mx-1 rounded-sm overflow-hidden border",
                                !activeSub
                                    ? "border-brand-red ring-2 ring-slate-800"
                                    : "border-2 border-slate-200 hover:border-slate-800"
                            )}
                        >

                            <p
                                className={clsx(
                                    "w-20 truncate font-semibold text-center mt-1 text-[11px]",
                                    !activeSub ? "text-white" : "text-white"
                                )}
                            >
                                All <span>{categorySlug?.toUpperCase()}</span>
                            </p>
                        </div>

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
                                            : "border-2 border-slate-200 hover:border-brand-red"
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
                                <div className="w-20 flex items-center justify-center">
                                    <p
                                        className={clsx(
                                            "mt-1 text-[11px] text-center truncate font-semibold",
                                            isActive ? "text-brand-red" : "text-slate-700"
                                        )}
                                    >
                                        {item?.name}
                                    </p>

                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="my-8">
                {products.length === 0 ? (
                    <div className="flex items-center font-poppins justify-center h-[40vh] text-sm text-slate-800 font-bold">
                        Nothing Dropped Here Yet...
                    </div>
                ) : (
                    <ProductMasonryGrid products={products} showHeading={false} showFilter ={false} fullWidth={false} />
                )}
            </div>
        </section>
    );
};

export default ProductCategoryPage;
