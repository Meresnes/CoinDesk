import {configureStore} from "@reduxjs/toolkit";
import {assetService} from "../services/assetService";
import {coinPageSlice} from "./coinPageSlice";

export const store = configureStore({
    reducer: {
        coinPage: coinPageSlice.reducer,
        assetService: assetService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(assetService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;