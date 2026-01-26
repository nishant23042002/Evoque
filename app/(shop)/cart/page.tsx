"use client";

import Image from "next/image";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "@/store/cart/cart.slice";

import { ShoppingBag } from "lucide-react";
import { addWishlistItem } from "@/store/wishlist/wishlist.thunks";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const subtotal = useAppSelector((state) => state.cart.subtotal);

    /* Masonry: fewer columns → horizontal feel */
    const breakpoints = {
        default: 2,
        1280: 2,
        1024: 2,
        768: 2,
        650: 1,
    };

    const itemCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const discount =
        cartItems.reduce((sum, item) => {
            if (!item.originalPrice) return sum;
            return sum + (item.originalPrice - item.price) * item.quantity;
        }, 0) || 0;

    const grandTotal = subtotal;

    /* EMPTY STATE */
    if (!cartItems.length) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
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
            <div className="px-2 w-full py-3 text-primary text-lg sm:text-xl font-semibold z-20 bg-(--linen-100)">
                My Bag ({itemCount} items)
            </div>

            <div className="mb-20
                    relative bg-(--linen-100)
                    h-[calc(100vh-72px)]
                    px-2 lg:px-4 mx-auto
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
                        lg:mt-2
                    "
                >

                    <Masonry
                        breakpointCols={breakpoints}
                        className="flex gap-2 lg:gap-4 w-full"
                        columnClassName="masonry-column"
                    >
                        {cartItems.map((item) => (
                            <Link
                                href={`/products/${item.slug}`}
                                key={item.productId}
                                className="block"
                            >
                                <div
                                    className="
                                                border border-(--border-strong)
                                                bg-(--linen-200)
                                                rounded-[3px]
                                                shadow-xs
                                                p-1
                                                flex gap-3
                                                hover:shadow-sm
                                                transition mb-2 lg:mb-4
                                            "
                                >
                                    {/* IMAGE */}
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

                                    {/* CONTENT */}
                                    <div className="flex flex-col justify-between flex-1 text-sm">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="max-[400px]:text-[11px] text-xs font-semibold text-(--linen-600)">
                                                    {item.brand ?? "Brand"}
                                                </h3>

                                                <MdDeleteOutline
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(removeFromCart(item.productId));
                                                    }}
                                                    className="cursor-pointer  hover:text-red-600 duration-200"
                                                    size={16}
                                                />
                                            </div>

                                            <p className="font-medium max-[400px]:text-[11px] text-xs leading-tight mt-1">
                                                {item.name}
                                            </p>

                                            <div className="flex items-center gap-2 mt-1 text-xs">
                                                <span className="font-semibold">
                                                    ₹{item.price}
                                                </span>
                                                {item.originalPrice && (
                                                    <span className="line-through text-[11px] text-(--linen-700)">
                                                        ₹{item.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {item.size && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Size: {item.size}
                                                </p>
                                            )}
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-2 border rounded-[3px] px-1 py-px">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(decreaseQuantity(item.productId));
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
                                                        dispatch(increaseQuantity(item.productId));
                                                    }}
                                                    className="font-bold hover:text-green-500 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();

                                                    dispatch(
                                                        addWishlistItem({
                                                            productId: item.productId,
                                                            slug: item.slug,
                                                            name: item.name,
                                                            image: item.image,
                                                            price: item.price,
                                                            originalPrice: item.originalPrice ?? 0,
                                                            brand: item.brand,
                                                        })
                                                    );

                                                    dispatch(removeFromCart(item.productId));

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
                            </Link>
                        ))}
                    </Masonry>
                </div>

                {/* RIGHT – SUMMARY (UNCHANGED) */}
                <div className="w-full lg:w-[35%] order-1 lg:order-2">

                    <div className="lg:sticky lg:top-30 border border-(--border-strong) rounded-[3px] p-3 space-y-4 bg-(--linen-200)">

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
                            <span>₹{subtotal}</span>
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

                        <button className="w-full bg-(--linen-900) text-white py-3 rounded-md font-semibold hover:bg-(--linen-800)">
                            PAY ₹{grandTotal}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
