import {
    Box,
    Flex,
    Combobox,
    Portal,
    useListCollection, HStack,
    Spinner, Span, Avatar,
} from "@chakra-ui/react";
import {debounce} from "lodash";
import * as React from "react";
import {LuList, LuNewspaper, LuSettings} from "react-icons/lu";
import {Link, useNavigate, useLocation} from "react-router";
import {useAssetSearchQuery} from "../services/assetService";
import type {Asset} from "../types/Asset";

export default function NavBar (): React.JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = React.useState<string>("");

    const onCoinClick = (name: string) => {
        navigate(`/coin/${name}`);
    };

    const setSearch = debounce(
        (text: string) => {
            setSearchText(text);
        },
        1000
    );
    const {data, isFetching} = useAssetSearchQuery({search_string: searchText});

    const {collection, set} = useListCollection<Asset>({
        initialItems: [],
        itemToString: (item) => item.NAME,
        itemToValue: (item) => item.ID.toString(),
    });

    React.useEffect(() => {
        if (data?.LIST) {
            set(data.LIST);
        }
    }, [data?.LIST, set]);

    const getLinkStyle = (path: string): React.CSSProperties => {
        const isActive = location.pathname === path;
        return {
            color: "black",
            textDecoration: isActive ? "underline" : "none",
            fontWeight: isActive ? "bold" : "normal",
        };
    };

    return (
        <Box
            mb={3}
            px={20}
        >
            <Flex
                height={50}
                gap={10}
                alignItems={"center"}
                justifyContent={"flex-end"}
            >
                <Flex as={"nav"} gap={20} alignItems={"center"}>
                    <>
                        <Link to={"/list"} style={getLinkStyle("/list")}>
                            <HStack>
                                <LuList />
                                <Span>Prices</Span>
                            </HStack>
                        </Link>
                        <Link to={"/news"} style={getLinkStyle("/news")}>
                            <HStack>
                                <LuNewspaper />
                                <Span>News</Span>
                            </HStack>
                        </Link>
                        <Link to={"/settings"} style={getLinkStyle("/settings")}>
                            <HStack>
                                <LuSettings />
                                <Span>Settings</Span>
                            </HStack>
                        </Link>
                    </>
                </Flex>

                <Flex alignItems={"center"} gap={10}>
                    <Combobox.Root
                        collection={collection}
                        onInputValueChange={(e) => setSearch(e.inputValue)}
                        onValueChange={details => onCoinClick(details.items[0].SYMBOL)}
                        width={"320px"}
                        openOnClick={true}
                    >
                        <Combobox.Control>
                            <Combobox.Input placeholder={"Type to search"} />
                            <Combobox.IndicatorGroup>
                                <Combobox.ClearTrigger />
                                <Combobox.Trigger />
                            </Combobox.IndicatorGroup>
                        </Combobox.Control>
                        <Portal>
                            <Combobox.Positioner>
                                <Combobox.Content>
                                    {isFetching && (
                                        <HStack p={"2"}>
                                            <Spinner size={"xs"} borderWidth={"1px"} />
                                            <Span>Loading...</Span>
                                        </HStack>
                                    )}
                                    {!isFetching && collection.items?.map((coin) => (
                                        <Combobox.Item key={coin.ID} item={coin}>
                                            <HStack justify={"space-between"} textStyle={"sm"}>
                                                <Avatar.Root size={"xs"}>
                                                    <Avatar.Fallback name={coin.NAME} />
                                                    <Avatar.Image src={coin.LOGO_URL} />
                                                </Avatar.Root>
                                                <Span fontWeight={"medium"} truncate>
                                                    {coin.NAME}
                                                </Span>
                                                <Span color={"fg.muted"} truncate>
                                                    {coin.SYMBOL}
                                                </Span>
                                            </HStack>
                                            <Combobox.ItemIndicator />
                                        </Combobox.Item>
                                    ))}
                                    {collection.items.length === 0 && (
                                        <Combobox.Empty>No items found</Combobox.Empty>
                                    )}
                                </Combobox.Content>
                            </Combobox.Positioner>
                        </Portal>
                    </Combobox.Root>
                </Flex>
            </Flex>
        </Box>
    );
}