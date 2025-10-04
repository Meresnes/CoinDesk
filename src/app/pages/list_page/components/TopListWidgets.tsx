import {Flex} from "@chakra-ui/react";
import * as React from "react";
import TopListWidget from "../../../components/TopListWidget";
import {SortBy, SortDirection} from "../../../types/Sort";
import {NEGATIVE_PRICE_COLOR, POSITIVE_PRICE_COLOR} from "../../../utils/ChartsColort";

export const TopListWidgets = React.memo(() => {
    return (
        <Flex
            justifyContent={"space-between"}
            width={"full"}
            alignItems={"center"}
            px={20}
            py={5}
        >
            <TopListWidget
                title={"Gainers"}
                listPayload={{
                    sort_by: SortBy.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD
                }}
                priceBadgeColor={POSITIVE_PRICE_COLOR}
            />
            <TopListWidget
                title={"Losers"}
                listPayload={{
                    sort_by: SortBy.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD,
                    sort_direction: SortDirection.ASC
                }}
                priceBadgeColor={NEGATIVE_PRICE_COLOR}
            />
        </Flex>
    );
});

