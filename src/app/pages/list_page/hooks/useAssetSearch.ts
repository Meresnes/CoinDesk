import * as React from "react";
import {useDebounce} from "../../../hooks";
import {useGetAssetListQuery, useAssetSearchQuery} from "../../../services/assetService";

interface UseAssetSearchProps {
    page: number,
    pageSize: number
}

export function useAssetSearch({page, pageSize}: UseAssetSearchProps) {
    const [searchStringQuery, setSearchStringQuery] = React.useState("");
    const debouncedSearchQuery = useDebounce(searchStringQuery, 300);

    const queryParams = {
        page,
        page_size: pageSize   
    };

    const {data: assetListData, isFetching: isAssetListFetching} = useGetAssetListQuery(queryParams);
    const {data: assetSearchData, isFetching: isAssetSearchDataFetching} = useAssetSearchQuery({
        search_string: debouncedSearchQuery,
        limit: 10
    }, {
        skip: !debouncedSearchQuery.trim()
    });

    const isSearchMode = Boolean(debouncedSearchQuery.trim());
    const currentData = isSearchMode ? assetSearchData?.LIST : assetListData?.LIST;
    const isLoading = isSearchMode ? isAssetSearchDataFetching : isAssetListFetching;
    
    const isPaginationDisabled = Boolean(searchStringQuery) || isAssetSearchDataFetching || isAssetListFetching;

    return {
        searchStringQuery,
        setSearchStringQuery,
        debouncedSearchQuery,
        currentData,
        isLoading,
        isSearchMode,
        isPaginationDisabled,
        assetListData,
        totalAssets: assetListData?.STATS.TOTAL_ASSETS
    };
}

