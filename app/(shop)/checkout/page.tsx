"use client";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { useMemo, useState } from "react";
import AddressSection from "./address/AddressSection";
import { CartItem } from "@/types/CartTypes";
import { Lock } from "lucide-react";
import { Address } from "@/types/AddressTypes";


export default function CheckoutPage() {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    return (
        <div className="px-4 py-10">
            <h1 className="text-4xl font-semibold mb-10">CHECKOUT</h1>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* LEFT */}
                <div className="w-full lg:w-[65%] space-y-10">
                    <MyInformation address={selectedAddress} />
                    <AddressSection onSelect={setSelectedAddress} />
                    <DeliverySection address={selectedAddress} />
                    <ParcelSection />
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[35%]">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}

/* ---------------- MY INFO ---------------- */

function MyInformation({ address }: { address: Address | null }) {
    if (!address) return null;

    return (
        <section className="border-b pb-6">
            <h2 className="font-semibold mb-3">MY INFORMATION</h2>
            <p>{address.name}</p>
            <p className="text-sm text-gray-600">hello@gmail.com</p>
        </section>
    );
}


/* ---------------- DELIVERY ---------------- */

function DeliverySection({ address }: { address: Address | null }) {
    if (!address) return null;

    return (
        <section className="border-b pb-6">
            <h2 className="font-semibold mb-3">DELIVERY</h2>
            <p>{address.name}</p>
            <p className="text-sm text-gray-600">{address.phone}</p>
        </section>
    );
}




function ParcelSection() {
    const cartItems = useAppSelector((s) => s.cart.items);

    return (
        <section>
            <h2 className="font-semibold mb-4">PARCEL</h2>
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





function OrderSummary() {
    const cartItems = useAppSelector((state) => state.cart.items);
    const [loading, setLoading] = useState(false);

    const bagTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    );

    const discount = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                if (!item.originalPrice) return sum;
                return sum + (item.originalPrice - item.price) * item.quantity;
            }, 0),
        [cartItems]
    );

    const grandTotal = bagTotal;

    return (
        <div className="w-full ">
            <div className="space-y-4 md:sticky md:top-24 mx-2">
                <h3 className="font-medium text-lg">SUMMARY</h3>

                <div className="flex justify-between text-sm">
                    <span>Bag Total</span>
                    <span>Rs. {bagTotal}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-red-600 text-sm">
                        <span>Discount</span>
                        <span>-Rs. {discount}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span>Delivery Charges</span>
                    <span>FREE</span>
                </div>

                <hr />

                <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>Rs. {grandTotal}</span>
                </div>

                <div className="space-y-3">
                    <p className="text-xs">We will process your personal data in accordance with THE LAYER CO. <span className="underline cursor-pointer hover:text-black/70">Privacy Notice</span></p>
                    <p className="text-xs">By continuing, you agree to THE LAYER CO. General <span className="underline cursor-pointer hover:text-black/70">Terms and Conditions</span></p>
                </div>

                <button
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            window.location.href = "/checkout/review";
                        }, 1500);
                    }}
                    className="hidden md:flex items-center justify-center gap-2 w-full
                                        bg-black text-white py-4 mt-4 font-extralight
                                        transition-all duration-150 ease-out
                                        hover:opacity-90 active:scale-[0.97]
                                        disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading ? "PROCESSING..." : "COMPLETE PURCHASE"}
                </button>



                <div className="text-xs font-extralight">
                    <div className="flex items-center gap-2"><span><Lock size={16} /></span> Payment information is encrypted.</div>
                    <p className="mt-3 mb-6"> Need help? Please contact <span className="underline hover:text-black/70 cursor-pointer">Customer Support</span></p>
                    <p className="underline underline-offset-2 uppercase text-[16px] cursor-pointer hover:text-black/70 font-extralight">Delivery and return options</p>
                </div>
            </div>
            <div className="w-full md:hidden fixed bottom-0 left-0 bg-white z-[999] 
                flex flex-col gap-3 px-4 py-3 
                border-t shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">

                {/* Top Row */}
                <div className="flex w-full justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Rs. {grandTotal}</span>
                </div>

                {/* Button */}
                <button
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            window.location.href = "/checkout/review";
                        }, 1500);
                    }}
                    className="p-4 bg-black w-full text-white mx-auto
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
