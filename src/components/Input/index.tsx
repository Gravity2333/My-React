import React,{ useDeferedValue, useState } from "../../../lib/react";

function SlowPost({ index }: { index: number }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {}

  return (
    <h3
      style={{
        color: "#61dafb",
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "10px",
      }}
    >
      Slow Item Render Need 1ms
    </h3>
  );
}

const PostsTab = function PostsTab({ len = 0 }: { len: number }) {
  const items = [];
  for (let i = 0; i < len * 100; i++) {
    //@ts-ignore
    items.push(<SlowPost key={i} index={i} />);
  }
  return <>{items}</>;
};

export default function Input() {
  console.log("input re");
  const [appMessage, setAppMessage] = useState<string>("测试输入框内容同步");
  const deferedAppMessage = useDeferedValue(appMessage);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <input
        onInput={(e) => setAppMessage((e.target as HTMLInputElement).value)}
        value={appMessage}
        style={{
          display: "block",
          width: "100%",
          padding: "16px",
          fontSize: "18px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          backgroundColor: "#f9f9f9",
          color: "#333",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          outline: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
        placeholder="请输入内容"
      />
      <div
        style={{
          marginTop: "20px",
          fontSize: "18px",
          color: "#333",
        }}
      >
        {appMessage}
      </div>
      {/* <div style={{ color: "gray" }}>defered: {deferedAppMessage}</div>
      <PostsTab len={deferedAppMessage.length} /> */}
    </div>
  );
}
