import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecentlyViewedItem } from "@/types/RecentlyViewedTypes";

const MAX_ITEMS = 10;
const STORAGE_KEY = "recently_viewed_products";

/* ---------- STORAGE HELPERS ---------- */
function loadFromStorage(): RecentlyViewedItem[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveToStorage(items: RecentlyViewedItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* ---------- STATE TYPE ---------- */
type RecentlyViewedState = {
    items: RecentlyViewedItem[];
};

/* ---------- INITIAL STATE ---------- */
const initialState: RecentlyViewedState = {
    items: loadFromStorage(),
};

/* ---------- SLICE ---------- */
const recentlyViewedSlice = createSlice({
    name: "recentlyViewed",
    initialState,
    reducers: {
        addRecentlyViewed(state, action: PayloadAction<RecentlyViewedItem>) {
            const item = action.payload;

            // remove duplicate
            state.items = state.items.filter(
                (i) => i.productId !== item.productId
            );

            // add to front
            state.items.unshift(item);

            // limit size
            if (state.items.length > MAX_ITEMS) {
                state.items = state.items.slice(0, MAX_ITEMS);
            }

            // persist
            saveToStorage(state.items);
        },

        hydrateRecentlyViewed(state, action: PayloadAction<RecentlyViewedItem[]>) {
            state.items = action.payload;
        },

        clearRecentlyViewed(state) {
            state.items = [];
            saveToStorage([]);
        },
    },
});

/* ---------- EXPORTS ---------- */
export const {
    addRecentlyViewed,
    hydrateRecentlyViewed,
    clearRecentlyViewed,
} = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
