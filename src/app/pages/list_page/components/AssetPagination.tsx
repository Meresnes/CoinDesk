import {ButtonGroup, IconButton, Pagination, Box, Text, Flex} from "@chakra-ui/react";
import * as React from "react";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import styles from "./AssetPagination.module.scss";

interface AssetPaginationProps {
    currentPage: number,
    totalCount: number,
    pageSize: number,
    onPageChange: (page: number) => void,
    disabled?: boolean
}

export const AssetPagination = React.memo(({ 
    currentPage, 
    totalCount, 
    pageSize, 
    onPageChange, 
    disabled = false 
}: AssetPaginationProps) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const isPrevDisabled = currentPage === 1 || disabled;
    const isNextDisabled = currentPage === totalPages || disabled;

    return (
        <Box className={styles.paginationContainer}>
            <Pagination.Root
                count={totalCount}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={(pageDetails) => onPageChange(pageDetails.page)}
            >
                <Flex className={styles.paginationContent}>
                    <Text className={styles.paginationInfo}>
                        Page {currentPage} of {totalPages} ({totalCount} total assets)
                    </Text>
                    
                    <ButtonGroup variant={"outline"} size={"sm"}>
                        <Pagination.PrevTrigger 
                            asChild 
                            disabled={isPrevDisabled}
                        >
                            <IconButton className={styles.paginationButton}>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton
                                    disabled={disabled}
                                    variant={"outline"}
                                    className={`${styles.paginationPageButton} ${page.value === currentPage ? styles.active : ""}`}
                                >
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger
                            asChild 
                            disabled={isNextDisabled}
                        >
                            <IconButton className={styles.paginationButton}>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Flex>
            </Pagination.Root>
        </Box>
    );
});

