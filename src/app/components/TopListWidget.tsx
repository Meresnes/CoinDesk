import {
    Avatar,
    Badge,
    Card,
    Flex,
    FormatNumber,
    Heading,
    SkeletonText,
    Text
} from "@chakra-ui/react";
import React from "react";
import {useNavigate} from "react-router";
import {useGetAssetListQuery} from "../services/assetService";
import type {AssetListQueryPayload} from "../types/Asset";
import {Tooltip} from "./Tooltip";

type IProps = {
    title?: React.ReactNode,
    listPayload?: AssetListQueryPayload,
    priceBadgeColor?: string
};

function TopListWidget (props: IProps): React.ReactNode {
    const {title, listPayload, priceBadgeColor = "green"} = props;
    const navigate = useNavigate();
    const {data, isFetching} = useGetAssetListQuery({
        page: 1,
        page_size: 10,
        ...listPayload
    });

    const onCoinClick = (name: string) => {
        navigate(`/coin/${name}`);
    };

    return (
        <Card.Root width={"lg"} boxSizing={"border-box"}>
            <Card.Title mt={"2"} ml={"3"}>{title}</Card.Title>
            <Card.Body py={2} px={3}>
                {isFetching ? (
                    <SkeletonText noOfLines={5} variant={"shine"} gap={"4"} width={"full"} />
                ): (
                    <Flex direction={"column"} justify={"space-between"} gap={"5px"}>
                        {data?.LIST.filter((_item, index) => index < 5).map((item, index) => {
                            const priceChangeValue = item.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD || 0;
                            return (
                                <Flex
                                    key={item.ID}
                                    gap={2}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    cursor={"pointer"}
                                    textStyle={"xs"}
                                    transition={"0.5s linear"}
                                    borderRadius={"5px"}
                                    border={"1px solid transparent"}
                                    onClick={() => onCoinClick(item.SYMBOL)}
                                    _hover={{
                                        transform: "scale(1.05)",
                                        marginLeft: "25px",
                                        border: "gray 1px solid",
                                        animation: "300ms ease-out",
                                    }}
                                >
                                    <Flex gap={2} pl={2} alignItems={"center"} overflow={"hidden"}>
                                        <FormatNumber
                                            value={index + 1}
                                        />
                                        <Avatar.Root size={"2xs"}>
                                            <Avatar.Fallback name={item.NAME} />
                                            <Avatar.Image src={item.LOGO_URL} />
                                        </Avatar.Root>

                                        <Tooltip
                                            content={item.NAME}
                                            showArrow={true}
                                            positioning={{
                                                placement: "top"
                                            }}
                                        >
                                            <Heading
                                                textStyle={"xs"}
                                                textWrap={"nowrap"}
                                                overflow={"hidden"}
                                                textOverflow={"ellipsis"}
                                            >
                                                {item.NAME}
                                            </Heading>
                                        </Tooltip>
                                    </Flex>
                                    <Flex
                                        justifyContent={"flex-end"}
                                        width={"50%"}
                                        gap={"10px"}
                                        alignItems={"center"}
                                        textOverflow={"ellipsis"}
                                        whiteSpace={"nowrap"}
                                        overflow={"hidden"}
                                    >
                                        <FormatNumber
                                            value={item.PRICE_USD || 0}
                                            style={"currency"}
                                            currency={"USD"}
                                            maximumFractionDigits={5}
                                        />
                                        <Badge
                                            color={priceBadgeColor}
                                            variant={"plain"}
                                            px={0}
                                            size={"xs"}
                                            width={"30%"}
                                        >
                                            <Tooltip
                                                content={priceChangeValue + "%"}
                                                showArrow={true}
                                                positioning={{
                                                    placement: "top"
                                                }}
                                            >
                                                <Text
                                                    textOverflow={"ellipsis"}
                                                    whiteSpace={"nowrap"}
                                                    overflow={"hidden"}
                                                >
                                                    <FormatNumber
                                                        value={priceChangeValue}
                                                        style={"percent"}
                                                        maximumFractionDigits={2}
                                                    />
                                                </Text>
                                            </Tooltip>
                                        </Badge>
                                    </Flex>
                                </Flex>
                            );
                        })}
                    </Flex>
                )}
            </Card.Body>
        </Card.Root>
    );
}

export default TopListWidget;