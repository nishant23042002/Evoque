"use client";
import Container from "@/components/Container";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { addWishlistItem, removeWishlistItem } from "@/store/wishlist/wishlist.thunks"
import Product from "@/types/ProductTypes";
import { SizeVariant } from "@/types/ProductTypes";
import { addCartItem } from "@/store/cart/cart.thunks";
import SizeChartModal from "@/components/SizeChartModal";
import { useRef } from "react";
import { useMediaQuery } from "@/src/useMediaQuery";
import ProductHorizontalScroller from "@/components/Main/ProductHorizontalScroller";
import { useProductPageData } from "@/src/useProductPageData";
import LayerLogo from "@/components/FlashLogo/LayerLogo";
import { useProductVariants } from "@/src/useProductVariants";
import Footer from "@/components/Footer/Footer";
import { addRecentlyViewed } from "@/store/recentlyViewed/recentlyViewed.slice";
import { showProductToast } from "@/store/ui/ui.slice";

function MobileImageSlider({
    images,
    activeColor,
}: {
    images: string[];
    activeColor?: string;
}) {
    const [active, setActive] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollTo = (index: number) => {
        if (!sliderRef.current) return;
        const width = sliderRef.current.clientWidth;
        sliderRef.current.scrollTo({
            left: width * index,
            behavior: "smooth",
        });
        setActive(index);
    };

    return (
        <div className="relative w-full">
            {/* SLIDER */}
            <div
                ref={sliderRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                onScroll={(e) => {
                    const el = e.currentTarget;
                    const index = Math.round(el.scrollLeft / el.clientWidth);
                    setActive(index);
                }}
            >
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="min-w-full snap-center relative aspect-4/5"
                    >
                        <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* DOTS */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className="h-2 w-2 border border-(--border-strong) transition-all duration-300"
                        style={{
                            backgroundColor:
                                active === i
                                    ? activeColor || "#000"
                                    : "rgba(0,0,0,0.25)",
                            transform: active === i ? "scale(1.2)" : "scale(1)",
                        }}
                    />
                ))}
            </div>

        </div>
    );
}
const DETAILS_LABELS: Record<keyof Product["details"], string> = {
    material: "Material",
    fabricWeight: "Fabric Weight",
    stretch: "Stretch",
    washCare: "Wash Care",
    fitType: "Fit Type",
    rise: "Rise",
    closure: "Closure",
};

const Stars = ({ value }: { value: number }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {value >= star ? "★" : "☆"}
                </span>
            ))}
        </div>
    );
};

