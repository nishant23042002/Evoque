"use client";
import Container from "@/components/Container";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useMemo, useState } from "react";
import EvoqueLogoLoader from "@/components/FlashLogo/LayerLogo";
import { Heart } from "lucide-react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

/* ====================
   TYPES
==================== */
interface VariantImage {
    url: string;
    isPrimary?: boolean;
}

interface SizeVariant {
    size: string;
    variantSku: string;
    stock: number;
    isAvailable: boolean;
}

interface ColorVariant {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
}

interface Variant {
    color: ColorVariant;
    sizes: SizeVariant[];
    pricing?: {
        price?: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    totalStock: number;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface Product {
    _id: string;
    productName: string;
    slug: string;
    brand: string;
    rating: number;
    category: Category;
    pricing: {
        price: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    variants: Variant[];
    details: {
        material: string;
        fabricWeight: string;
        stretch: string;
        washCare: string[];
        fitType: string;
        rise: string;
        closure: string;
    };
    sku: string;
    reviews: string[];
    description?: string;
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

/* ====================
   SIZE SCALES
==================== */
const sizeScaleMap: Record<string, string[]> = {
    shirts: ["XS", "S", "M", "L", "XL", "XXL"],
    tshirts: ["XS", "S", "M", "L", "XL"],
    jeans: ["28", "30", "32", "34", "36"],
    trousers: ["28", "30", "32", "34", "36"],
};

/* ====================
   COMPONENT
==================== */
export default function ProductPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;
    const router = useRouter();
    const searchParams = useSearchParams();
    const colorFromUrl = searchParams.get("color");

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [cursor, setCursor] = useState<{ x: number; y: number; direction: "left" | "right" | null }>({ x: 0, y: 0, direction: null });

    /* ---------------- FETCH PRODUCT ---------------- */
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/products/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const productData = await res.json();
                setProduct(productData);
            } catch (err) {
                console.error(err);
            } finally {
                timer = setTimeout(() => setLoading(false), 800);
            }
        };
        fetchData();
        return () => clearTimeout(timer);
    }, [slug]);

    /* ---------------- COLOR & SIZE SELECTION ---------------- */
    useEffect(() => {
        if (!product) return;
        const validColor = product.variants.find(v => v.color.slug === colorFromUrl);
        setSelectedColor(validColor?.color.slug || product.variants[0].color.slug);
    }, [product, colorFromUrl]);

    useEffect(() => setActiveImageIndex(0), [selectedColor]);
    useEffect(() => setSelectedSize(null), [selectedColor]);

    /* ---------------- DERIVED DATA ---------------- */
    const activeVariant = useMemo(() => product?.variants.find(v => v.color.slug === selectedColor) ?? product?.variants[0], [product, selectedColor]);
    const images = activeVariant?.color.images.map(img => img.url) ?? [];
    const colorVariants = useMemo(() => product?.variants.map(v => ({
        slug: v.color.slug,
        name: v.color.name,
        image: v.color.images.find(img => img.isPrimary)?.url || v.color.images[0]?.url,
    })) ?? [], [product]);

    const sizes = useMemo(() => {
        if (!product || !activeVariant) return [];

        const scale = sizeScaleMap[product.category.slug] || sizeScaleMap["shirts"];
        const sizeMap = new Map(activeVariant.sizes.map(s => [s.size, s]));

        return scale.map(size => {
            const variant = sizeMap.get(size);
            return {
                size,
                variant, // <-- keep original object
                exists: !!variant,
                inStock: variant?.stock ? true : false,
                isAvailable: variant?.isAvailable ?? false,
            };
        });
    }, [activeVariant, product]);


    /* ---------------- IMAGE ARROWS ---------------- */
    const handlePrevImage = () => setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    const handleNextImage = () => setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeft = e.clientX < rect.left + rect.width / 2;
        setCursor({ x: e.clientX, y: e.clientY, direction: isLeft ? "left" : "right" });
    };
    const handleMouseLeave = () => setCursor(prev => ({ ...prev, direction: null }));
    const handleClick = () => { if (cursor.direction === "left") handlePrevImage(); else handleNextImage(); };

    if (loading) return <div className="flex items-center justify-center h-[70vh]"><EvoqueLogoLoader /></div>;
    if (!product) return <p className="ml-20 text-center font-poppins text-sm tracking-widest font-semibold text-slate-700">Fresh styles coming your way</p>;

    return (
        <Container>
            <div className="flex md:w-[90%] mx-auto flex-col w-full">
                <div className=" w-full mx-auto lg:flex gap-2 justify-between">

                    {/* LEFT: IMAGES */}
                    <div className="w-full flex gap-2 relative">

                        {/* THUMBNAILS */}
                        <div className="absolute left-0 z-30 flex flex-col gap-2">
                            {images.map((img, i) => {
                                const isActive = activeImageIndex === i;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIndex(i)}
                                        className={`cursor-pointer
                                                relative w-25 h-25 border transition-all duration-200
                                                ${isActive
                                                ? ""
                                                : "border-slate-300 hover:border-slate-500"}
                                            `}
                                        style={
                                            isActive
                                                ? {
                                                    borderColor:
                                                        activeVariant?.color?.hex || "#000000",
                                                    borderWidth: "2px",
                                                }
                                                : undefined
                                        }
                                    >
                                        <Image
                                            src={img}
                                            alt={product.productName}
                                            fill
                                            sizes="(max-width: 640px) 100vw,
                                                        (max-width: 1024px) 50vw,
                                                        33vw"
                                            className="object-cover w-auto h-auto"
                                        />
                                    </button>
                                );
                            })}


                        </div>

                        {/* MAIN IMAGE */}
                        <div className="relative w-full flex flex-col gap-4 overflow-y-auto max-h-[90vh] scrollbar-hide">
                            <div className="relative w-full overflow-y-auto h-125 md:h-195 flex justify-items-start group">
                                <Image
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={handleClick}
                                    src={images[activeImageIndex]}
                                    alt={product.productName}
                                    width={800}
                                    height={800}
                                    className="cursor-none object-[10%_20%] object-cover transition-all duration-300"
                                />
                                {cursor.direction && (
                                    <div className="fixed z-50 pointer-events-none" style={{ left: cursor.x, top: cursor.y, transform: "translate(-50%, -50%)" }}>
                                        <div className="w-9 h-9 rounded-sm backdrop-blur-md bg-black/55 flex items-center justify-center transition-all duration-200">
                                            {cursor.direction === "left" ? <FaArrowLeftLong className="text-xl" style={{ color: activeVariant?.color?.hex || "#000" }} /> : <FaArrowRightLong className="text-xl" style={{ color: activeVariant?.color?.hex || "#000" }} />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="lg:w-4xl w-full flex flex-col p-3 lg:py-7">
                        <div className="flex justify-between items-center">
                            <h1 className="text-sm md:text-lg font-bold text-slate-700">{product.productName.toUpperCase()}</h1>
                            <Heart className="hover:bg-brand-red rounded-full cursor-pointer duration-200 border border-black/15 p-1 hover:text-white" />
                        </div>

                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex justify-center items-center gap-3 my-1.5">
                                <span className="text-brand-red text-lg font-semibold">₹ {activeVariant?.pricing?.price}</span>
                                <span className="font-semibold text-[12px] text-[#5a5858] line-through decoration-red-500">{activeVariant?.pricing?.originalPrice}</span>
                            </div>
                            <div><span className="text-white text-[10px] bg-brand-red p-1 font-semibold rounded-sm">- {product.pricing.discountPercentage}%</span></div>
                        </div>

                        <div><span className="text-[10px] font-semibold text-text-[#5a5858]">SKU: {product.sku}</span></div>

                        {/* COLORS */}
                        <div className="py-2 flex flex-col">
                            <h1 className="font-extrabold mb-1 text-slate-700">Colors</h1>

                            <div className="flex flex-row flex-nowrap items-center gap-2 w-full overflow-x-auto scrollbar-hide">
                                {colorVariants.map((color) => {
                                    const isActive = selectedColor === color.slug;

                                    return (
                                        <button
                                            key={color.slug}
                                            onClick={() => {
                                                setSelectedColor(color.slug);
                                                router.replace(`/products/${product.slug}?color=${color.slug}`, { scroll: false });
                                            }}
                                            className={`shrink-0 cursor-pointer border ${isActive ? "" : "border-gray-300 hover:border-gray-500"
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
                                            <div className="w-18 h-31.5 flex flex-col justify-between items-center">
                                                <Image src={color.image} className="object-cover h-full w-full" alt={color.name} width={70} height={70} />
                                                <span className="text-[10px] block text-center py-0.5">{color.name}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                        {/* SIZES */}
                        <div className="py-2">
                            <h3 className="font-bold mb-1 text-slate-700">{product.category.slug === "jeans" ? "Choose Waist" : "Select Size"}</h3>
                            <div className="flex flex-row flex-nowrap items-center gap-2 w-full overflow-x-auto scrollbar-hide">
                                {sizes.map(s => {
                                    const isActive = selectedSize?.variantSku === s.variant?.variantSku;
                                    const disabled = !s.exists || !s.isAvailable || !s.inStock;

                                    return (
                                        <button
                                            key={s.size}
                                            disabled={disabled}
                                            onClick={() => s.variant && setSelectedSize(s.variant)} // ✅ Use original SizeVariant
                                            className={`border border-black/15 px-3 py-1 text-sm font-bold cursor-pointer ${disabled ? "opacity-40 line-through cursor-not-allowed" : isActive ? "bg-black text-white" : "text-[#5a5858]"}`}
                                        >
                                            {s.size}
                                            {s.exists && !s.inStock && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <span className="w-full h-px bg-black -rotate-12" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}

                            </div>
                        </div>

                        {/* ADD TO CART */}
                        <div className="flex justify-between gap-2 text-sm w-full my-4">
                            <button className="cursor-pointer w-full rounded-[5px] bg-black/80 text-white font-bold p-3">ADD TO BAG</button>
                            <button className="cursor-pointer w-full rounded-[5px] bg-brand-red text-white font-bold p-3">BUY NOW</button>
                        </div>

                        {/* ACCORDION */}
                        <div className="max-h-75 overflow-y-auto scrollbar-hide my-4">
                            <Accordion type="single" collapsible className="border border-black/15 p-2">
                                {product.description && (
                                    <AccordionItem value="description">
                                        <AccordionTrigger className="text-slate-700 font-semibold">Description</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                <AccordionItem value="productDetails">
                                    <AccordionTrigger className="text-slate-700 font-semibold">Product Details</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="text-sm text-gray-700 space-y-2">
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <li key={key} className="flex gap-2">
                                                    <span className="font-semibold min-w-30">{DETAILS_LABELS[key as keyof Product["details"]]}</span>
                                                    <span>{Array.isArray(value) ? value.join(", ") : value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="returns">
                                    <AccordionTrigger className="text-slate-700 font-semibold">Returns and Exchange</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-gray-700">Standard returns and exchange policies apply.</p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="offers">
                                    <AccordionTrigger className="text-slate-700 font-semibold">Exclusive Offers</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-gray-700">Check for current discounts and deals.</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
