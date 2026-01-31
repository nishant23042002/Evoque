import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/CartTypes";
import { fetchCart, addCartItem } from "./cart.thunks";
import { removeCartItem } from "./cart.thunks";

interface CartState {
    items: CartItem[];
    loading: boolean;
}

const initialState: CartState = {
    items: [],
    loading: false,
};


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        removeFromCart(
            state,
            action: PayloadAction<{ productId: string; variantSku: string }>
        ) {
            state.items = state.items.filter(
                i =>
                    !(
                        i.productId === action.payload.productId &&
                        i.variantSku === action.payload.variantSku
                    )
            );
        },

        increaseQuantity(
            state,
            action: PayloadAction<{ productId: string; variantSku: string }>
        ) {
            const item = state.items.find(
                i =>
                    i.productId === action.payload.productId &&
                    i.variantSku === action.payload.variantSku
            );
            if (item) item.quantity += 1;
        },

        decreaseQuantity(
            state,
            action: PayloadAction<{ productId: string; variantSku: string }>
        ) {
            const item = state.items.find(
                i =>
                    i.productId === action.payload.productId &&
                    i.variantSku === action.payload.variantSku
            );

            if (!item) return;

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter(
                    i =>
                        !(
                            i.productId === action.payload.productId &&
                            i.variantSku === action.payload.variantSku
                        )
                );
            }
        },

        clearCart(state) {
            state.items = [];
        },
    },

    /* 🔥 THIS WAS MISSING */
    extraReducers: builder => {
        builder
            .addCase(fetchCart.pending, state => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchCart.rejected, state => {
                state.loading = false;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    i =>
                        !(
                            i.productId === action.payload.productId &&
                            i.variantSku === action.payload.variantSku
                        )
                );
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                const item = action.payload;

                const existing = state.items.find(
                    i =>
                        i.productId === item.productId &&
                        i.variantSku === item.variantSku
                );

                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    state.items.push(item);
                }
            });
    },
});

export const {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
