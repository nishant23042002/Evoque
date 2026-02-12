import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/CartTypes";
import { fetchCart, addCartItem, updateCartQuantity } from "./cart.thunks";
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

        updateQuantityLocal(state, action) {
            const { variantSku, quantity } = action.payload;
            const item = state.items.find(i => i.variantSku === variantSku);
            if (item) item.quantity = quantity;
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
            })
        builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
            const { variantSku, quantity } = action.payload;

            const item = state.items.find(i => i.variantSku === variantSku);
            if (item) {
                item.quantity = Math.max(1, quantity);
            }
        });
    },
});

export const {
    removeFromCart,
    clearCart,
    updateQuantityLocal
} = cartSlice.actions;

export default cartSlice.reducer;
