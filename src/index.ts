import { createElement } from "../lib/React";
import { createRoot } from "../lib/ReactDom";

function App() {
  return createElement("h1", {}, "TOY-REACT DEMO APP");
}

const elements = createElement(
  "div",
  {
    style: {
      color: "green",
      backgroundColor: "lightgray",
    },
  },
  createElement("h1", {}, "Hi My React! "),
  createElement(
    "button",
    { key: "hebtn1", style: { backgroundColor: "red", cursor: "pointer" } },
    "+1"
  ),
  createElement(
    "button",
    {
      key: "hebtn2",
      style: {
        color: "blue",
        fontSize: "18px",
        cursor: "pointer",
      },
    },
    "+2"
  ),
  ["hello", "world"],
  createElement(App, {})
);
console.log(elements);
const root = createRoot(document.querySelector("#root-master"));
root.render(elements);
