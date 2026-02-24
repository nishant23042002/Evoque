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

    // reusable fetch
    const fetchAddresses = async () => {
        const res = await fetch("/api/address");
        const data: Address[] = await res.json();
        setAddresses(data);

        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) onSelect(defaultAddr);
    };

    // INITIAL LOAD (inline fetch, not calling setter function)
    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/address");
            const data: Address[] = await res.json();
            setAddresses(data);

            const defaultAddr = data.find((a) => a.isDefault);
            if (defaultAddr) onSelect(defaultAddr);
        };

        load();
    }, [onSelect]);

    return (
        <section className="pb-3 border-b border-black/10 mx-2 md:mx-4">
            <h2 className="font-semibold">BILLING ADDRESS</h2>
            <div className="h-60 overflow-y-auto px-2">

                {addresses.map((address) => (
                    <AddressCard
                        key={address._id}
                        address={address}
                        onSelect={() => onSelect(address)}
                        onEdit={() => {
                            setEditAddress(address);
                            setOpenForm(true);
                        }}
                        onRefresh={fetchAddresses}
                    />
                ))}
                <button
                    onClick={() => {
                        setEditAddress(null);
                        setOpenForm(true);
                    }}
                    className="hover:underline border border-black/10 py-1 px-3 hover:text-black/70 cursor-pointer text-sm mt-3"
                >
                ADDRESS +
                </button>
            </div>


            {openForm && (
                <AddressFormDrawer
                    address={editAddress}
                    onClose={() => {
                        setOpenForm(false);
                        setEditAddress(null);
                    }}
                    onSuccess={async () => {
                        await fetchAddresses();
                    }}
                />
            )}
        </section>
    );
}
