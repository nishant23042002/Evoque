"use client"
import Container from "@/components/Container";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useMemo, useState } from "react";
import EvoqueLogoLoader from "@/components/FlashLogo/EvoqueLoader";
import { Heart } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

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
        material: string,
        fabricWeight: string,
        stretch: string,
        washCare: [string],
        fitType: string,
        rise: string,
        closure: string,
    },
    sku: string;
    reviews: [string]
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



export default function ProductPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;

    const [cursor, setCursor] = useState<{
        x: number;
        y: number;
        direction: "left" | "right" | null;
    }>({
        x: 0,
        y: 0,
        direction: null,
    });
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);


    const searchParams = useSearchParams();
    const colorFromUrl = searchParams.get("color");
    const router = useRouter();

    useEffect(() => {
        if (!product) return;

        const validColor = product.variants.find(
            v => v.color.slug === colorFromUrl
        );

        if (validColor) {
            setSelectedColor(validColor.color.slug);
        } else {
            setSelectedColor(product.variants[0].color.slug);
        }
    }, [product, colorFromUrl]);


    /* ---------------- FETCH PRODUCT ---------------- */
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const fetchData = async () => {
            try {
                // 1️⃣ Fetch single product
                const res = await fetch(`/api/products/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const productData = await res.json();
                setProduct(productData);
            } catch (err) {
                console.error(err);
            } finally {
                // ⏳ force minimum 2s loader
                timer = setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };

        fetchData();

        return () => clearTimeout(timer);
    }, [slug]);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [selectedColor]);

    useEffect(() => {
        setSelectedSize(null);
    }, [selectedColor]);




    /* ---------------- DERIVED DATA ---------------- */

    const colorVariants = useMemo(() => {
        return (
            product?.variants.map(v => ({
                slug: v.color.slug,
                name: v.color.name,
                image:
                    v.color.images.find(img => img.isPrimary)?.url ||
                    v.color.images[0]?.url,
            })) ?? []
        );
    }, [product]);

    const activeVariant = useMemo(() => {
        return (
            product?.variants.find(v => v.color.slug === selectedColor) ??
            product?.variants[0]
        );
    }, [product, selectedColor]);

    const images = activeVariant?.color.images.map(img => img.url) ?? [];


    const sizes =
        activeVariant?.sizes.filter(s => s.stock > 0) ?? [];

    const handlePrevImage = () => {
        setActiveImageIndex(prev =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setActiveImageIndex(prev =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeft = e.clientX < rect.left + rect.width / 2;

        setCursor({
            x: e.clientX,
            y: e.clientY,
            direction: isLeft ? "left" : "right",
        });
    };

    const handleMouseLeave = () => {
        setCursor(prev => ({ ...prev, direction: null }));
    };

    const handleClick = () => {
        if (cursor.direction === "left") {
            handlePrevImage();
        } else {
            handleNextImage();
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <EvoqueLogoLoader />
            </div>
        );
    }

    if (!product) return <p className="ml-20 text-center font-poppins text-sm tracking-widest font-semibold text-slate-700">Fresh styles coming your way</p>;

    return (
        <Container>
            <div className="flex justify-around md:items-center flex-col">
                <div className="md:flex gap-2 justify-around my-1 px-1">
                    {/*Left Side */}
                    <div className="w-full flex gap-2 mt-1">
                        {/* Small Images Left side */}
                        <div className="absolute z-30 flex flex-col gap-2">
                            {images.map((img, i) => {
                                const isActive = activeImageIndex === i;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIndex(i)}
                                        className={`
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

                        {/* Big Images Left side */}
                        <div className="relative w-full flex flex-col md:items-center gap-4 overflow-y-auto max-h-[90vh] scrollbar-hide">

                            <div
                                className="relative w-full h-150 md:h-195 flex  justify-center group">
                                <Image
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={handleClick}
                                    src={images[activeImageIndex]}
                                    alt={product.productName}
                                    width={600}
                                    height={600}
                                    className="cursor-none object-cover transition-all duration-300"
                                />
                                {cursor.direction && (
                                    <div
                                        className="fixed z-999 pointer-events-none"
                                        style={{
                                            left: cursor.x,
                                            top: cursor.y,
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    >
                                        <div
                                            className="
                                                w-9 h-9
                                                rounded-sm
                                                backdrop-blur-md
                                                bg-white/55
                                                flex items-center justify-center
                                                transition-all duration-200
                                            "
                                        >

                                            {cursor.direction === "left" ? (
                                                <FaArrowLeftLong
                                                    className="text-xl"
                                                    style={{
                                                        color: activeVariant?.color?.hex || "#000000",

                                                    }}
                                                />
                                            ) : (
                                                <FaArrowRightLong
                                                    className="text-xl"
                                                    style={{
                                                        color: activeVariant?.color?.hex || "#000000",

                                                    }}
                                                />
                                            )}

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/*Right Side */}
                    <div className="lg:w-2xl w-full flex flex-col sticky top-20 px-1">
                        <div className="pb-4 max-md:pt-4 flex justify-between items-center">
                            <h1 className="text-sm md:text-lg font-bold text-slate-700">{product.productName.toUpperCase()}</h1>
                            <Heart className="hover:bg-brand-red rounded-full cursor-pointer duration-200 border p-1 hover:text-white" />
                        </div>
                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex justify-center items-center gap-3">
                                <span className="text-brand-red text-xl font-semibold">₹ {activeVariant?.pricing?.price}</span>
                                <span className="font-semibold text-sm text-slate-700 line-through decoration-red-500">{activeVariant?.pricing?.originalPrice}</span>
                            </div>
                            <div>
                                <span className="text-white bg-brand-red p-1 font-semibold rounded-sm">- {product.pricing.discountPercentage}%</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] font-semibold text-slate-700">SKU: {product.sku}</span>
                        </div>


                        {/*COLORS*/}
                        <div className="py-4 flex flex-col">
                            <h1 className="font-extrabold mb-2 text-slate-700">Colors</h1>
                            <div className="w-full flex flex-wrap items-center gap-2">
                                {colorVariants.map(color => {
                                    const isActive = selectedColor === color.slug;

                                    return (
                                        <button
                                            key={color.slug}
                                            onClick={() => {
                                                setSelectedColor(color.slug);
                                                router.replace(
                                                    `/products/${product.slug}?color=${color.slug}`,
                                                    { scroll: false }
                                                );
                                            }}
                                            className={`cursor-pointer
                                                         border
                                                        ${isActive
                                                    ? ""
                                                    : "border-slate-300 hover:border-slate-500"}
                                                   `}
                                            style={
                                                isActive
                                                    ? {
                                                        borderColor:
                                                            product.variants.find(
                                                                v => v.color.slug === color.slug
                                                            )?.color.hex || "#000000",
                                                        borderWidth: "2px",
                                                    }
                                                    : undefined
                                            }
                                        >
                                            <Image
                                                src={color.image}
                                                alt={color.name}
                                                width={70}
                                                height={70}
                                            />
                                            <span className="text-[10px] block text-center py-0.5">
                                                {color.name}
                                            </span>
                                        </button>
                                    );
                                })}

                            </div>
                        </div>


                        {/* SIZES */}
                        <div className="mt-4">
                            <h3 className="font-bold mb-2 text-slate-700">Sizes</h3>

                            <div className="flex flex-wrap items-center gap-2">
                                {sizes.map(size => {
                                    const isActive =
                                        selectedSize?.variantSku === size.variantSku;

                                    return (
                                        <button
                                            key={size.variantSku}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={!size.isAvailable}
                                            className={`border border-slate-400
                    px-3 py-1 rounded-sm text-sm font-bold text-slate-700                 
                    ${!size.isAvailable
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : ""}
                `}
                                            style={
                                                isActive
                                                    ? {
                                                        backgroundColor:
                                                            activeVariant?.color?.hex || "#334155",
                                                        color: "#fff",
                                                    }
                                                    : {
                                                        color: "#334155",
                                                    }
                                            }
                                        >
                                            {size.size}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>

                        <div className="flex justify-between gap-3 w-full my-4">
                            <button className="cursor-pointer w-full rounded-[5px] bg-black  text-white font-bold p-5">ADD TO BAG</button>
                            <button className="cursor-pointer w-full rounded-[5px] bg-brand-red-dark  text-white font-bold p-5">BUY NOW</button>
                        </div>
                        {/* Accordion */}
                        <div className="max-h-75 overflow-y-auto scrollbar-hide">
                            <Accordion type="single" collapsible className="mt-8 border border-slate-200 p-2">

                                {/* DESCRIPTION */}
                                {product.description && (
                                    <AccordionItem value="description">
                                        <AccordionTrigger>Description</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {product.description}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                {/* PRODUCT DETAILS */}
                                <AccordionItem value="details">
                                    <AccordionTrigger>Product Details</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="text-sm text-gray-700 space-y-2">
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <li key={key} className="flex gap-2">
                                                    <span className="font-semibold min-w-30">
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
                                <AccordionItem value="details">
                                    <AccordionTrigger>Returns and Exchange</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="text-sm text-gray-700 space-y-2">
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <li key={key} className="flex gap-2">
                                                    <span className="font-semibold min-w-30">
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
                                <AccordionItem value="details">
                                    <AccordionTrigger>Exclusive Offers</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="text-sm text-gray-700 space-y-2">
                                            {Object.entries(product.details).map(([key, value]) => (
                                                <li key={key} className="flex gap-2">
                                                    <span className="font-semibold min-w-30">
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

                            </Accordion>

                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
