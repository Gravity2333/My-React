import { createElement, useState, useTransition } from "../lib/react";
import { REACT_FRAGMENT_TYPE } from "../lib/share/ReactSymbols";
import Counter from "./components/Counter";
import Input from "./components/Input";
import MemoComp from "./components/MemoComp";
import WelcomePage from "./Pages/Welcome";

async function fetchMockMessaage(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Message From Mock Fetch!!!");
    }, 1000);
  });
}

export function SlowPost({ index }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 4) { }

  return createElement(
    "div",
    {
      style: {
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f3f3f3",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "15px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
      },
    },
    "Slow Item Render Need 4ms"
  );
}

export const PostsTab = function PostsTab() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(createElement(SlowPost, {}));
  }
  return items;
};

export default function App() {
  const [isPending, startTransition] = useTransition();
  console.log("app re");
  const [type, setType] = useState<"welcome" | "counter" | "input" | "hugeData">("welcome");

  const content =
    type === "welcome" ?
      createElement(WelcomePage, {})
      : type === "counter"
        ? createElement(Counter, {})
        : type === "input"
          ? createElement(Input, {})
          : createElement(PostsTab, {});

  return createElement(REACT_FRAGMENT_TYPE, {}, [
    // 简洁的菜单 (横向菜单)
    createElement(
      "nav",
      {
        style: navContainerStyle,
      },
      [
        createElement(
          "ul",
          {
            style: menuStyle,
          },
          [
            createElement(
              "li",
              {
                key: "welcome-menu",
                onClick: () => setType("welcome"),
                style: menuItemStyle,
              },
              "Weclome"
            ),
            createElement(
              "li",
              {
                key: "counter-menu",
                onClick: () => setType("counter"),
                style: menuItemStyle,
              },
              "计数器"
            ),
            createElement(
              "li",
              {
                key: "input-menu",
                onClick: () => setType("input"),
                style: menuItemStyle,
              },
              "输入框"
            ),
            createElement(
              "li",
              {
                key: "hugedata-menu",
                onClick: () => {
                  startTransition(() => {
                    setType("hugeData");
                  });
                },
                style: menuItemStyle,
              },
              "大量数据 测试useTransition"
            ),
          ]
        ),
      ]
    ),

    // 内容展示区域，放置在屏幕中心，占满屏幕
    createElement(
      "div",
      {
        style: contentContainerStyle,
      },
      [
        isPending ? (
          createElement(
            "div",
            {
              style: {
                textAlign: "center",
                fontSize: "18px",
                color: "#888",
                marginTop: "20px",
              },
            },
            "Loading Data..."
          )
        ) : (
          content
        ),
      ]
    ),

    // MemoComp 部分
    createElement(MemoComp, { style: memoCompStyle }),
  ]);
}

// 导航菜单项样式
const menuItemStyle = {
  listStyle: "none",
  padding: "10px 20px",
  fontSize: "18px",
  fontWeight: "500",
  cursor: "pointer",
  color: "#fff",
  textTransform: "uppercase",
  transition: "background-color 0.3s, color 0.3s",
  margin: "0 15px",
  borderRadius: "5px",
  display: "inline-block", // 水平排列菜单项
};

// 菜单容器样式
const navContainerStyle = {
  backgroundColor: "#333", // 深色背景
  padding: "10px 0",
  position: "sticky",
  top: "0",
  zIndex: "100",
};

// 菜单样式
const menuStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0",
  padding: "0",
};

// 内容区域样式 - 居中且占满屏幕
const contentContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  height: 'calc( 100% - 93px )',
  backgroundColor: "#f5f5f5", // 背景色可以设置为浅灰色或自定义
  fontFamily: "'Arial', sans-serif",
  overflow: 'auto',
};

// MemoComp 样式
const memoCompStyle = {
  padding: "20px",
  marginTop: "30px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

// Hover 动画 (菜单项悬停效果)
menuItemStyle[':hover'] = {
  backgroundColor: "#4CAF50", // 按钮背景色悬停变化
  color: "#fff", // 文字颜色悬停变化
};
