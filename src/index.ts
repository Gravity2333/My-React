import { createElement } from "../lib/React";

const element = createElement("div", { style: "color:gray;" }, [
  createElement("h2", {}, ["hello"]),
  createElement("h2", {}, ["world"]),
  createElement("div", {}, [
    createElement("a", { href: "https://www.baidu.com" }, [
      "百度一下,你就知道!",
    ]),
  ]),
]);

console.log(element)