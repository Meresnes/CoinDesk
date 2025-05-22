import {
    Box,
    Field,
    Flex,
    Grid,
    Combobox,
    Portal,
    Tabs,
} from "@chakra-ui/react";

import * as React from "react";
import {LuList, LuNewspaper, LuSquareCheck,} from "react-icons/lu";
import {Link} from "react-router";

export default function NavBar (): React.JSX.Element {
    return (
        <Box
            pt={5}
            mb={3}
            px={20}
        >
            <Grid
                templateColumns="repeat(3, 1fr)"
                height={50}
                alignItems="center"
            >
                <Combobox.Root
                    // collection={[]}
                    onInputValueChange={() => ""}
                    width="320px"
                >
                    <Combobox.Label>Select framework</Combobox.Label>
                    <Combobox.Control>
                        <Combobox.Input placeholder="Type to search" />
                        <Combobox.IndicatorGroup>
                            <Combobox.ClearTrigger />
                            <Combobox.Trigger />
                        </Combobox.IndicatorGroup>
                    </Combobox.Control>
                    <Portal>
                        <Combobox.Positioner>
                            <Combobox.Content>
                                <Combobox.Empty>No items found</Combobox.Empty>
                                {/*{collection.items.map((item) => (*/}
                                {/*    <Combobox.Item item={item} key={item.value}>*/}
                                {/*        {item.label}*/}
                                {/*        <Combobox.ItemIndicator />*/}
                                {/*    </Combobox.Item>*/}
                                {/*))}*/}
                            </Combobox.Content>
                        </Combobox.Positioner>
                    </Portal>
                </Combobox.Root>

                <Tabs.Root defaultValue="members" variant={"line"}>
                    {/*<Tabs.List>*/}
                    <Flex gap={20}>
                        <Link to={"/list"}>

                            <Tabs.Trigger value="members">
                                <LuList />
                                Top list
                            </Tabs.Trigger>
                        </Link>
                        <Link to={"/news"}>

                            <Tabs.Trigger value="projects">
                                <LuNewspaper />
                                News
                            </Tabs.Trigger>
                        </Link>
                        <Tabs.Trigger value="tasks">
                            <LuSquareCheck />
                            Settings
                        </Tabs.Trigger>
                    </Flex>
                    {/*</Tabs.List>*/}
                </Tabs.Root>
                <div></div>
            </Grid>
        </Box>
    );
}