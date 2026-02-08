"use client";

import { useEffect, useState } from "react";
import { Address } from "@/types/AddressTypes";
import AddressCard from "./AddressCard";
import AddressFormDrawer from "./AddressFormDrawer";

export default function AddressSection({
    onSelect,
}: {
    onSelect: (a: Address) => void;
}) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editAddress, setEditAddress] = useState<Address | null>(null);

    const loadAddresses = async () => {
        const res = await fetch("/api/address");
        const data: Address[] = await res.json();
        setAddresses(data);

        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) onSelect(defaultAddr);
    };

    useEffect(() => {
        const init = async () => {
            const res = await fetch("/api/address");
            const data: Address[] = await res.json();
            setAddresses(data);

            const defaultAddr = data.find((a) => a.isDefault);
            if (defaultAddr) onSelect(defaultAddr);
        };

        init();
    }, [onSelect]);

    return (
        <section className="border-b pb-6">
            <h2 className="font-semibold mb-4">BILLING ADDRESS</h2>

            {addresses.map((address) => (
                <AddressCard
                    key={address._id}
                    address={address}
                    onSelect={() => onSelect(address)}
                    onRefresh={loadAddresses}
                />
            ))}

            <button
                onClick={() => {
                    setEditAddress(null);
                    setOpenForm(true);
                }}
                className="underline text-sm mt-3"
            >
                ADD
            </button>

            {openForm && (
                <AddressFormDrawer
                    address={editAddress}
                    onClose={() => setOpenForm(false)}
                    onSuccess={loadAddresses}
                />
            )}
        </section>
    );
}
