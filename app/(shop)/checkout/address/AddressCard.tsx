import { Address } from "@/types/AddressTypes";

export default function AddressCard({
    address,
    onSelect,
    onEdit,
    onRefresh,
}: {
    address: Address;
    onSelect: () => void;
    onEdit: () => void;
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

    const remove = async () => {
        await fetch(`/api/address/${address._id}`, { method: "DELETE" });
        onRefresh();
    };

    return (
        <div className="p-3 mb-2">
            <div className="relative flex gap-3 items-start">
                <input
                    className="absolute top-5 -left-4"
                    type="radio"
                    checked={address.isDefault}
                    onChange={setDefault}
                />

                <div className="flex-1">
                    <p className="font-medium capitalize">{address.name}</p>
                    

                    <p className="text-sm">
                        {address.addressLine1}
                    </p>
                    <p className="text-sm">
                        {address.addressLine2}
                    </p>

                    <p className="text-sm">{address.pincode} {address.city}</p>
                    <p className="text-sm">{address.state}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                        <button onClick={onEdit} className="border border-[var(--border-light)] py-1 px-3 hover:underline hover:text-black/70 cursor-pointer">
                            EDIT
                        </button>
                        <button onClick={remove} className="border border-[var(--border-light)] px-3 py-1  hover:underline hover:text-black/70 cursor-pointer">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
