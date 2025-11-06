import {Box, FormatNumber, Stack, Text} from "@chakra-ui/react";
import * as React from "react";
import type {TooltipProps} from "recharts";
import {NEGATIVE_PRICE_COLOR, POSITIVE_PRICE_COLOR} from "../../../utils/ChartsColort";


export function ChartCustomTooltip (param: TooltipProps<number, string>): React.ReactNode {
    if (param.active && param.payload && param.payload.length) {
        const data = param.payload[0].payload;
        return (
            <Box bg={"blackAlpha.700"} borderRadius={"5px"} p={1} w={"full"}>
                <Stack gap={"1"} color={"white"} direction={"row"} >
                    <Text textStyle={"xs"}>
                        {"Open: "}
                    </Text>
                    <Text fontWeight={"bold"} textStyle={"xs"} >
                        <FormatNumber
                            value={data.open}
                            notation={"standard"}
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            style={"currency"}
                            currency={"USD"}
                        />
                    </Text>
                </Stack>
                <Stack gap={"1"} color={"white"} direction={"row"}>
                    <Text textStyle={"xs"}>
                        {"High: "}
                    </Text>
                    <Text fontWeight={"bold"} textStyle={"xs"} color={POSITIVE_PRICE_COLOR}>
                        <FormatNumber
                            value={data.high}
                            notation={"standard"}
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            style={"currency"}
                            currency={"USD"}
                        />
                    </Text>
                </Stack>
                <Stack gap={"1"} color={"white"} direction={"row"}>
                    <Text textStyle={"xs"}>
                        {"Low: "}
                    </Text>
                    <Text fontWeight={"bold"} textStyle={"xs"} color={NEGATIVE_PRICE_COLOR}>
                        <FormatNumber
                            value={data.low}
                            notation={"standard"}
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            style={"currency"}
                            currency={"USD"}
                        />
                    </Text>
                </Stack>
                <Stack gap={"1"} color={"white"} textStyle={"xs"} direction={"row"}>
                    <Text>
                        {"Close: "}
                    </Text>
                    <Text fontWeight={"bold"}>
                        <FormatNumber
                            value={data.close}
                            notation={"standard"}
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            style={"currency"}
                            currency={"USD"}
                        />
                    </Text>
                </Stack>
                <Stack gap={"1"} color={"white"} textStyle={"xs"} direction={"row"}>
                    <Text>
                        {"Date: "}
                    </Text>
                    <Text fontWeight={"bold"}>
                        {data.date}
                    </Text>
                </Stack>
            </Box>
        );
    }

    return undefined;
};