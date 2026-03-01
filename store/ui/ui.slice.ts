import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProductToastType =
    | "cart"
    | "wishlist"
    | "wishlist-remove"
    | "cart-remove"
    | "error"
    | "success"
    | "info"
    | "warning";

export type ProductToastPayload = {
    id?: string;
    name?: string;
    image: string;
    price?: number;
    size?: string;
    message?: string;
    duration?: number;
    type: ProductToastType;
};

type UIState = {
    productToast: ProductToastPayload | null;
};

const initialState: UIState = {
    productToast: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        showProductToast: (
            state,
            action: PayloadAction<ProductToastPayload>
        ) => {
            state.productToast = action.payload;
        },
        hideProductToast: (state) => {
            state.productToast = null;
        },
    },
});

export const { showProductToast, hideProductToast } = uiSlice.actions;
export default uiSlice.reducer;