import { createElement, useState } from "../../../lib/react";

export default function Input() {
  console.log('input re')
  const [appMessage, setAppMessage] = useState<string>("loading...");
  
  return createElement(
    "div",
    {},
    createElement("input", {
      onInput: (e) => {
        setAppMessage(e.target.value);
      },
      value: appMessage,
      style: {
        display: "block",
        width: "100%",
      },
      placeholder: "请输入内容",
    }),
    appMessage
  );
}