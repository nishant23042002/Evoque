"use client";

import { Address } from "@/types/AddressTypes";
import { useState } from "react";

interface Props {
    address: Address | null;
    onClose: () => void;
    onSuccess: (addr: Address) => void;
}

export default function AddressFormDrawer({
    address,
    onClose,
    onSuccess,
}: Props) {
    const [form, setForm] = useState({
        name: address?.name ?? "",
        phone: address?.phone ?? "",
        addressLine1: address?.addressLine1 ?? "",
        addressLine2: address?.addressLine2 ?? "",
        city: address?.city ?? "",
        state: address?.state ?? "",
        pincode: address?.pincode ?? "",
        isDefault: address?.isDefault ?? false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const updateField = (key: keyof typeof form, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validate = () => {
        if (!form.name.trim()) return "Name is required";   
        if (!form.phone.trim()) return "Phone is required";
        if (!form.addressLine1.trim()) return "Address is required";
        if (!form.city.trim()) return "City is required";
        if (!form.state.trim()) return "State is required";
        if (!form.pincode.trim()) return "Pincode is required";
        return "";
    };

    const submit = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const url = address ? `/api/address/${address._id}` : "/api/address";
            const method = address ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to save address");

            const data = await res.json();
            onSuccess(data);
            onClose();
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
            <div className="w-full max-w-md h-full p-6 space-y-4 bg-white overflow-y-auto">
                <h2 className="text-lg font-semibold">
                    {address ? "Edit Address" : "Add Address"}
                </h2>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </p>
                )}

                {/* NAME */}
                <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(v) => updateField("name", v)}
                />             

                {/* PHONE */}
                <Input
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => updateField("phone", v)}
                />

                {/* ADDRESS 1 */}
                <Input
                    label="Address Line 1"
                    value={form.addressLine1}
                    onChange={(v) => updateField("addressLine1", v)}
                />

                {/* ADDRESS 2 */}
                <Input
                    label="Address Line 2"
                    value={form.addressLine2}
                    onChange={(v) => updateField("addressLine2", v)}
                />

                {/* CITY */}
                <Input
                    label="City"
                    value={form.city}
                    onChange={(v) => updateField("city", v)}
                />

                {/* STATE */}
                <Input
                    label="State"
                    value={form.state}
                    onChange={(v) => updateField("state", v)}
                />

                {/* PINCODE */}
                <Input
                    label="Pincode"
                    type="number"
                    value={form.pincode}
                    onChange={(v) => updateField("pincode", v)}
                />

                {/* DEFAULT */}
                <label className="flex gap-2 text-sm items-center">
                    <input
                        type="checkbox"
                        checked={form.isDefault}
                        onChange={(e) => updateField("isDefault", e.target.checked)}
                    />
                    Set as default
                </label>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 py-3 bg-black text-white rounded disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 border rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- REUSABLE INPUT ---------- */

function Input({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 border border-black/10 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
        </div>
    );
}
