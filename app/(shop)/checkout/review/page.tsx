"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { RazorpayOptions } from "@/types/Razorpay";
import { clearCart } from "@/store/cart/cart.slice";
import { useDispatch } from "react-redux";

export interface RazorpayInstance {
    open: () => void;
    on: (
        event: "payment.failed",
        handler: (response: unknown) => void
    ) => void;
}


declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

export { };

interface CheckoutItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variantSku: string;
}


interface CheckoutResponse {
    items: CheckoutItem[];
    address: {
        name: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    summary: {
        subtotal: number;
        shipping: number;
        tax: number;
        discount: number;
        totalAmount: number;
    };
    checkoutToken: string;
}



export default function CheckoutReviewPage() {
    const [data, setData] = useState<CheckoutResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch("/api/checkout/prepare", { method: "POST" })
            .then(async res => {
                const text = await res.text();
                console.log("CHECKOUT RESPONSE:", res.status, text);
                return JSON.parse(text);
            })
            .then(parsed => {
                if (parsed?.items && parsed?.summary) {
                    setData(parsed);
                } else {
                    setData(null);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        if (!data || paying) return;

        setPaying(true);

        try {
            const res = await fetch("/api/payment/razorpay/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    checkoutToken: data.checkoutToken,
                    totalAmount: data.summary.totalAmount,
                }),
            });

            if (!res.ok) {
                setPaying(false);
                return;
            }

            const payment = await res.json();

            const options: RazorpayOptions = {
                key: payment.keyId,
                amount: payment.amount,
                currency: payment.currency,
                order_id: payment.orderId,
                name: "The Layer Co",
                description: "Order Payment",

                handler: () => {
                    dispatch(clearCart());
                    window.location.replace("/account/order/success");
                },

                modal: {
                    ondismiss: () => {
                        setPaying(false);
                    },
                },

                theme: { color: "#000000" },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", () => {
                setPaying(false);
                alert("Payment failed. Please try again.");
            });

            razorpay.open();
        } catch {
            setPaying(false);
        }
    };


    useEffect(() => {
        if (!loading && !data) {
            window.location.replace("/checkout/address");
        }
    }, [loading, data]);

    if (loading) return <p>Preparing checkout...</p>;
    if (!data) return null;

    if (loading) return <p>Preparing checkout...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-4">
                <h1 className="text-xl font-semibold">Review your order</h1>

                {data.items.map(item => (
                    <div
                        key={item.variantSku}
                        className="flex gap-4 border p-3 rounded"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={96}
                            className="object-cover"
                        />

                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold">₹{item.price}</p>
                        </div>
                    </div>
                ))}

                <div className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">Delivery Address</h2>
                    <p>{data.address.name}</p>
                    <p className="text-sm">
                        {data.address.addressLine1}, {data.address.city}
                    </p>
                    <p className="text-sm">{data.address.phone}</p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="border p-4 rounded space-y-3">
                <h2 className="font-semibold">Order Summary</h2>

                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{data.summary.subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹{data.summary.shipping}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹{data.summary.tax}</span>
                </div>

                <hr />

                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{data.summary.totalAmount}</span>
                </div>

                <button
                    disabled={paying}
                    onClick={async () => {
                        setPaying(true);
                        await handlePayment();
                    }}
                    className="w-full bg-black text-white py-3 rounded mt-4"
                >
                    {paying ? "Processing payment..." : `Pay ₹${data.summary.totalAmount}`}
                </button>
            </div>
        </div>
    );
}
