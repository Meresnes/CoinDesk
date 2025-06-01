import {Chart, useChart} from "@chakra-ui/charts";
import {Box, Button, Flex, Group, Skeleton, Stack} from "@chakra-ui/react";
import * as React from "react";
import {useParams} from "react-router";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {useAssetHistoryQuery, useAssetMetaQuery} from "../../services/assetService";
import {type AssetHistoryQueryPayload, HistoryTime} from "../../types/Asset";
import HeaderCoinStats from "./components/HeaderCoinStats";

type HistoryData = {
    price: number,
    date: string,
    currentTime: string,
};


function CoinPage() {
    const {name} = useParams();
    const DEFAULT_PAYLOAD = {
        time: HistoryTime.DAYS,
        limit: 2000,
        to_ts: Math.floor(new Date(Date.now()).getTime() / 1000),
        instrument: name || ""
    };
    const [historyData, setHistoryData] = React.useState<HistoryData[]>([]);
    const [minPrice, setMinPrice] = React.useState<number>(0);
    const [maxPrice, setMaxPrice] = React.useState<number>(0);
    const [historyPayload, setHistoryPayload] = React.useState<AssetHistoryQueryPayload>(DEFAULT_PAYLOAD);
    const assetMeta = useAssetMetaQuery({assets: name || ""});
    const assetHistory = useAssetHistoryQuery(historyPayload);

    const initHistoryData = () => {
        setMaxPrice(0);
        setMinPrice(0);

        const data: HistoryData[] = assetHistory.data?.map((item, index) => {
            if (index === 0 || item.CLOSE < minPrice) {
                setMinPrice(item.CLOSE);
            }

            if (maxPrice < item.CLOSE) {
                setMaxPrice(item.CLOSE);
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
        setHistoryData(data);
    };


    const chart = useChart({
        data: historyData || [],
        series: [
            {name: "price", label: "price $", color: "teal.solid"},
        ],
    });



    const onToggleClick = () => {
        setHistoryPayload({
            time: HistoryTime.MINUTE,
            limit: 60,
            to_ts: Math.floor(new Date(Date.now()).getTime() / 1000),
            instrument: name || ""
        });
    };

    const getXLineTimeFormat = () => {
        const periodVariant = historyPayload.time;

        switch (periodVariant) {
            case HistoryTime.DAYS:
                return chart.formatDate({month: "short", year: "numeric"});
            case HistoryTime.HOURS:
                return chart.formatDate({hour: "2-digit", minute: "2-digit", hour12: false, dayPeriod: "short", day: "2-digit", month: "short"});
            case HistoryTime.MINUTE:
                return chart.formatDate({hour: "2-digit", minute: "2-digit", hour12: false, dayPeriod: "short", day: "2-digit", month: "short"});
            default:
                return chart.formatDate({year: "numeric", month: "short"});
        }
    };

    const getFullDateFormat = (date: Date)  => {

        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    };


    React.useEffect(() => {
        initHistoryData();
    }, [name, assetHistory.data]);


    React.useEffect(() => {
        initHistoryData();
    }, []);

    React.useEffect(() => {
        setHistoryPayload(DEFAULT_PAYLOAD);
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
                            <Button
                                key={"1H"}
                                variant="surface"
                                onClick={onToggleClick}
                            >
                                1H
                            </Button>
                            <Button
                                key={"24H"}
                                variant="outline"
                            >
                                24H
                            </Button>
                            <Button
                                key={"7D"}
                                variant="outline"
                            >
                                7D
                            </Button>
                            <Button
                                key={"1M"}
                                variant="outline"
                            >
                                1M
                            </Button>
                            <Button
                                key={"1M"}
                                variant="outline"
                            >
                                ALL
                            </Button>
                        </Group>

                    </Stack>
                </Flex>
                {!assetHistory.isFetching && chart.data.length > 0 ? (
                    <Chart.Root maxH="sm" chart={chart} height="lg">
                        <LineChart data={historyData}>
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
