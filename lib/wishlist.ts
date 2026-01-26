// lib/wishlist.ts
import { WishlistItem } from "@/types/WishlistTypes";

export async function fetchWishlist(
    token: string
): Promise<WishlistItem[]> {
    const res = await fetch("/api/wishlist", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch wishlist");

    return res.json();
}

export async function toggleWishlist(
    token: string,
    item: WishlistItem
): Promise<void> {
    await fetch("/api/wishlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
    });
}
