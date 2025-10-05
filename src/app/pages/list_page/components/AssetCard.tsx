import {
    Avatar,
    Badge,
    Box,
    Flex,
    FormatNumber,
    Heading,
    Text,
    HStack,
    VStack
} from "@chakra-ui/react";
import * as React from "react";
import type {Asset, AssetListItem} from "../../../types/Asset";
import styles from "./AssetCard.module.scss";

interface AssetCardProps {
    item: AssetListItem | Asset,
    itemMeta?: AssetListItem,
    onCoinClick: (symbol: string) => void
}

export const AssetCard = React.memo(({item, itemMeta, onCoinClick}: AssetCardProps) => {
    const priceSource = "PRICE_USD" in item ? item as AssetListItem : itemMeta;
    const priceUsd = priceSource?.PRICE_USD ?? 0;
    const priceChangeValue = priceSource?.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD ?? 0;
    
    const isPriceUp = priceChangeValue > 0;
    const isPriceStand = priceChangeValue === 0;

    return (
        <Box className={styles.card} onClick={() => onCoinClick(item.SYMBOL)}>
            <Flex className={styles.cardHeader}>
                <HStack className={styles.cardInfo} gap={3}>
                    <Avatar.Root size={"md"}>
                        <Avatar.Fallback name={item.NAME} />
                        <Avatar.Image src={item.LOGO_URL} />
                    </Avatar.Root>
                    <VStack className={styles.cardDetails} align={"start"} gap={1}>
                        <Heading size={"sm"} className={styles.cardTitle}>
                            {item.NAME}
                        </Heading>
                        <Badge 
                            colorPalette={"yellow"} 
                            variant={"subtle"}
                            size={"sm"}
                        >
                            {item.SYMBOL}
                        </Badge>
                    </VStack>
                </HStack>
                
                <VStack className={styles.cardPrice} align={"end"} gap={1}>
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
                        <HStack gap={1}>
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
                        </HStack>
                    </Badge>
                </VStack>
            </Flex>
            
            <HStack className={styles.cardFooter} justify={"space-between"}>
                <Text className={styles.footerText}>
                    {item.ASSET_TYPE}
                </Text>
                <Text className={styles.footerId}>
                    #{item.ID}
                </Text>
            </HStack>
        </Box>
    );
});




