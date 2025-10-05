import {Flex, Box, Container, Heading, Text} from "@chakra-ui/react";
import * as React from "react";
import {useNavigate} from "react-router";
import {usePagination} from "../../hooks";
import {AssetPagination, AssetGrid, SearchBar, TopListWidgets} from "./components";
import {useAssetSearch, useAssetList} from "./hooks";
import "./ListPage.css";
import styles from "./ListPage.module.scss";

function ListPage() {
    const navigate = useNavigate();
    const {page, pageSize, setTotalCount, onSetPage} = usePagination({
        initTotalCount: 0,
        initPage: 1,
        initPageSize: 10,
    });

    const {
        searchStringQuery,
        setSearchStringQuery,
        searchData,
        assetMetaData,
        isLoading,
        isSearchMode,
    } = useAssetSearch();

    const {
        assetListData,
        totalAssets,
        isAssetListFetching
    } = useAssetList({page, pageSize});

    const isTableLoading = isAssetListFetching || isLoading;
    
    const isPaginationDisabled = isTableLoading || isSearchMode;

    const onCoinClick = React.useCallback((symbol: string) => {
        navigate(`/coin/${symbol}`);
    }, [navigate]);

    React.useEffect(() => {
        if (totalAssets) {
            setTotalCount(totalAssets);
        }
    }, [totalAssets, setTotalCount]);

    return (
        <Box className={styles.pageContainer}>
            <Container className={styles.contentContainer} maxW={"7xl"}>
                <Box className={styles.heroSection}>
                    <Heading size={"2xl"} mb={4} className={styles.heroTitle}>
                        CoinDesk
                    </Heading>
                    <Text className={styles.heroSubtitle} fontSize={"xl"}>
                        Discover, track, and analyze cryptocurrency markets with real-time data and insights
                    </Text>
                </Box>

                <TopListWidgets />
                
                <Box className={styles.searchSection}>
                    <SearchBar 
                        searchValue={searchStringQuery}
                        onSearchChange={setSearchStringQuery}
                    />
                </Box>
                
                <Box className={styles.gridSection}>
                    <AssetGrid 
                        data={isSearchMode ? searchData : assetListData}
                        isLoading={isTableLoading}
                        assetMetaData={assetMetaData}
                        onCoinClick={onCoinClick}
                    />
                </Box>
                
                {!isSearchMode && totalAssets && (
                    <Flex className={styles.paginationSection}>
                        <AssetPagination
                            currentPage={page}
                            totalCount={totalAssets || 0}
                            pageSize={pageSize}
                            onPageChange={onSetPage}
                            disabled={isPaginationDisabled}
                        />
                    </Flex>
                )}
            </Container>
        </Box>
    );
}

export default ListPage;
