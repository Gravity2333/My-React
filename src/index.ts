import { createElement } from "../lib/React";
import { createRoot } from "../lib/ReactDom";

function App() {
  return createElement("h1", {
    style: {color:'purple'}
  }, "TOY-REACT DEMO APP");
}

const elements = createElement(
  "div",
  {
    style: {
      color: "green",
      backgroundColor: "lightgray",
    },
    onClick: (e) => {
      console.log(e, "div");
    },
    onClickCapture: (e) => {
      console.log(e, "div captire");
    },
  },
  createElement("h1", {}, "Hi My React! "),
  createElement(
    "button",
    {
      key: "hebtn1",
      style: { backgroundColor: "orange", cursor: "pointer" },
      onClick: (e) => {
        console.log(e, "btn+1");
      },
    },
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
      onClick: (e) => {
        console.log(e, "btn+2");
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
