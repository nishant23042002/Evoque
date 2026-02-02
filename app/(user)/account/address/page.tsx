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
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "var(--background)" }}
        >
            {/* HEADER */}
            <div
                className="sticky top-0 z-20 backdrop-blur-md"
                style={{
                    background: "rgba(250,248,244,0.85)",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <div className="max-w-5xl mx-auto py-5 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-foreground tracking-wide">
                        Delivery Address
                    </h1>

                    <button
                        onClick={() => {
                            setEditAddress(null);
                            setOpenForm(true);
                        }}
                        className="text-sm font-medium underline"
                        style={{ color: "var(--primary)" }}
                    >
                        + Add New
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto py-6 space-y-6">
                    {addresses.length === 0 ? (
                        <EmptyState
                            onAdd={() => {
                                setEditAddress(null);
                                setOpenForm(true);
                            }}
                        />
                    ) : (
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
                    )}
                </div>
            </div>

            {/* DRAWER */}
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
        <div
            className="rounded-xl h-[95vh] p-10 text-center space-y-4"
            style={{
                background: "var(--surface)",
                border: "1px dashed var(--border)",
            }}
        >
            <p className="text-sm text-(--text-secondary)">
                No delivery address added yet.
            </p>

            <button
                onClick={onAdd}
                className="px-5 py-2 rounded-md text-sm font-medium"
                style={{
                    background: "var(--btn-primary-bg)",
                    color: "var(--btn-primary-text)",
                }}
            >
                Add Address
            </button>
        </div>
    );
}
