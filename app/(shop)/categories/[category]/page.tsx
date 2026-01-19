"use client";

import EvoqueLogoLoader from "@/components/FlashLogo/LayerLogo";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

export interface Product {
    _id: string;
    productName: string;
    slug: string;
    brand: string;
    category?: {
        name: string;
        slug: string;
    };
    pricing: Pricing;
    rating: number;
    variants: Variant[];
    subCategory?: {
        slug: string;
    };
    isActive: string;
    isFeatured: string;
    isBestSeller: string;
    isNewArrival: string;
}

/* ---------------- COMPONENT ---------------- */

const ProductCategoryPage = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [bannerImage, setBannerImage] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const bannerRef = useRef<HTMLDivElement>(null);
    const [bannerHeight, setBannerHeight] = useState<number>(0);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const categorySlug = pathname.split("/").pop();
    const activeSub = searchParams.get("sub") || "";
    const isBannerVisible = Boolean(bannerImage && !activeSub);

    useEffect(() => {
        if (bannerRef.current && bannerImage) {
            setBannerHeight(bannerRef.current.scrollHeight);
        }
    }, [bannerImage]);

    /* ---------- FETCH DATA ---------- */
    useEffect(() => {
        async function fetchCategoryAndProducts() {
            setLoading(true);
            try {
                const url = activeSub
                    ? `/api/categories/${categorySlug}?sub=${activeSub}`
                    : `/api/categories/${categorySlug}`;

                const res = await fetch(url, { cache: "no-store" });
                const data = await res.json();

                setBannerImage(
                    data.category?.categoryPageBanner ||
                    "/images/default-category-banner.png"
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

    return (
        <section className="min-h-[95vh] bg-[var(--linen-150)]">
            {/* ---------------- CATEGORY BANNER ---------------- */}
            <div
                style={{
                    height: isBannerVisible ? bannerHeight : 0,
                    opacity: isBannerVisible ? 1 : 0,
                    transform: isBannerVisible
                        ? "translateY(0)"
                        : "translateY(-24px)",
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
                    <div ref={bannerRef}>
                        <Image
                            src={bannerImage}
                            alt={`${categorySlug} banner`}
                            width={1600}
                            height={600}
                            priority
                            className="w-full object-cover object-center h-90"
                        />
                    </div>
                )}
            </div>

            {/* ---------------- SUB CATEGORY BAR ---------------- */}
            <div className="md:w-full mx-auto sticky top-15 z-30 border border-b-[var(--border-strong)] bg-[var(--linen-200)] border-b border-[var(--border-light)]">
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
                                    ? "bg-[var(--primary)] border-[var(--primary)] ring-1 ring-[var(--accent)]"
                                    : "bg-[var(--surface-muted)] border-[var(--border)] hover:ring-[var(--accent)]"
                            )}
                        >
                            <p
                                className={clsx(
                                    "w-20 truncate font-semibold text-center mt-1 text-[11px]",
                                    activeSub
                                        ? "text-[var(--primary)]"
                                        : "text-[var(--primary-foreground)]"
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
                                        "overflow-hidden bg-[var(--linen-100)] rounded-[3px] border transition-all",
                                        isActive
                                            ? "border-[var(--primary)] ring-1 ring-[var(--primary)]"
                                            : "border-[var(--border)] hover:border-[var(--primary)]"
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
                                            "mt-1 text-[11px] text-center truncate font-semibold hover:text-[var(--primary)]",
                                            isActive
                                                ? "text-[var(--primary)]"
                                                : "text-[var(--text-secondary)]"
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
                    <div className="flex w-full items-center justify-center h-[40vh] text-sm font-semibold text-[var(--text-muted)]">
                        Nothing Dropped Here Yet...
                    </div>
                ) : (
                    <ProductMasonryGrid
                        products={products}
                        showHeading={false}
                        showFilter={false}
                        fullWidth={false}
                    />
                )}
            </div>
        </section>
    );
};

export default ProductCategoryPage;
