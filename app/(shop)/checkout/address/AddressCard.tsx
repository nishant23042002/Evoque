import { Address } from "@/types/AddressTypes";

interface Props {
    address: Address;
    onRefresh: () => void;
    onEdit: () => void;
}

export default function AddressCard({ address, onRefresh, onEdit }: Props) {
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
        onRefresh();
    };

    return (
        <label className="block border rounded-md p-4 cursor-pointer hover:border-black transition">
            <div className="flex items-start gap-3">
                <input
                    type="radio"
                    checked={address.isDefault}
                    onChange={setDefault}
                    className="mt-1"
                />

                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">
                            {address.name}
                            {address.isDefault && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-black text-white rounded">
                                    DEFAULT
                                </span>
                            )}
                        </p>
                    </div>

                    <p className="text-sm mt-1">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                        <br />
                        {address.city}, {address.state} - {address.pincode}
                    </p>

                    <p className="text-sm mt-1">📞 {address.phone}</p>

                    <div className="flex gap-4 text-sm mt-3 underline">
                        <button onClick={onEdit}>Edit</button>
                        <button onClick={remove} className="text-red-600">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </label>
    );
}
