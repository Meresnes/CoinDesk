import {Box, Grid, Skeleton, useBreakpointValue} from "@chakra-ui/react";
import * as React from "react";
import type {Asset, AssetListItem, AssetMetaResponse} from "../../../types/Asset";
import {AssetCard} from "./AssetCard";
import {AssetTable} from "./AssetTable";

interface AssetGridProps {
    data?: (AssetListItem | Asset)[],
    isLoading: boolean,
    assetMetaData?: AssetMetaResponse,
    onCoinClick: (symbol: string) => void
}

export const AssetGrid = React.memo(({data, isLoading, assetMetaData, onCoinClick}: AssetGridProps) => {
    const isMobile = useBreakpointValue({base: true, md: false});

    const getMetaDataById = (symbol: string): AssetListItem | undefined => {
        return assetMetaData?.[symbol] || undefined;
    };

    if (isLoading) {
        return (
            <Box>
                {isMobile ? (
                    <Grid templateColumns={"1fr"} gap={4}>
                        {Array.from({length: 10}).map((_, index) => (
                            <Skeleton key={index} height={"120px"} borderRadius={"xl"} />
                        ))}
                    </Grid>
                ) : (
                    <AssetTable
                        data={data}
                        isLoading={true}
                        assetMetaData={assetMetaData}
                        onCoinClick={onCoinClick}
                    />
                )}
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box
                textAlign={"center"}
                py={20}
                color={"gray.400"}
                fontSize={"lg"}
            >
                No assets found
            </Box>
        );
    }

    if (isMobile) {
        return (
            <Grid templateColumns={"1fr"} gap={4}>
                {data.map((item) => (
                    <AssetCard
                        key={item.ID}
                        item={item}
                        itemMeta={getMetaDataById(item.SYMBOL)}
                        onCoinClick={onCoinClick}
                    />
                ))}
            </Grid>
        );
    }

    return (
        <AssetTable
            data={data}
            isLoading={false}
            assetMetaData={assetMetaData}
            onCoinClick={onCoinClick}
        />
    );
});




