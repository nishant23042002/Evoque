"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AddressSection from "./address/AddressSection";
import { CartItem } from "@/types/CartTypes";
import { Link, Lock, ShoppingBag } from "lucide-react";
import { Address } from "@/types/AddressTypes";
import { RazorpayOptions } from "@/types/Razorpay";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cart/cart.slice";
import { MdDeleteOutline } from "react-icons/md";
import { removeCartItem } from "@/store/cart/cart.thunks";
import { useRouter } from "next/navigation";
/* ---------------- TYPES ---------------- */

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
    const cartItems = useAppSelector((s) => s.cart.items);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [paymentProvider, setPaymentProvider] =
        useState<PaymentProvider>("razorpay");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
    const router = useRouter();


    if (!cartItems.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[95vh] text-center px-6">
                {/* Icon */}
                <div className="mb-2 animate-float flex items-center justify-center w-20 h-20 rounded-full bg-(--earth-charcoal)/10">
                    <ShoppingBag className="w-10 h-10 text-primary" />
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold text-primary">
                    Your Cart is empty
                </h2>
                <p className="mt-2 text-sm font-medium text-(--linen-800)/70 max-w-sm">
                    Your bag is waiting to be filled. Explore our collection or add your
                    favorites from the wishlist to continue.
                </p>

                {/* CTA */}
                <button
                    onClick={() => {
                        router.push("/wishlist")
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium
                          bg-primary text-black hover:opacity-90 transition"
                >
                    <span className="text-white cursor-pointer">
                        Explore Products
                    </span>
                </button>
            </div>
        );
    }
    return (
        <div className="py-10 z-999">
            <h1 className="mx-2 md:mx-4 text-5xl font-extrabold mb-4 tracking-wider">CHECKOUT</h1>

            <div className="flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-[65%] space-y-6">
                    <MyInformation address={selectedAddress} />
                    <AddressSection onSelect={setSelectedAddress} />
                    <ParcelSection />
                    <PaymentOptions
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        setSelectedProvider={setPaymentProvider}
                    />
                </div>

                <div className="w-full lg:w-[35%]">
                    <OrderSummary
                        paymentMethod={paymentMethod}
                        paymentProvider={paymentProvider}
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
        <section className="pb-3 border-b mx-2 md:mx-4">
            <h2 className="font-semibold mb-3">MY INFORMATION</h2>
            <p className="capitalize">{address.name}</p>
            <p className="text-sm text-gray-600">{address.email}</p>
        </section>
    );
}

/* ---------------- PARCEL ---------------- */

function ParcelSection() {
    const cartItems = useAppSelector((s) => s.cart.items);
    const dispatch = useAppDispatch();

    return (
        <section className="mx-2 md:mx-4">
            <h2 className="font-semibold mb-2">PARCEL</h2>
            <p className="text-sm mb-4">Shipped by THE LAYER CO.</p>

            <div
                className="
                    flex gap-4
                    overflow-x-auto
                    whitespace-nowrap
                    pb-2
                    scrollbar-thin
                "
            >

                {cartItems.map((item: CartItem) => (
                    <div key={item.variantSku} className="w-24 h-32 relative flex-shrink-0">

                        <Image src={item.image} alt="" fill className="object-cover" />
                        <div className="absolute bottom-0 right-0">
                            <MdDeleteOutline
                                size={18}
                                className="cursor-pointer hover:text-red-600"
                                onClick={() =>
                                    dispatch(
                                        removeCartItem({
                                            productId: item.productId,
                                            variantSku: item.variantSku,
                                        })
                                    )
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-xs mt-4">
                <p><span className="font-semibold">Standard Delivery</span> <br />
                    Rs.50.00 <br />
                    <span className="font-semibold">Free Delivery on order above Rs. 999</span> <br />
                    2-7 days
                </p>
            </div>

        </section>
    );
}

/* ---------------- PAYMENT OPTIONS ---------------- */

type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

type PaymentProvider = "razorpay" | "offline";

type PaymentOption = {
    value: PaymentMethod;
    label: string;
    img: string;
    provider: PaymentProvider;
};


const PAYMENT_OPTIONS = [
    { value: "upi", label: "UPI", img: "/images/upi-icon.svg" },
    { value: "card", label: "CARD", img: "/images/visa-icon.svg" },
    { value: "netbanking", label: "NET BANKING", img: "/images/net-banking-icon.svg" },
    { value: "cod", label: "COD", img: "/images/cod.svg" },
];

function PaymentOptions({
    paymentMethod,
    setPaymentMethod,
    setSelectedProvider,
}: {
    paymentMethod: PaymentMethod;
    setPaymentMethod: (m: PaymentMethod) => void;
    setSelectedProvider: (p: PaymentProvider) => void;
}) {
    const [options, setOptions] = useState<PaymentOption[]>([]);

    useEffect(() => {
        fetch("/api/payment/options")
            .then((r) => r.json())
            .then(setOptions);
    }, []);

    return (
        <div className="py-2 rounded space-y-2 mx-2 md:mx-4">
            <h2 className="font-semibold">PAYMENT</h2>

            {options.map((item) => (
                <label
                    key={item.value}
                    className="flex justify-between items-center border-b py-4 cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <Image src={item.img} alt={item.label} width={24} height={24} />
                        <span>{item.label}</span>
                    </div>

                    <input
                        type="radio"
                        checked={paymentMethod === item.value}
                        onChange={() => {
                            setPaymentMethod(item.value);
                            setSelectedProvider(item.provider);
                        }}
                    />
                </label>
            ))}
        </div>
    );
}

/* ---------------- SUMMARY ---------------- */

function OrderSummary({
    paymentMethod,
    paymentProvider,
    address,
}: {
    paymentMethod: PaymentMethod;
    paymentProvider: PaymentProvider;
    address: Address | null;
}) {
    const cartItems = useAppSelector((state) => state.cart.items);
    const [data, setData] = useState<CheckoutResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    /* FIX 1 — SINGLE FETCH */
    useEffect(() => {
        if (cartItems.length === 0) return;

        fetch("/api/checkout/prepare", { method: "POST" })
            .then((r) => r.json())
            .then(setData);
    }, [cartItems]);



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
        if (cartItems.length === 0) {
            alert("Cart is empty");
            return;
        }


        setLoading(true);

        /* COD */
        if (paymentProvider === "offline") {
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
            method: {
                upi: paymentMethod === "upi",
                card: paymentMethod === "card",
                netbanking: paymentMethod === "netbanking",
            },
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
        <div className="w-full sticky top-20 mb-20">
            <div className="space-y-4 md:sticky md:top-24 mx-2 md:mx-4">
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
                    disabled={loading || cartItems.length === 0}
                    onClick={handlePayment}
                    className="max-md:hidden  cursor-pointer w-full bg-black hover:bg-black/80 text-white py-4 mt-4 flex justify-center items-center gap-2"
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
            <div className="w-full md:hidden fixed bottom-0 h-35 bg-white flex flex-col justify-between p-4">
                <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>Rs. {data.summary.totalAmount}</span>
                </div>
                <button
                    disabled={loading || cartItems.length === 0}
                    onClick={handlePayment}
                    className="cursor-pointer p-4 bg-black w-full text-white mx-auto
                                flex items-center justify-center gap-2
                                transition-all duration-150 ease-out
                                hover:opacity-90 active:scale-[0.97]
                                disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading ? "PROCESSING..." : "COMPLETE PURCHASE"}
                </button>
            </div>
        </div>
    );
}
