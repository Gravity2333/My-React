import { createElement } from "../lib/React";
import { render } from "../lib/ReactDom";
import App from "./App";

render(createElement(App, {}, []), document.querySelector("#root-master"));

