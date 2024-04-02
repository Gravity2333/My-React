import { createElement } from "../lib/React";
import { render } from "../lib/ReactDom";

function Counter() {
  const handleAdd = (num: number) => {
    Counter.value += num;
    reload();
  };
  const handleSub = (num: number) => {
    Counter.value -= num;
    reload();
  };

  return createElement("div", {}, [
    createElement("h2", {}, ["Counter:", String(Counter.value)]),
    Counter.value > 20
      ? createElement("h3", { style: "color:green" }, ["counter>20"])
      : createElement("h3", { style: "color:red" }, ["counter<20"]),
    createElement("div", {}, [
      createElement("button", { onClick: () => handleAdd(1) }, ["+1"]),
      createElement("button", { onClick: () => handleSub(1) }, ["-1"]),
    ]),
  ]);
}

Counter.value = 10;

function App() {
  return createElement("div", { style: "color:gray;" }, [
    createElement("h2", {}, ["hello"]),
    createElement("h2", {}, ["world"]),
    createElement("div", {}, [
      createElement("a", { href: "https://www.baidu.com" }, [
        "百度一下,你就知道!",
      ]),
      createElement(Counter, {}, []),
    ]),
  ]);
}

render(createElement(App, {}, []), document.querySelector("#root-master"));

function reload() {
  render(createElement(App, {}, []), document.querySelector("#root-master"));
}
