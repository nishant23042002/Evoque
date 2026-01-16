// store/wishlist/wishlist.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { WishlistItem } from "./wishlist.types";

interface WishlistState {
    items: WishlistItem[];
}

const initialState: WishlistState = {
    items: []
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlist(state, action) {
            const exists = state.items.find(
                item => item.productId === action.payload.productId
            );

            if (exists) {
                state.items = state.items.filter(
                    item => item.productId !== action.payload.productId
                );
                console.log("❌ Removed from wishlist:", action.payload);
            } else {
                state.items.push(action.payload);
                console.log("✅ Added to wishlist:", action.payload);
            }
        },
        clearWishlist(state) {
            state.items = [];
        }
    }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
