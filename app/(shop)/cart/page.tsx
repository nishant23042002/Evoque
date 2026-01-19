"use client";

import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    removeFromCart, increaseQuantity,
    decreaseQuantity
} from "@/store/cart/cart.slice";
import { toggleWishlist } from "@/store/wishlist/wishlist.slice";
import { useMemo } from "react";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const subtotal = useAppSelector((state) => state.cart.subtotal);

    const breakpoints = {
        default: 4,
        1280: 3,
        768: 2,
        470: 1,
    };

    /* =======================
         STABLE HEIGHTS (NO JITTER)
      ======================= */
    const heights = useMemo(() => {
        if (!cartItems.length) return [];

        const buckets =
            typeof window !== "undefined" && window.innerWidth < 640
                ? [280, 300, 320, 340]
                : [350, 370, 390, 420, 450, 480, 510];


        return cartItems.map((product) => {
            let seed = 0;
            const id = product.productId;

            for (let i = 0; i < id.length; i++) {
                seed = (seed << 5) - seed + id.charCodeAt(i);
            }

            const index = Math.abs(seed) % buckets.length;
            const jitter = (Math.abs(seed) % 30) - 15;

            return buckets[index] + jitter;
        });
    }, [cartItems]);

    const itemCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const discount =
        cartItems.reduce((sum, item) => {
            if (!item.originalPrice) return sum;
            return (
                sum +
                (item.originalPrice - item.price) * item.quantity
            );
        }, 0) || 0;

    const grandTotal = subtotal;

    if (!cartItems.length) {
        return (
            <div className="h-[60vh] flex items-center justify-center text-sm text-slate-600">
                Your bag is empty
            </div>
        );
    }

    return (
        <div className="bg-[var(--linen-100)] min-h-[95vh] px-2 sm:px-4 py-10 mx-auto">
            <h1 className="text-lg sm:text-xl my-3 font-semibold text-[var(--primary)]">
                My Bag ({itemCount} items)
            </h1>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* LEFT – CART ITEMS */}
                <div className="w-full lg:w-[65%]">
                    <Masonry
                        breakpointCols={breakpoints}
                        className="flex gap-4 w-full"
                        columnClassName="masonry-column"
                    >
                        {cartItems.map((item, index) => (
                            <Link
                                href={`/products/${item.slug}`}
                                key={item.productId}
                                className="block break-inside-avoid"
                            >
                                <div style={{ height: heights[index] }} className="border border-[var(--border-strong)] shadow-xs group h-80 relative overflow-hidden rounded-[3px]">

                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover object-center duration-500 transition-transform will-change-transform group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition" />

                                    {/* Header */}
                                    <div className="absolute flex justify-between top-2 left-2 right-2">
                                        <h3 className="text-[11px] text-slate-800 font-semibold">
                                            {item.brand ?? "Brand"}
                                        </h3>

                                        <MdDeleteOutline
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                dispatch(removeFromCart(item.productId));
                                            }}
                                            className="text-slate-600 hover:text-red-500 cursor-pointer duration-250"
                                        />
                                    </div>

                                    {/* Footer */}
                                    <div className="absolute bottom-0 w-full bg-black/30 p-2 text-white">
                                        <p className="text-[11px] mb-1">{item.name}</p>

                                        <div className="flex justify-between text-[11px]">
                                            <span>Price: ₹{item.price}</span>
                                            {item.originalPrice && (
                                                <span className="line-through text-gray-200">
                                                    ₹{item.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-1 text-[11px]">
                                            <div className="flex items-center gap-2 bg-white/90 text-black rounded px-2 py-0.5">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(decreaseQuantity(item.productId));
                                                    }}
                                                    className="px-1 font-bold hover:text-red-500"
                                                >
                                                    −
                                                </button>

                                                <span className="min-w-[16px] text-center">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(increaseQuantity(item.productId));
                                                    }}
                                                    className="px-1 font-bold hover:text-green-600"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {item.size && <span>Size: {item.size}</span>}
                                        </div>


                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                dispatch(toggleWishlist(item));
                                                dispatch(removeFromCart(item.productId));
                                            }}
                                            className="cursor-pointer mt-2 w-full bg-brand-red font-semibold hover:text-brand-red  text-[11px] py-1.5 rounded hover:bg-white/90 transition-all duration-300"
                                        >
                                            Move to wishlist
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </Masonry>
                </div>

                {/* RIGHT – SUMMARY */}
                <div className="w-full lg:w-[35%]">
                    <div className="lg:sticky lg:top-20 border border-[var(--border-strong)] rounded-[3px] p-3 space-y-4">

                        {/* Address */}
                        <div className="flex justify-between gap-3">
                            <div className="flex gap-3">
                                <span className="text-orange-500 text-xl">🚚</span>
                                <div className="text-sm mb-5">
                                    <p className="font-semibold">
                                        Delivering to Nishant Sapkal
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        402116 · Raigad
                                    </p>
                                </div>
                            </div>
                            <button className="text-xs font-semibold text-orange-600">
                                CHANGE
                            </button>
                        </div>

                        {/* Coupon */}
                        <div className="flex justify-between items-center text-sm">
                            <p>
                                Save more with coupons
                            </p>
                            <button className="text-xs text-orange-600 font-semibold">
                                View
                            </button>
                        </div>

                        {/* Price */}
                        <div>
                            <h3 className="text-sm text-center font-semibold mb-2 uppercase">
                                Price Details
                            </h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Bag Total</span>
                                    <span>₹{subtotal}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{discount}</span>
                                    </div>
                                )}

                                <hr />

                                <div className="flex justify-between font-semibold mb-6">
                                    <span>Grand Total</span>
                                    <span>₹{grandTotal}</span>
                                </div>
                            </div>
                        </div>

                        {/* Pay */}
                        <button className="cursor-pointer w-full bg-[var(--linen-900)]  hover:bg-[var(--linen-800)] text-white py-3 rounded-md font-semibold transition">
                            PAY ₹{grandTotal}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
