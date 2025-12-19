"use client";
import Image from "next/image";
import { clothingItems } from "@/data/clothingItems";

const cartItems = [
    {
        id: 1,
        name: "Happy Socks",
        subtitle: "Heart socks",
        price: 890,
        quantity: 3,
        image: "/products/socks.jpg",
        size: "38–40",
    },
    {
        id: 2,
        name: "Twilltip Parka",
        subtitle: "Blue Denim",
        price: 6990,
        quantity: 1,
        image: "/products/jacket.jpg",
        size: "M",
    },
];

const recommendations = [
    {
        id: 1,
        name: "Mint&Berry Boots",
        price: 5990,
        image: "/products/boots.jpg",
    },
    {
        id: 2,
        name: "Even&Odd Crossbody",
        price: 1590,
        image: "/products/bag.jpg",
    },
];

export default function CartPage() {
    return (
        <div className="ml-18 max-[490px]:ml-15 px-4 py-12 mx-auto">
            <h1 className="text-2xl font-semibold mb-10">My Bag (4 items)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                {/* LEFT — CART ITEMS */}
                <div className="space-y-6">
                    <div
                        key={clothingItems[0].image}
                        className="border border-black/20 flex gap-6 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="relative w-28 h-36 rounded-lg overflow-hidden">
                            <Image
                                src={clothingItems[0].image}
                                alt={clothingItems[0].title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-medium">{clothingItems[0].title}</h3>
                            <p className="text-sm text-gray-500">{clothingItems[0].brand}</p>
                            {/* <p className="text-sm mt-1">Size: {item.size}</p> */}

                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center border rounded-md">
                                    <button className="px-3 py-1 text-lg">−</button>
                                    {/* <span className="px-3">{item.quantity}</span> */}
                                    <button className="px-3 py-1 text-lg">+</button>
                                </div>

                                <button className="text-sm text-gray-500 hover:text-black">
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className="text-right font-medium">
                            {/* ₹{clothingItems[0].price * clothingItems[0].quantity} */}
                        </div>
                    </div>


                    {/* WEAR IT WITH */}
                    <div>
                        <h2 className="text-lg font-semibold mt-14 mb-6">
                            Wear it with
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {recommendations.map(item => (
                                <div
                                    key={item.id}
                                    className="border border-black/20 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-500">₹{item.price}</p>

                                        <button className="mt-3 w-full border border-black/20 rounded-lg py-2 text-sm hover:bg-black hover:text-white transition">
                                            Add to bag
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT — SUMMARY */}
                <div className="border border-black/20 sticky top-24 h-fit bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="font-semibold mb-6">Summary</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹9,660</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>− ₹1,500</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹90</span>
                        </div>

                        <div className="border-t pt-4 flex justify-between font-semibold text-base">
                            <span>Total</span>
                            <span>₹8,050</span>
                        </div>

                        <p className="text-xs text-gray-500">
                            Including all taxes
                        </p>
                    </div>

                    <textarea
                        placeholder="Leave a comment"
                        className="mt-6 w-full border rounded-lg p-3 text-sm resize-none focus:outline-none"
                        rows={3}
                    />

                    <button className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
