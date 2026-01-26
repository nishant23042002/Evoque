import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlist/wishlist.slice";
import cartReducer from "./cart/cart.slice";

export const store = configureStore({
    reducer: {
        wishlist: wishlistReducer,
        cart: cartReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
