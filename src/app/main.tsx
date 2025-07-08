import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router";
import NavBar from "./components/NavBar";
import CoinPage from "./pages/coin_page/CoinPage";
import ListPage from "./pages/list_page/ListPage";
import {store} from "./store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path={"list"} element={<ListPage />} />
                    <Route path={"coin/:name"} element={<CoinPage />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>,
);
