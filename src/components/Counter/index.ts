import { createElement, useMemo, useRef, useState } from "../../../lib/react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);
  const testRef = useRef<any>({});
  const domRef = useRef<Element>(null);
  const countPlusTen = useMemo(() => {
    return count + 10;
  }, [count]);
  console.log("counter re", countPlusTen);
  return createElement(
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
        ref: domRef,
        onClick: () => {
          setCount((prev) => {
            testRef.current = prev;
            return prev + 1;
          });
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
  );
}
