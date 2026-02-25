"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";



type OrderItem = {
    name: string;
    sku: string;
    image: string;
};

type Order = {
    _id: string;
    orderNumber: string;
    grandTotal: number;
    orderStatus: string;
    paymentMethod: string;
    createdAt: string;
    items: OrderItem[];
};

type Address = {
    name: string;
    city: string;
    state: string;
    email: string;
    pincode: string;
    isDefault: boolean;
};


export default function AccountPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);




    useEffect(() => {
        const load = async () => {
            try {
                const orderRes = await fetch("/api/orders/my");
                if (orderRes.ok) {
                    const data: Order[] = await orderRes.json();

                    // Sort newest first
                    data.sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    );

                    setOrders(data);
                }


                const addressRes = await fetch("/api/address");
                if (addressRes.ok) {
                    const list: Address[] = await addressRes.json();
                    setAddress(list.find(a => a.isDefault) || null);
                }
            } catch (err) {
                console.error("Account page fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);
    const displayName = address?.name || "Guest User";




    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 border animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-10 mx-2 sm:mx-4 bg-white">


            {/* PROFILE */}
            <section className="border border-black/10 hover:border-black p-6 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-lg font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                </div>

                <div>
                    <p className="font-semibold text-lg capitalize">{displayName}</p>

                    {address?.email && (
                        <p className="text-sm text-gray-500">{address.email}</p>
                    )}
                </div>
            </section>



            {/* QUICK ACTIONS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/account/order" className="border border-black/10 p-6 text-center hover:border-black">
                    Orders
                </Link>

                <Link href="/account/address" className="border border-black/10 p-6 text-center hover:border-black">
                    Addresses
                </Link>

                <Link href="/wishlist" className="border border-black/10 p-6 text-center hover:border-black">
                    Wishlist
                </Link>

                <Link href="/account" className="border border-black/10 p-6 text-center hover:border-black">
                    Security
                </Link>
            </section>

            {/* RECENT ORDERS */}
            <section className="space-y-4">
                <h2 className="font-semibold uppercase tracking-widest text-sm">
                    Recent Orders
                </h2>

                {orders.length === 0 && (
                    <p className="text-sm text-gray-500">No recent orders.</p>
                )}

                {orders.slice(0, 2).map(order => {
                    const item = order.items?.[0];

                    return (
                        <div
                            key={order._id}
                            className="
                                border border-black/10 hover:border-black p-1
                                flex gap-3 items-center
                                hover:shadow-md transition
                                bg-white
                            "
                        >
                            {/* IMAGE */}
                            <div className="relative cursor-pointer w-20 h-24 overflow-hidden bg-gray-100 shrink-0">
                                {item?.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 hover:bg-black/20" />
                            </div>

                            {/* INFO */}
                            <div className="flex-1 space-y-1 min-w-0">
                                {/* PRODUCT NAME */}
                                <p className="font-medium text-sm truncate">
                                    {item?.name || "Product"}
                                </p>

                                {/* ORDER NUMBER */}
                                <p className="text-[11px] text-gray-500">
                                    Order Number: {order.orderNumber || order._id.slice(-6)}
                                </p>

                                {/* SKU + PAYMENT */}
                                <div className="flex flex-wrap gap-x-3 text-[11px] text-gray-500">
                                    <span>SKU: {item?.sku || "-"}</span>
                                    <span>{order.paymentMethod}</span>
                                </div>
                            </div>

                            {/* RIGHT SIDE */}
                            <div className="text-right space-y-1 shrink-0">
                                <p className="font-semibold text-sm">
                                    Rs. {order.grandTotal}
                                </p>

                                {/* STATUS BADGE */}
                                <span
                                    className={`
                                        text-[10px] px-2 py-1 capitalize
                                        ${order.orderStatus === "delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.orderStatus === "confirmed"
                                                ? "bg-yellow-400 text-white"
                                                : "bg-gray-100 text-gray-700"
                                        }
                                    `}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>
                    );
                })}




                <Link href="/account/order" className="text-xs border border-black/10 hover:border-black p-1">
                    View All Orders
                </Link>
            </section>

            {/* DEFAULT ADDRESS */}
            <section className="space-y-4">
                <h2 className="font-semibold uppercase tracking-widest text-sm">
                    Default Address
                </h2>

                <div className="border border-black/10 hover:border-black p-2">
                    {address ? (
                        <p className="flex flex-col text-gray-600 text-sm py-2">
                            <span>{address.city}, {address.state} </span>
                            <span>{address.pincode}</span>
                        </p>
                    ) : (
                        <p className="text-gray-500 text-sm py-2">No address saved.</p>
                    )}

                    <Link href="/account/address" className="text-xs border border-black/10 p-1 hover:border-black">
                        Manage Addresses
                    </Link>
                </div>

            </section>
        </div>
    );
}
