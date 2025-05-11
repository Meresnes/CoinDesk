import {configureStore} from "@reduxjs/toolkit";
import {assetService} from "../services/assetService";
import {counterSlice} from "./countedSlice";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        assetService: assetService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(assetService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;