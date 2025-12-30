"use client"
import Container from "@/components/Container";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MasonryGrid from "@/components/Main/MasonryGrid";
import { useEffect, useState } from "react";
import CometLogoLoader from "@/components/CometLoader";

interface ColorVariant {
    slug: string;
    hex: string;
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
    images: string[];
    price: number;
    originalPrice: number;
    brand: string;
    rating: number;
    category: Category;
    colors?: ColorVariant[];
    sizes?: string[];
    description?: string;
}

interface ProductPageProps {
    params: {
        slug: string;
    };
}
export default function ProductPage({ params }: ProductPageProps) {
    const { slug } = params;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        const fetchData = async () => {
            try {
                // 1️⃣ Fetch single product
                const res = await fetch(`/api/products/${slug}`);
                if (!res.ok) throw new Error("Product not found");
                const productData = await res.json();
                setProduct(productData);

                // 2️⃣ Fetch related products
                const allRes = await fetch("/api/products");
                const allProducts: Product[] = await allRes.json();

                const related = allProducts.filter(
                    (p) =>
                        p._id !== productData._id &&
                        p.category._id === productData.category._id
                );

                setRelatedProducts(related);
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

    const SIZE_GROUPS = {
        topwear: ["XS", "S", "M", "L", "XL", "XXL"],
        bottomwear: ["28", "30", "32", "34", "36", "38", "40"],
    };
    const categorySlug = product?.category?.slug?.toLowerCase() ?? "";

    const isBottomWear = ["jeans", "trousers", "pants"].includes(categorySlug);

    const ALL_SIZES = isBottomWear
        ? SIZE_GROUPS.bottomwear
        : SIZE_GROUPS.topwear;

    const availableSizes = product?.sizes ?? [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <CometLogoLoader />
            </div>
        );
    }

    if (!product) return <p className="ml-20">Product not found</p>;

    const images = Array(4).fill(product.images);
    return (
        <Container>
            <div className="flex flex-col">
                <div className="md:flex gap-2 justify-evenly my-2 min-[768px]:ml-16 ml-13 mr-1">
                    {/*Left Side */}
                    <div className="w-full flex gap-2">
                        {/* Small Images Left side */}
                        <div className="absolute opacity-0 sm:opacity-90 z-30 flex flex-col gap-2">
                            {images.map((img, i) => (
                                <div key={i} className="relative w-30 h-30">
                                    <Image src={product.images[0]} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                        {/* Big Images Left side */}
                        <div className="relative w-full flex flex-col md:items-center gap-4 overflow-y-auto max-h-[90vh] scrollbar-hide">
                            {images.map((img, i) => (
                                <Image key={i} src={product.images[0]} alt={product.productName} width={600} height={600} />
                            ))}
                        </div>
                    </div>


                    {/*Right Side */}
                    <div className="lg:w-3xl w-full flex flex-col sticky top-20 mr-2">
                        <div className="py-4 flex justify-around items-center">
                            <h1 className="text-sm md:text-xl font-bold text-slate-900">{product.productName}</h1>
                            <p className="text-sm md:text-xl font-semibold text-slate-900">{product.price} <span className="text-gray-700 text-[11px] line-through decoration-red-500">{product.originalPrice}</span></p>
                        </div>


                        {/*COLORS*/}
                        <div className="py-4 flex flex-col">
                            <h1 className="text-center font-extrabold mb-2 text-slate-900">Colors</h1>
                            <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                {images.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={product.images[0]}
                                        alt={product.productName}
                                        width={70}
                                        height={70}
                                    />
                                ))}

                            </div>
                        </div>


                        {/*SIZES*/}

                        {product.sizes && (
                            <div className="py-4 flex flex-col justify-center items-center">
                                <h1 className="font-extrabold mb-2">Sizes</h1>

                                <div className="max-w-140 flex flex-wrap gap-3">
                                    {ALL_SIZES?.map((size) => {
                                        const isAvailable = availableSizes.includes(size);

                                        return (
                                            <span
                                                key={size}
                                                className={`
                                                            border p-2 select-none
                                                            ${isAvailable
                                                        ? "cursor-pointer border-black hover:bg-black hover:text-white hoverEffect"
                                                        : "cursor-not-allowed border-gray-300 text-gray-400 line-through opacity-60"
                                                    }
                                                            `}
                                            >

                                                {size}
                                            </span>
                                        );
                                    })}
                                </div>

                                <p className="text-[11px] sm:text-sm my-2">
                                    FREE 1-2 day delivery on 5k+ pincodes
                                </p>
                            </div>
                        )}


                        <div className="w-full my-4 px-6">
                            <button className="bg-black w-full text-white font-bold p-5">ADD TO BAG</button>
                        </div>
                        {/* Accordion */}
                        <div className="px-6 max-h-75 overflow-y-auto scrollbar-hide">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="font-semibold cursor-pointer">DETAILS</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="product-accordion-content">
                                            <section className="mb-4">
                                                <p className="text-sm leading-tight text-gray-700">
                                                    Tan suede-like jacket with a relaxed fit, featuring a notch lapel and snap button closure.
                                                    Crafted from a durable polyester blend with spandex for flexibility, it offers a stylish
                                                    yet comfortable look. Perfect for layering during cooler days, this jacket combines
                                                    functionality with modern design.
                                                </p>
                                            </section>


                                            <section className="mb-4">
                                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Size &amp; Fit</h3>
                                                <ul className="text-sm text-gray-700 list-disc leading-tight pl-5 space-y-1">
                                                    <li><strong>Fit:</strong> Relaxed Fit</li>
                                                    <li><strong>Size:</strong> Model is wearing size M</li>
                                                </ul>
                                            </section>

                                            <section className="mb-4">
                                                <h3 className="text-sm leading-tight font-semibold text-slate-900 mb-1">Wash Care</h3>
                                                <p className="text-sm leading-tight text-gray-700">Machine Wash</p>
                                            </section>


                                            <section className="mb-4">
                                                <h3 className="text-sm font-semibold text-slate-900 mb-1">Specifications</h3>
                                                <ul className="text-sm text-gray-700 leading-tight list-disc pl-5 space-y-1">
                                                    <li>Casual Wear</li>
                                                    <li>Plain</li>
                                                    <li>Classic</li>
                                                    <li>Poly Blend</li>
                                                    <li>Full Sleeve</li>
                                                </ul>
                                            </section>


                                            <section>
                                                <p className="text-xs text-gray-500">
                                                    <strong>SKU:</strong> 4MSK8779-01
                                                </p>
                                            </section>

                                        </div>

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="font-semibold cursor-pointer">DELIVERY</AccordionTrigger>
                                    <AccordionContent>

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="font-semibold cursor-pointer">RETURNS</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="leading-5 sm:leading-7">
                                            <li>

                                                1.
                                                Hassle-free returns within 7 days under specific product and promotion conditions.
                                            </li>
                                            <li>
                                                2.
                                                Refunds for prepaid orders revert to the original payment method, while COD orders receive a wallet refund.
                                            </li>
                                            <li>
                                                3.
                                                Report defective, incorrect, or damaged items within 24 hours of delivery.
                                            </li>
                                            <li>
                                                4.
                                                Products bought during special promotions like BOGO are not eligible for returns.
                                            </li>
                                            <li>
                                                5.
                                                For excessive returns, reverse shipment fee upto Rs 100 can be charged, which will be deducted from the refund
                                            </li>
                                            <li>
                                                6.
                                                Non-returnable items include accessories, sunglasses, perfumes, masks, and innerwear due to hygiene concerns.
                                            </li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h1 className="p-3 text-center font-bold text-xl">
                        You may also like
                    </h1>
                    <div className="max-[768px]:ml-14 ml-19 mr-2">
                        <MasonryGrid />
                    </div>
                </div>

            </div>
        </Container>
    );
}
