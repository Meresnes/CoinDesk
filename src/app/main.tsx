import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import * as React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router";
import App from "./App";
import NavBar from "./components/NavBar";
import {store} from "./store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path={"list"} element={<App />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>,
);
