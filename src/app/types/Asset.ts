import {Language} from "../types/Language";
import {type IBaseItem, type IBaseItemWithUpdated} from "./Common";
import {SortBy, SortDirection} from "./Sort";

export enum HistoryTime {
    MINUTE = "MINUTES",
    HOURS = "HOURS",
    DAYS = "DAYS",
}

export interface ListQueryPayload<T extends SortBy> {
    page?: number,
    page_size?: number,
    sort_direction?: SortDirection,
    sort_by?: T
}

//TODO: FIX generic on asset list values
export interface AssetListQueryPayload extends ListQueryPayload<SortBy> {
    toplist_quote_asset?: string
}

export interface AssetSearchQueryPayload {
    search_string?: string,
    limit?: number
}

export interface AssetHistoryQueryPayload {
    time: HistoryTime,
    market?: string,
    instrument?: string,
    limit?: number,
    to_ts?: number,
    aggregate?: number
}

export interface AssetMetaQueryPayload {
    assets: string[],
    asset_language?: Language,
    quote_asset?: string
}

export type STAT = {
    PAGE: number,
    PAGE_SIZE: number,
    TOTAL_ASSETS: number
};

export interface AssetMetaResponse {
    [key: string]: AssetListItem
}

export interface AssetHistoryResponse {
    Data: AssetHistory[]
}
export interface AssetHistory extends HistoryPeriodStats {
    TIMESTAMP: number,
    CLOSE: number,
    QUOTE_VOLUME: number,
    UNIT: string,
    MARKET: string,
    INSTRUMENT: string,
    HIGH_MESSAGE_VALUE: number,
    LOW_MESSAGE_VALUE: number
}

export interface HistoryPeriodStats {
    OPEN: number,
    HIGH: number,
    LOW: number,
    VOLUME: number
}

export interface AssetListResponse {
    STATS: STAT,
    LIST: AssetListItem[]
}

export interface AssetSearchResponse {
    LIST: Asset[]
}

export interface Asset extends IBaseItem {
    SYMBOL: string,
    URI: string,
    CIRCULATING_MKT_CAP_USD: number,
    SUPPLY_CIRCULATING: number,
    SUPPLY_FUTURE: number,
    SUPPLY_TOTAL: number,
    SUPPLY_MAX: number,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD: number,
    ASSET_TYPE: string,
    TOPLIST_BASE_RANK: TopListBaseRank,
    NAME: string,
    LOGO_URL: string
}

export interface AssetListItem extends Asset, IBaseItemWithUpdated {
    ID_LEGACY: number,
    PRICE_USD?: number,
    SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD?: number,
    LAUNCH_DATE: number
}

type TopListBaseRank = {
    CREATED_ON: number,
    LAUNCH_DATE: number,
    CIRCULATING_MKT_CAP_USD: number,
    TOTAL_MKT_CAP_USD: number,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD:number,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: number,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: number
};

