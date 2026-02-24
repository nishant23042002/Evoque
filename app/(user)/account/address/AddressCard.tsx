import { Address } from "@/types/AddressTypes";
import { useState } from "react";

interface Props {
    address: Address;
    onRefresh: () => void;
    onEdit: () => void;
}

export default function AddressCard({ address, onRefresh, onEdit }: Props) {
    const [showConfirm, setShowConfirm] = useState(false);


    const setDefault = async () => {
        if (address.isDefault) return;

        await fetch(`/api/address/${address._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDefault: true }),
        });

        onRefresh();
    };

    const remove = async () => {
        await fetch(`/api/address/${address._id}`, { method: "DELETE" });
        setShowConfirm(false);
        onRefresh();
    };


    return (
        <label className="block border mb-2 border-black/10 p-8 transition hover:border-black cursor-pointer">
            <div className="flex gap-6">

                <input
                    type="radio"
                    checked={address.isDefault}
                    onChange={setDefault}
                    className="mt-2 accent-black"
                />

                <div className="flex-1 space-y-3">

                    {/* NAME ROW */}
                    <div className="flex items-center gap-4">
                        <p className="font-medium capitalize tracking-wide text-sm">
                            {address.name}
                        </p>

                        {address.isDefault && (
                            <span className="text-[11px] px-3 py-1 border border-black/10 uppercase tracking-widest">
                                Default
                            </span>
                        )}
                    </div>

                    {/* EMAIL */}
                    {address.email && (
                        <p className="text-xs lowercase tracking-widest text-gray-500">
                            {address.email}
                        </p>
                    )}

                    {/* ADDRESS */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                        <br />
                        {address.city}, {address.state} – {address.pincode}
                    </p>

                    {/* PHONE */}
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                        {address.phone}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex gap-3 text-xs uppercase tracking-widest">
                        <button onClick={onEdit} className="cursor-pointer border border-black/10 hover:text-black/60 p-1 hover:underline">
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                setShowConfirm(true)
                            }}
                            className="cursor-pointer border border-black/10 p-1 hover:underline text-gray-500 hover:text-black"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-[90%] max-w-sm space-y-4 shadow-lg">
                        <h3 className="font-semibold text-sm uppercase tracking-widest">
                            Delete Address?
                        </h3>

                        <p className="text-xs text-gray-500">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3 text-xs uppercase tracking-widest">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="cursor-pointer px-4 py-2 border hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={remove}
                                className="cursor-pointer px-4 py-2 bg-black text-white hover:opacity-80"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </label>

    );
}
