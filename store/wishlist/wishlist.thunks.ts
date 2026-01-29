import { createAsyncThunk } from "@reduxjs/toolkit";
import { WishlistItem } from "@/types/WishlistTypes";
import api from "@/lib/axios";
export const dynamic = "force-dynamic";

/**
 * Fetch wishlist for logged-in user
 */
export const fetchWishlist = createAsyncThunk<
    WishlistItem[]
>(
    "wishlist/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/wishlist");
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue("Failed to fetch wishlist");
        }
    }
);

/**
 * Add item to wishlist
 */
export const addWishlistItem = createAsyncThunk<
    WishlistItem,
    WishlistItem
>(
    "wishlist/add",
    async (item, { rejectWithValue }) => {
        try {
            await api.post("/wishlist", { productId: item.productId });

            return item; // ✅ THIS FIXES EVERYTHING
        } catch {
            return rejectWithValue("Failed to add wishlist item");
        }
    }
);



/**
 * Remove item from wishlist
 */
export const removeWishlistItem = createAsyncThunk<
    string,          // ✅ fulfilled payload
    string,          // ✅ argument
    { rejectValue: string } // ✅ reject payload
>(
    "wishlist/remove",
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            return productId; // ✅ always string on success
        } catch {
            return rejectWithValue("Failed to remove wishlist item");
        }
    }
);