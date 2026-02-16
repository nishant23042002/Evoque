"use client";
import Container from "@/components/Container";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { addWishlistItem, removeWishlistItem } from "@/store/wishlist/wishlist.thunks"
import Product, { Review } from "@/types/ProductTypes";
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
import { useAuth } from "@/components/AuthProvider";
import ImagePreviewModal from "@/components/ImagePreviewModal";


function MobileImageSlider({
    images,
    activeColor,
    onImageClick,
}: {
    images: string[];
    activeColor?: string;
    onImageClick: (index: number) => void;
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
                            onClick={() => onImageClick(i)}
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
    const [quantity, setQuantity] = useState(1);
    const [qtyWarning, setQtyWarning] = useState<string | null>(null);
    const { isAuthenticated, openLogin } = useAuth();

    const galleryRef = useRef<HTMLDivElement | null>(null);



    const isDesktop = useMediaQuery("(min-width: 1024px)");

    // UI state
    const [openSizeChart, setOpenSizeChart] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    // Selection state
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
    const [outOfStockMsg, setOutOfStockMsg] = useState(false);

    // Gallery state
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    const [showBottomBar, setShowBottomBar] = useState(false);

    const openPreview = (i: number) => {
        setPreviewIndex(i);
        setPreviewOpen(true);
    };

    const nextPreview = () => {
        setPreviewIndex((p) => (p + 1) % images.length);
    };

    const prevPreview = () => {
        setPreviewIndex((p) =>
            p === 0 ? images.length - 1 : p - 1
        );
    };

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
    }, [product?._id]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowBottomBar(prev => {
                const next = scrollY > 500;
                return prev === next ? prev : next;
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const activeIndexRef = useRef(0);

    useEffect(() => {
        const container = galleryRef.current;
        if (!container) return;

        let rafId: number | null = null;

        const handleScroll = () => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                const scrollTop = container.scrollTop;

                let closestIndex = 0;
                let minDiff = Infinity;

                imageRefs.current.forEach((el, i) => {
                    if (!el) return;

                    const diff = Math.abs(el.offsetTop - scrollTop);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndex = i;
                    }
                });

                // ONLY update if changed
                if (activeIndexRef.current !== closestIndex) {
                    activeIndexRef.current = closestIndex;
                    setActiveImageIndex(closestIndex);
                }

                rafId = null;
            });
        };

        container.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            container.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [images.length]);


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



    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 2000);
            return;
        }
        if (!isAuthenticated) {
            openLogin();
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
                quantity: quantity,
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

        setQuantity(1);

    };
    const handleWishlistToggle = () => {
        if (!product) return;
        if (!isAuthenticated) {
            openLogin();
            return;
        }

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

    const activeColorObj = colorVariants.find(
        (c) => c.slug === selectedColor
    );




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
            <div className="relative w-full min-h-screen lg:h-screen">
                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        justify-evenly
                        lg:h-screen
                    "
                >
                    {/* LEFT: IMAGES */}
                    {isDesktop ? (
                        <div
                            ref={galleryRef}
                            className="
                                relative
                                md:w-[60%]
                                lg:w-[50%]
                                aspect-4/5
                                h-full
                                overflow-y-auto
                                overscroll-contain
                                scrollbar-hide
                            "
                        >
                            {/* THUMBNAILS OVERLAY */}
                            <div className="sticky top-0 left-0 z-30 w-fit">
                                <div className="absolute left-0 top-0 flex flex-col gap-1 w-22.5">
                                    {images.map((img, i) => {
                                        const isActive = activeImageIndex === i;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => scrollToImage(i)}
                                                className={`relative w-22 h-28 border transition-all duration-200 bg-white/70 backdrop-blur
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
                                                <Image
                                                    src={img}
                                                    alt={product.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* MAIN IMAGES */}
                            <div className="flex flex-col gap-4">
                                {images.map((img, i) => (
                                    <div
                                        key={i}
                                        ref={(el) => {
                                            imageRefs.current[i] = el;
                                        }}

                                        className="relative w-full aspect-4/5"
                                    >
                                        <Image
                                            src={img}
                                            alt={product.productName}
                                            fill
                                            onClick={() => openPreview(i)}
                                            className="cursor-pointer object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>


                    ) : (
                        <MobileImageSlider
                            images={images}
                            activeColor={activeVariant?.color?.hex}
                            onImageClick={openPreview}
                        />
                    )}


                    {/* RIGHT: DETAILS */}
                    <div
                        className="
                            max-lg:px-3
                            lg:w-[40%]
                            w-full
                            lg:sticky
                            lg:top-0
                            h-fit
                            self-start
                            py-2
                            lg:py-20
                            "
                    >
                        <div className="flex flex-col">

                            <div className="flex justify-between items-center w-full">
                                <h1 className="text-sm md:text-lg font-extralight text-(--earth-charcoal)">
                                    {product.productName.toUpperCase()}
                                </h1>
                                <button
                                    onClick={handleWishlistToggle}

                                >
                                    <Heart
                                        strokeWidth={1.4}
                                        className="h-6 w-6 cursor-pointer transition-all duration-200"
                                        style={
                                            isWishlisted
                                                ? {
                                                    fill: activeVariant?.color?.hex || "#000",
                                                    color: activeVariant?.color?.hex || "#000",
                                                    transform: "scale(1.1)",
                                                    stroke: "var(--border-strong)"
                                                }
                                                : {
                                                    color: "var(--text-secondary)",
                                                    stroke: "var(--border-strong)"
                                                }
                                        }
                                    />
                                </button>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-col">
                                    <div className="flex gap-1 items-center">
                                        <span className="text-red-600 font-semibold">
                                            Rs.{activeVariant?.pricing?.price}
                                        </span>
                                        <span className="text-[12px] line-through">Rs.{activeVariant?.pricing?.originalPrice}</span>
                                    </div>
                                    <div className="text-xs">
                                        <span>MRP excluding of taxes</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="bg-black text-white text-[10px] p-1 font-semibold">
                                        - {product.pricing.discountPercentage}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-medium">
                                    SKU: {product.sku}</span>
                            </div>
                        </div>


                        {/* COLORS */}
                        <div className="py-2 flex flex-col">
                            <h1 className="font-light mb-1 text-md">
                                Colors: <span className="font-light text-sm">{activeColorObj ? activeColorObj.name : ""}</span>
                            </h1>

                            <div className="flex flex-row flex-nowrap items-center gap-1 w-full overflow-x-auto scrollbar-hide">
                                {colorVariants.map((color) => {
                                    const isActive = selectedColor === color.slug;
                                    return (
                                        <button
                                            key={color.slug}
                                            onClick={() => {
                                                setSelectedColor(color.slug);
                                                router.replace(`/products/${product.slug}?color=${color.slug}`, { scroll: false });
                                            }}
                                            className={`shrink-0 cursor-pointer border ${isActive ? "" : "border-border hover:border-black"
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
                                                <div className="aspect-3/4 ">
                                                    <Image src={color.image} className="object-cover aspect-3/4" alt={color.name} width={70} height={70} />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                        {/* SIZES */}
                        <div className="py-2">
                            <div className="flex justify-between">
                                <div className="flex gap-2 items-center justify-center">

                                    <h3 className="font-light text-foreground">
                                        Sizes:
                                    </h3>
                                    <div>{outOfStockMsg && (
                                        <p className="text-xs text-red-500">
                                            Out of Stock
                                        </p>
                                    )}</div>
                                </div>

                                <h1
                                    onClick={() => setOpenSizeChart(true)}
                                    className="text-sm font-medium hover:text-primary cursor-pointer hover:underline"
                                >
                                    Size Chart
                                </h1>

                            </div>

                            <div className="mt-1 flex flex-row flex-nowrap items-center gap-1 w-full overflow-x-auto scrollbar-hide">
                                {sizes.map(s => {
                                    const isActive = selectedSize?.variantSku === s.variant?.variantSku;
                                    const disabled = !s.exists || !s.isAvailable || !s.inStock;

                                    return (
                                        <button
                                            key={s.size}
                                            onClick={() => {
                                                if (disabled) {
                                                    setOutOfStockMsg(true);
                                                    setTimeout(() => setOutOfStockMsg(false), 1500);
                                                    return;
                                                }

                                                setOutOfStockMsg(false);
                                                if (s.variant) setSelectedSize(s.variant);
                                            }}
                                            className={`
                                                        relative
                                                        border
                                                        w-14 h-10
                                                        text-sm
                                                        cursor-pointer
                                                        ${disabled
                                                    ? "line-through border hover:border-black opacity-60"
                                                    : isActive
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "border border-(--border-light) text-(--text-secondary) hover:border-primary"
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
                            {sizeError && (
                                <p className="text-[11px] font-semibold text-red-600">
                                    Please select a size before adding to bag
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="py-2">
                            <h3 className="font-light mb-1 text-foreground">
                                Quantity:
                            </h3>
                            <div className="flex gap-2 items-center">
                                <div className="flex w-20 items-center justify-center border border-(--border-light) hover:border-black px-5 py-1.5 gap-3">
                                    <button
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (quantity <= 1) {
                                                setQtyWarning("Minimum quantity is 1");
                                                setTimeout(() => setQtyWarning(null), 1200);
                                                return;
                                            }
                                            setQuantity(q => q - 1);
                                        }}
                                    >
                                        −
                                    </button>

                                    <span>{quantity}</span>

                                    <button
                                        className="cursor-pointer"
                                        onClick={() => setQuantity(q => q + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div>
                                    {qtyWarning && (
                                        <div className=" text-red-600 text-xs z-50">
                                            {qtyWarning}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* ADD TO CART */}
                        <div className="flex justify-between gap-2 text-sm w-full my-4">
                            <button onClick={handleAddToCart}
                                className="
                                    cursor-pointer
                                    w-full
                                    p-3
                                    transition-colors duration-200
                                    hover:bg-(--btn-primary-bg)
                                    text-(--btn-primary-text)
                                    bg-black
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
                                        border-(--border-light)                                 
                                        p-2
                                    "
                            >
                                {product.description && (
                                    <AccordionItem value="description">
                                        <AccordionTrigger
                                            className="
                                                    text-foreground
                                                    font-light cursor-pointer
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
                                                    font-light cursor-pointer
                                                   hover:text-primary
                                            "
                                    >
                                        Product Details
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="text-sm text-(--text-secondary) space-y-2">
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <li key={key} className="flex gap-2">
                                                    <span className="font-medium min-w-30 text-foreground">
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
                                                    font-light cursor-pointer
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
                                                    font-light cursor-pointer
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

                        {/* CUSTOMER REVIEW */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-1">
                                    <h2 className="font-light">Reviews</h2>
                                    <p>[ {product.reviews?.length || 0} ]</p>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Stars value={Math.round(product.rating || 0)} />
                                    <span className="text-sm">
                                        {product.rating?.toFixed(1) || "0.0"}
                                    </span>
                                </div>
                            </div>

                            {/* REVIEW LIST */}
                            <div className="flex flex-col gap-5 h-30 overflow-y-auto">
                                {product.reviews?.length ? (
                                    product?.reviews?.map((review: Review, index) => {

                                        return (
                                            <div
                                                key={index}
                                                className="border border-(--border-light) p-2 bg-gray-50"
                                            >
                                                <Stars value={review.rating} />

                                                <p className="text-sm mt-2">{review.comment}</p>

                                                <span className="text-xs text-gray-500 mt-1 block">
                                                    {(() => {
                                                        const d = new Date(review.createdAt);
                                                        return isNaN(d.getTime())
                                                            ? "—"
                                                            : d.toLocaleDateString("en-IN", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            });
                                                    })()}
                                                </span>
                                            </div>
                                        )
                                    })
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
            <div className="text-lg">
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
                            <div className="flex items-center gap-2">
                                <span className="
                                text-sm sm:text-base
                                font-semibold
                                text-red-600
                                ">
                                    Rs.{activeVariant?.pricing?.price}
                                </span>
                                <span className="line-through text-xs">Rs.{activeVariant?.pricing?.originalPrice}</span>
                            </div>

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
                            transition-colors duration-200
                            hover:bg-(--btn-primary-bg)
                            text-white
                            bg-black
                            whitespace-nowrap
                            shrink-0
                        "
                    >
                        ADD TO BAG
                    </button>

                </div>
            </div>


            {previewOpen && (
                <ImagePreviewModal
                    images={images}
                    index={previewIndex}
                    onClose={() => setPreviewOpen(false)}
                    onNext={nextPreview}
                    onPrev={prevPreview}
                />
            )}

            <Footer />
        </Container>
    );
}