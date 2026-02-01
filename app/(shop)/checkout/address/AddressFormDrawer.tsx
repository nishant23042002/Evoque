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
        phone: address?.phone ?? "",
        addressLine1: address?.addressLine1 ?? "",
        addressLine2: address?.addressLine2 ?? "",
        city: address?.city ?? "",
        state: address?.state ?? "",
        pincode: address?.pincode ?? "",
        isDefault: address?.isDefault ?? false,
    });

    const submit = async () => {
        const url = address
            ? `/api/address/${address._id}`
            : "/api/address";

        const method = address ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
            <div className="bg-white w-full max-w-md h-full p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                    {address ? "Edit Address" : "Add New Address"}
                </h2>

                {Object.entries(form).map(([key, value]) =>
                    key !== "isDefault" ? (
                        <input
                            key={key}
                            placeholder={key}
                            value={value as string}
                            onChange={e =>
                                setForm({ ...form, [key]: e.target.value })
                            }
                            className="w-full border p-2 rounded"
                        />
                    ) : null
                )}

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={form.isDefault}
                        onChange={e =>
                            setForm({ ...form, isDefault: e.target.checked })
                        }
                    />
                    Set as default address
                </label>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={submit}
                        className="flex-1 bg-black text-white py-2 rounded"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 border py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
