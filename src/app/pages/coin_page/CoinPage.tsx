import {Box} from "@chakra-ui/react";
import * as React from "react";
import {useParams} from "react-router";
import {useAssetMetaQuery} from "../../services/assetService";
import HeaderCoinStats from "./components/HeaderCoinStats";


function CoinPage() {
    const {name} = useParams();
    const {data, isFetching} = useAssetMetaQuery({assets: name || ""});
    const coinData = data?.[name || ""];


    return (
        <div>
            <Box>
                <HeaderCoinStats
                    coinData={coinData}
                    isFetching={isFetching}
                />
            </Box>
        </div>
    );
}

export default CoinPage;
