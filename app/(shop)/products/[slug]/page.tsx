"use client"
import Container from "@/components/Container";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MasonryGrid from "@/components/Main/MasonryGrid";
import { useEffect, useMemo, useState } from "react";
import EvoqueLogoLoader from "@/components/FlashLogo/EvoqueLoader";
import { Heart } from "lucide-react";
import { useParams } from "next/navigation";

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

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    console.log(product);
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





    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <EvoqueLogoLoader />
            </div>
        );
    }

    if (!product) return <p className="ml-20">Product not found</p>;

    return (
        <Container>
            <div className="flex justify-around items-center flex-col">
                <div className="md:flex gap-2 justify-around my-1 px-1">
                    {/*Left Side */}
                    <div className="w-full flex gap-2 mt-1">
                        {/* Small Images Left side */}
                        <div className="absolute z-30 flex flex-col gap-2">
                            {images.map((img, i) => (
                                <div key={i} className="relative border border-slate-300 w-25 h-25">
                                    <Image src={img} alt={product.productName} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                        {/* Big Images Left side */}
                        <div className="relative w-full flex flex-col md:items-center gap-4 overflow-y-auto max-h-[90vh] scrollbar-hide">
                            {images.map((img, i) => (
                                <Image key={i} src={img} alt={product.productName} width={700} height={600} />
                            ))}
                        </div>
                    </div>


                    {/*Right Side */}
                    <div className="lg:w-3xl w-full flex flex-col sticky top-20 px-1">
                        <div className="pb-4 max-md:pt-4 flex justify-between items-center">
                            <h1 className="text-sm md:text-lg font-bold text-slate-700">{product.productName.toUpperCase()}</h1>
                            <Heart className="hover:bg-brand-red rounded-full cursor-pointer duration-200 border p-1 hover:text-white" />
                        </div>
                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex justify-center items-center gap-3">
                                <span className="text-brand-red text-xl font-semibold">₹ {product.pricing.price}</span>
                                <span className="font-semibold text-sm text-slate-700 line-through decoration-red-500">{product.pricing.originalPrice}</span>
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
                                {colorVariants.map(color => (
                                    <button
                                        key={color.slug}
                                        onClick={() => setSelectedColor(color.slug)}
                                        className={`border-2 cursor-pointer p-0.5 rounded-md hover:border-accent-peach ${selectedColor === color.slug
                                            ? "border-2 border-accent-peach"
                                            : ""
                                            }`}
                                    >
                                        <Image
                                            src={color.image}
                                            alt={color.name}
                                            width={70}
                                            height={70}
                                            className="rounded-sm"
                                        />
                                        <span className="text-[10px]">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* SIZES */}
                        <div className="mt-4">
                            <h3 className="font-bold mb-2 text-slate-700">Sizes</h3>

                            <div className="flex flex-wrap items-center gap-2">
                                {sizes.map(size => {
                                    const isDisabled = !size.isAvailable || size.stock <= 0;

                                    return (
                                        <button
                                            key={size.variantSku}
                                            disabled={isDisabled}
                                            className={`
                        relative px-3 py-1 border text-sm font-medium
                        transition
                        ${isDisabled
                                                    ? "border-slate-300 text-slate-400 cursor-not-allowed"
                                                    : "border-black hover:bg-black hover:text-white cursor-pointer"}
                    `}
                                        >
                                            {size.size}

                                            {/* Cross mark for unavailable sizes */}
                                            {isDisabled && (
                                                <>
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <span className="w-full h-[1px] bg-slate-400 rotate-45 absolute" />
                                                        <span className="w-full h-[1px] bg-slate-400 -rotate-45 absolute" />
                                                    </span>
                                                </>
                                            )}
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
            <div className="mt-15">
                <div>
                    <MasonryGrid />
                </div>
            </div>
        </Container>
    );
}
