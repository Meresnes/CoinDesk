import {
    Avatar,
    Badge,
    Flex,
    FormatNumber,
    Heading,
    Table,
    Text
} from "@chakra-ui/react";
import * as React from "react";
import type {Asset, AssetListItem} from "../../../types/Asset";
import styles from "./AssetTableRow.module.scss";

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
        <Table.Row key={item.ID} className={styles.tableRow}>
            <Table.Cell className={styles.idCell}>
                <FormatNumber value={item.ID} />
            </Table.Cell>
            <Table.Cell>
                <Flex
                    className={styles.assetCell}
                    alignItems={"center"}
                    gap={4}
                    onClick={() => onCoinClick(item.SYMBOL)}
                >
                    <Avatar.Root size={"sm"}>
                        <Avatar.Fallback name={item.NAME} />
                        <Avatar.Image src={item.LOGO_URL} />
                    </Avatar.Root>
                    <Flex className={styles.assetInfo} direction={"column"} gap={1}>
                        <Heading size={"sm"} className={styles.assetName}>
                            {item.NAME}
                        </Heading>
                        <Badge width={"fit-content"} colorPalette={"yellow"} variant={"subtle"} size={"xs"}>
                            {item.SYMBOL}
                        </Badge>
                    </Flex>
                </Flex>
            </Table.Cell>
            <Table.Cell className={styles.categoryCell}>
                {item.ASSET_TYPE}
            </Table.Cell>
            <Table.Cell textAlign={"right"}>
                <Flex className={styles.priceCell} direction={"column"} align={"end"} gap={1}>
                    <Text className={styles.priceValue}>
                        <FormatNumber
                            value={priceUsd}
                            style={"currency"}
                            currency={"USD"}
                            maximumFractionDigits={priceUsd < 1 ? 6 : 2}
                        />
                    </Text>
                    <Badge
                        colorPalette={isPriceStand ? "yellow" : (isPriceUp ? "green" : "red")}
                        variant={"solid"}
                        size={"sm"}
                    >
                        <Flex className={styles.priceChange} align={"center"} gap={1}>
                            {!isPriceStand && (
                                isPriceUp ? (
                                    <Text>↗</Text>
                                ) : (
                                    <Text>↘</Text>
                                )
                            )}
                            <FormatNumber
                                value={priceChangeValue}
                                style={"percent"}
                                maximumFractionDigits={2}
                            />
                        </Flex>
                    </Badge>
                </Flex>
            </Table.Cell>
        </Table.Row>
    );
});

