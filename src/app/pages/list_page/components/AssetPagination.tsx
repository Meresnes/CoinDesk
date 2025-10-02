import {ButtonGroup, IconButton, Pagination} from "@chakra-ui/react";
import * as React from "react";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";

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
        <Pagination.Root
            count={totalCount}
            pageSize={pageSize}
            page={currentPage}
            onPageChange={(pageDetails) => onPageChange(pageDetails.page)}
        >
            <ButtonGroup variant={"outline"} size={"sm"}>
                <Pagination.PrevTrigger 
                    asChild 
                    disabled={isPrevDisabled}
                >
                    <IconButton>
                        <LuChevronLeft />
                    </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                    render={(page) => (
                        <IconButton
                            disabled={disabled}
                            variant={{base: "outline", _selected: "solid"}}
                        >
                            {page.value}
                        </IconButton>
                    )}
                />

                <Pagination.NextTrigger
                    asChild 
                    disabled={isNextDisabled}
                >
                    <IconButton>
                        <LuChevronRight />
                    </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    );
});

