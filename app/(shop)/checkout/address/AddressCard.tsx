import { Address } from "@/types/AddressTypes";

export default function AddressCard({
    address,
    onSelect,
    onRefresh,
}: {
    address: Address;
    onSelect: () => void;
    onRefresh: () => void;
}) {
    const setDefault = async () => {
        if (address.isDefault) return;

        await fetch(`/api/address/${address._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDefault: true }),
        });

        onRefresh();
        onSelect();
    };

    return (
        <label className="block py-4 border-b cursor-pointer">
            <div className="flex gap-4">
                <input
                    type="radio"
                    checked={address.isDefault}
                    onChange={setDefault}
                    className="mt-1 accent-black"
                />

                <div>
                    <p className="font-medium capitalize">{address.name}</p>
                    <p className="text-sm text-gray-600">
                        {address.addressLine1}, {address.city}
                    </p>
                </div>
            </div>
        </label>
    );
}
