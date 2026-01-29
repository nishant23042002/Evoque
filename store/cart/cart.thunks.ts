import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { CartItem } from "@/types/CartTypes";

/* FETCH CART */
export const fetchCart = createAsyncThunk<CartItem[]>(
    "cart/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/cart");
            return res.data;
        } catch {
            return rejectWithValue("Failed to fetch cart");
        }
    }
);

export const addCartItem = createAsyncThunk<
    CartItem,
    CartItem
>("cart/add", async (item, { rejectWithValue }) => {
    try {
        await api.post("/cart", item);
        return item; // Redux mirror
    } catch {
        return rejectWithValue("Failed to add to cart");
    }
});


export const removeCartItem = createAsyncThunk<
    { productId: string; variantSku: string },
    { productId: string; variantSku: string }
>(
    "cart/remove",
    async ({ productId, variantSku }, { rejectWithValue }) => {
        try {
            await api.delete(`/cart/${variantSku}`);
            return { productId, variantSku };
        } catch {
            return rejectWithValue("Failed to remove cart item");
        }
    }
);