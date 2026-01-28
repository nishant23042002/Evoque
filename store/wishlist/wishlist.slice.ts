import { createSlice } from "@reduxjs/toolkit";
import { WishlistItem } from "./wishlist.types";
import { fetchWishlist, addWishlistItem, removeWishlistItem } from "./wishlist.thunks";

interface WishlistState {
    items: WishlistItem[];
    loading: boolean;
}

const initialState: WishlistState = {
    items: [],
    loading: false
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlist(state) {
            state.items = [];
            state.loading = false;
        }
    },
    extraReducers: builder => {
        builder
            // FETCH
            .addCase(fetchWishlist.pending, state => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchWishlist.rejected, state => {
                state.loading = false;
            })

            // ADD
            .addCase(addWishlistItem.fulfilled, (state, action) => {
                console.log("ADDING TO WISHLIST:", action.payload);
                const exists = state.items.some(
                    i => i.productId === action.payload.productId
                );

                if (!exists) {
                    state.items.unshift(action.payload);
                }
            })

            // REMOVE
            .addCase(removeWishlistItem.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    i => i.productId !== action.payload
                );
            });
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
