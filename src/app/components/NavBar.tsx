import {
    Box,
    Flex,
    Grid,
    Combobox,
    Portal,
    Tabs,
    useListCollection, HStack,
    Spinner, Span, Avatar,
} from "@chakra-ui/react";
import {debounce} from "lodash";
import * as React from "react";
import {LuList, LuNewspaper, LuSquareCheck, LuArrowLeft} from "react-icons/lu";
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

    const onArrowClick = () => {
        navigate("/list");
    };

    const setSearch = debounce(
        (text: string) => {
            setSearchText(text);
        },
        1000
    );
    const {data, isFetching} = useAssetSearchQuery({search_string: searchText});

    const isCoinPath = location.pathname.includes("/coin/");

    const {collection, set} = useListCollection<Asset>({
        initialItems: [],
        itemToString: (item) => item.NAME,
        itemToValue: (item) => item.NAME,
    });

    React.useEffect(() => {
        if (data?.LIST) {
            set(data.LIST);
        }
    }, [data?.LIST, set]);

    return (
        <Box
            pt={5}
            mb={3}
            px={20}
        >
            <Grid
                templateColumns={"repeat(3, 1fr)"}
                height={50}
                gap={10}
                alignContent={"center"}
                alignItems={"center"}
            >
                
                <Flex alignItems={"center"} gap={10}>
                    {isCoinPath && <LuArrowLeft cursor={"pointer"} size={40} onClick={onArrowClick}/>}
                    <Combobox.Root
                        collection={collection}
                        onInputValueChange={(e) => setSearch(e.inputValue)}
                        onValueChange={details => onCoinClick(details.items[0].SYMBOL)}
                        width={"320px"}
                        openOnClick={true}
                    >
                    
                        <Combobox.Label>Select coin</Combobox.Label>
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

                <Tabs.Root defaultValue={"members"} variant={"line"}>
                    {!isCoinPath && (
                        <Flex gap={20}>
                            <Link to={"/list"}>

                                <Tabs.Trigger value={"members"}>
                                    <LuList />
                                    Top list
                                </Tabs.Trigger>
                            </Link>
                            <Link to={"/news"}>

                                <Tabs.Trigger value={"projects"}>
                                    <LuNewspaper />
                                    News
                                </Tabs.Trigger>
                            </Link>
                            <Tabs.Trigger value={"tasks"}>
                                <LuSquareCheck />
                                Settings
                            </Tabs.Trigger>
                        </Flex>

                    )}
                </Tabs.Root>
                <div></div>
            </Grid>
        </Box>
    );
}