"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddressSection from "./address/AddressSection";
import { CartItem } from "@/types/CartTypes";
import { Lock } from "lucide-react";
import { Address } from "@/types/AddressTypes";
import { RazorpayOptions } from "@/types/Razorpay";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cart/cart.slice";
import { MdDeleteOutline } from "react-icons/md";
import { removeCartItem } from "@/store/cart/cart.thunks";
import useAnimatedNumber from "@/lib/useAnimateNumber";
import { useRouter } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [paymentProvider, setPaymentProvider] =
        useState<PaymentProvider>("razorpay");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");




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
        <section className="pb-3 border-b border-black/10 mx-2 md:mx-4">
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
                    <div key={item.variantSku} className="w-24 h-32 relative shrink-0">

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
                    Rs. 100 <br />
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
    description: string
};



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
        <div className="py-2 mx-2 md:mx-4">
            <h2 className="font-semibold mb-4 tracking-wide">PAYMENT</h2>

            <Accordion
                type="single"
                collapsible
                value={paymentMethod}
                onValueChange={(value) => {
                    const selected = options.find(
                        (opt) => opt.value === value
                    );
                    if (!selected) return;

                    setPaymentMethod(selected.value);
                    setSelectedProvider(selected.provider);
                }}
                className="w-full"
            >
                {options.map((item) => (
                    <AccordionItem
                        key={item.value}
                        value={item.value}
                        className="border-b border-black/10"
                    >
                        <AccordionTrigger className="hover:no-underline py-4 [&>svg]:hidden">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={item.img}
                                        alt={item.label}
                                        width={24}
                                        height={24}
                                    />
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </div>

                                {/* Radio */}
                                <input className="
                                        h-4 w-4
                                        appearance-none
                                        border border-black
                                        checked:bg-black
                                        checked:border-white
                                        transition-colors
                                    "
                                    type="radio"
                                    checked={paymentMethod === item.value}
                                    readOnly
                                />
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="text-xs tracking-wider pb-4 pr-10">
                            {item.description}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
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
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();

    /* FIX 1 — SINGLE FETCH */
    const fetchCheckout = async (code?: string) => {
        try {
            if (code !== undefined) {
                setCouponLoading(true);
            }
            const res = await fetch("/api/checkout/prepare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    couponCode: code ?? "",
                    addressId: address?._id ?? null,  // ✅ ADD THIS
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setCouponError(result.message || "Invalid coupon");
                return;
            }

            setCouponError("");
            setData(result);
        } catch {
            setCouponError("Failed to load checkout");
        } finally {
            if (code !== undefined) {
                setCouponLoading(false);
            }
        }
    };

    /* Initial load */
    useEffect(() => {
        if (cartItems.length === 0) return;
        if (!address?._id) return;

        fetchCheckout();
    }, [cartItems, address?._id]);


    /* Razorpay Script */
    useEffect(() => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.async = true;
        document.body.appendChild(s);
    }, []);




    const fallbackSubtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const subTotal = data?.summary.subtotal ?? fallbackSubtotal;
    const animatedSubTotal = useAnimatedNumber(subTotal)

    const tax = data?.summary.tax ?? 0
    const animatedTax = useAnimatedNumber(tax);

    const fallbackGrandTotal =
        subTotal + tax - (data?.summary.discount ?? 0);

    const grandTotal = data?.summary.totalAmount ?? fallbackGrandTotal;
    const animatedGrandTotal = useAnimatedNumber(grandTotal)

    const animatedDiscount = useAnimatedNumber(
        data?.summary.discount ?? 0
    );

    const fallbackShipping = subTotal >= 999 ? 0 : 100;



    const handlePayment = async () => {
        if (!address) {
            setCheckoutError("Please select a delivery address.");
            return;
        }
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        if (!data) {
            alert("Checkout not ready. Please wait.");
            return;
        }

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

        if (!data?.checkoutToken) {
            setLoading(false);
            return;
        }

        const res = await fetch("/api/payment/razorpay/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                checkoutToken: data.checkoutToken,
            }),
        });

        const payment: RazorpayCreateResponse = await res.json();

        if (!window.Razorpay) {
            alert("Payment system not loaded. Please refresh.");
            setLoading(false);
            return;
        }
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
            handler: async () => {
                try {
                    dispatch(clearCart());
                    router.replace("/account/order/success");
                } catch (err) {
                    console.error("Analytics update failed", err);
                }
            },

            modal: { ondismiss: () => setLoading(false) },
        });

        razorpay.open();
    };

    if (cartItems.length === 0) {
        return (
            <div className="w-full sticky top-20 mb-20">
                <div className="mx-2 md:mx-4 border p-8 text-center space-y-6">
                    <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                    <p className="text-sm text-gray-600">
                        Looks like you haven’t added anything yet.
                    </p>

                    <button
                        onClick={() => router.push("/")}
                        className="bg-black cursor-pointer text-white px-6 py-3 hover:opacity-90 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }





    return (
        <div className="w-full sticky top-20 mb-20">
            <div className="space-y-4 md:sticky md:top-24 mx-2 md:mx-4">
                <h3 className="font-semibold text-lg">CHECKOUT</h3>
                {/* COUPON INPUT */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter coupon"
                        value={couponCode}
                        onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                        }
                        className="border border-black/10 px-3 py-2 w-full text-sm"
                    />
                    <button
                        onClick={() => fetchCheckout(couponCode)}
                        disabled={couponLoading}
                        className="bg-black text-white px-4 text-sm"
                    >
                        {couponLoading ? "..." : "APPLY"}
                    </button>
                </div>

                {couponError && (
                    <p className="text-red-500 text-xs">{couponError}</p>
                )}
                <div className="flex justify-between text-sm">
                    <span>Bag Total</span>
                    <span>Rs. {animatedSubTotal}</span>
                </div>

                {(data?.summary?.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-red-600 text-sm">
                        <span>Discount</span>
                        <span>-Rs. {animatedDiscount}</span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Rs. {animatedTax}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Rs. {data?.summary.shipping ?? fallbackShipping}</span>
                </div>

                <hr className="border-black" />

                <div className="flex justify-between font-medium text-lg">
                    <span className="uppercase">Total</span>
                    <span>Rs. {animatedGrandTotal}</span>
                </div>

                <div className="space-y-3">

                    <p className="text-xs">We will process your personal data in accordance with THE LAYER CO. <a href="/pages/privacy-policy" className="underline cursor-pointer hover:text-black/70">Privacy Notice</a></p>
                    <p className="text-xs">By continuing, you agree to THE LAYER CO. General <a href="/pages/terms-conditions" className="underline cursor-pointer hover:text-black/70">Terms and Conditions</a></p>
                </div>
                {checkoutError && (
                    <p className="text-red-500 text-xs">{checkoutError}</p>
                )}
                <button
                    disabled={loading}
                    onClick={handlePayment}
                    className="max-md:hidden  cursor-pointer w-full bg-black hover:bg-black/80 text-white py-4 mt-4 flex justify-center items-center gap-2"
                >
                    {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading ? "PROCESSING..." : "COMPLETE PURCHASE"}
                </button>


                <div className="text-xs font-extralight">
                    <div className="flex items-center gap-2"><span><Lock size={16} /></span> Payment information is encrypted.</div>
                    <p className="mt-3 mb-6"> Need help? Please contact <span className="underline hover:text-black/70 cursor-pointer">Customer Support</span></p>
                    <a href="/pages/shipping-returns" className="underline underline-offset-2 uppercase text-[16px] cursor-pointer hover:text-black/70 font-extralight">Delivery and return options</a>
                </div>
            </div>
            <div className="w-full md:hidden fixed bottom-0 h-35 bg-white flex flex-col justify-between p-4">
                <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>Rs. {animatedGrandTotal}</span>
                </div>
                
                {!paymentMethod && (
                    <p className="text-xs text-red-500">
                        Please select a payment method.
                    </p>
                )}
                <button
                    disabled={loading}
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
