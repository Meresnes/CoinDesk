import {
    Avatar,
    ButtonGroup, Flex,
    IconButton, Pagination,
    SkeletonText, Table,
    Heading, Badge,
    Stat, FormatNumber
} from "@chakra-ui/react";
import * as React from "react";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import {usePagination} from "../../../hooks/usePagination.ts";
import {useGetAssetListQuery} from "../../services/assetService";
import "./ListPage.css";

function ListPage() {
    const {page, pageSize, totalPages, setTotalCount, onSetPage} = usePagination({
        initTotalCount: 0,
        initPage: 1,
        initPageSize: 10,
    });

    const {data, isFetching} = useGetAssetListQuery({page: page, page_size: pageSize});

    React.useEffect(() => {
        if (data?.STATS.TOTAL_ASSETS) {
            setTotalCount(data?.STATS.TOTAL_ASSETS);
        }
    }, [data?.STATS.TOTAL_ASSETS]);


    return (
        <>
            <Flex direction="column" alignItems="center" gap={5} paddingX={20} >
                <Table.Root size="lg" >
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Category</Table.ColumnHeader>
                            <Table.ColumnHeader>Price</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isFetching ? (
                            <SkeletonText noOfLines={10} variant={"shine"} gap="4" width={"full"} />
                        ): (data?.LIST.map((item) => {
                            const priceChangeValue = item.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD || 0;
                            const isPriceUp = priceChangeValue >= 0;
                            const isPriceStand = priceChangeValue === 0;
                            return (
                                <Table.Row key={item.ID}>
                                    <Table.Cell>
                                        <FormatNumber
                                            value={item.ID}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Flex alignItems="center" gap={5}>
                                            <Avatar.Root size={"xs"}>
                                                <Avatar.Fallback name={item.NAME} />
                                                <Avatar.Image src={item.LOGO_URL} />
                                            </Avatar.Root>
                                            <Heading size={"md"}>
                                                {item.NAME}
                                            </Heading>
                                            <Badge colorPalette="yellow">
                                                {item.SYMBOL}
                                            </Badge>
                                        </Flex>
                                    </Table.Cell>
                                    <Table.Cell>{item.ASSET_TYPE}</Table.Cell>
                                    <Table.Cell>
                                        <Stat.Root size={"sm"}>
                                            <Stat.ValueText>
                                                <FormatNumber
                                                    value={item.PRICE_USD || 0}
                                                    style={"currency"}
                                                    currency={"USD"}
                                                    maximumFractionDigits={10}
                                                />
                                            </Stat.ValueText>
                                            <Badge
                                                colorPalette={isPriceStand ? (isPriceUp ? "green" : "red"): "yellow"}
                                                variant={"plain"}
                                                px={0}
                                                size={"xs"}
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
                                        </Stat.Root>
                                    </Table.Cell>
                                </Table.Row>
                            );}))}
                    </Table.Body>
                </Table.Root>
                

                <Pagination.Root
                    count={totalPages}
                    pageSize={pageSize}
                    defaultPage={page}
                    onPageChange={(pageDetails) => onSetPage(pageDetails.page)}
                >
                    <ButtonGroup variant="outline" size="sm">
                        <Pagination.PrevTrigger asChild>
                            <IconButton>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton
                                    variant={{base: "outline", _selected: "solid"}}
                                >
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild >
                            <IconButton>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </Flex>
        </>
    );
}

export default ListPage;
