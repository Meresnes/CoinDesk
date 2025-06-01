import {Chart, useChart} from "@chakra-ui/charts";
import {Box, Button, Flex, Group, Skeleton, Stack} from "@chakra-ui/react";
import * as React from "react";
import {useParams} from "react-router";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {useAppSelector, useAppDispatch} from "../../hooks";
import {useAssetHistoryQuery, useAssetMetaQuery} from "../../services/assetService";
import {
    selectAssetHistoryChartData,
    selectAssetHistoryPayload,
    selectMaxCoinPrice,
    selectMinCoinPrice,
    selectSortPeriodType,
    setHistoryPayload,
    setSortPeriodType,
    setHistoryChartData
} from "../../store/coinPageSlice";
import {HistoryTime} from "../../types/Asset";
import {SortPeriodType} from "../../types/Sort";
import HeaderCoinStats from "./components/HeaderCoinStats";

export type HistoryChartData = {
    price: number,
    date: string,
    currentTime: string,
};


function CoinPage() {
    const {name} = useParams();
    const dispatch = useAppDispatch();

    const historyChartData = useAppSelector(selectAssetHistoryChartData);
    const assetHistoryPayload = useAppSelector(selectAssetHistoryPayload);
    const currentSortPeriodType = useAppSelector(selectSortPeriodType);
    const minPrice = useAppSelector(selectMinCoinPrice);
    const maxPrice = useAppSelector(selectMaxCoinPrice);

    const assetMeta = useAssetMetaQuery({assets: name || ""});
    const assetHistory = useAssetHistoryQuery(assetHistoryPayload, {
        skip: !assetHistoryPayload.instrument,
    });

    const chart = useChart({
        data: historyChartData,
        series: [
            {name: "price", label: "price $", color: "teal.solid"},
        ],
    });

    const onToggleClick = (sortPeriod: SortPeriodType) => {
        dispatch(setSortPeriodType(sortPeriod));
    };

    const getXLineTimeFormat = () => {
        const periodVariant = assetHistoryPayload.time;

        switch (periodVariant) {
            case HistoryTime.DAYS:
                return chart.formatDate({year: "numeric", month: "short"});
            case HistoryTime.HOURS:
                return chart.formatDate({hour: "2-digit", minute: "2-digit", hour12: false, dayPeriod: "short", day: "2-digit", month: "short"});
            case HistoryTime.MINUTE:
                return chart.formatDate({hour: "2-digit", minute: "2-digit", hour12: false, dayPeriod: "short", day: "2-digit", month: "short"});
            default:
                return chart.formatDate({year: "numeric", month: "short"});
        }
    };


    React.useEffect(() => {
        dispatch(setHistoryChartData(assetHistory.data));
    }, [name, assetHistory.data]);


    React.useEffect(() => {
        dispatch(setHistoryChartData(assetHistory.data));
    }, []);

    React.useEffect(() => {
        dispatch(setHistoryPayload({
            ...assetHistoryPayload,
            instrument: name
        }));
    }, [name]);

    const coinData = assetMeta.data?.[name || ""];

    return (
        <div>
            <Box>
                <HeaderCoinStats
                    coinData={coinData}
                    isFetching={assetMeta.isFetching}
                />
            </Box>
            <Box mt={10}>
                <Flex mb={10}>
                    <Stack gap="4">
                        <Group attached>
                            {Object.values(SortPeriodType).map(item => {
                                return (
                                    <Button
                                        key={item}
                                        variant={currentSortPeriodType === item ? "surface": "outline"}
                                        onClick={() => onToggleClick(item)}
                                    >
                                        {item}
                                    </Button>
                                );
                            })}
                        </Group>

                    </Stack>
                </Flex>
                {!assetHistory.isFetching && chart.data.length > 0 ? (
                    <Chart.Root maxH="sm" chart={chart} height="lg">
                        <LineChart data={historyChartData}>
                            <CartesianGrid stroke={chart.color("border")} vertical={false} />
                            <XAxis
                                axisLine={false}
                                dataKey="date"
                                hide={false}
                                tickFormatter={getXLineTimeFormat()}
                                stroke={chart.color("border")}
                            />
                            <YAxis
                                axisLine
                                tickLine={false}
                                domain={[minPrice, maxPrice]}
                                tickFormatter={chart.formatNumber({
                                    style: "currency",
                                    currency: "USD",
                                    currencyDisplay: "narrowSymbol",
                                })}
                                tickMargin={10}
                                stroke={chart.color("border")}
                            />
                            <Tooltip animationDuration={100} content={<Chart.Tooltip />} />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="green"
                                strokeWidth={2}
                                dot={false}
                                connectNulls={true}
                            />
                        </LineChart>
                    </Chart.Root>
                ): (
                    <>
                        <Skeleton height="lg" />
                    </>
                )}
            </Box>
        </div>
    );
}

export default CoinPage;
