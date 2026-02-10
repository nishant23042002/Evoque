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
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
            <div
                className="w-full flex flex-col max-w-md h-full p-6 space-y-4 overflow-y-auto"
                style={{ background: "var(--surface)" }}
            >
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    {address ? "Edit Address" : "Add New Address"}
                </h2>

                {/* NAME */}
                <input
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={e => handleChange("name", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                {/* EMAIL */}
                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => handleChange("email", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                {/* PHONE */}
                <input
                    placeholder="Phone *"
                    type="tel"
                    value={form.phone}
                    onChange={e => handleChange("phone", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                {/* ADDRESS */}
                <input
                    placeholder="Address Line 1 *"
                    value={form.addressLine1}
                    onChange={e => handleChange("addressLine1", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                <input
                    placeholder="Address Line 2"
                    value={form.addressLine2}
                    onChange={e => handleChange("addressLine2", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                {/* CITY */}
                <input
                    placeholder="City *"
                    value={form.city}
                    onChange={e => handleChange("city", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                {/* STATE */}
                <input
                    placeholder="State *"
                    value={form.state}
                    onChange={e => handleChange("state", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                {/* PINCODE */}
                <input
                    placeholder="Pincode *"
                    type="number"
                    value={form.pincode}
                    onChange={e => handleChange("pincode", e.target.value)}
                    className="input border border-[var(--border-strong)] p-3"
                />

                {/* DEFAULT */}
                <label className="flex items-center gap-2 text-sm">
                    <input
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
                        className="flex-1 py-3 rounded-md text-sm font-medium bg-black text-white disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-md text-sm border"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
