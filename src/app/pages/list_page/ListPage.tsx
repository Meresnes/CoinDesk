import {Flex} from "@chakra-ui/react";
import * as React from "react";
import {useNavigate} from "react-router";
import {usePagination} from "../../hooks";
import {AssetPagination, AssetTable, SearchBar, TopListWidgets} from "./components";
import {useAssetSearch, useAssetList} from "./hooks";
import "./ListPage.css";

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
        <Flex direction={"column"} alignItems={"center"} gap={5} paddingX={20}>
            <TopListWidgets />
            
            <SearchBar 
                searchValue={searchStringQuery}
                onSearchChange={setSearchStringQuery}
            />
            
            <AssetTable 
                data={isSearchMode ? searchData : assetListData}
                isLoading={isTableLoading}
                assetMetaData={assetMetaData}
                onCoinClick={onCoinClick}
            />
            
            {!isSearchMode && totalAssets && (
                <AssetPagination
                    currentPage={page}
                    totalCount={totalAssets || 0}
                    pageSize={pageSize}
                    onPageChange={onSetPage}
                    disabled={isPaginationDisabled}
                />
            )}
        </Flex>
    );
}

export default ListPage;
