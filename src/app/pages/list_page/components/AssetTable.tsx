import {SkeletonText, Table} from "@chakra-ui/react";
import * as React from "react";
import type {Asset, AssetListItem, AssetMetaResponse} from "../../../types/Asset";
import {AssetTableRow} from "./AssetTableRow";

interface AssetTableProps {
    data?: (AssetListItem | Asset)[],
    isLoading: boolean,
    assetMetaData?: AssetMetaResponse,
    onCoinClick: (symbol: string) => void
}

export const AssetTable = React.memo(({data, isLoading, assetMetaData, onCoinClick}: AssetTableProps) => {

    const getMetaDataById = (symbol: string): AssetListItem | undefined => {
        return assetMetaData?.[symbol] || undefined;
    };

    return (
        <Table.Root size={"lg"}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Category</Table.ColumnHeader>
                    <Table.ColumnHeader>Price</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>

            {isLoading ? (
                <Table.Body>
                    <SkeletonText noOfLines={10} variant={"shine"} gap={"4"} width={"full"} />
                </Table.Body>
            ) : (!data || data.length === 0 ? (
                <Table.Body>
                    <Table.Row>
                        <Table.Cell colSpan={4} textAlign={"center"} py={8}>
                            No assets found
                        </Table.Cell>
                    </Table.Row>
                </Table.Body> 
            ) : (
                <Table.Body>
                    {data.map((item) => (
                        <AssetTableRow 
                            key={item.ID} 
                            item={item} 
                            itemMeta={getMetaDataById(item.SYMBOL)}
                            onCoinClick={onCoinClick} 
                        />
                    ))}
                </Table.Body>
            ))}
        </Table.Root>
    );
});

