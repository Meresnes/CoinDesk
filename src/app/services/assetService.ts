import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../config";
import {
    type AssetHistory,
    type AssetHistoryQueryPayload,
    type AssetListQueryPayload,
    type AssetListResponse,
    type AssetMetaQueryPayload,
    type AssetMetaResponse,
    type AssetSearchQueryPayload,
    type AssetSearchResponse, HistoryTime
} from "../types/Asset";
import {Language} from "../types/Language";
import {SortDirection, SortBy} from "../types/Sort";

export const assetService = createApi({
    reducerPath: "assetService",
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getAssetList: builder.query<AssetListResponse, AssetListQueryPayload>({
            query: (paramsKeys: AssetListQueryPayload) => ({
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
        assetMeta: builder.query<AssetMetaResponse, AssetMetaQueryPayload>({
            query: (paramsKeys: AssetMetaQueryPayload) => ({
                url: "/asset/v2/metadata",
                method: "GET",
                params: {
                    asset_language: Language.EN,
                    quote_asset: "USD",
                    ...paramsKeys
                }
            }),
            transformResponse: (data: {Data: AssetMetaResponse}) => {
                return {
                    ...data.Data
                };
            },
        }),
        assetSearch: builder.query<AssetSearchResponse, AssetSearchQueryPayload>({
            query: (paramsKeys: AssetSearchQueryPayload) => ({
                url: "/asset/v1/search",
                method: "GET",
                params: {
                    search_string: "",
                    limit: 5,
                    ...paramsKeys,
                }
            }),
            transformResponse: (data: {Data: AssetSearchResponse}) => {
                return {
                    ...data.Data
                };
            },
        }),
        assetHistory: builder.query<AssetHistory[], AssetHistoryQueryPayload>({
            query: (paramsKeys: AssetHistoryQueryPayload) => ({
                url: `/index/cc/v1/historical/${paramsKeys.time.toLowerCase() || HistoryTime.MINUTE.toLowerCase()}`,
                method: "GET",
                params: {
                    market: "cadli",
                    to_ts: paramsKeys.to_ts || Math.floor(new Date(Date.now()).getTime() / 1000),
                    response_format: "JSON",
                    fill: true,
                    apply_mapping: true,
                    instrument: `${paramsKeys.instrument}-USD`,
                    limit: paramsKeys.limit || 60,
                    aggregate: paramsKeys.aggregate || 1,
                }
            }),
            transformResponse: (data: {Data: AssetHistory[]} ) => {
                return data.Data;
            },
        })
    }),
});

export const {useGetAssetListQuery, useAssetMetaQuery, useAssetSearchQuery, useAssetHistoryQuery} = assetService;
