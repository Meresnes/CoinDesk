import {Language} from "../types/Language";
import {SortBy, SortDirection} from "./Sort";

export interface ListQueryPayload<T extends SortBy> {
    page?: number,
    page_size?: number,
    sort_direction?: SortDirection,
    sort_by?: T,
}

//TODO: FIX generic on asset list values
export interface AssetListQueryPayload extends ListQueryPayload<SortBy> {
    toplist_quote_asset?: string
}

export interface AssetSearchQueryPayload {
    search_string?: string;
    limit?: number;
}

export interface AssetMetaQueryPayload {
    assets: string,
    asset_language?: Language,
    quote_asset?: string
}

export type STAT = {
    PAGE: number;
    PAGE_SIZE: number;
    TOTAL_ASSETS: number;
};

export interface AssetMetaResponse {
    [key: string]: AssetListItem
}

export interface AssetListResponse {
    STATS: STAT,
    LIST: AssetListItem[]
}

export interface AssetSearchResponse {
    LIST: Asset[]
}

export interface IBaseItem {
    ID: number,
    TYPE: number,
    CREATED_ON: number,
}

export interface Asset extends IBaseItem {
    SYMBOL: string, //TODO FIX ON ENUM
    URI: string,
    CIRCULATING_MKT_CAP_USD: number,
    SUPPLY_CIRCULATING: number,
    SUPPLY_FUTURE: number,
    SUPPLY_TOTAL: number,
    SUPPLY_MAX: number,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD: number,
    ASSET_TYPE: string
    TOPLIST_BASE_RANK: TopListBaseRank
    NAME: string,
    LOGO_URL: string
}

export interface AssetListItem extends Asset {
    ID_LEGACY: number,
    PRICE_USD?: number,
    SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD?: number,
    UPDATED_ON: number,
    LAUNCH_DATE: number
}

type TopListBaseRank = {
    CREATED_ON: number,
    LAUNCH_DATE: number,
    CIRCULATING_MKT_CAP_USD: number,
    TOTAL_MKT_CAP_USD: number,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD:number,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: number,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: number,
};

