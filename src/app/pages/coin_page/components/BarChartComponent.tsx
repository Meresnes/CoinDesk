import {Chart, type UseChartReturn} from "@chakra-ui/charts";
import * as React from "react";
import {Bar, BarChart, CartesianGrid, Cell, ErrorBar, Tooltip, XAxis, YAxis} from "recharts";
import {type HistoryChartData} from "../../../store/coinPageSlice";
import {NEGATIVE_PRICE_COLOR, POSITIVE_PRICE_COLOR} from "../../../utils/ChartsColort";
import {ChartCustomTooltip} from "./ChartCustomTooltip";

type IProps = {
    chartData: HistoryChartData[],
    chartMeta: UseChartReturn<HistoryChartData>,
    minPrice: number,
    maxPrice: number
};

export function BarChartComponent ({chartMeta, chartData, maxPrice, minPrice}: IProps): React.JSX.Element {

    return (
        <Chart.Root maxH={"sm"} chart={chartMeta} height={"lg"}>
            <BarChart data={chartData} >
                <CartesianGrid stroke={chartMeta.color("border.muted")} />
                <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey={chartMeta.key("date")}
                    tickFormatter={chartMeta.formatDate({month: "short", day: "2-digit"})}
                    tick={{fill: 'white'}}
                />
                <YAxis
                    orientation={"right"}
                    axisLine={false}
                    tickLine={false}
                    domain={[minPrice, maxPrice]}
                    tickFormatter={chartMeta.formatNumber({
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "narrowSymbol",
                        maximumSignificantDigits:6,
                        maximumFractionDigits: 2,
                    })}
                    tick={{fill: 'white'}}
                />
                <Tooltip
                    animationDuration={100}
                    content={<ChartCustomTooltip />}
                />
                <Bar
                    isAnimationActive={false}
                    width={1}
                    barSize={10}
                    dataKey={chartMeta.key("openClose")}
                >

                    {chartData.map((item) => (
                        <Cell
                            key={item.date}
                            fill={
                                item.open > item.close
                                    ? chartMeta.color(NEGATIVE_PRICE_COLOR)
                                    : chartMeta.color(POSITIVE_PRICE_COLOR)
                            }
                        />
                    ))
                    }
                    <ErrorBar
                        dataKey={(obj) => [
                            obj.high - obj.open,
                            obj.low - obj.close,
                        ]}
                        opacity={0.6}
                        width={2}
                        stroke={chartMeta.color("fg")}
                    />
                </Bar>
            </BarChart>
        </Chart.Root>
    );
}