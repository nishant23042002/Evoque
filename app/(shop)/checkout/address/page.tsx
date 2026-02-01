"use client";

import { useEffect, useState } from "react";
import { Address } from "@/types/AddressTypes";
import AddressCard from "./AddressCard";
import AddressFormDrawer from "./AddressFormDrawer";
import AddressSkeleton from "./AddressSkeleton";

export default function AddressPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [editAddress, setEditAddress] = useState<Address | null>(null);

    const fetchAddresses = async () => {
        setLoading(true);
        const res = await fetch("/api/address");
        const data = await res.json();
        setAddresses(data);
        setLoading(false);
    };

    useEffect(() => {
        let isMounted = true;

        const loadAddresses = async () => {
            setLoading(true);
            const res = await fetch("/api/address");
            const data = await res.json();

            if (isMounted) {
                setAddresses(data);
                setLoading(false);
            }
        };

        loadAddresses();

        return () => {
            isMounted = false;
        };
    }, []);


    useEffect(() => {
        let active = true;

        const validateCart = async () => {
            const res = await fetch("/api/cart");

            if (!res.ok && active) {
                window.location.replace("/cart");
            }
        };

        validateCart();

        return () => {
            active = false;
        };
    }, []);


    const hasDefaultAddress = addresses.some(a => a.isDefault);

    if (loading) return <AddressSkeleton />;

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6 h-[95vh]">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Delivery Address</h1>
                <button
                    onClick={() => {
                        setEditAddress(null);
                        setOpenForm(true);
                    }}
                    className="text-sm font-medium underline"
                >
                    + Add New
                </button>
            </div>

            <div className="space-y-4">
                {addresses.map(address => (
                    <AddressCard
                        key={address._id}
                        address={address}
                        onRefresh={fetchAddresses}
                        onEdit={() => {
                            setEditAddress(address);
                            setOpenForm(true);
                        }}
                    />
                ))}
            </div>

            {openForm && (
                <AddressFormDrawer
                    address={editAddress}
                    onClose={() => setOpenForm(false)}
                    onSuccess={fetchAddresses}
                />
            )}
            <button
                disabled={!hasDefaultAddress}
                onClick={() => {
                    window.location.href = "/checkout/review";
                }}
                className="w-full bg-black text-white py-3 rounded mt-6"
            >
                Deliver to this address
            </button>

            {!hasDefaultAddress && (
                <p className="text-xs text-red-600 mt-2">
                    Please select a default address to continue
                </p>
            )}


        </div>
    );
}
