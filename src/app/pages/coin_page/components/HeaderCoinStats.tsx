import * as React from "react";
import {
    Avatar,
    Badge,
    Box,
    Flex,
    FormatNumber,
    HStack,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Stat,
    Text
} from "@chakra-ui/react";
import type {AssetListItem} from "../../../types/Asset";

type IProps = {
    coinData?: AssetListItem,
    isFetching: boolean,
};

export default function HeaderCoinStats({coinData, isFetching}: IProps) {
    const priceChangeValue = coinData?.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD || 0;
    const isPriceUp = priceChangeValue >= 0;
    const isPriceStand = priceChangeValue === 0;

    return (
        <Box mt={20}>
            {!isFetching && coinData ? (
                <Flex gap={40} width={"full"} justifyContent={"space-between"} >
                    <HStack key={coinData.NAME} gap="4" justifyContent={"flex-start"} height={"full"}>
                        <Avatar.Root>
                            <Avatar.Fallback name={coinData.NAME} />
                            <Avatar.Image src={coinData.LOGO_URL} />
                        </Avatar.Root>
                        <Stack gap="0">
                            <Text color="fg.muted" textStyle="sm">
                                {coinData.SYMBOL}
                            </Text>
                            <Text fontWeight="bold" textStyle="lg">
                                {coinData.NAME}
                            </Text>
                        </Stack>
                    </HStack>
                    <Flex direction="column" justifyContent="center" alignItems="center" gap={5}>
                        <Stat.Root size={"lg"}>
                            <Stat.ValueText gap={3} fontStyle={"italic"} >
                                <FormatNumber
                                    value={coinData.PRICE_USD || 0}
                                    style={"currency"}
                                    currency={"USD"}
                                    maximumFractionDigits={3}
                                />
                                <Badge
                                    colorPalette={isPriceStand ? (isPriceUp ? "green" : "red"): "yellow"}
                                    variant={"plain"}
                                    px={0}
                                    fontStyle={"normal"}
                                    size={"sm"}
                                >
                                    {!isPriceStand && (isPriceUp ? (
                                        <Stat.UpIndicator />
                                    ): (
                                        <Stat.DownIndicator />
                                    ))}
                                    <FormatNumber
                                        value={priceChangeValue}
                                        style="percent"
                                        maximumFractionDigits={2}
                                    />
                                </Badge>
                            </Stat.ValueText>
                        </Stat.Root>
                        <Flex gap={10}>
                            <Stack gap="2">
                                <Text color="fg.muted" textStyle="sm">
                                    {"Market Cap" + " #" +  coinData.TOPLIST_BASE_RANK.TOTAL_MKT_CAP_USD}
                                </Text>
                                <Text fontWeight="bold" textStyle={"s"}>
                                    <FormatNumber value={coinData.CIRCULATING_MKT_CAP_USD} style="currency" currency="USD" />
                                </Text>
                            </Stack>
                            <Stack gap="2">
                                <Text color="fg.muted" textStyle={"sm"}>
                                    {"Volume (24h)" + " #" +  coinData.TOPLIST_BASE_RANK.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD}
                                </Text>
                                <Text fontWeight="bold" textStyle={"s"}>
                                    <FormatNumber value={coinData.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD} style="currency" currency="USD" />
                                </Text>
                            </Stack>
                            <Stack gap="2" >
                                <Text color="fg.muted" textStyle="sm">
                                    {"Supply (Circ. / Total / Max)"}
                                </Text>
                                <Flex gap={1} textStyle={"s"}>
                                    <Text fontWeight="bold">
                                        <FormatNumber value={coinData.SUPPLY_CIRCULATING} notation="compact" compactDisplay="short" minimumFractionDigits={2} minimumIntegerDigits={2} />
                                    </Text>
                                    {"/"}
                                    <Text fontWeight="bold">
                                        <FormatNumber value={coinData.SUPPLY_TOTAL} notation="compact" compactDisplay="short" minimumFractionDigits={2} minimumIntegerDigits={2} />
                                    </Text>
                                    {"/"}
                                    <Text fontWeight="bold">
                                        {coinData.SUPPLY_MAX === -1.00 ? (
                                            "∞"
                                        ): (
                                            <FormatNumber value={coinData.SUPPLY_MAX} notation="compact" compactDisplay="short" minimumFractionDigits={2} minimumIntegerDigits={2} />
                                        )}
                                    </Text>
                                </Flex>
                            </Stack>
                        </Flex>
                    </Flex>
                    <div/>
                </Flex>
            ) : (
                <Flex width={"full"} justifyContent={"space-between"} >
                    <div>
                        <Stack gap="6" maxW="xs">
                            <HStack width="200px">
                                <SkeletonCircle size="10" />
                                <SkeletonText noOfLines={2} />
                            </HStack>
                        </Stack>
                    </div>
                    <Flex direction={"column"} width={"auto"} gap={10}>
                        <Stack maxW="xs">
                            <HStack width="auto">
                                <SkeletonText noOfLines={3} />
                            </HStack>
                        </Stack>
                        <Flex direction={"row"} gap={10}>
                            <Stack maxW="xs">
                                <HStack width="100px">
                                    {/*<SkeletonCircle size="10" />*/}
                                    <SkeletonText noOfLines={3} />
                                </HStack>
                            </Stack>
                            <Stack maxW="xs">
                                <HStack width="100px">
                                    {/*<SkeletonCircle size="10" />*/}
                                    <SkeletonText noOfLines={3} />
                                </HStack>
                            </Stack>
                            <Stack maxW="xs">
                                <HStack width="100px">
                                    {/*<SkeletonCircle size="10" />*/}
                                    <SkeletonText noOfLines={3} />
                                </HStack>
                            </Stack>
                        </Flex>
                    </Flex>
                    <div/>
                </Flex>
            )}
        </Box>);
}