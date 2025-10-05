import {SkeletonText, Table, Box} from "@chakra-ui/react";
import * as React from "react";
import type {Asset, AssetListItem, AssetMetaResponse} from "../../../types/Asset";
import styles from "./AssetTable.module.scss";
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
        <Box className={styles.tableContainer}>
            <Table.Root size={"lg"}>
                <Table.Header>
                    <Table.Row className={styles.tableHeader}>
                        <Table.ColumnHeader className={styles.tableHeaderCell}>#</Table.ColumnHeader>
                        <Table.ColumnHeader className={styles.tableHeaderCell}>Asset</Table.ColumnHeader>
                        <Table.ColumnHeader className={styles.tableHeaderCell}>Category</Table.ColumnHeader>
                        <Table.ColumnHeader className={styles.tableHeaderCell} textAlign={"right"}>Price</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                {isLoading ? (
                    <Table.Body>
                        <SkeletonText noOfLines={10} variant={"shine"} gap={"4"} width={"full"} />
                    </Table.Body>
                ) : (!data || data.length === 0 ? (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan={4} textAlign={"center"} py={8} color={"gray.400"}>
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
        </Box>
    );
});

