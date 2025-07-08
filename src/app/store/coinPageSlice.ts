import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {type AssetHistory, type AssetHistoryQueryPayload, type HistoryPeriodStats, HistoryTime} from "../types/Asset";
import {SortPeriodType} from "../types/Sort";
import {getCurrentTimestamp, getFullDateFormat} from "../utils/DateTimeUtils";
import type {RootState} from "./index";

export type HistoryChartData = {
    price: number,
    date: string,
    currentTime: string,
    openClose: [number, number],
    open: number,
    close: number,
    high: number,
    low: number,
    highLow: [number, number]
};

export interface CoinPageState {
    assetHistoryPayload: AssetHistoryQueryPayload,
    assetHistoryChartData: HistoryChartData[],
    minCoinPrice: number,
    selectedChartType: CHART_TYPE,
    maxCoinPrice: number,
    sortPeriodType: SortPeriodType,
    historyPeriodStat: HistoryPeriodStats
}

export enum CHART_TYPE {
    LINE = "line",
    BAR = "bar"
}

const DEFAULT_PAYLOAD = {
    time: HistoryTime.DAYS,
    limit: 365,
    aggregate: 1,
    instrument: undefined
};

const DEFAULT_PERIOD_STAT = {
    OPEN: 0,
    HIGH: -Infinity,
    LOW: Infinity,
    VOLUME: 0,
};

const initialState: CoinPageState = {
    assetHistoryPayload: DEFAULT_PAYLOAD,
    sortPeriodType: SortPeriodType.YEAR,
    selectedChartType: CHART_TYPE.LINE,
    assetHistoryChartData: [],
    minCoinPrice: Infinity,
    maxCoinPrice: Infinity,
    historyPeriodStat: DEFAULT_PERIOD_STAT
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
        setChartType: (state, action: PayloadAction<CHART_TYPE>) => {
            state.selectedChartType = action.payload;
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
                    payload.aggregate = 5;
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

            const periodOpen = rawData[0].OPEN || 0;
            let minPrice = Infinity;
            let maxPrice = -Infinity;
            let periodVolume = 0;
            const data: HistoryChartData[] = rawData.map(item => {

                periodVolume += item.QUOTE_VOLUME || 0;

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
                    openClose: [item.OPEN, item.CLOSE],
                    highLow: [item.HIGH, item.LOW],
                    high: item.HIGH,
                    low: item.LOW,
                    open: item.OPEN,
                    close: item.CLOSE,
                    date: getFullDateFormat(date),
                    currentTime: currentTime
                };
            }) || [];

            state.assetHistoryChartData = data;

            state.minCoinPrice = minPrice === Infinity ? 0 : minPrice;
            state.maxCoinPrice = maxPrice === -Infinity ? 0 : maxPrice;

            state.historyPeriodStat = {
                OPEN: periodOpen,
                VOLUME: periodVolume,
                HIGH: maxPrice,
                LOW: minPrice
            };

        }
    },
});

export const {setHistoryChartData, setChartType, setSortPeriodType, setHistoryPayload} = coinPageSlice.actions;

export const selectAssetHistoryChartData = (state: RootState) => state.coinPage.assetHistoryChartData;
export const selectAssetHistoryPayload = (state: RootState) => state.coinPage.assetHistoryPayload;
export const selectHistoryPeriodStat = (state: RootState) => state.coinPage.historyPeriodStat;
export const selectMinCoinPrice = (state: RootState) => state.coinPage.minCoinPrice;
export const selectSelectedChartType = (state: RootState) => state.coinPage.selectedChartType;
export const selectMaxCoinPrice = (state: RootState) => state.coinPage.maxCoinPrice;
export const selectSortPeriodType = (state: RootState) => state.coinPage.sortPeriodType;

export default coinPageSlice.reducer;