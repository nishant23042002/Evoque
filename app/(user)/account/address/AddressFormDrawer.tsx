"use client";

import { Address } from "@/types/AddressTypes";
import { useState } from "react";

interface Props {
    address: Address | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddressFormDrawer({
    address,
    onClose,
    onSuccess,
}: Props) {
    const [form, setForm] = useState({
        name: address?.name ?? "",
        email: address?.email ?? "",
        phone: address?.phone ?? "",
        addressLine1: address?.addressLine1 ?? "",
        addressLine2: address?.addressLine2 ?? "",
        city: address?.city ?? "",
        state: address?.state ?? "",
        pincode: address?.pincode ?? "",
        isDefault: address?.isDefault ?? false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, value: string | boolean) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const submit = async () => {
        // -------- VALIDATION --------
        if (!form.name || !form.phone || !form.addressLine1) {
            alert("Please fill required fields");
            return;
        }

        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
            alert("Invalid email");
            return;
        }

        try {
            setLoading(true);

            const url = address
                ? `/api/address/${address._id}`
                : "/api/address";

            const method = address ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to save address");

            onSuccess();
            onClose();
        } catch (err) {
            alert("Something went wrong");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
            <div className="w-full max-w-md h-full bg-white p-3 space-y-6 overflow-y-auto border-l">

                <h2 className="text-lg font-semibold uppercase tracking-widest">

                    {address ? "Edit Address" : "Add New Address"}
                </h2>

                {/* NAME */}
                <input
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={e => handleChange("name", e.target.value)}
                    className="input w-full border border-(--border-strong) p-3"
                />

                {/* EMAIL */}
                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => handleChange("email", e.target.value)}
                    className="input border w-full border-(--border-strong) p-3"
                />

                {/* PHONE */}
                <input
                    placeholder="Phone *"
                    type="tel"
                    value={form.phone}
                    onChange={e => handleChange("phone", e.target.value)}
                    className="input border w-full border-(--border-strong) p-3"
                />

                {/* ADDRESS */}
                <input
                    placeholder="Address Line 1 *"
                    value={form.addressLine1}
                    onChange={e => handleChange("addressLine1", e.target.value)}
                    className="input border w-full border-(--border-strong) p-3"
                />

                <input
                    placeholder="Address Line 2"
                    value={form.addressLine2}
                    onChange={e => handleChange("addressLine2", e.target.value)}
                    className="input border w-full border-(--border-strong) p-3"
                />

                {/* CITY */}
                <input
                    placeholder="City *"
                    value={form.city}
                    onChange={e => handleChange("city", e.target.value)}
                    className="input border w-full border-(--border-strong) p-3"
                />

                {/* STATE */}
                <input
                    placeholder="State *"
                    value={form.state}
                    onChange={e => handleChange("state", e.target.value)}
                    className="input border w-full border-(--border-strong) p-3"
                />

                {/* PINCODE */}
                <input
                    placeholder="Pincode *"
                    type="number"
                    value={form.pincode}
                    onChange={e => handleChange("pincode", e.target.value)}
                    className="input border w-full border-(--border-strong) p-3"
                />

                {/* DEFAULT */}
                <label className="flex gap-3 text-xs uppercase tracking-widest text-gray-600">

                    <input className="cursor-pointer"
                        type="checkbox"
                        checked={form.isDefault}
                        onChange={e => handleChange("isDefault", e.target.checked)}
                    />
                    Set as default
                </label>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="cursor-pointer flex-1 py-3 bg-black text-white text-xs uppercase tracking-widest"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                        onClick={onClose}
                        className="cursor-pointer flex-1 py-3 border text-xs uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
