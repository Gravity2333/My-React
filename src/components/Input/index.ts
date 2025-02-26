import { createElement, useDeferedValue, useState } from "../../../lib/react";
function SlowPost({ index }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {}

  return createElement(
    "h3",
    {
      style: {
        color: "#61dafb", // React 蓝色
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "10px",
      },
    },
    "Slow Item Render Need 1ms"
  );
}

const PostsTab = function PostsTab({ len = 0 }: { len: number }) {
  const items = [];
  for (let i = 0; i < len*100; i++) {
    items.push(createElement(SlowPost, {}));
  }
  return items;
};

export default function Input() {
  console.log("input re");
  const [appMessage, setAppMessage] = useState<string>("loading...");
  const deferedAppMessage = useDeferedValue(appMessage);
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
    appMessage,
    // createElement(
    //   "div",
    //   { style: { color: "gray" } },
    //   "defered:" + deferedAppMessage
    // ),
    // createElement(PostsTab, { len: deferedAppMessage.length })
  );
}
