import { createElement } from "../lib/React";
import { render } from "../lib/ReactDom";

function Counter() {
  const handleAdd = (num: number) => {
    debugger
    Counter.value += num
    reload()
  }
  const handleSub = (num: number) => {
    Counter.value -= num
    reload()
  };

  return createElement("div", {}, [
    createElement("h2", {}, ["Counter:", String(Counter.value)]),
    createElement("div", {}, [
      createElement("button", { onClick: ()=>handleAdd(1) }, ["+1"]),
      createElement("button", { onClick: ()=>handleSub(1) }, ["-1"]),
    ]),
  ]);
}

Counter.value = 10;

const elements = createElement("div", { style: "color:gray;" }, [
  createElement("h2", {}, ["hello"]),
  createElement("h2", {}, ["world"]),
  createElement("div", {}, [
    createElement("a", { href: "https://www.baidu.com" }, [
      "百度一下,你就知道!",
    ]),
    createElement(Counter,{},[])
  ]),
]);
// console.log(element)
render(elements, document.querySelector("#root-master"));

function reload(){
  const elements = createElement("div", { style: "color:gray;" }, [
    createElement("h2", {}, ["hello"]),
    createElement("h2", {}, ["world"]),
    createElement("div", {}, [
      createElement("a", { href: "https://www.baidu.com" }, [
        "百度一下,你就知道!",
      ]),
      createElement(Counter,{},[])
    ]),
  ]);
  render(elements, document.querySelector("#root-master"));
}