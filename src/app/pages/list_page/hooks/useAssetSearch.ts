import * as React from "react";
import {useDebounce} from "../../../hooks";
import {useAssetSearchQuery, useLazyAssetMetaQuery} from "../../../services/assetService";


export function useAssetSearch() {
    const [searchStringQuery, setSearchStringQuery] = React.useState("");
    const debouncedSearchQuery = useDebounce<string>(searchStringQuery, 300);

    const [fetchAssetMeta, {data: assetMetaData, isFetching: isAssetMetaFetching}] = useLazyAssetMetaQuery();
    
    const {data: assetSearchData, isFetching: isAssetSearchDataFetching} = useAssetSearchQuery({
        search_string: debouncedSearchQuery,
        limit: 10
    }, {
        skip: !debouncedSearchQuery.trim()
    });

    React.useEffect(() => {
        if (assetSearchData?.LIST && assetSearchData.LIST.length > 0) {
            fetchAssetMeta({
                assets: assetSearchData.LIST.map(item => item.SYMBOL) || []
            });
        }
    }, [assetSearchData, fetchAssetMeta]);

    const isSearchMode = Boolean(debouncedSearchQuery.trim());
    const searchData = assetSearchData?.LIST;
    const isLoading = isAssetSearchDataFetching || isAssetMetaFetching;
    
    return {
        searchStringQuery,
        setSearchStringQuery,
        debouncedSearchQuery,
        searchData,
        isLoading,
        isSearchMode,
        assetMetaData,
    };
}

