import { createElement, useEffect, useState, useTransition } from "../lib/react";

async function fetchMockMessaage(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Message From Mock Fetch!!!");
    }, 1000);
  });
}

function SlowPost({ index }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 4) { }

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
    "Slow Item Render Need 4ms"
  );
}

const PostsTab = function PostsTab() {
  const items = [];
  for (let i = 0; i < 500; i++) {
    items.push(createElement(SlowPost, {}));
  }
  return items;
};

export default function App() {
  const [count, setCount] = useState<number>(0);

  const [isPending, startTransition] = useTransition()

  const [appMessage, setAppMessage] = useState<string>(
    "loading..."
  );

  const [type, setType] = useState<"counter" | "input" | 'hugeData'>("input");

  // useEffect(() => {
  //   console.log("app mount");
  //   (async () => {
  //     setAppMessage(await fetchMockMessaage())
  //   })();
  //   return () => {
  //     console.log("app unmount");
  //   };
  // }, []);

  const content = type === "counter"
    ? createElement(
      "div",
      {
        style: {
          backgroundColor: "lightgray",
        },
      },
      // 创建按钮 +1
      createElement(
        "button",
        {
          key: "btn1",
          style: {
            backgroundColor: "#4CAF50", // 绿色
            color: "white",
            padding: "12px 25px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          },
          onClick: () => {
            setCount((prev) => prev + 1);
          },
          onMouseEnter: (e) => {
            e.target.style.transform = "scale(1.1)";
          },
          onMouseLeave: (e) => {
            e.target.style.transform = "scale(1)";
          },
        },
        "+1"
      ),

      // 创建按钮 +2
      createElement(
        "button",
        {
          key: "btn2",
          style: {
            backgroundColor: "#2196F3", // 蓝色
            color: "white",
            padding: "12px 25px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          },
          onClick: () => {
            setCount((prev) => prev + 2);
          },
          onMouseEnter: (e) => {
            e.target.style.transform = "scale(1.1)";
          },
          onMouseLeave: (e) => {
            e.target.style.transform = "scale(1)";
          },
        },
        "+2"
      ),

      createElement("div", {}, "计数器：", String(count))
    )
    : type === "input" ? createElement(
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
    ) : createElement(PostsTab, {})

  // return createElement(
  //   "div", // 最外层容器
  //   {
  //     style: {
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       minHeight: "100vh",
  //       backgroundColor: "#f7f7f7", // 背景色
  //       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  //       color: "#333",
  //     },
  //   },

  //   createElement(
  //     "div", // 创建一个卡片容器
  //     {
  //       style: {
  //         backgroundColor: "#fff",
  //         padding: "40px 50px",
  //         borderRadius: "10px",
  //         boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)", // 阴影效果
  //         width: "600px",
  //         textAlign: "center",
  //         animation: "fadeIn 1s ease-in-out",
  //       },
  //     },
  //     // 标题部分
  //     createElement(
  //       "h1",
  //       {
  //         style: {
  //           color: "#61dafb", // React 蓝色
  //           fontSize: "28px",
  //           fontWeight: "700",
  //           marginBottom: "10px",
  //         },
  //       },
  //       "Welcome to MyReact Demo"
  //     ),

  //     // 描述文本
  //     createElement(
  //       "p",
  //       {
  //         style: {
  //           color: "#666",
  //           fontSize: "18px",
  //           marginBottom: "30px",
  //           lineHeight: "1.6",
  //         },
  //       },
  //       "This is a simple page built using MyReact. Below are two interactive buttons."
  //     ),



  //     // 底部文本
  //     createElement(
  //       "p",
  //       {
  //         style: {
  //           color: "#888",
  //           fontSize: "14px",
  //           marginTop: "30px",
  //           fontStyle: "italic",
  //         },
  //       },
  //       "Created with MyReact. Enjoy!"
  //     )
  //   )
  // );

  return createElement('div', {}, [
    createElement(
      "button",
      {
        onClick: () => {
          setType('counter');
        },
      },
      '计数器'
    ),

    createElement(
      "button",
      {
        onClick: () => {
          setType('input');
        },
      },
      '输入框'
    ),

    createElement(
      "button",
      {
        onClick: () => {
          startTransition(() => {
            setType('hugeData');
          })
        },
      },
      '大量数据 测试useTransition'
    ),
    isPending?'Loading Data...':content,
  ])
}
