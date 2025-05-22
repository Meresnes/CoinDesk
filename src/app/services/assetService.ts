import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../config";
import type {AssetListQueryPayload, AssetListResponse} from "../types/Asset.ts";
import {SortDirection, SortBy} from "../types/Sort";

export const assetService = createApi({
    reducerPath: "assetService",
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getAssetList: builder.query<AssetListResponse, AssetListQueryPayload>({
            query: (paramsKeys) => ({
                url: "/asset/v1/top/list",
                method: "GET",
                params: {
                    page: 1,
                    page_size: 10,
                    sort_direction: SortDirection.DESC,
                    sort_by: SortBy.PRICE_USD,
                    toplist_quote_asset: "USD",
                    ...paramsKeys,
                }
            }),
            transformResponse: (data: {Data: AssetListResponse}) => {
                return {
                    ...data.Data
                };
            },
        }),
    }),
});

export const {useGetAssetListQuery} = assetService;