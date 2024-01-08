import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const container = document.querySelector("#root");

const root = createRoot(container);
root.render(
    <BrowserRouter>
        <App tab="home" />
    </BrowserRouter>
);
