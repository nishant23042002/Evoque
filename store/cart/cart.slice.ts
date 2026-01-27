import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cart.types";



interface CartState {
    items: CartItem[];
    subtotal: number;
}

const initialState: CartState = {
    items: [],
    subtotal: 0
}

const calculateCartTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;

            const existing = state.items.find(
                i =>
                    i.productId === item.productId &&
                    i.variantSku === item.variantSku // 🔥 size-aware
            );

            if (existing) {
                existing.quantity += item.quantity;
            } else {
                state.items.push(item);
            }

            state.subtotal += item.price * item.quantity;
        },


        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item.productId !== action.payload
            );
            state.subtotal = calculateCartTotal(state.items);
        },

        increaseQuantity(state, action: PayloadAction<string>) {
            const item = state.items.find(
                (i) => i.productId === action.payload
            );
            if (item) {
                item.quantity += 1;
                state.subtotal += item.price;
            }
        },

        decreaseQuantity(state, action: PayloadAction<string>) {
            const item = state.items.find(
                (i) => i.productId === action.payload
            );

            if (!item) return;

            if (item.quantity > 1) {
                item.quantity -= 1;
                state.subtotal -= item.price;
            } else {
                // auto-remove if quantity becomes 0
                state.items = state.items.filter(
                    (i) => i.productId !== action.payload
                );
                state.subtotal -= item.price;
            }
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ productId: string; quantity: number }>
        ) => {
            const item = state.items.find(
                (item) => item.productId === action.payload.productId
            );

            if (item) {
                item.quantity = Math.max(1, action.payload.quantity);
            }

            state.subtotal = calculateCartTotal(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            state.subtotal = 0;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;