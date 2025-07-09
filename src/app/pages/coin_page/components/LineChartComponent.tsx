import {Chart, type UseChartReturn} from "@chakra-ui/charts";
import * as React from "react";
import {CartesianGrid, Cell, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import type {HistoryChartData} from "../../../store/coinPageSlice";
import {NEGATIVE_PRICE_COLOR, POSITIVE_PRICE_COLOR} from "../../../utils/ChartsColort";

type IProps = {
    chartData: HistoryChartData[],
    chartMeta: UseChartReturn<HistoryChartData>,
    minPrice: number,
    maxPrice: number,
    getTimeFormat: (value: any, index:number) => string
};

export function LineChartComponent ({chartData, chartMeta, minPrice, maxPrice, getTimeFormat}: IProps): React.JSX.Element  {


    return (
        <Chart.Root maxH={"sm"} chart={chartMeta} height={"lg"}>
            <LineChart data={chartData} >
                <CartesianGrid stroke={chartMeta.color("border")} vertical={false} />
                <XAxis
                    axisLine={false}
                    dataKey={"date"}
                    hide={false}
                    // tickFormatter={getXLineTimeFormat()}
                    tickFormatter={getTimeFormat}
                    stroke={chartMeta.color("border")}
                />
                <YAxis
                    axisLine
                    tickLine={false}
                    domain={[minPrice, maxPrice]}
                    tickFormatter={chartMeta.formatNumber({
                        style: "currency",
                        currency: "USD",
                        currencyDisplay: "narrowSymbol",
                        maximumSignificantDigits:6,
                        maximumFractionDigits: 2,
                    })}
                    tickMargin={10}
                    stroke={chartMeta.color("border")}
                />
                <Tooltip animationDuration={100} content={<Chart.Tooltip />} />
                <Line
                    type={"linear"}
                    dataKey={"price"}
                    legendType={"cross"}
                    animationEasing={"ease-in-out" }
                    unit={"number"}
                    // stroke={}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={true}
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
                </Line>
            </LineChart>
        </Chart.Root>
    );
}