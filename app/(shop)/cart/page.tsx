"use client";

import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ShoppingBag } from "lucide-react";
import { increaseQuantity, decreaseQuantity } from "@/store/cart/cart.slice";
import { addWishlistItem } from "@/store/wishlist/wishlist.thunks";
import { removeCartItem } from "@/store/cart/cart.thunks";
import { useMemo, useState } from "react";


export default function CartPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const [loading, setLoading] = useState(false);
    /* Masonry: fewer columns → horizontal feel */
    const breakpoints = {
        default: 2,
        1280: 2,
        1024: 2,
        768: 2,
        650: 1,
    };

    /* ---------- DERIVED VALUES (UI ONLY) ---------- */
    const itemCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );

    const bagTotal = useMemo(
        () =>
            cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
        [cartItems]
    );

    const discount = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                if (!item.originalPrice) return sum;
                return (
                    sum +
                    (item.originalPrice - item.price) * item.quantity
                );
            }, 0),
        [cartItems]
    );

    const grandTotal = bagTotal
    /* EMPTY STATE */
    if (!cartItems.length) {
        return (
            <div className="min-h-[95vh] flex items-center justify-center px-4">
                <div className="max-w-sm w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="mb-2 flex items-center justify-center w-20 h-20 rounded-full bg-(--earth-charcoal)/10">
                            <ShoppingBag className="w-9 h-9 text-(--text-muted)" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Your cart is empty</h2>
                        <p className="text-sm text-(--linen-800)/70">
                            Looks like you haven’t added anything yet.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex w-full justify-center rounded-md
              bg-primary text-primary-foreground
              px-4 py-2 text-sm font-medium"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* HEADER */}
            <div className="text-3xl sm:text-5xl mx-2 flex py-2 justify-between items-center text-(--linen-800) font-semibold tracking-tight">
                <span>SHOPPING BAG </span>
                <span className="text-sm sm:text-lg">ITEMS {itemCount}</span>
            </div>

            <div className="mb-20
                    relative bg-(--linen-100)
                    h-[calc(100vh-72px)]
                    px-2 mx-auto
                    flex flex-col lg:flex-row
                    gap-6
                    ">
                {/* LEFT – PINTEREST STYLE CART */}
                <div
                    className="
                        w-full lg:w-[65%]
                        order-2 lg:order-1
                        overflow-y-auto
                        scrollbar-hide
                        min-h-[60vh]     
                    "
                >

                    <Masonry
                        breakpointCols={breakpoints}
                        className="flex gap-2 w-full"
                        columnClassName="masonry-column"
                    >
                        {cartItems.map((item) => (
                            <div
                                key={`${item.productId}/${item.variantSku}`}
                                className="block"
                            >
                                <div
                                    className="
                                                border border-(--border-strong)
                                                bg-(--linen-200)
                                                rounded-[3px]
                                                shadow-xs
                                                p-1
                                                flex gap-2
                                                hover:shadow-sm
                                                transition mb-2
                                            "
                                >
                                    {/* IMAGE */}
                                    <Link href={`/products/${item.slug}`}
                                        className="block">
                                        <div className="group relative w-28 h-36 shrink-0 rounded-[3px] overflow-hidden">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                            <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </Link>

                                    {/* CONTENT */}
                                    <div className="flex flex-col justify-between flex-1 text-sm">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="max-[400px]:text-[11px] text-xs font-semibold text-primary">
                                                    {item.brand ?? "Brand"}
                                                </h3>

                                                <MdDeleteOutline
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(
                                                            removeCartItem({
                                                                productId: item.productId,
                                                                variantSku: item.variantSku,
                                                            })
                                                        );
                                                    }}
                                                    className="cursor-pointer  hover:text-red-600 duration-200"
                                                    size={16}
                                                />
                                            </div>

                                            <p className="font-semibold text-(--linen-700) max-[400px]:text-[11px] text-xs leading-tight">
                                                {item.name}
                                            </p>

                                            <div className="flex flex-col text-xs">
                                                <div className="font-semibold mb-2 flex gap-2 items-center text-sm">
                                                    ₹{item.price}
                                                    {item.originalPrice && (
                                                        <span className="line-through text-[11px] text-(--linen-700)">
                                                            ₹{item.originalPrice}
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    {item.color && (
                                                        <p className="text-[11px] text-(var(--linen-500))">
                                                            Color: {item.color.name}
                                                        </p>
                                                    )}
                                                </div>

                                            </div>

                                            {item.size && (
                                                <p className="text-[11px] text-(var(--linen-500))">
                                                    Size: {item.size}
                                                </p>
                                            )}
                                            <p className="text-[11px]">VariantSku: {item.variantSku}</p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-2 border rounded-[3px] px-1 py-px">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(
                                                            decreaseQuantity({
                                                                productId: item.productId,
                                                                variantSku: item.variantSku,
                                                            })
                                                        );
                                                    }}
                                                    className="font-bold hover:text-red-500 cursor-pointer"
                                                >
                                                    −
                                                </button>
                                                <span className="text-[11px]">{item.quantity}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(
                                                            increaseQuantity({
                                                                productId: item.productId,
                                                                variantSku: item.variantSku,
                                                            })
                                                        );
                                                    }}
                                                    className="font-bold hover:text-green-500 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    // 1️⃣ Fetch full product
                                                    const res = await fetch(`/api/products/by-id/${item.productId}`);
                                                    if (!res.ok) return;

                                                    const product = await res.json();

                                                    // 2️⃣ Add to wishlist WITH product
                                                    dispatch(
                                                        addWishlistItem({
                                                            productId: item.productId,
                                                            product, // ✅ REQUIRED
                                                            slug: item.slug,
                                                            name: item.name,
                                                            image: item.image,
                                                            price: item.price,
                                                            originalPrice: item.originalPrice ?? 0,
                                                            brand: item.brand,
                                                        })
                                                    );

                                                    // 3️⃣ Remove from cart AFTER wishlist add
                                                    dispatch(
                                                        removeCartItem({
                                                            productId: item.productId,
                                                            variantSku: item.variantSku,
                                                        })
                                                    );

                                                }}
                                                className="max-[400px]:text-[11px] text-xs font-semibold cursor-pointer
                                                        text-primary border border-(--border-strong)
                                                        p-1 rounded-[3px] hover:underline"
                                            >
                                                Move to wishlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Masonry>
                </div>

                {/* RIGHT – SUMMARY (UNCHANGED) */}
                <div className="w-full select-none lg:w-[35%] order-1 lg:order-2">

                    <div className="lg:sticky lg:top-28 border border-(--border-strong) rounded-[3px] p-3 space-y-4 bg-(--linen-200)">

                        <div className="flex justify-between gap-3">
                            <div>
                                <p className="font-semibold">Delivering to Nishant Sapkal</p>
                                <p className="text-xs text-gray-500">402116 · Raigad</p>
                            </div>
                            <button className="text-xs font-semibold text-orange-600">
                                CHANGE
                            </button>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>Bag Total</span>
                            <span>₹{bagTotal}</span>
                        </div>

                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-₹{discount}</span>
                            </div>
                        )}

                        <hr />

                        <div className="flex justify-between font-semibold">
                            <span>Grand Total</span>
                            <span>₹{grandTotal}</span>
                        </div>

                        <button onClick={() => {
                            setLoading(true)
                            setTimeout(() => {
                                setLoading(false)
                                window.location.href = "/checkout/address";
                            }, 2000)
                        }} className="w-full bg-(--linen-900) text-white py-3 rounded-[3px] duration-300 cursor-pointer font-semibold hover:bg-(--linen-800)">
                            PAY ₹{grandTotal}
                        </button>
                        {
                            loading &&
                            <>
                                <p>Please wait confirming prices</p>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
