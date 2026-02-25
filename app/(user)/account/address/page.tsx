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
        try {
            setLoading(true);

            const res = await fetch("/api/address");

            if (!res.ok) {
                setAddresses([]);
                return;
            }

            const data = await res.json();

            // CRITICAL CHECK
            if (!Array.isArray(data)) {
                setAddresses([]);
                return;
            }

            setAddresses(data);
        } catch (err) {
            console.error(err);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };


    // Load addresses
    useEffect(() => {
        let active = true;

        const loadAddresses = async () => {
            const res = await fetch("/api/address");
            const data = await res.json();

            if (active) {
                setAddresses(data);
                setLoading(false);
            }
        };

        loadAddresses();

        return () => {
            active = false;
        };
    }, []);

    if (loading) return <AddressSkeleton />;


    return (
        <div className="relative bg-white min-h-screen flex flex-col">
            {/* CONTENT */}
            <button
                onClick={() => {
                    setEditAddress(null);
                    setOpenForm(true);
                }}
                className="absolute cursor-pointer -top-4 right-4 text-xs uppercase tracking-widest hover:underline underline-offset-2"
            >
                Add New
            </button>
            <div className="flex-1">
                <div className="px-2 sm:px-4 py-2">
                    {Array.isArray(addresses) && addresses.length > 0 ? (
                        addresses.map(address => (
                            <AddressCard
                                key={address._id}
                                address={address}
                                onRefresh={fetchAddresses}
                                onEdit={() => {
                                    setEditAddress(address);
                                    setOpenForm(true);
                                }}
                            />
                        ))
                    ) : (
                        <EmptyState
                            onAdd={() => {
                                setEditAddress(null);
                                setOpenForm(true);
                            }}
                        />
                    )}
                </div>

            </div>

            {openForm && (
                <AddressFormDrawer
                    address={editAddress}
                    onClose={() => setOpenForm(false)}
                    onSuccess={fetchAddresses}
                />
            )}
        </div>
    );

}

/* ---------------- EMPTY STATE ---------------- */

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="border p-16 text-center space-y-4">
            <p className="text-sm uppercase tracking-widest text-gray-500">
                No Address Added
            </p>

            <button
                onClick={onAdd}
                className="text-xs uppercase tracking-widest underline"
            >
                Add Address
            </button>
        </div>

    );
}
