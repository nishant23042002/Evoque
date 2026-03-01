import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { CartItem } from "@/types/CartTypes";
import { AxiosError } from "axios";

/* 🔹 Helper to extract backend error message */
const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return (
            error.response?.data?.message ||
            error.response?.data ||
            "Something went wrong"
        );
    }
    return "Something went wrong";
};

/* =========================
   FETCH CART
========================= */
export const fetchCart = createAsyncThunk<
    CartItem[],
    void,
    { rejectValue: string }
>(
    "cart/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/cart");
            return res.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

/* =========================
   ADD CART ITEM
========================= */
export const addCartItem = createAsyncThunk<
    CartItem,
    CartItem,
    { rejectValue: string }
>(
    "cart/add",
    async (item, { rejectWithValue }) => {
        try {
            await api.post("/cart", item);
            return item; // Mirror in Redux
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

/* =========================
   REMOVE CART ITEM
========================= */
export const removeCartItem = createAsyncThunk<
    { productId: string; variantSku: string },
    { productId: string; variantSku: string },
    { rejectValue: string }
>(
    "cart/remove",
    async ({ productId, variantSku }, { rejectWithValue }) => {
        try {
            await api.delete(`/cart/${variantSku}`);
            return { productId, variantSku };
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

/* =========================
   UPDATE QUANTITY
========================= */
export const updateCartQuantity = createAsyncThunk<
    { productId: string; variantSku: string; quantity: number },
    { productId: string; variantSku: string; quantity: number },
    { rejectValue: string }
>(
    "cart/updateQuantity",
    async ({ productId, variantSku, quantity }, { rejectWithValue }) => {
        try {
            await api.patch(`/cart/${variantSku}`, { quantity });
            return { productId, variantSku, quantity };
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);