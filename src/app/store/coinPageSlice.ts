import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {HistoryChartData} from "../pages/coin_page/CoinPage";
import {type AssetHistory, type AssetHistoryQueryPayload, HistoryTime} from "../types/Asset";
import {SortPeriodType} from "../types/Sort";
import {getCurrentTimestamp, getFullDateFormat} from "../utils/DateTimeUtils";
import type {RootState} from "./index";


export interface CoinPageState {
    assetHistoryPayload: AssetHistoryQueryPayload,
    assetHistoryChartData: HistoryChartData[],
    minCoinPrice: number,
    maxCoinPrice: number,
    sortPeriodType: SortPeriodType
}

const DEFAULT_PAYLOAD = {
    time: HistoryTime.DAYS,
    limit: 365,
    aggregate: 1,
    instrument: undefined
};

const initialState: CoinPageState = {
    assetHistoryPayload: DEFAULT_PAYLOAD,
    sortPeriodType: SortPeriodType.YEAR,
    assetHistoryChartData: [],
    minCoinPrice: 0,
    maxCoinPrice: 0,

};

export const coinPageSlice = createSlice({
    name: "coinPage",
    initialState,
    reducers: {
        setHistoryPayload: (state, action: PayloadAction<AssetHistoryQueryPayload>) => {
            state.assetHistoryPayload = {
                ...action.payload,
                to_ts: getCurrentTimestamp(),
            };
        },
        setSortPeriodType: (state, action: PayloadAction<SortPeriodType>) => {
            const payload = state.assetHistoryPayload;

            switch (action.payload) {
                case SortPeriodType.HOUR:
                    payload.limit = 60;
                    payload.aggregate = 1;
                    payload.time = HistoryTime.MINUTE;
                    break;
                case SortPeriodType.DAY:
                    payload.limit = 12 * 24 + 1;
                    payload.aggregate = 1;
                    payload.time = HistoryTime.MINUTE;
                    break;
                case SortPeriodType.WEEK:
                    payload.limit = 24 * 7;
                    payload.aggregate = 1;
                    payload.time = HistoryTime.HOURS;
                    break;
                case SortPeriodType.MOUTH:
                    payload.limit = 4 * 30;
                    payload.aggregate = 6;
                    payload.time = HistoryTime.HOURS;
                    break;
                case SortPeriodType.YEAR:
                    payload.limit = 365;
                    payload.aggregate = 1;
                    payload.time = HistoryTime.DAYS;
                    break;
                case SortPeriodType.ALL_TIME:
                    payload.limit = 2500;
                    payload.aggregate = 1;
                    payload.time = HistoryTime.DAYS;
                    break;
                default:
                    payload.limit = 2500;
                    payload.aggregate = 1;
                    payload.time = HistoryTime.DAYS;
            }

            state.sortPeriodType = action.payload;

            state.assetHistoryPayload = {
                ...payload,
                to_ts: getCurrentTimestamp(),
            };
        },
        setHistoryChartData: (state, action: PayloadAction<AssetHistory[] | undefined>) => {
            const rawData = action.payload || [];

            if (rawData.length === 0) {
                state.assetHistoryChartData = [];
                state.minCoinPrice = 0;
                state.maxCoinPrice = 0;
                return;
            }

            let minPrice = Infinity;
            let maxPrice = -Infinity;

            const data: HistoryChartData[] = rawData.map(item => {

                if (item.CLOSE < minPrice) {
                    minPrice = item.CLOSE;
                }
                if (maxPrice < item.CLOSE) {
                    maxPrice = item.CLOSE;
                }

                const date = new Date(item.TIMESTAMP * 1000);

                const hours = date.getHours() < 10 ? `0${date.getHours()}`:  date.getHours();
                const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
                const currentTime = `${hours}: ${minutes}`;

                return {
                    price: item.CLOSE,
                    date: getFullDateFormat(date),
                    currentTime: currentTime
                };
            }) || [];

            state.assetHistoryChartData = data;

            state.minCoinPrice = minPrice === Infinity ? 0 : minPrice;
            state.maxCoinPrice = maxPrice === -Infinity ? 0 : maxPrice;

        }
    },
});

export const {setHistoryChartData, setSortPeriodType, setHistoryPayload} = coinPageSlice.actions;

export const selectAssetHistoryChartData = (state: RootState) => state.coinPage.assetHistoryChartData;
export const selectAssetHistoryPayload = (state: RootState) => state.coinPage.assetHistoryPayload;
export const selectMinCoinPrice = (state: RootState) => state.coinPage.minCoinPrice;
export const selectMaxCoinPrice = (state: RootState) => state.coinPage.maxCoinPrice;
export const selectSortPeriodType = (state: RootState) => state.coinPage.sortPeriodType;

export default coinPageSlice.reducer;