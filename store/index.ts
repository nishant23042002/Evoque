// store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlist/wishlist.slice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
    wishlist: wishlistReducer
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["wishlist"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
