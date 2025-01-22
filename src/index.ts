import { createElement } from "../lib/React";
import { createRoot } from "../lib/ReactDom";

const elements = createElement(
  "div",
  {
    style: "padding:20px;border-bottom:1px solid black",
  },
  createElement("h1", {}, "TOY-REACT DEMO"),
  createElement(
    "button",
    { key: "hebtn1", style: "background-color:red" },
    "+1"
  ),
  createElement(
    "button",
    { key: "hebtn2", style: "background-color:red" },
    "+2"
  ),
  [
    'hello',
    'world'
  ]
);
console.log(elements);
const root = createRoot(document.querySelector("#root-master"));
root.render(elements);
