"use client";

import Image from "next/image";
import Link from "next/link";
import { MdDeleteOutline } from "react-icons/md";
import { Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addWishlistItem } from "@/store/wishlist/wishlist.thunks";
import { fetchCart, removeCartItem, updateCartQuantity } from "@/store/cart/cart.thunks";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer/Footer";
import ProductHorizontalScroller from "@/components/Main/ProductHorizontalScroller";
import { showProductToast } from "@/store/ui/ui.slice";
import { updateQuantityLocal } from "@/store/cart/cart.slice";

interface CheckoutSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    totalAmount: number;
}

interface CheckoutResponse {
    summary: CheckoutSummary;
}


export default function CartPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const [summaryData, setSummaryData] = useState<CheckoutResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [qtyWarning, setQtyWarning] = useState<string | null>(null);
    function useHasMounted() {
        const [hasMounted, setHasMounted] = useState(false);
        useEffect(() => {
            setHasMounted(true);
        }, []);
        return hasMounted;
    }

    const hasMounted = useHasMounted();




    const recentlyViewed = useAppSelector(
        state => state.recentlyViewed.items
    );

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (!cartItems.length) {
            setSummaryData(null);   // 🔥 IMPORTANT
            return;
        }

        const t = setTimeout(() => {
            fetch("/api/checkout/prepare", { method: "POST" })
                .then((r) => r.json())
                .then((data: CheckoutResponse) => setSummaryData(data))
                .catch(() => setSummaryData(null));
        }, 300); // 300ms debounce

        return () => clearTimeout(t);
    }, [cartItems]);



    /* ---------- DERIVED VALUES ---------- */
    const itemCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );

    const bagTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    );

    const discount = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                if (!item.originalPrice) return sum;
                return sum + (item.originalPrice - item.price) * item.quantity;
            }, 0),
        [cartItems]
    );


    const grandTotal = bagTotal;


    if (!hasMounted) return null;


    return (
        <div className="relative w-full">
            {/* HEADER */}
            <div className="mx-2 flex justify-between items-center py-12 z-20">
                <h1 className="text-5xl tracking-wider font-bold">SHOPPING BAG</h1>
                <span className="text-sm">ITEMS {itemCount}</span>
            </div>

            <div className="mx-2">
                {cartItems.length == 0 && (
                    <h1 className="font-semibold text-xl">Your shopping bag is empty.</h1>
                )}
            </div>

            <div className="flex flex-col mb-30 md:flex-row justify-between gap-10 mx-2">
                {/* LEFT – ITEMS */}
                <div className="w-full md:w-[55%] lg:w-[60%] space-y-2 my-2">
                    {cartItems.map((item) => (
                        <div
                            key={`${item.productId}/${item.variantSku}`}
                            className="flex gap-5 pb-2 border-b"
                        >
                            {/* IMAGE */}
                            <Link href={`/products/${item.slug}`}>
                                <div className="group relative w-32 h-40">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>

                            {/* DETAILS */}
                            <div className="flex flex-col justify-between flex-1 text-sm">
                                <div>
                                    <div className="flex justify-between">
                                        <p className="font-medium text-primary">
                                            {item.brand ?? "Brand"}
                                        </p>
                                        <MdDeleteOutline
                                            size={18}
                                            className="cursor-pointer hover:text-red-600"
                                            onClick={() => {
                                                dispatch(
                                                    removeCartItem({
                                                        productId: item.productId,
                                                        variantSku: item.variantSku,
                                                    })
                                                )
                                                dispatch(showProductToast({
                                                    name: item!.name,
                                                    image: item.image,
                                                    price: item!.price,
                                                    size: item.size,
                                                    type: "cart-remove"
                                                }));
                                            }
                                            }
                                        />
                                    </div>

                                    <p className="font-semibold">{item.name}</p>

                                    <div className="mt-1 space-y-1 text-xs text-gray-600">
                                        {item.color && <p>Color: {item.color.name}</p>}
                                        {item.size && <p>Size: {item.size}</p>}
                                    </div>

                                    <div className="mt-2 font-semibold">
                                        ₹{item.price}
                                        {item.originalPrice && (
                                            <span className="ml-2 line-through text-gray-400 text-xs">
                                                ₹{item.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex justify-between items-center mt-3">
                                    {/* QUANTITY */}
                                    <div className="flex items-center border px-3 py-1 gap-3">

                                        <button className="cursor-pointer"
                                            onClick={() => {
                                                if (item.quantity <= 1) {
                                                    setQtyWarning("Minimum quantity is 1");

                                                    setTimeout(() => {
                                                        setQtyWarning(null);
                                                    }, 1200);

                                                    return;
                                                }

                                                dispatch(updateCartQuantity({
                                                    productId: item.productId,
                                                    variantSku: item.variantSku,
                                                    quantity: item.quantity - 1
                                                }));
                                            }}

                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button className="cursor-pointer"
                                            onClick={() => {
                                                dispatch(updateQuantityLocal({
                                                    variantSku: item.variantSku,
                                                    quantity: item.quantity + 1
                                                }));
                                                dispatch(updateCartQuantity({
                                                    productId: item.productId,
                                                    variantSku: item.variantSku,
                                                    quantity: item.quantity + 1
                                                }));
                                            }
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    {qtyWarning && (
                                        <div className=" text-red-600 px-4 py-1 text-xs z-50">
                                            {qtyWarning}
                                        </div>
                                    )}


                                    {/* WISHLIST */}
                                    <button
                                        onClick={async () => {
                                            const res = await fetch(
                                                `/api/products/by-id/${item.productId}`
                                            );
                                            if (!res.ok) return;
                                            const product = await res.json();

                                            dispatch(
                                                addWishlistItem({
                                                    productId: item.productId,
                                                    product,
                                                    slug: item.slug,
                                                    name: item.name,
                                                    image: item.image,
                                                    price: item.price,
                                                    originalPrice: item.originalPrice ?? 0,
                                                    brand: item.brand,
                                                })
                                            );
                                            dispatch(showProductToast({
                                                name: item.name,
                                                image: item.image,
                                                type: "wishlist"
                                            }));

                                            dispatch(
                                                removeCartItem({
                                                    productId: item.productId,
                                                    variantSku: item.variantSku,
                                                })
                                            );
                                        }}
                                        className="text-xs hover:underline cursor-pointer hover:text-primary"
                                    >
                                        Move to wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT – SUMMARY */}
                <div className="w-full md:w-[35%] lg:w-[30%] mb-12">
                    <div className="py-2 space-y-4 md:sticky md:top-24 mx-2">
                        <h3 className="font-medium text-lg">SUMMARY</h3>

                        <div className="flex justify-between text-sm">
                            <span>Bag Total</span>
                            <span>Rs. {bagTotal}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>Tax</span>
                            <span>₹{summaryData?.summary.tax ?? 0}</span>
                        </div>


                        {discount > 0 && (
                            <div className="flex justify-between text-red-600 text-sm">
                                <span>Discount</span>
                                <span>-Rs. {discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span>Delivery Charges</span>
                            <span>₹{summaryData?.summary.shipping ?? 0}</span>
                        </div>

                        <hr />

                        <div className="flex justify-between font-medium text-lg">
                            <span>Total</span>
                            <span>Rs. {summaryData?.summary.totalAmount ?? grandTotal}</span>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs">We will process your personal data in accordance with THE LAYER CO. <span className="underline cursor-pointer hover:text-black/70">Privacy Notice</span></p>
                            <p className="text-xs">By continuing, you agree to THE LAYER CO. General <span className="underline cursor-pointer hover:text-black/70">Terms and Conditions</span></p>
                        </div>

                        <button
                            disabled={loading || cartItems.length === 0}
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setLoading(false);
                                    window.location.href = "/checkout";
                                }, 1500);
                            }}
                            className="cursor-pointer hidden md:flex items-center justify-center gap-2 w-full
                                        bg-black text-white py-4 mt-4 font-extralight
                                        transition-all duration-150 ease-out
                                        hover:opacity-90 active:scale-[0.97]
                                        disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {loading ? "PROCESSING..." : "CONTINUE TO CHECKOUT"}
                        </button>



                        <div className="text-xs font-extralight">
                            <div className="flex items-center gap-2"><span><Lock size={16} /></span> Payment information is encrypted.</div>
                            <p className="mt-3 mb-6"> Need help? Please contact <span className="underline hover:text-black/70 cursor-pointer">Customer Support</span></p>
                            <p className="underline underline-offset-2 uppercase text-[16px] cursor-pointer hover:text-black/70 font-extralight">Delivery and return options</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:hidden fixed bottom-0 h-35 bg-white z-999 flex flex-col justify-between p-4">

                {/* Top Row */}
                <div className="flex w-full justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Rs. {summaryData?.summary.totalAmount ?? grandTotal}</span>

                </div>

                {/* Button */}
                <button
                    disabled={loading || cartItems.length === 0}
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            window.location.href = "/checkout";
                        }, 1500);
                    }}
                    className="cursor-pointer p-4 bg-black w-full text-white mx-auto
                                flex items-center justify-center gap-2
                                transition-all duration-150 ease-out
                                hover:opacity-90 active:scale-[0.97]
                                disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading ? "PROCESSING..." : "CONTINUE TO CHECKOUT"}
                </button>

            </div>


            {hasMounted && recentlyViewed.length > 0 && (
                <ProductHorizontalScroller
                    title="RECENTLY VIEWED"
                    products={recentlyViewed.map(item => ({
                        _id: item.productId,
                        slug: item.slug,
                        productName: item.name,
                        image: item.image,
                        price: item.price,
                    }))}
                />

            )}



            <Footer />
        </div>
    );
}