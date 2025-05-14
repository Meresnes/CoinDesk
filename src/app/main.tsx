import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router";
import App from "./App";
import {store} from "./store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ChakraProvider>
    </Provider>,
);
