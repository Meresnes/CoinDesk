import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {usePagination} from "../hooks/usePagination";
import {useGetAssetListQuery} from "./services/assetService";
import type {RootState} from "./store";
import {decrement, increment} from "./store/countedSlice";

function App() {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    const {page, pageSize, setTotalCount, goNext, goPrevious} = usePagination({
        initTotalCount: 0,
        initPage: 1,
        initPageSize: 10,
    });

    const {data, isLoading, error, isError, isSuccess} = useGetAssetListQuery({page: page, page_size: pageSize});

    React.useEffect(() => {
        if (data?.STATS.TOTAL_ASSETS) {
            setTotalCount(data?.STATS.TOTAL_ASSETS);
        }
    }, [data?.STATS.TOTAL_ASSETS]);


    return (
        <>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => dispatch(increment())}>
                    loadData
                </button>
                <button onClick={() => dispatch(increment())}>
                    +1
                </button>
                <button onClick={() => dispatch(decrement())}>
                    -1
                </button>
                <span>{count || 0}</span>
            </div>
            {isSuccess && data &&  (
                <>
                    <h1>List</h1>
                    <ul>
                        {data?.LIST.map((item) => {
                            return <li key={item.ID}>{item.NAME}</li>;
                        })}
                    </ul>
                    <button onClick={goPrevious}>
                        Go previous
                    </button>
                    {page}
                    <button onClick={goNext}>
                        Go next
                    </button>
                </>
            )}
        </>
    );
}

export default App;
