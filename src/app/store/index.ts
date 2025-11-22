import {configureStore} from "@reduxjs/toolkit";
import {assetService} from "../services/assetService";
import {newsService} from "../services/newsService";
import {coinPageSlice} from "./coinPageSlice";

export const store = configureStore({
    reducer: {
        coinPage: coinPageSlice.reducer,
        assetService: assetService.reducer,
        newsService: newsService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(assetService.middleware, newsService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;