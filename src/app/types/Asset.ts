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

export type STAT = {
    PAGE: number;
    PAGE_SIZE: number;
    TOTAL_ASSETS: number;
};

export interface AssetListResponse {
    STATS: STAT,
    LIST: Asset[]
}

export interface IBaseItem {
    ID: number,
    TYPE: number,
    ID_LEGACY: number,
    CREATED_ON: number,
    UPDATED_ON: number,
    LAUNCH_DATE: number
}

export interface Asset extends IBaseItem {
    SYMBOL: string, //TODO FIX ON ENUM
    URI: string,
    PRICE_USD?: number,
    SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD?: number,
    ASSET_TYPE: string
    NAME: string,
    LOGO_URL: string
}

