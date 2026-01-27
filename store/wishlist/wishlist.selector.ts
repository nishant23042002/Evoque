import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const selectWishlistItems = (state: RootState) =>
    state.wishlist.items;

export const selectWishlistIds = createSelector(
    [selectWishlistItems],
    (items) => new Set(items.map(i => i.productId))
);
