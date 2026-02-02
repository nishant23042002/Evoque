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
        <label
            className="block rounded-[3px] p-5 cursor-pointer transition"
            style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "var(--card-shadow)",
            }}
        >
            <div className="flex items-start gap-4">
                <input
                    type="radio"
                    checked={address.isDefault}
                    onChange={setDefault}
                    className="mt-1 accent-primary"
                />

                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-foreground">
                            {address.name}
                            {address.isDefault && (
                                <span
                                    className="ml-3 text-xs px-2.5 py-1 rounded-[3px]"
                                    style={{
                                        background: "var(--earth-sand)",
                                        color: "var(--earth-olive)",
                                        border: "1px solid var(--earth-olive)",
                                    }}
                                >
                                    DEFAULT
                                </span>
                            )}
                        </p>
                    </div>

                    <p className="text-sm mt-2 text-(--text-secondary) leading-relaxed">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                        <br />
                        {address.city}, {address.state} – {address.pincode}
                    </p>

                    <p className="text-sm mt-2 text-(--text-muted)">
                        📞 {address.phone}
                    </p>

                    <div className="flex gap-6 text-sm mt-4">
                        <button
                            onClick={onEdit}
                            className="underline text-primary"
                        >
                            Edit
                        </button>
                        <button
                            onClick={remove}
                            className="underline text-destructive"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </label>
    );
}
