import * as React from "react";

interface UsePaginationParams {
    initTotalCount: number,
    initPage?: number,
    initPageSize?: number
}

export function usePagination({
    initTotalCount,
    initPage = 1,
    initPageSize = 10,
}: UsePaginationParams) {
    const [page, setPage] = React.useState<number>( initPage);
    const [pageSize, setPageSize] = React.useState<number>(initPageSize);
    const [totalCount, setTotalCount] = React.useState<number>(initTotalCount);

    const totalPages = React.useMemo(
        () => Math.max(1, Math.ceil(totalCount / pageSize)),
        [totalCount, pageSize]
    );

    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    const onSetPage = (newPage: number) => {
        setPage(newPage);
    };

    const goNext = () => hasNext && onSetPage(page + 1);
    const goPrevious = () => hasPrev && onSetPage(page - 1);

    React.useEffect(() => {
        if (page > totalPages) {
            onSetPage(totalPages);
        }
    }, [totalPages, page]);

    return {page, totalPages, setTotalCount, pageSize, setPageSize, goNext, goPrevious, onSetPage};
}
