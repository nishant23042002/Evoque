import Container from "@/components/Container";
import Image from "next/image";
import { clothingItems } from "@/data/clothingItems";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MasonryGrid from "@/components/MasonryGrid";

interface ProductPageParams {
    slug: string;
}

interface ProductPageProps {
    params: Promise<ProductPageParams>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    const product = clothingItems.find(
        (item) => item.slug === slug
    );

    if (!product) {
        return <div className="ml-20">Product not found</div>;
    }

    return (
        <Container>
            <div className="flex flex-col">
                <div className="md:flex gap-2 justify-evenly ml-15 mt-2">
                    {/*Left Side */}
                    <div className="w-full flex gap-2">
                        {/* Small Images Left side */}
                        <div className="absolute opacity-0 sm:opacity-90 z-30 flex flex-col gap-2">
                            <div className="relative w-30 h-30">
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-30 h-30">
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-30 h-30">
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-30 h-30">
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-30 h-30">
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>


                        </div>
                        {/* Big Images Left side */}
                        <div className="relative w-full flex flex-col md:items-center gap-4 overflow-y-auto max-h-[90vh] scrollbar-hide">
                            <Image
                                src={product.image}
                                alt={`Product Image ${product.title + 1}`}
                                width={600}
                                height={600}
                            />
                            <Image
                                src={product.image}
                                alt={`Product Image ${product.title + 1}`}
                                width={600}
                                height={600}
                            />
                            <Image
                                src={product.image}
                                alt={`Product Image ${product.title + 1}`}
                                width={600}
                                height={600}
                            />
                            <Image
                                src={product.image}
                                alt={`Product Image ${product.title + 1}`}
                                width={600}
                                height={600}
                            />
                        </div>
                    </div>
                    {/*Right Side */}
                    <div className="lg:w-3xl w-full flex flex-col sticky top-20 mr-2">
                        <div className="py-4 flex justify-around items-center">
                            <h1 className="text-sm md:text-xl font-bold text-slate-900">{product.title}</h1>
                            <p className="text-sm md:text-xl font-semibold text-slate-900">{product.price} <span className="text-gray-700 text-[11px]">MRP</span></p>
                        </div>
                        {/*COLORS*/}
                        <div className="py-4 flex flex-col">
                            <h1 className="text-center font-extrabold mb-2 text-slate-900">Colors</h1>
                            <div className="w-full flex flex-wrap justify-center items-center md:flex-nowrap gap-2 md:overflow-x-auto scrollbar-hide">
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    width={70}
                                    height={70}
                                />
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    width={70}
                                    height={70}
                                />
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    width={70}
                                    height={70}
                                />
                                <Image
                                    src={product.image}
                                    alt={`Product Image ${product.title + 1}`}
                                    width={70}
                                    height={70}
                                />

                            </div>
                        </div>
                        {/*SIZES*/}
                        <div className="py-4 flex flex-col justify-center items-center">
                            <h1 className="text-center font-extrabold mb-2 text-slate-900">Sizes</h1>
                            <div className="max-w-140 flex flex-wrap gap-3">
                                <span className="border border-black p-2 hover:bg-black hover:text-white hoverEffect">XS</span>
                                <span className="border border-black p-2 hover:bg-black hover:text-white hoverEffect">S</span>
                                <span className="border border-black p-2 hover:bg-black hover:text-white hoverEffect">M</span>
                                <span className="border border-black p-2 hover:bg-black hover:text-white hoverEffect">L</span>
                                <span className="border border-black p-2 hover:bg-black hover:text-white hoverEffect">XL</span>
                            </div>
                            <p className="text-[11px] sm:text-sm my-2">FREE 1-2 day delivery on 5k+ pincodes</p>
                        </div>
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
                    <div>
                       <h1 className="p-4 text-center font-bold text-xl">You may also like</h1>
                    </div>
                    <div className="max-[490px]:ml-16 ml-19 mr-1">
                        <MasonryGrid items={clothingItems} />
                    </div>
                </div>


            </div>
        </Container>
    );
}
