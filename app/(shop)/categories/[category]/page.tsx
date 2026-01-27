"use client";


import LayerLogo from "@/components/FlashLogo/LayerLogo";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Category, Product, SubCategory } from "@/types/ProductTypes";
import { useQuery } from "@tanstack/react-query";

interface CategoryProductsResponse {
    category: Category;
    products: Product[];
}

export async function fetchCategoryWithProducts(slug: string, sub?: string) {
    const { data } = await axios.get<{ category: Category; products: Product[] }>(
        `/api/categories/${slug}`,
        { params: sub ? { sub } : undefined }
    );
    return data;
}



const ProductCategoryPage = () => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const [bannerHeight, setBannerHeight] = useState<number>(0);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const categorySlug = pathname.split("/").pop() ?? "";
    const activeSub = searchParams.get("sub") || "";

    /* ---------- FETCH DATA ---------- */
    const { data, isLoading } = useQuery<CategoryProductsResponse>({
        queryKey: ["categoryProducts", categorySlug, activeSub],
        queryFn: () => fetchCategoryWithProducts(categorySlug, activeSub),
        enabled: !!categorySlug,
        staleTime: 1000 * 60 * 5,
    });

    const bannerImage = data?.category?.categoryPageBanner ?? "/images/default-category-banner.png";
    const subCategories = (data?.category?.subCategories ?? []).filter((s: SubCategory) => s.isActive);
    const products = data?.products ?? [];

    const isBannerVisible = Boolean(bannerImage && !activeSub);

    useEffect(() => {
        if (bannerRef.current && bannerImage) {
            setBannerHeight(bannerRef.current.scrollHeight);
        }
    }, [bannerImage]);

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><LayerLogo /></div>

    return (
        <section className="min-h-[95vh]">
            {/* ---------------- CATEGORY BANNER ---------------- */}
            <div
                style={{
                    height: isBannerVisible ? bannerHeight : 0,
                    opacity: isBannerVisible ? 1 : 0,
                    transform: isBannerVisible ? "translateY(0)" : "translateY(-20px)",
                }}
                className="
                        overflow-hidden
                        transition-[height,opacity,transform]
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        will-change-[height,opacity,transform]
                    "
            >
                {bannerImage && (
                    <div
                        ref={bannerRef}
                        className="
                                relative
                                w-full
                                h-100
                            "
                    >
                        <Image
                            src={bannerImage}
                            alt={`${categorySlug} banner`}
                            fill
                            priority
                            sizes="100vw"
                            className="
                                object-cover
                                object-center
                                select-none
                            "
                        />
                    </div>
                )}
            </div>


            {/* ---------------- SUB CATEGORY BAR ---------------- */}
            <div className="md:w-full mx-auto sticky top-15 z-30 border border-b-(--border-strong) bg-(--linen-200) border-b border-(--border-light)">
                <div className="mx-2 h-40 flex flex-nowrap overflow-auto items-center sm:justify-center gap-2 scrollbar-hide">
                    {/* ALL */}
                    <Link
                        href={`/categories/${categorySlug}`}
                        scroll={false}
                        className="flex flex-col items-center min-w-20"
                    >
                        <div
                            className={clsx(
                                "flex justify-center items-center mb-3.75 w-20 h-25 mx-1 rounded-sm overflow-hidden border transition-all",
                                !activeSub
                                    ? "bg-primary border-primary ring-1 ring-accent"
                                    : "bg-(--surface-muted) hover:ring-accent"
                            )}
                        >
                            <p
                                className={clsx(
                                    "w-20 truncate font-semibold text-center mt-1 text-[11px]",
                                    activeSub
                                        ? "text-primary"
                                        : "text-primary-foreground"
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
                                        "overflow-hidden bg-(--linen-100) rounded-[3px] border transition-all",
                                        isActive
                                            ? "border-primary ring-1 ring-primary"
                                            : "border-border hover:border-primary"
                                    )}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="object-cover h-24.75 rounded-[3px]"
                                    />
                                </div>

                                <div className="w-20 flex items-center justify-center">
                                    <p
                                        className={clsx(
                                            "mt-1 text-[11px] text-center truncate font-semibold hover:text-primary",
                                            isActive
                                                ? "text-primary"
                                                : "text-(--text-secondary)"
                                        )}
                                    >
                                        {item.name}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ---------------- PRODUCTS ---------------- */}
            <div>
                {products.length === 0 ? (
                    <div className="flex w-full items-center justify-center h-[40vh] text-sm font-semibold text-(--text-muted)">
                        Nothing Dropped Here Yet...
                    </div>
                ) : (
                    <ProductMasonryGrid
                        products={products}
                        showHeading={false}
                        fullWidth={false}
                    />
                )}
            </div>
        </section>
    );
};

export default ProductCategoryPage;