/* ====================
   COMPONENT
==================== */
export default function ProductPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;
    const router = useRouter();
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const galleryRef = useRef<HTMLDivElement | null>(null);
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    // UI state
    const [openSizeChart, setOpenSizeChart] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    // Selection state
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);

    // Gallery state
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [cursorDirection, setCursorDirection] = useState<"left" | "right" | null>(null);
    const cursorElRef = useRef<HTMLDivElement | null>(null);
    const [showBottomBar, setShowBottomBar] = useState(false);


    const dispatch = useAppDispatch();
    const hasViewedRef = useRef(false);
    const {
        product,
        recommendations,
        sameCategory,
        loading
    } = useProductPageData(slug);
    const {
        activeVariant,
        images,
        colorVariants,
        sizes
    } = useProductVariants(product, selectedColor);

    useEffect(() => {
        if (hasViewedRef.current) return;

        hasViewedRef.current = true;

        fetch(`/api/products/${slug}/view`, {
            method: "POST",
        });
    }, [slug]);
    useEffect(() => {
        if (!product || !activeVariant) return;

        dispatch(
            addRecentlyViewed({
                productId: product._id,
                slug: product.slug,
                name: product.productName,
                image:
                    activeVariant.color.images.find(i => i.isPrimary)?.url ||
                    activeVariant.color.images[0]?.url,
                price: product.pricing.price,
                brand: product.brand,
                viewedAt: Date.now(),
            })
        );
    }, [product?._id, selectedColor]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 500) {
                setShowBottomBar(true);
            } else {
                setShowBottomBar(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    const selectWishlistIds = (state: RootState) =>
        new Set(state.wishlist.items.map(i => i.productId));
    const wishlistIds = useAppSelector(selectWishlistIds);
    const isWishlisted = product && wishlistIds.has(product._id);


    const cartImage =
        activeVariant?.color.images.find(img => img.isPrimary)?.url ||
        activeVariant?.color.images[0]?.url ||
        "";

    const scrollToImage = (index: number) => {
        setActiveImageIndex(index);

        const container = galleryRef.current;
        const el = imageRefs.current[index];

        if (!container || !el) return;

        const offsetTop = el.offsetTop;

        container.scrollTo({
            top: offsetTop,
            behavior: "smooth",
        });
    };



    /* ---------------- IMAGE ARROWS ---------------- */
    const handlePrevImage = () => {
        const newIndex = activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1;
        scrollToImage(newIndex);
    };
    const handleNextImage = () => {
        const newIndex = activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1;
        scrollToImage(newIndex);
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // Move DOM directly (no React render)
        if (cursorElRef.current) {
            cursorElRef.current.style.transform =
                `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const newDir =
            e.clientX < rect.left + rect.width / 2 ? "left" : "right";

        setCursorDirection(prev => (prev === newDir ? prev : newDir));
    };

    const handleMouseLeave = () => {
        setCursorDirection(null);
    };

    const handleClick = () => {
        if (cursorDirection === "left") handlePrevImage();
        else handleNextImage();
    };



    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 2000);
            return;
        }

        dispatch(
            addCartItem({
                productId: product!._id,
                name: product!.productName,
                slug: product!.slug,
                image: cartImage,
                price: product!.pricing.price,
                originalPrice: product!.pricing.originalPrice ?? 0,
                quantity: 1,
                size: selectedSize.size,
                variantSku: selectedSize.variantSku,
                brand: product!.brand,
                color: {
                    name: activeVariant!.color.name,
                    slug: activeVariant!.color.slug,
                },
            })
        );
        dispatch(showProductToast({
            name: product!.productName,
            image: cartImage,
            price: product!.pricing.price,
            size: selectedSize.size,
            type: "cart"
        }));



        // 2️⃣ Increment analytics.cartAdds
        fetch(`/api/products/by-id/${product!._id}/cart-add`, {
            method: "POST",
        }).catch(() => {
            // optional: silent fail, don’t block UX
        });

    };
    const handleWishlistToggle = () => {
        if (!product) return;

        if (isWishlisted) {
            dispatch(removeWishlistItem(product._id));
            dispatch(showProductToast({
                name: product.productName,
                image: cartImage,
                type: "wishlist-remove"
            }));
        } else {
            dispatch(
                addWishlistItem({
                    productId: product._id,
                    product,
                    slug: product.slug,
                    name: product.productName,
                    image: cartImage,
                    price: product.pricing?.price ?? 0,
                    originalPrice: product.pricing?.originalPrice ?? 0,
                    brand: product.brand,
                })
            );
            dispatch(showProductToast({
                name: product.productName,
                image: cartImage,
                type: "wishlist"
            }));

        }
    };



    if (loading)
        return (
            <div className="flex items-center justify-center h-[70vh] bg-background">
                <LayerLogo />
            </div>
        );

    if (!product)
        return (
            <p className="ml-20 text-center font-poppins text-sm tracking-widest font-semibold text-(--text-muted)">
                Fresh styles coming your way
            </p>
        );



    return (
        <Container>
            <div className="relative w-full mb-30 min-h-screen lg:h-screen">
                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:h-screen
                    "
                >


                    {/* LEFT: IMAGES */}
                    {isDesktop ? (
                        <div
                            ref={galleryRef}
                            className="relative                  
                                
                                md:w-[60%]
                                lg:w-[50%]
                                aspect-4/5
                                h-full
                                mx-auto
                                overflow-y-auto
                                overscroll-contain
                                scrollbar-hide
                                "
                        >
                            {/* THUMBNAILS */}
                            <div className="absolute left-2 top-0 h-full z-30 pointer-events-none">
                                <div className="sticky top-2 flex flex-col gap-2 w-22.5 pointer-events-auto">
                                    {images.map((img, i) => {
                                        const isActive = activeImageIndex === i;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => scrollToImage(i)}
                                                className={`relative w-22 h-28 border transition-all duration-200
                                                    ${isActive ? "" : "border-border hover:border-(--border-strong)"}`}
                                                style={
                                                    isActive
                                                        ? {
                                                            borderColor: activeVariant?.color?.hex || "#000",
                                                            borderWidth: "2px",
                                                        }
                                                        : undefined
                                                }
                                            >
                                                <Image src={img} alt={product.productName} fill className="object-cover" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {images.map((img, i) => (
                                    <div key={i} ref={(el) => {
                                        imageRefs.current[i] = el;
                                    }}
                                        className="relative w-full aspect-4/5">
                                        <Image
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={handleClick}
                                            src={img}
                                            alt={product.productName}
                                            fill
                                            className="cursor-none object-cover object-center"
                                        />
                                        {cursorDirection && (
                                            <div
                                                ref={cursorElRef}
                                                className="fixed z-50 pointer-events-none"
                                                style={{
                                                    left: 0,
                                                    top: 0,
                                                    transform: "translate(-9999px, -9999px)", // hidden initially
                                                }}
                                            >
                                                <div className="w-7 h-7 rounded-[3px] backdrop-blur-md border border-(--border-strong) bg-secondary flex items-center justify-center transition-all duration-200">
                                                    {cursorDirection === "left" ? (
                                                        <FaArrowLeftLong
                                                            className="text-xl"
                                                            style={{ color: activeVariant?.color?.hex || "#000" }}
                                                        />
                                                    ) : (
                                                        <FaArrowRightLong
                                                            className="text-xl"
                                                            style={{ color: activeVariant?.color?.hex || "#000" }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <MobileImageSlider
                            images={images}
                            activeColor={activeVariant?.color?.hex}
                        />
                    )}


                    {/* RIGHT: DETAILS */}
                    <div
                        className="
                            
                            lg:w-[40%]
                            w-full
                            lg:sticky
                            lg:top-0
                            h-fit
                            self-start
                            p-2
                            "
                    >
                        <div className="flex justify-between items-center">
                            <h1 className="text-sm md:text-lg font-bold text-(--earth-charcoal)">
                                {product.productName.toUpperCase()}
                            </h1>

                            <button
                                onClick={handleWishlistToggle}
                                className="p-1.5 border border-(--border-light) cursor-pointer rounded-full bg-(--surface) shadow"
                            >
                                <Heart
                                    strokeWidth={0.9}
                                    className="h-5 w-5 transition-all duration-200"
                                    style={
                                        isWishlisted
                                            ? {
                                                fill: activeVariant?.color?.hex || "#000",
                                                color: activeVariant?.color?.hex || "#000",
                                                transform: "scale(1.1)",
                                            }
                                            : {
                                                color: "var(--text-secondary)",
                                            }
                                    }
                                />
                            </button>
                        </div>

                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex items-center gap-3 my-1.5">
                                <span className="text-primary text-lg font-semibold">
                                    ₹ {activeVariant?.pricing?.price}
                                </span>
                                <span className="font-semibold text-[12px] text-(--text-muted) line-through">{activeVariant?.pricing?.originalPrice}</span>
                            </div>
                            <span className="text-white text-[10px] bg-[oklch(0.55_0.04_75)] p-1 font-semibold rounded-[3px]">
                                - {product.pricing.discountPercentage}%
                            </span>
                        </div>

                        <div><span className="text-[10px] font-semibold text-(--text-secondary)">
                            SKU: {product.sku}</span>
                        </div>

                        {/* COLORS */}
                        <div className="py-2 flex flex-col">
                            <h1 className="font-extrabold mb-1 text-foreground">Colors</h1>
                            <div className="flex flex-row flex-nowrap mx-1 items-center gap-1 w-full overflow-x-auto scrollbar-hide">
                                {colorVariants.map((color) => {
                                    const isActive = selectedColor === color.slug;
                                    return (
                                        <button
                                            key={color.slug}
                                            onClick={() => {
                                                setSelectedColor(color.slug);
                                                router.replace(`/products/${product.slug}?color=${color.slug}`, { scroll: false });
                                            }}
                                            className={`shrink-0 cursor-pointer border ${isActive ? "" : "border-border hover:border-(--border-strong)"
                                                }`}
                                            style={
                                                isActive
                                                    ? {
                                                        borderColor:
                                                            product.variants.find((v) => v.color.slug === color.slug)?.color.hex || "#000",
                                                        borderWidth: "2px",
                                                    }
                                                    : undefined
                                            }
                                        >
                                            <div className="flex flex-col justify-between items-center">
                                                <div className="aspect-2/3 ">
                                                    <Image src={color.image} className="rounded-[3px] object-cover aspect-2/3" alt={color.name} width={70} height={70} />
                                                </div>
                                                <span className="text-[10px] text-(--text-secondary)">
                                                    {color.name}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                        {/* SIZES */}
                        <div className="py-2">
                            <div className="flex justify-between">
                                <h3 className="font-bold mb-1 text-foreground">
                                    Select Size
                                </h3>
                                <h1
                                    onClick={() => setOpenSizeChart(true)}
                                    className="text-sm font-medium text-(--linen-600) hover:text-primary cursor-pointer underline"
                                >
                                    Size Chart
                                </h1>

                            </div>
                            <div className="flex flex-row flex-nowrap items-center gap-1 w-full overflow-x-auto scrollbar-hide">
                                {sizes.map(s => {
                                    const isActive = selectedSize?.variantSku === s.variant?.variantSku;
                                    const disabled = !s.exists || !s.isAvailable || !s.inStock;

                                    return (
                                        <button
                                            key={s.size}
                                            disabled={disabled}
                                            onClick={() => s.variant && setSelectedSize(s.variant)}
                                            className={`
                                                    relative
                                                    border
                                                    px-6 py-3
                                                    text-sm font-bold
                                                    cursor-pointer
                                                    transition-colors duration-200 

                                                ${disabled
                                                    ? "opacity-40 line-through cursor-not-allowed border-border text-(--linen-800)"
                                                    : isActive
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "border-border text-(--text-secondary) hover:border-primary"
                                                }
                                           `}
                                        >
                                            {s.size}

                                            {s.exists && !s.inStock && (
                                                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="w-full h-px bg-primary -rotate-12" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {sizeError && (
                            <p className="mt-1 text-[11px] font-semibold text-red-600">
                                Please select a size before adding to bag
                            </p>
                        )}
                        {/* ADD TO CART */}
                        <div className="flex justify-between gap-2 text-sm w-full my-4">
                            <button onClick={handleAddToCart}
                                className="
                                    cursor-pointer
                                    w-full
                                    p-3
                                    font-bold
                                    transition-colors duration-200
                                    hover:bg-(--btn-primary-bg)
                                    text-(--btn-primary-text)
                                    bg-(--btn-primary-hover)
                                "
                            >
                                ADD TO BAG
                            </button>
                        </div>


                        {/* ACCORDION */}
                        <div className="max-h-95 mt-3 overflow-y-auto scrollbar-hide my-4">
                            <Accordion
                                type="single"
                                collapsible
                                className="
                                        border
                                        border-border                                      
                                        p-2
                                    "
                            >
                                {product.description && (
                                    <AccordionItem value="description">
                                        <AccordionTrigger
                                            className="
                                                    text-foreground
                                                    font-semibold
                                                    hover:text-primary
                                                "
                                        >
                                            Description
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-(--text-secondary) leading-relaxed">
                                                {product.description}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                <AccordionItem value="productDetails">
                                    <AccordionTrigger
                                        className="
                                                text-foreground
                                                    font-semibold
                                                   hover:text-primary
                                            "
                                    >
                                        Product Details
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="text-sm text-(--text-secondary) space-y-2">
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <li key={key} className="flex gap-2">
                                                    <span className="font-semibold min-w-30 text-foreground">
                                                        {DETAILS_LABELS[key as keyof Product["details"]]}
                                                    </span>
                                                    <span>
                                                        {Array.isArray(value) ? value.join(", ") : value}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="returns">
                                    <AccordionTrigger
                                        className="
                                                text-foreground
                                                    font-semibold
                                                    hover:text-primary
                                            "
                                    >
                                        Returns and Exchange
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-(--text-secondary)">
                                            Standard returns and exchange policies apply.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="offers">
                                    <AccordionTrigger
                                        className="
                                                text-foreground
                                                    font-semibold
                                                    hover:text-primary
                                            "
                                    >
                                        Exclusive Offers
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-(--text-secondary)">
                                            Check for current discounts and deals.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <div>

                            {/* SUMMARY */}
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">Customer Reviews</h2>
                                <div className="flex items-center gap-3 mb-2">
                                    <Stars value={Math.round(product.rating || 0)} />
                                    <span className="text-sm text-gray-600">
                                        {product.rating?.toFixed(1) || "0.0"} / 5
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({product.reviews?.length || 0} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* REVIEW LIST */}
                            <div className="flex flex-col gap-5 h-60 overflow-y-auto">
                                {product.reviews?.length ? (
                                    product?.reviews?.map((review, index) => (
                                        <div
                                            key={index}
                                            className="border p-4 bg-gray-50"
                                        >
                                            <Stars value={review.rating} />

                                            <p className="text-sm mt-2">{review.comment}</p>

                                            <span className="text-xs text-gray-500 mt-1 block">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No reviews yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                {product?.category?.sizeType && (
                    <SizeChartModal
                        open={openSizeChart}
                        onClose={() => setOpenSizeChart(false)}
                        label={product.category.sizeType.label}
                        image={product.category.sizeType.chartImage}
                        productName={product.productName}
                    />
                )}

            </div>
            <div className="text-xl mb-30">
                {recommendations.length > 0 && (
                    <ProductHorizontalScroller
                        title="STYLE WITH"
                        products={recommendations.map(p => ({
                            _id: p._id,
                            slug: p.slug,
                            productName: p.productName,
                            price: p.pricing.price,
                            image:
                                p.thumbnail ||
                                p.variants?.[0]?.color.images?.[0]?.url ||
                                "",
                            variants: p.variants,
                        }))}
                    />
                )}
                {sameCategory.length > 0 && (
                    <ProductHorizontalScroller
                        title="SIMILAR ITEMS"
                        products={sameCategory.map(p => ({
                            _id: p._id,
                            slug: p.slug,
                            productName: p.productName,
                            price: p.pricing.price,
                            image:
                                p.thumbnail ||
                                p.variants?.[0]?.color.images?.[0]?.url ||
                                "",
                            variants: p.variants,
                        }))}
                    />
                )}

            </div>
            <div
                className={`
                    fixed bottom-0 left-0 w-full bg-white border-t border-border z-50
                    transition-transform duration-300
                    ${showBottomBar ? "translate-y-0" : "translate-y-full"}
                `}
            >
                <div className="
                        flex items-center justify-between
                        gap-2 sm:gap-3
                        px-2 sm:px-4
                        py-2
                        max-w-7xl mx-auto
                    ">

                    {/* LEFT: IMAGE + PRICE */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                        {/* IMAGE */}
                        <div className="
                                relative
                                w-14 h-18
                                sm:w-20 sm:h-25
                                rounded
                                overflow-hidden
                                border border-border
                                shrink-0
                            ">
                            {cartImage && (
                                <Image
                                    src={cartImage}
                                    alt={product.productName}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        {/* TEXT */}
                        <div className="flex flex-col truncate">
                            <span className="
                                text-[11px] text-sm min-[500px]:text-lg
                                text-(--text-secondary)
                                max-[400px]:truncate
                                sm:max-w-none
                                ">
                                {product.productName}
                            </span>

                            <span className="
                                text-sm sm:text-base
                                font-semibold
                                text-primary
                                ">
                                ₹ {activeVariant?.pricing?.price}
                            </span>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={handleAddToCart}
                        className="
                            cursor-pointer
                            px-3 sm:px-6
                            py-2 sm:py-3
                            text-xs sm:text-sm
                            font-bold
                            rounded-[3px]
                            transition-colors duration-200
                            hover:bg-(--btn-primary-bg)
                            text-(--btn-primary-text)
                            bg-(--btn-primary-hover)
                            whitespace-nowrap
                            shrink-0
                        "
                    >
                        ADD TO BAG
                    </button>

                </div>
            </div>



            <Footer />
        </Container>
    );
}