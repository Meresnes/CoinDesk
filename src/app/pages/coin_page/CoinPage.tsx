import {useChart} from "@chakra-ui/charts";
import {Box, Button, Center, Flex, Group, IconButton, Spinner, Stack} from "@chakra-ui/react";
import * as React from "react";
import {FaChartLine} from "react-icons/fa6";
import {MdCandlestickChart} from "react-icons/md";
import {useParams} from "react-router";
import {useAppSelector, useAppDispatch} from "../../hooks";
import {useAssetHistoryQuery, useAssetMetaQuery} from "../../services/assetService";
import {
    selectAssetHistoryChartData,
    selectAssetHistoryPayload,
    selectMaxCoinPrice,
    selectMinCoinPrice,
    selectSortPeriodType,
    selectHistoryPeriodStat,
    setHistoryPayload,
    setSortPeriodType,
    setHistoryChartData, type HistoryChartData, selectSelectedChartType, CHART_TYPE, setChartType,
} from "../../store/coinPageSlice";
import {HistoryTime} from "../../types/Asset";
import {SortPeriodType} from "../../types/Sort";
import {NEGATIVE_PRICE_COLOR, POSITIVE_PRICE_COLOR} from "../../utils/ChartsColort";
import {BarChartComponent} from "./components/BarChartComponent.tsx";
import HeaderCoinStats from "./components/HeaderCoinStats";
import {LineChartComponent} from "./components/LineChartComponent.tsx";
import {PeriodStackLabelValue} from "./components/PeriodStackLabelValue";


function CoinPage() {
    const {name} = useParams();
    const dispatch = useAppDispatch();

    const historyChartData = useAppSelector(selectAssetHistoryChartData);
    const selectedCharType = useAppSelector(selectSelectedChartType);
    const assetHistoryPayload = useAppSelector(selectAssetHistoryPayload);
    const historyPeriodStat = useAppSelector(selectHistoryPeriodStat);
    const currentSortPeriodType = useAppSelector(selectSortPeriodType);
    const minPrice = useAppSelector(selectMinCoinPrice);
    const maxPrice = useAppSelector(selectMaxCoinPrice);

    const assetMeta = useAssetMetaQuery({assets: name || ""});
    const assetHistory = useAssetHistoryQuery(assetHistoryPayload, {
        skip: !assetHistoryPayload.instrument,
    });

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

    const chart = useChart<HistoryChartData>({
        data: historyChartData,
        series: [
            {name: "openClose", color: "teal.solid"},
            {name: "open", label: "price $", color: "teal.solid",  stackId: "barId"},
            {name: "date", label: "date", color: "teal.solid"},
            {name: "close", color: "teal.solid", stackId: "barId"},
            {name: "high", color: POSITIVE_PRICE_COLOR,  stackId: "barId"},
            {name: "low", color: NEGATIVE_PRICE_COLOR,  stackId: "barId"},
            {name: "highLow", color: "teal.solid", stackId: "barId"},
        ],
    });

    const onToggleClick = (sortPeriod: SortPeriodType) => {
        dispatch(setSortPeriodType(sortPeriod));
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
                <Flex mb={10} justifyContent={"space-between"} alignItems={"center"}>
                    <Stack gap={"4"}>
                        <Group attached>
                            <IconButton
                                size={"xs"}
                                onClick={() => dispatch(setChartType(CHART_TYPE.LINE))}
                                variant={selectedCharType === CHART_TYPE.LINE ? "surface" : "outline"}
                            >
                                <FaChartLine/>
                            </IconButton>
                            <IconButton
                                size={"xs"}
                                onClick={() => dispatch(setChartType(CHART_TYPE.BAR))}
                                variant={selectedCharType === CHART_TYPE.BAR ? "surface" : "outline"}
                            >
                                <MdCandlestickChart/>
                            </IconButton>
                        </Group>
                    </Stack>
                    <Stack direction={"row"} gap={5}>
                        <PeriodStackLabelValue
                            priceValue={historyPeriodStat.OPEN}
                            label={"Open"}
                            currentSortPeriod={currentSortPeriodType}
                            isLoading={assetHistory.isFetching}
                        />
                        <PeriodStackLabelValue
                            priceValue={historyPeriodStat.HIGH}
                            label={"High"}
                            priceTextColor={POSITIVE_PRICE_COLOR}
                            currentSortPeriod={currentSortPeriodType}
                            isLoading={assetHistory.isFetching}
                        />
                        <PeriodStackLabelValue
                            priceValue={historyPeriodStat.LOW}
                            label={"Low"}
                            priceTextColor={NEGATIVE_PRICE_COLOR}
                            currentSortPeriod={currentSortPeriodType}
                            isLoading={assetHistory.isFetching}
                        />
                        <PeriodStackLabelValue
                            priceValue={historyPeriodStat.VOLUME}
                            label={"Volume"}
                            currentSortPeriod={currentSortPeriodType}
                            isLoading={assetHistory.isFetching}
                        />
                    </Stack>
                    <Stack gap={"4"}>
                        <Group attached>
                            {Object.values(SortPeriodType).map(item => {
                                return (
                                    <Button
                                        key={item}
                                        size={"xs"}
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
                <Box position={"relative"} aria-busy={"true"} userSelect={"none"}>
                    {selectedCharType === CHART_TYPE.LINE && (
                        <LineChartComponent
                            chartData={historyChartData}
                            chartMeta={chart}
                            maxPrice={maxPrice}
                            minPrice={minPrice}
                            getTimeFormat={getXLineTimeFormat()}
                        />
                    )}
                    {selectedCharType === CHART_TYPE.BAR && (
                        <BarChartComponent
                            chartData={historyChartData}
                            chartMeta={chart}
                            maxPrice={maxPrice}
                            minPrice={minPrice}
                        />
                    )}

                    {assetHistory.isFetching && (
                        <Box pos={"absolute"} inset={"0"} bg={"bg/70"}>
                            <Center h={"full"} w={"ful"}>
                                <Spinner color={"teal.500"}/>
                            </Center>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
}

export default CoinPage;
