import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlist/wishlist.slice";
import cartReducer from "./cart/cart.slice";
import recentlyViewed from "./recentlyViewed/recentlyViewed.slice"
import uiReducer from "./ui/ui.slice"


export const store = configureStore({
    reducer: {
        wishlist: wishlistReducer,
        cart: cartReducer,
        recentlyViewed: recentlyViewed,
        ui: uiReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
