import {Flex, Box, Heading, Text} from "@chakra-ui/react";
import * as React from "react";
import TopListWidget from "../../../components/TopListWidget";
import {SortBy, SortDirection } from "../../../types/Sort";
import {NEGATIVE_PRICE_COLOR, POSITIVE_PRICE_COLOR } from "../../../utils/ChartsColort";
import styles from "./TopListWidgets.module.scss";

export const TopListWidgets = React.memo(() => {
    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Heading size={"xl"} mb={2} className={styles.title}>
                    Market Overview
                </Heading>
                <Text className={styles.subtitle} fontSize={"lg"}>
                    Track the top performing cryptocuыrrencies
                </Text>
            </Box>

            <Flex className={styles.widgetsGrid} >
                <Box className={styles.widgetBox}>
                    <TopListWidget
                        title={"Top Gainers"}
                        listPayload={{
                            sort_by: SortBy.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD
                        }}
                        priceBadgeColor={POSITIVE_PRICE_COLOR}
                    />
                </Box>
                <Box className={styles.widgetBox}>
                    <TopListWidget
                        title={"Top Losers"}
                        listPayload={{
                            sort_by: SortBy.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD,
                            sort_direction: SortDirection.ASC
                        }}
                        priceBadgeColor={NEGATIVE_PRICE_COLOR}
                    />
                </Box>
            </Flex>
        </Box>
    );
});

