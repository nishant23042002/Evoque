"use client";

import LayerLogo from "@/components/FlashLogo/LayerLogo";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Minus, Plus, X } from "lucide-react";
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
    colorCounts: {
        slug: string;
        name: string;
        hex: string;
        count: number;
    }[];
    sizeCounts: {
        size: string;
        count: number;
    }[];
    fitCounts: {
        fitType: string;
        count: number;
    }[];
    fabricCounts: {
        fabric: string;
        count: number;
    }[];
    patternCounts: {
        pattern: string;
        count: number;
    }[];
    priceRange: {
        min: number;
        max: number;
    };
}
const FilterSection = ({
    title,
    children,
    onClose,
}: {
    title: string;
    children: React.ReactNode;
    onClose?: () => void;
}) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open && onClose) {
            onClose(); // ✅ safe: runs after render
        }
    }, [open]);

    return (
        <div>
            <div
                onClick={() => setOpen(prev => !prev)}
                className="flex justify-between items-center cursor-pointer  pb-3"
            >
                <span className="uppercase tracking-wide text-sm font-medium">
                    {title}
                </span>
                {open ? <Minus size={16} /> : <Plus size={16} />}
            </div>

            <div
                className={clsx(
                    "transition-all duration-300 overflow-hidden",
                    open ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                {children}
            </div>
        </div>
    );
};
export async function fetchCategoryWithProducts(
    slug: string,
    sub?: string,
    sort?: SortOption | null,
    min?: string | null,
    max?: string | null,
    color?: string | null,
    size?: string | null,
    fit?: string | null,
    fabric?: string | null,
    pattern?: string | null,
) {
    const { data } = await axios.get(`/api/categories/${slug}`, {
        params: {
            ...(sub && { sub }),
            ...(sort && { sort }),
            ...(min && { min }),
            ...(max && { max }),
            ...(color && { color }),
            ...(size && { size }),
            ...(fit && { fit }),
            ...(fabric && { fabric }),
            ...(pattern && { pattern }),
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const categorySlug = pathname.split("/").pop() ?? "";
    const activeSub = searchParams.get("sub") || "";
    const showBannerToggle = !activeSub;
    const [sortOpen, setSortOpen] = useState(false);
    const sortValue = searchParams.get("sort") as SortOption | null;
    const colorParam = searchParams.get("color");
    const selectedColors = colorParam ? colorParam.split(",") : [];
    const sizeParam = searchParams.get("size");
    const selectedSizes = sizeParam ? sizeParam.split(",") : [];
    const fitParam = searchParams.get("fit");
    const selectedFits = fitParam ? fitParam.split(",") : [];

    const fabricParam = searchParams.get("fabric");
    const patternParam = searchParams.get("pattern");
    const selectedPattern = patternParam ? patternParam.split(",") : [];
    const selectedFabrics = fabricParam ? fabricParam.split(",") : [];

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


    const minPrice = searchParams.get("min");
    const maxPrice = searchParams.get("max");
    /* ---------- FETCH DATA ---------- */
    const { data, isLoading } = useQuery<CategoryProductsResponse>({
        queryKey: [
            "categoryProducts",
            categorySlug,
            activeSub,
            sortValue,
            minPrice,
            maxPrice,
            colorParam,
            sizeParam,
            fitParam,
            fabricParam,
            patternParam
        ],
        queryFn: () =>
            fetchCategoryWithProducts(
                categorySlug,
                activeSub,
                sortValue,
                minPrice,
                maxPrice,
                colorParam,
                sizeParam,
                fitParam,
                fabricParam,
                patternParam
            ),
        enabled: !!categorySlug,
        staleTime: 1000 * 60 * 5,
    });

    const minAvailable = data?.priceRange?.min || 0;
    const maxAvailable = data?.priceRange?.max || 0;

    const minVal = minPrice ? Number(minPrice) : minAvailable;
    const maxVal = maxPrice ? Number(maxPrice) : maxAvailable;
    const [tempMin, setTempMin] = useState<number>(() => minVal);
    const [tempMax, setTempMax] = useState<number>(() => maxVal);


    const resetPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("min");
        params.delete("max");

        router.replace(`?${params.toString()}`);
    };


    const bannerImage = data?.category?.categoryPageBanner ?? "/images/default-category-banner.png";
    const subCategories = (data?.category?.subCategories ?? []).filter((s: SubCategory) => s.isActive);
    const products = data?.products ?? [];
    const updatePrice = (min: number, max: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (min > minAvailable)
            params.set("min", String(min));
        else
            params.delete("min");

        if (max < maxAvailable)
            params.set("max", String(max));
        else
            params.delete("max");

        router.replace(`?${params.toString()}`);
    };
    useEffect(() => {
        const timeout = setTimeout(() => setAnimatePage(true), 50); // delay to trigger transition
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        // cleanup safety (important)
        return () => {
            document.body.style.overflow = "";
        };
    }, [isFilterOpen]);

    const updateColorFilter = (colorSlug: string) => {
        const params = new URLSearchParams(searchParams.toString());

        let colors = colorParam ? colorParam.split(",") : [];

        if (colors.includes(colorSlug)) {
            // remove
            colors = colors.filter(c => c !== colorSlug);
        } else {
            // add
            colors.push(colorSlug);
        }

        if (colors.length > 0) {
            params.set("color", colors.join(","));
        } else {
            params.delete("color");
        }

        router.replace(`?${params.toString()}`);
    };

    const updateSizeFilter = (size: string) => {
        const params = new URLSearchParams(searchParams.toString());

        let sizes = sizeParam ? sizeParam.split(",") : [];

        if (sizes.includes(size)) {
            sizes = sizes.filter(s => s !== size);
        } else {
            sizes.push(size);
        }

        if (sizes.length > 0) {
            params.set("size", sizes.join(","));
        } else {
            params.delete("size");
        }

        router.replace(`?${params.toString()}`);
    };

    const updateFitFilter = (fitValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        let fits = fitParam ? fitParam.split(",") : [];

        if (fits.includes(fitValue)) {
            fits = fits.filter(f => f !== fitValue);
        } else {
            fits.push(fitValue);
        }

        if (fits.length > 0) {
            params.set("fit", fits.join(","));
        } else {
            params.delete("fit");
        }

        router.replace(`?${params.toString()}`);
    };

    const updateFabricFilter = (fabricValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        let fabrics = fabricParam ? fabricParam.split(",") : [];

        if (fabrics.includes(fabricValue)) {
            fabrics = fabrics.filter(f => f !== fabricValue);
        } else {
            fabrics.push(fabricValue);
        }

        if (fabrics.length > 0) {
            params.set("fabric", fabrics.join(","));
        } else {
            params.delete("fabric");
        }

        router.replace(`?${params.toString()}`);
    };

    const updatePatternFilter = (patternValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        let patterns = patternParam ? patternParam.split(",") : [];

        if (patterns.includes(patternValue)) {
            patterns = patterns.filter(p => p !== patternValue);
        } else {
            patterns.push(patternValue);
        }

        if (patterns.length > 0) {
            params.set("pattern", patterns.join(","));   // ✅ correct key
        } else {
            params.delete("pattern");                   // ✅ correct key
        }

        router.replace(`?${params.toString()}`);
    };

    const availableColors = data?.colorCounts || [];
    const availableSizes = data?.sizeCounts || [];
    const fit = data?.fitCounts || [];
    const fabricCounts = data?.fabricCounts || [];
    const patternCounts = data?.patternCounts || [];

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
            <div className="md:w-full mx-auto z-30">
                <div className="relative mx-2 h-40 flex flex-nowrap overflow-auto items-center sm:justify-center gap-1 scrollbar-hide">
                    {/* ALL */}
                    <Link href={`/categories/${categorySlug}`} scroll={false} className="flex flex-col items-center">
                        <div className={clsx(
                            "flex justify-center items-center border border-black/20 mb-5 w-25 h-25 mx-1 rounded-full overflow-hidden",
                            !activeSub ? "ring-1 ring-primary" : "hover:border-primary"
                        )}>
                            <p className={clsx(
                                "font-medium truncate w-20 text-center mt-1 text-[11px]",
                                activeSub ? "text-primary" : "text-primary"
                            )}>
                                All <span>{categorySlug?.toUpperCase()}</span>
                            </p>
                        </div>
                    </Link>
                    {/* ---------------- BANNER TOGGLE ---------------- */}
                    {showBannerToggle && (
                        <div className="absolute bottom-0 left-0 flex items-center justify-end gap-2 py-2">
                            <span className="text-[11px] font-medium text-(--text-secondary)">Banner</span>

                            <button
                                role="switch"
                                aria-checked={isBannerEnabled}
                                onClick={toggleBanner}
                                className={clsx(
                                    "cursor-pointer border-(--border-strong) relative inline-flex h-4 w-6 items-center justify-center rounded-[3px] border transition-all",
                                    isBannerEnabled
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-border text-(--text-secondary)"
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
                                className="flex flex-col items-center"
                            >
                                <div className={clsx(
                                    "flex justify-center items-center overflow-hidden w-25 h-25 rounded-full border border-black/20",
                                    isActive ? "ring-1 ring-primary" : " hover:border-primary"
                                )}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="object-cover object-center"
                                    />
                                </div>
                                <div className="w-20 flex items-center justify-center">
                                    <p className={clsx(
                                        "mt-1 text-[11px] text-center truncate font-light tracking-tighter hover:text-primary",
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
                    "transition-all duration-700 ease-out",
                    animatePage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
            >
                <div className="sticky top-14.75 z-50 bg-(--linen-100) select-none flex justify-between pt-2 pb-2">
                    <div onClick={() => setSortOpen((prev) => !prev)} className="flex cursor-pointer  mx-1 sm:mx-2 items-center justify-center gap-2">
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
                                    absolute top-9 left-2 z-40
                                    w-56 h-45
                                    bg-white
                                    border border-(--border-light)
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
                    <div
                        onClick={() => setIsFilterOpen(true)}
                        className="flex mx-2 cursor-pointer justify-center items-center gap-2"
                    >
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
                    <ProductMasonryGrid
                        products={products}
                    />

                )}
            </div>
            {/* ================= FILTER DRAWER ================= */}
            <div
                className={clsx(
                    "fixed inset-0 scrollbar-hide z-100 transition-opacity duration-300",
                    isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Overlay */}
                <div
                    onClick={() => setIsFilterOpen(false)}
                    className="absolute  inset-0 bg-black/40 backdrop-blur-[1px]"
                />

                {/* Filter Sliding Panel */}
                <div
                    className={clsx(
                        "absolute pb-10 h-full right-0 top-0  w-[90%] sm:w-125 bg-white",
                        "transition-transform  duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isFilterOpen ? "translate-x-0 " : "translate-x-full"
                    )}
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center px-4 py-5">
                        <h2 className="text-lg font-light uppercase tracking-wider">
                            Filters
                        </h2>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-sm hover:opacity-60 cursor-pointer"
                        >
                            <X />
                        </button>
                    </div>

                    {/* FILTER CONTENT */}
                    <div className="overflow-y-auto scrollbar-hide h-[calc(100%-70px)] px-4 py-6 space-y-8">

                        {/* PRICE */}
                        <FilterSection
                            key={`${minVal}-${maxVal}`}   // 🔥 important
                            title="Price Range"
                            onClose={resetPriceFilter}
                        >
                            <div className="space-y-2 mb-8">

                                {/* Values */}
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{tempMin.toFixed(2)} Rs</span>
                                    <span>{tempMax.toFixed(2)} Rs</span>
                                </div>

                                {/* Slider Wrapper */}
                                <div className="relative h-6 flex items-center">

                                    {/* Track */}
                                    <div className="absolute w-full h-[2px] bg-black" />

                                    {/* Active Range */}
                                    <div
                                        className="absolute h-[2px] bg-black"
                                        style={{
                                            left: `${((minVal - minAvailable) / (maxAvailable - minAvailable)) * 100}%`,
                                            right: `${100 - ((maxVal - minAvailable) / (maxAvailable - minAvailable)) * 100}%`,
                                        }}
                                    />

                                    {/* Min Thumb */}
                                    <input
                                        type="range"
                                        min={minAvailable}
                                        max={maxAvailable}
                                        value={tempMin}
                                        onChange={(e) => {
                                            const value = Math.min(Number(e.target.value), tempMax - 1);
                                            setTempMin(value);
                                        }}
                                        onMouseUp={() => updatePrice(tempMin, tempMax)}
                                        onTouchEnd={() => updatePrice(tempMin, tempMax)}
                                        className="absolute w-full appearance-none bg-transparent"
                                    />

                                    {/* Max Thumb */}
                                    <input
                                        type="range"
                                        min={minAvailable}
                                        max={maxAvailable}
                                        value={tempMax}
                                        onChange={(e) => {
                                            const value = Math.max(Number(e.target.value), tempMin + 1);
                                            setTempMax(value);
                                        }}
                                        onMouseUp={() => updatePrice(tempMin, tempMax)}
                                        onTouchEnd={() => updatePrice(tempMin, tempMax)}
                                        className="absolute w-full appearance-none bg-transparent"
                                    />

                                </div>
                            </div>
                        </FilterSection>
                        {/* COLOR */}
                        <FilterSection title="Color">
                            <div className="flex flex-col h-70 overflow-y-auto scrollbar-hide gap-3">

                                {availableColors.map(color => {
                                    const isSelected = selectedColors.includes(color.slug);

                                    return (
                                        <button
                                            key={color.slug}
                                            onClick={() => updateColorFilter(color.slug)}
                                            className="cursor-pointer flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">

                                                {/* Radio Circle */}
                                                <div className="relative flex items-center justify-center">
                                                    <div
                                                        className={clsx(
                                                            "w-4 h-4 border",
                                                            isSelected ? "border-black" : "border-gray-400"
                                                        )}
                                                    >
                                                        {isSelected && (
                                                            <div className="w-2 h-2 bg-black m-auto mt-[3px]" />
                                                        )}
                                                    </div>
                                                </div>

                                                <span className="text-sm">
                                                    {color.name}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-2">
                                                <span className="text-xs text-gray-500">
                                                    [ {color.count} ]
                                                </span>
                                                {/* Color Swatch */}
                                                <div
                                                    className="w-5 h-4 border border-black"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </FilterSection>

                        {/* SIZE */}
                        <FilterSection title="Size">
                            <div className="flex flex-col gap-2">
                                {availableSizes.map(item => {
                                    const isSelected = selectedSizes.includes(item.size);

                                    return (
                                        <button
                                            key={item.size}
                                            onClick={() => updateSizeFilter(item.size)}
                                            className={clsx(
                                                "flex justify-between items-center px-3 py-2 border  text-sm transition",
                                                isSelected
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 hover:border-black"
                                            )}
                                        >
                                            <span>{item.size}</span>
                                            <span className="text-xs opacity-70">
                                                [ {item.count} ]
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </FilterSection>
                        <FilterSection title="Fit">
                            <div className="flex flex-col gap-2">
                                {fit.map((item) => {
                                    const isSelected = selectedFits.includes(item.fitType);

                                    return (
                                        <button
                                            key={item.fitType}
                                            onClick={() => updateFitFilter(item.fitType)}
                                            className={clsx(
                                                "flex justify-between items-center px-3 py-2 border text-sm transition capitalize",
                                                isSelected
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 hover:border-black"
                                            )}
                                        >
                                            <span>{item.fitType}</span>
                                            <span className="text-xs opacity-70">
                                                [ {item.count} ]
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </FilterSection>
                        <FilterSection title="Fabric">
                            <div className="flex flex-col gap-2">
                                {fabricCounts.map(item => {
                                    const isSelected = selectedFabrics.includes(item.fabric);

                                    return (
                                        <button
                                            key={item.fabric}
                                            onClick={() => updateFabricFilter(item.fabric)}
                                            className={clsx(
                                                "flex justify-between items-center px-3 py-2 border text-sm transition capitalize",
                                                isSelected
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 hover:border-black"
                                            )}
                                        >
                                            <span>{item.fabric}</span>
                                            <span className="text-xs opacity-70">
                                                [ {item.count} ]
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </FilterSection>
                        <FilterSection title="Pattern">
                            <div className="flex flex-col gap-2">
                                {patternCounts.map(item => {
                                    const isSelected = selectedPattern.includes(item.pattern);

                                    return (
                                        <button
                                            key={item.pattern}
                                            onClick={() => updatePatternFilter(item.pattern)}
                                            className={clsx(
                                                "flex justify-between items-center px-3 py-2 border text-sm transition capitalize",
                                                isSelected
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 hover:border-black"
                                            )}
                                        >
                                            <span>{item.pattern}</span>
                                            <span className="text-xs opacity-70">
                                                [ {item.count} ]
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </FilterSection>
                    </div>

                    {/* APPLY BUTTON */}
                    <div className="absolute bottom-0 left-0 w-full">
                        <button onClick={() => setIsFilterOpen(false)} className="w-full bg-black hover:bg-black/60 cursor-pointer duration-300 text-white py-3 uppercase tracking-wider text-sm">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default ProductCategoryPage;
