"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchCart } from "@/store/cart/cart.thunks";
import Link from "next/link";

export default function OrderSuccessPage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Re-sync cart after webhook clears it
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
            window.history.go(1);
        };
    }, []);


    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
            <h1 className="text-2xl font-semibold">🎉 Order placed successfully</h1>
            <p className="text-sm text-gray-600">
                Thank you for shopping with The Layer Co
            </p>

            <Link
                href="/account/order"
                className="mt-4 px-6 py-3 bg-black text-white rounded"
            >
                Continue Shopping
            </Link>
        </div>
    );
}
