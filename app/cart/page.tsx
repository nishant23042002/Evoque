"use client";

import Image from "next/image";
import { clothingItems } from "@/data/clothingItems";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { MdDeleteOutline } from "react-icons/md";

export default function CartPage() {
    const breakpoints = {
        default: 4,
        1280: 3,
        768: 2,
        470: 1,
    };


    return (
        <div className="ml-18 max-[768px]:ml-15 px-2 sm:px-4 py-4 mx-auto">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4">
                My Bag (4 items)
            </h1>

            {/* Layout */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* LEFT – CART ITEMS */}
                <div className="w-full lg:w-[65%]">
                    <Masonry
                        breakpointCols={breakpoints}
                        className="flex gap-4 w-full"
                        columnClassName="masonry-column"
                    >
                        {clothingItems.slice(0, 4).map((item, index) => (
                            <Link
                                href={`/product/${item.slug}`}
                                key={item.id}
                                className="mb-4 block break-inside-avoid"
                            >
                                <div className="group h-80 relative overflow-hidden rounded-xl bg-gray-100">

                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />

                                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition" />

                                    {/* Header */}
                                    <div className="absolute flex justify-between top-2 left-2 right-2">
                                        <h3 className="text-[11px] text-slate-800 font-semibold">
                                            {item.brand}
                                        </h3>
                                        <MdDeleteOutline className="text-slate-600 hover:text-red-500 cursor-pointer duration-250" />
                                    </div>

                                    {/* Footer */}
                                    <div className="absolute bottom-0 w-full bg-black/20 p-2 rounded-b-xl text-white">
                                        <p className="text-[11px] mb-1">{item.title}</p>

                                        <div className="flex justify-between text-[11px]">
                                            <span>Price: {item.price}</span>
                                            <span className="line-through text-gray-300">
                                                {item.originalPrice}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-[11px] mt-1">
                                            <span>Size: {item.size}</span>
                                            <span>Qty: {item.qty}</span>
                                        </div>

                                        <button className="cursor-pointer mt-2 w-full border border-white/30 text-[11px] py-1.5 rounded hover:bg-brand-red transition">
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
                    <div className="lg:sticky lg:top-20 border border-black/10 rounded-lg p-3 space-y-4">

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
                                Only <b>₹2700</b> away from <b>SHOP10</b>
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
                                    <span>₹2348</span>
                                </div>

                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹705</span>
                                </div>

                                <hr />

                                <div className="flex justify-between font-semibold mb-6">
                                    <span>Grand Total</span>
                                    <span>₹1643</span>
                                </div>
                            </div>
                        </div>

                        {/* Pay */}
                        <button className="cursor-pointer w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition">
                            PAY ₹1643
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
