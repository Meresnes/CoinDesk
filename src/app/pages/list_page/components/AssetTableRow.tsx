import {
    Avatar,
    Badge,
    Flex,
    FormatNumber,
    Heading,
    Stat,
    Table
} from "@chakra-ui/react";
import * as React from "react";
import type {Asset, AssetListItem} from "../../../types/Asset";

interface AssetTableRowProps {
    item: AssetListItem | Asset,
    itemMeta?: AssetListItem,
    onCoinClick: (symbol: string) => void
}

export const AssetTableRow = React.memo(({item, itemMeta, onCoinClick}: AssetTableRowProps) => {
    const priceSource = "PRICE_USD" in item ? item as AssetListItem : itemMeta;
    const priceUsd = priceSource?.PRICE_USD ?? 0;
    const priceChangeValue = priceSource?.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD ?? 0;
    
    const isPriceUp = priceChangeValue > 0;
    const isPriceStand = priceChangeValue === 0;

    return (
        <Table.Row key={item.ID}>
            <Table.Cell>
                <FormatNumber value={item.ID} />
            </Table.Cell>
            <Table.Cell>
                <Flex
                    alignItems={"center"}
                    gap={5}
                    cursor={"pointer"}
                    onClick={() => onCoinClick(item.SYMBOL)}
                >
                    <Avatar.Root size={"xs"}>
                        <Avatar.Fallback name={item.NAME} />
                        <Avatar.Image src={item.LOGO_URL} />
                    </Avatar.Root>
                    <Heading size={"md"}>
                        {item.NAME}
                    </Heading>
                    <Badge colorPalette={"yellow"}>
                        {item.SYMBOL}
                    </Badge>
                </Flex>
            </Table.Cell>
            <Table.Cell>{item.ASSET_TYPE}</Table.Cell>
            <Table.Cell>
                <Stat.Root size={"sm"}>
                    <Stat.ValueText>
                        <FormatNumber
                            value={priceUsd}
                            style={"currency"}
                            currency={"USD"}
                            maximumFractionDigits={10}
                        />
                    </Stat.ValueText>
                    <Badge
                        colorPalette={isPriceStand ? "yellow" : (isPriceUp ? "green" : "red")}
                        variant={"plain"}
                        px={0}
                        size={"xs"}
                    >
                        {!isPriceStand && (isPriceUp ? (
                            <Stat.UpIndicator />
                        ) : (
                            <Stat.DownIndicator />
                        ))}
                        <FormatNumber
                            value={priceChangeValue}
                            style={"percent"}
                            maximumFractionDigits={2}
                        />
                    </Badge>
                </Stat.Root>
            </Table.Cell>
        </Table.Row>
    );
});

