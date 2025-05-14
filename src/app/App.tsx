import {Button, ButtonGroup, IconButton, Pagination, SkeletonText} from "@chakra-ui/react";
import * as React from "react";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import {useDispatch, useSelector} from "react-redux";
import {usePagination} from "../hooks/usePagination";
import {useGetAssetListQuery} from "./services/assetService";
import type {RootState} from "./store";
import {decrement, increment} from "./store/countedSlice";

function App() {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    const {page, pageSize, totalPages, setTotalCount, onSetPage} = usePagination({
        initTotalCount: 0,
        initPage: 1,
        initPageSize: 10,
    });

    const {data, isFetching} = useGetAssetListQuery({page: page, page_size: pageSize});

    React.useEffect(() => {
        if (data?.STATS.TOTAL_ASSETS) {
            setTotalCount(data?.STATS.TOTAL_ASSETS);
        }
    }, [data?.STATS.TOTAL_ASSETS]);


    return (
        <>
            <h1>Vite + React</h1>
            <Button variant="outline" onClick={() => dispatch(increment())}>
                loadData
            </Button>
            <button onClick={() => dispatch(increment())}>
                +1
            </button>
            <button onClick={() => dispatch(decrement())}>
                -1
            </button>
            <span>{count || 0}</span>
           
            <>
                <h1>List</h1>
                {isFetching ? (
                    <SkeletonText  noOfLines={10} gap="4" />
                ): (
                    <ul>
                        {data?.LIST.map((item) => {
                            return <li key={item.ID}>{item.NAME}</li>;
                        })}
                    </ul>
                )
                }

                <Pagination.Root
                    count={totalPages}
                    pageSize={pageSize}
                    defaultPage={page}
                    onPageChange={(pageDetails) => onSetPage(pageDetails.page)}
                >
                    <ButtonGroup variant="outline" size="sm">
                        <Pagination.PrevTrigger asChild>
                            <IconButton>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton
                                    variant={{base: "outline", _selected: "solid"}}
                                >
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild >
                            <IconButton>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </>
            
        </>
    );
}

export default App;
