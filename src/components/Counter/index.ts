import { createElement, useEffect, useMemo, useRef, useState } from "../../../lib/react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  const testRef = useRef<any>({});
  const domRef = useRef<Element>(null);
  const countPlusTen = useMemo(() => {
    return count + 10;
  }, [count]);
  const [c,setC] = useState(0)
  setC(c+1)
  console.log("re", c);

  return createElement(
    "div",
    {
      style: cardContainerStyle,
    },
    [
      // 卡片容器
      createElement(
        "div",
        {
          style: cardStyle,
        },
        [
          // 创建按钮 +1
          createElement(
            "button",
            {
              key: "btn1",
              style: buttonStyle("green"),
              ref: domRef,
              onClick: () => {
                setCount(count+1);
              },
            },
            "+1"
          ),

          // 创建按钮 +2
          createElement(
            "button",
            {
              key: "btn2",
              style: buttonStyle("blue"),
              onClick: () => {
                setCount(count + 2);
              },
            },
            "+2"
          ),

          // 创建按钮 +3 (展示闭包陷阱)
          createElement(
            "button",
            {
              key: "btn3",
              style: buttonStyle("red"),
              onClick: () => {
                setTimeout(() => {
                  setCount(count + 3);
                }, 1000);
              },
            },
            "+3 (展示闭包陷阱 点击后延迟更新 你可以点击之后迅速点击其他的)"
          ),

          // 计数器显示
          createElement("div", {
            style: counterDisplayStyle,
          }, [
            "计数器：", 
            createElement("span", {
              style: {
                fontWeight: "bold",
                fontSize: "36px",
                color: "#333",
              },
            }, String(count)),
          ]),
        ]
      ),
    ]
  );
}

// 按钮样式函数，根据颜色返回不同样式
const buttonStyle = (color: string) => ({
  backgroundColor: color === "green" ? "#4CAF50" : color === "blue" ? "#2196F3" : "#FF5722", // 基于颜色传入不同背景色
  color: "white",
  padding: "15px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "18px",
  transition: "transform 0.2s ease, background-color 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  margin: "10px",
  display: "inline-block",
  textAlign: "center",
  width: "auto",
  maxWidth: "200px",
  lineHeight: "1.5",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  opacity: 0.9,
  ":hover": {
    transform: "scale(1.1)",
    backgroundColor: color === "green" ? "#45a049" : color === "blue" ? "#1e88e5" : "#e64a19",
  },
  ":active": {
    transform: "scale(1)",
    opacity: 1,
  },
});

// 整体卡片容器样式
const cardContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Roboto', sans-serif",
};

// 卡片样式
const cardStyle = {
  width: "350px",
  height: "400px", // 固定高度
  backgroundColor: "white",
  borderRadius: "12px", // 圆角
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // 阴影效果
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center", // 垂直居中
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  ":hover": {
    transform: "scale(1.05)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)", // 鼠标悬停时阴影更强
  },
};

// 计数器显示部分样式
const counterDisplayStyle = {
  marginTop: "30px",
  fontSize: "24px",
  color: "#333",
  fontWeight: "500",
};
