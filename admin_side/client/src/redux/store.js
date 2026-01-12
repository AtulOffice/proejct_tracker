import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import { createTransform } from "redux-persist";

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
});


const authTransform = createTransform(
    (inboundState) => {
        return {
            ...inboundState,
            accessToken: null,
        };
    },
    (outboundState) => outboundState,
    { whitelist: ["auth"] }
);

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "ui"],
    transforms: [authTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
