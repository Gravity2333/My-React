import { createElement } from "../lib/react";
import { createRoot } from "../lib/react-dom";
import App from "./App";

const root = createRoot(document.querySelector("#root-master"));
root.render(createElement(App, {}));
