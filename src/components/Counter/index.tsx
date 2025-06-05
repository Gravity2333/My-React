import React, { useMemo, useRef, useState } from "../../../lib/react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);
  const testRef = useRef<any>({});
  const domRef = useRef<Element>(null);
  const countPlusTen = useMemo(() => count + 10, [count]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        style={{
          width: "350px",
          height: "400px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "15px 30px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            transition: "transform 0.2s ease, background-color 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            textTransform: "uppercase",
          }}
          ref={domRef}
          onClick={() => setCount(count + 1)}
        >
          +1
        </button>

        <button
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "15px 30px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            transition: "transform 0.2s ease, background-color 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            textTransform: "uppercase",
          }}
          onClick={() => setCount(count + 2)}
        >
          +2
        </button>

        <button
          style={{
            backgroundColor: "#FF5722",
            color: "white",
            padding: "15px 30px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            transition: "transform 0.2s ease, background-color 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            textTransform: "uppercase",
          }}
          onClick={() => {
            setTimeout(() => {
              setCount((prev) => prev + 3);
            }, 1000);
          }}
        >
          +3 (展示闭包陷阱 点击后延迟更新 你可以点击之后迅速点击其他的)
        </button>

        <div
          style={{
            marginTop: "30px",
            fontSize: "24px",
            color: "#333",
            fontWeight: "500",
          }}
        >
          计数器：
          <span
            style={{
              fontWeight: "bold",
              fontSize: "36px",
              color: "#333",
            }}
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
