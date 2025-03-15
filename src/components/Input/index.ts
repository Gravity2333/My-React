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
  for (let i = 0; i < len * 100; i++) {
    items.push(createElement(SlowPost, {}));
  }
  return items;
};

export default function Input() {
  console.log("input re");
  const [appMessage, setAppMessage] = useState<string>("测试输入框内容同步");
  const deferedAppMessage = useDeferedValue(appMessage);
  return createElement(
    "div",
    { style: containerStyle },
    createElement("input", {
      onInput: (e) => {
        setAppMessage(e.target.value);
      },
      value: appMessage,
      style: inputStyle,
      placeholder: "请输入内容",
    }),
    createElement("div", {
      style: { marginTop: "20px", fontSize: "18px", color: "#333" },
    }, appMessage),
    // createElement(
    //   "div",
    //   { style: { color: "gray" } },
    //   "defered:" + deferedAppMessage
    // ),
    // createElement(PostsTab, { len: deferedAppMessage.length })
  );
}

// 输入框样式
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "16px",
  fontSize: "18px",
  borderRadius: "8px", // 圆角
  border: "1px solid #ccc", // 边框颜色
  boxSizing: "border-box",
  backgroundColor: "#f9f9f9", // 浅灰背景
  color: "#333", // 深色文本
  transition: "border-color 0.3s ease, box-shadow 0.3s ease", // 平滑过渡效果
  outline: "none", // 去掉默认的输入框高亮
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 阴影效果
  marginBottom: "20px", // 底部间距
};

// 输入框聚焦时样式
const inputFocusStyle = {
  borderColor: "#61dafb", // 聚焦时的边框颜色
  boxShadow: "0 0 8px rgba(0, 122, 255, 0.4)", // 聚焦时的阴影
};

// 容器样式
const containerStyle = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "12px", // 卡片的圆角
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", // 外部阴影
  fontFamily: "'Roboto', sans-serif",
};
