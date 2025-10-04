import {useGetAssetListQuery} from "@/app/services/assetService";

interface UseAssetSearchProps {
    page: number,
    pageSize: number
}

export function useAssetList({page, pageSize}: UseAssetSearchProps) {

    const {data, isFetching: isAssetListFetching} = useGetAssetListQuery({
        page, 
        page_size: pageSize
    });

    const assetListData = data?.LIST;
    const totalAssets = data?.STATS.TOTAL_ASSETS;

    return {
        assetListData,
        totalAssets,
        isAssetListFetching
    };
} 