import React, { useState, useTransition } from "../lib/react";
import Counter from "./components/Counter";
import Input from "./components/Input";
import MemoComp from "./components/MemoComp";
import ContextDemo from "./Pages/ContextDemo";
import WelcomePage from "./Pages/Welcome";

async function fetchMockMessage(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Message From Mock Fetch!!!");
    }, 1000);
  });
}

function SlowPost({ index }: { index: number }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 4) {}

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f3f3f3",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "15px",
        fontSize: "16px",
        fontWeight: 600,
        color: "#333",
        textAlign: "center",
      }}
    >
      Slow Item Render Need 4ms
    </div>
  );
}

const PostsTab = () => {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        // @ts-ignore
        <SlowPost key={i} index={i} />
      ))}
    </>
  );
};

const App = () => {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<
    "welcome" | "counter" | "input" | "hugeData" | "context"
  >("welcome");

  const content = (() => {
    switch (type) {
      case "welcome":
        return <WelcomePage />;
      case "counter":
        return <Counter />;
      case "input":
        return <Input />;
      case "context":
        return <ContextDemo />;
      case "hugeData":
        return <PostsTab />;
      default:
        return null;
    }
  })();

  return (
    <>
      <nav style={navContainerStyle}>
        <ul style={menuStyle}>
          {menuItems.map(({ key, label, value }) => (
            <li
              key={key}
              onClick={() =>
                ["hugeData", "context"].includes(value)
                  ? startTransition(() => setType(value as any))
                  : setType(value as any)
              }
              style={menuItemStyle}
            >
              {label}
            </li>
          ))}
        </ul>
      </nav>
      <div style={contentContainerStyle}>
        {isPending ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              color: "#888",
              marginTop: "20px",
            }}
          >
            Loading Data...
          </div>
        ) : (
          content
        )}
      </div>
      <MemoComp style={memoCompStyle} />
    </>
  );
};

const menuItems = [
  { key: "welcome-menu", label: "Welcome", value: "welcome" },
  { key: "counter-menu", label: "计数器", value: "counter" },
  { key: "input-menu", label: "输入框", value: "input" },
  {
    key: "hugedata-menu",
    label: "大量数据 测试useTransition",
    value: "hugeData",
  },
  { key: "context-menu", label: "测试Context", value: "context" },
];

const menuItemStyle = {
  listStyle: "none",
  padding: "10px 20px",
  fontSize: "18px",
  fontWeight: 500,
  cursor: "pointer",
  color: "#fff",
  textTransform: "uppercase",
  transition: "background-color 0.3s, color 0.3s",
  margin: "0 15px",
  borderRadius: "5px",
  display: "inline-block",
};

const navContainerStyle = {
  backgroundColor: "#333",
  padding: "10px 0",
  position: "sticky",
  top: "0",
  zIndex: 100,
};

const menuStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0",
  padding: "0",
};

const contentContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  height: "calc(100% - 93px)",
  backgroundColor: "#f5f5f5",
  fontFamily: "'Arial', sans-serif",
  overflow: "auto",
};

const memoCompStyle = {
  padding: "20px",
  marginTop: "30px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

export default App;
