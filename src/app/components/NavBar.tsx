import {
    Box,
    Flex,
    Combobox,
    Portal,
    useListCollection, HStack,
    Spinner, Span, Avatar, Heading,
} from "@chakra-ui/react";
import {debounce} from "lodash";
import * as React from "react";
import {LuList, LuNewspaper, LuSettings} from "react-icons/lu";
import {Link, useNavigate, useLocation} from "react-router";
import {useAssetSearchQuery} from "../services/assetService";
import type {Asset} from "../types/Asset";
import styles from "./NavBar.module.scss";

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
        <Box className={styles.navbar}>
            <Box className={styles.navbarContainer}>
                <Flex className={styles.navbarContent}>
                    <Link to={"/list"} className={styles.logo}>
                        <Heading size={"lg"} className={styles.logoText}>
                            CoinDesk
                        </Heading>
                    </Link>

                    <Flex as={"nav"} className={styles.navLinks}>
                        <Link to={"/list"} style={getLinkStyle("/list")}>
                            <HStack className={styles.navLink} gap={2}>
                                <LuList size={18} />
                                <Span color={"white"}>Prices</Span>
                            </HStack>
                        </Link>
                        <Link to={"/news"} style={getLinkStyle("/news")}>
                            <HStack className={styles.navLink} gap={2}>
                                <LuNewspaper size={18} />
                                <Span color={"white"}>News</Span>
                            </HStack>
                        </Link>
                        <Link to={"/settings"} style={getLinkStyle("/settings")}>
                            <HStack className={styles.navLink} gap={2}>
                                <LuSettings size={18} />
                                <Span color={"white"}>Settings</Span>
                            </HStack>
                        </Link>
                    </Flex>

                    <Box className={styles.searchBox}>
                        <Combobox.Root
                            collection={collection}
                            onInputValueChange={(e) => setSearch(e.inputValue)}
                            onValueChange={details => onCoinClick(details.items[0].SYMBOL)}
                            width={"300px"}
                            openOnClick={true}
                        >
                            <Combobox.Control>
                                <Combobox.Input 
                                    placeholder={"Search coins..."} 
                                    className={styles.searchInput}
                                />
                                <Combobox.IndicatorGroup>
                                    <Combobox.ClearTrigger />
                                    <Combobox.Trigger />
                                </Combobox.IndicatorGroup>
                            </Combobox.Control>
                            <Portal>
                                <Combobox.Positioner>
                                    <Combobox.Content className={styles.searchDropdown}>
                                        {isFetching && (
                                            <HStack p={3}>
                                                <Spinner size={"xs"} borderWidth={"1px"} className={styles.searchSpinner} />
                                                <Span color={"gray.400"}>Loading...</Span>
                                            </HStack>
                                        )}
                                        {!isFetching && collection.items?.map((coin) => (
                                            <Combobox.Item key={coin.ID} item={coin}>
                                                <HStack justify={"space-between"} textStyle={"sm"} p={2}>
                                                    <Avatar.Root size={"xs"}>
                                                        <Avatar.Fallback name={coin.NAME} />
                                                        <Avatar.Image src={coin.LOGO_URL} />
                                                    </Avatar.Root>
                                                    <Span fontWeight={"medium"} truncate color={"white"}>
                                                        {coin.NAME}
                                                    </Span>
                                                    <Span color={"gray.400"} truncate>
                                                        {coin.SYMBOL}
                                                    </Span>
                                                </HStack>
                                                <Combobox.ItemIndicator />
                                            </Combobox.Item>
                                        ))}
                                        {collection.items.length === 0 && (
                                            <Combobox.Empty color={"gray.400"}>No items found</Combobox.Empty>
                                        )}
                                    </Combobox.Content>
                                </Combobox.Positioner>
                            </Portal>
                        </Combobox.Root>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}