"use client";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AddressSection from "./address/AddressSection";
import { CartItem } from "@/types/CartTypes";
import { Lock } from "lucide-react";
import { Address } from "@/types/AddressTypes";
import { RazorpayOptions } from "@/types/Razorpay";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cart/cart.slice";

/* ---------------- TYPES ---------------- */

type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

interface CheckoutItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variantSku: string;
}

interface CheckoutSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    totalAmount: number;
}

interface RazorpayCreateResponse {
    keyId: string;
    amount: number;
    currency: string;
    orderId: string;
}

export interface RazorpayInstance {
    open: () => void;
    on: (event: "payment.failed", handler: (response: unknown) => void) => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}
export { };

interface CheckoutResponse {
    items: CheckoutItem[];
    summary: CheckoutSummary;
    checkoutToken: string;
}

/* ================= PAGE ================= */

export default function CheckoutPage() {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

    return (
        <div className="px-4 py-10">
            <h1 className="text-5xl font-extrabold mb-10 tracking-wider">CHECKOUT</h1>

            <div className="flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-[65%] space-y-6">
                    <MyInformation address={selectedAddress} />
                    <AddressSection onSelect={setSelectedAddress} />
                    <ParcelSection />
                    <PaymentOptions
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />
                </div>

                <div className="w-full lg:w-[35%]">
                    <OrderSummary
                        paymentMethod={paymentMethod}
                        address={selectedAddress}
                    />
                </div>
            </div>
        </div>
    );
}

/* ---------------- INFO ---------------- */

function MyInformation({ address }: { address: Address | null }) {
    if (!address) return null;

    return (
        <section className="pb-3 border-b">
            <h2 className="font-semibold mb-3">MY INFORMATION</h2>
            <p className="capitalize">{address.name}</p>
            <p className="text-sm text-gray-600">{address.email}</p>
        </section>
    );
}

/* ---------------- PARCEL ---------------- */

function ParcelSection() {
    const cartItems = useAppSelector((s) => s.cart.items);

    return (
        <section>
            <h2 className="font-semibold mb-2">PARCEL</h2>
            <p className="text-sm mb-4">Shipped by THE LAYER CO.</p>

            <div className="flex gap-4">
                {cartItems.map((item: CartItem) => (
                    <div key={item.productId} className="w-24 h-32 relative">
                        <Image src={item.image} alt="" fill className="object-cover" />
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---------------- PAYMENT OPTIONS ---------------- */

function PaymentOptions({
    paymentMethod,
    setPaymentMethod,
}: {
    paymentMethod: PaymentMethod;
    setPaymentMethod: (m: PaymentMethod) => void;
}) {
    return (
        <div className="py-2 rounded space-y-2">
            <h2 className="font-semibold">PAYMENT</h2>

            {["upi", "card", "netbanking", "cod"].map((m) => (
                <label key={m} className="flex justify-between border-b p-4 cursor-pointer">
                    <input
                        type="radio"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m as PaymentMethod)}
                    />
                    <span>{m.toUpperCase()}</span>
                </label>
            ))}
        </div>
    );
}

/* ---------------- SUMMARY ---------------- */

function OrderSummary({
    paymentMethod,
    address,
}: {
    paymentMethod: PaymentMethod;
    address: Address | null;
}) {
    const cartItems = useAppSelector((state) => state.cart.items);
    const [data, setData] = useState<CheckoutResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    /* FIX 1 — SINGLE FETCH */
    useEffect(() => {
        fetch("/api/checkout/prepare", { method: "POST" })
            .then((r) => r.json())
            .then(setData);
    }, []);

    /* Razorpay Script */
    useEffect(() => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.async = true;
        document.body.appendChild(s);
    }, []);

    const discount = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                if (!item.originalPrice) return sum;
                return sum + (item.originalPrice - item.price) * item.quantity;
            }, 0),
        [cartItems]
    );

    const handlePayment = async () => {
        if (!data) return;
        if (!address) return alert("Select address");

        setLoading(true);

        /* COD */
        if (paymentMethod === "cod") {
            await fetch("/api/order/cod", { method: "POST" });
            dispatch(clearCart());
            window.location.href = "/account/order/success";
            return;
        }

        const res = await fetch("/api/payment/razorpay/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                checkoutToken: data.checkoutToken,
                totalAmount: data.summary.totalAmount,
            }),
        });

        const payment: RazorpayCreateResponse = await res.json();


        const razorpay = new window.Razorpay({
            key: payment.keyId,
            amount: payment.amount,
            currency: payment.currency,
            order_id: payment.orderId,
            name: "THE LAYER CO.",
            handler: () => {
                dispatch(clearCart());
                window.location.href = "/account/order/success";
            },
            modal: { ondismiss: () => setLoading(false) },
        });

        razorpay.open();
    };

    if (!data) return null;

    return (
        <div className="w-full">
            <div className="space-y-4 md:sticky md:top-24 mx-2">
                <h3 className="font-medium text-lg">SUMMARY</h3>

                <div className="flex justify-between text-sm">
                    <span>Bag Total</span>
                    <span>Rs. {data.summary.subtotal}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-red-600 text-sm">
                        <span>Discount</span>
                        <span>-Rs. {discount}</span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Rs. {data.summary.tax}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹{data.summary.shipping}</span>
                </div>

                <hr />

                <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>Rs. {data.summary.totalAmount}</span>
                </div>

                <button
                    disabled={loading}
                    onClick={handlePayment}
                    className="w-full bg-black text-white py-4 mt-4 flex justify-center gap-2"
                >
                    {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading ? "PROCESSING..." : "COMPLETE PURCHASE"}
                </button>

                <div className="text-xs font-extralight flex gap-2">
                    <Lock size={16} /> Payment information is encrypted.
                </div>
            </div>
        </div>
    );
}
