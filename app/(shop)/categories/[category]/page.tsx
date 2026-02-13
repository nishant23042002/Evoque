"use client";

import LayerLogo from "@/components/FlashLogo/LayerLogo";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Plus } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Category, SubCategory } from "@/types/ProductTypes";
import Product from "@/types/ProductTypes";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/Footer";
type SortOption = "recommended" | "newest" | "low-high" | "high-low";

interface CategoryProductsResponse {
    category: Category;
    products: Product[];
}

export async function fetchCategoryWithProducts(
    slug: string,
    sub?: string,
    sort?: SortOption | null
) {
    const { data } = await axios.get(`/api/categories/${slug}`, {
        params: {
            ...(sub && { sub }),
            ...(sort && { sort }),
        },
    });

    return data;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: "Recommended", value: "recommended" },
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "low-high" },
    { label: "Price: High to Low", value: "high-low" },
];


const ProductCategoryPage = () => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const [animatePage, setAnimatePage] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const categorySlug = pathname.split("/").pop() ?? "";
    const activeSub = searchParams.get("sub") || "";
    const showBannerToggle = !activeSub;
    const [sortOpen, setSortOpen] = useState(false);
    const sortValue = searchParams.get("sort") as SortOption | null;
    const router = useRouter();


    const [isBannerEnabled, setIsBannerEnabled] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;

        const saved = localStorage.getItem(
            `categoryBannerVisible:${categorySlug}`
        );

        return saved !== null ? saved === "true" : true;
    });
    const [animateBanner, setAnimateBanner] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setAnimateBanner(true), 1500);
        return () => clearTimeout(timeout);
    }, []);


    /* ---------- FETCH DATA ---------- */
    const { data, isLoading } = useQuery<CategoryProductsResponse>({
        queryKey: ["categoryProducts", categorySlug, activeSub, sortValue],
        queryFn: () =>
            fetchCategoryWithProducts(categorySlug, activeSub, sortValue),
        enabled: !!categorySlug,
        staleTime: 1000 * 60 * 5,
    });

    const bannerImage = data?.category?.categoryPageBanner ?? "/images/default-category-banner.png";
    const subCategories = (data?.category?.subCategories ?? []).filter((s: SubCategory) => s.isActive);
    const products = data?.products ?? [];


    useEffect(() => {
        const timeout = setTimeout(() => setAnimatePage(true), 50); // delay to trigger transition
        return () => clearTimeout(timeout);
    }, []);

    /* ---------- LOCAL STORAGE PERSISTENCE ---------- */
    const toggleBanner = () => {
        setIsBannerEnabled(prev => {
            const next = !prev;

            if (typeof window !== "undefined") {
                localStorage.setItem(
                    `categoryBannerVisible:${categorySlug}`,
                    String(next)
                );
            }

            return next;
        });
    };


    const handleSortChange = (value: SortOption) => {
        setSortOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);

        router.replace(`?${params.toString()}`);
    };



    if (isLoading) return (
        <div className="min-h-screen flex justify-center items-center">
            <LayerLogo />
        </div>
    );

    return (
        <section className="min-h-[95vh]">
            {/* ---------------- CATEGORY BANNER ---------------- */}
            <div
                ref={bannerRef}
                className={clsx(
                    "relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isBannerEnabled ? "opacity-100 translate-y-0" : "opacity-0"
                )}

            >
                {isBannerEnabled && animateBanner && (
                    <div
                        ref={bannerRef}
                        className="relative aspect-16/8 md:aspect-21/7 overflow-hidden"
                    >
                        <Image
                            src={bannerImage}
                            alt={`${categorySlug} banner`}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-center select-none"
                        />
                    </div>
                )}

            </div>


            {/* ---------------- SUB CATEGORY BAR ---------------- */}
            <div className="md:w-full mx-auto sticky top-15 z-30 border-b-(--border-strong) bg-(--surface-elevated) border-b border-(--border-light)">
                <div className="relative mx-2 h-40 flex flex-nowrap overflow-auto items-center sm:justify-center gap-1 scrollbar-hide">
                    {/* ALL */}
                    <Link href={`/categories/${categorySlug}`} scroll={false} className="flex flex-col items-center min-w-20">
                        <div className={clsx(
                            "flex justify-center items-center mb-5 w-20 h-25 mx-1 overflow-hidden border transition-all",
                            !activeSub ? "bg-primary border-primary ring-1 ring-accent" : "bg-(--surface-muted) hover:ring-accent"
                        )}>
                            <p className={clsx(
                                "w-20 truncate font-semibold text-center mt-1 text-[11px]",
                                activeSub ? "text-primary" : "text-primary-foreground"
                            )}>
                                All <span>{categorySlug?.toUpperCase()}</span>
                            </p>
                        </div>
                    </Link>
                    {/* ---------------- BANNER TOGGLE ---------------- */}
                    {showBannerToggle && (
                        <div className="absolute bottom-0 left-0 z-50 flex items-center justify-end gap-2 py-2">
                            <span className="text-[11px] font-medium text-(--text-secondary)">Banner</span>

                            <button
                                role="switch"
                                aria-checked={isBannerEnabled}
                                onClick={toggleBanner}
                                className={clsx(
                                    "cursor-pointer border-(--border-strong) relative inline-flex h-4 w-6 items-center justify-center rounded-[3px] border transition-all",
                                    isBannerEnabled
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "bg-(--linen-100) border-border text-(--text-secondary)"
                                )}
                            >
                                {isBannerEnabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </button>
                        </div>
                    )}

                    {/* SUB CATEGORIES */}
                    {subCategories.map(item => {
                        const isActive = activeSub === item.slug;
                        return (
                            <Link
                                key={item.slug}
                                href={`/categories/${categorySlug}?sub=${item.slug}`}
                                scroll={false}
                                className="flex flex-col items-center min-w-20"
                            >
                                <div className={clsx(
                                    "overflow-hidden bg-(--linen-100) border transition-all",
                                    isActive ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary"
                                )}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="object-cover h-24.75"
                                    />
                                </div>
                                <div className="w-20 flex items-center justify-center">
                                    <p className={clsx(
                                        "mt-1 text-[11px] text-center truncate font-semibold hover:text-primary",
                                        isActive ? "text-primary" : "text-(--text-secondary)"
                                    )}>
                                        {item.name}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ---------------- PRODUCTS ---------------- */}
            <div
                className={clsx(
                    "transition-all duration-700 ease-out mb-24",
                    animatePage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
            >
                <div className="relative select-none flex justify-between pt-4 pb-2  mx-1 sm:mx-2">
                    <div onClick={() => setSortOpen((prev) => !prev)} className="flex cursor-pointer items-center justify-center gap-2">
                        <div className="font-medium hover:text-black/70 duration-300 tracking-wider uppercase text-sm">
                            Sort
                        </div>

                        <div
                            className="cursor-pointer hover:rotate-90 transition duration-300"
                        >
                            <Plus size={18} />
                        </div>

                        {sortOpen && (
                            <div
                                className="
                                    absolute top-12 left-4 z-40
                                    w-56 h-45
                                    bg-white
                                    border border-(--border-strong)
                                    p-4
                                    animate-in fade-in zoom-in-95 duration-150
                                    "
                            >
                                <div className="flex flex-col justify-center gap-3 text-sm">
                                    {SORT_OPTIONS.map((item) => (
                                        <label
                                            key={item.value}
                                            onClick={() => handleSortChange(item.value)}
                                            className="flex items-center justify-between cursor-pointer select-none"
                                        >
                                            <span className="text-lg">{item.label}</span>

                                            <input
                                                type="radio"
                                                checked={sortValue === item.value}
                                                onChange={() => handleSortChange(item.value)}
                                                className="w-4 h-4 accent-black cursor-pointer"
                                            />

                                        </label>
                                    ))}
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="flex cursor-pointer justify-center items-center gap-2">
                        <div className="font-medium hover:text-black/70 duration-300 tracking-wider uppercase text-sm">
                            FILTERS
                        </div>
                        <div className="cursor-pointer hover:rotate-90 transition duration-300">
                            <svg role="img" aria-hidden="true" focusable="false" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16"><path d="M9 2.25h4v4H9zM3 9.75h4v4H3z"></path><path d="M16 11v1.5H0V11zM16 3.5V5H0V3.5z"></path></svg>
                        </div>
                    </div>
                </div>


                {products.length === 0 ? (
                    <div className="flex w-full items-center justify-center h-[40vh] text-sm font-semibold text-(--text-muted)">
                        Nothing Dropped Here Yet...
                    </div>
                ) : (
                    <ProductMasonryGrid products={products} showHeading={false} fullWidth={false} />
                )}
            </div>
            <Footer />
        </section>
    );
};

export default ProductCategoryPage;
