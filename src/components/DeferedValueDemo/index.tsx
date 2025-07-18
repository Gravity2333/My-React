import React, { memo, useDeferedValue, useMemo, useState } from "../../../lib/react";

const bigList = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `item ${i + 1}`,
}));

const BigListItem = memo(({ id, name }) => {
  const itemStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid #eaeaea",
    display: "flex",
    alignItems: "center",
    fontFamily: "sans-serif",
    fontSize: "14px",
    backgroundColor: id % 2 === 0 ? "#fafafa" : "#fff",
    transition: "background 0.3s",
    cursor: "pointer",
  };

  const indexStyle = {
    color: "#888",
    marginRight: "8px",
    minWidth: "40px",
    textAlign: "right",
  };

  const nameStyle = {
    fontWeight: 500,
    color: "#333",
  };

  return (
    <li style={itemStyle} onMouseOver={() => {}}>
      <span style={indexStyle}>{id + 1}.</span>
      <span style={nameStyle}>{name}</span>
    </li>
  );
})

export default function DeferedValueDemo() {
  const [searchValue, setsearchValue] = useState<string>("");

  const deferedSearchValue = useDeferedValue(searchValue);

  const showList = useMemo(() => {
    if (!deferedSearchValue) return bigList;
    return bigList.filter((i) => i.name?.includes(deferedSearchValue));
  }, [deferedSearchValue]);
  console.log("defered内容:", deferedSearchValue, searchValue);
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
        onInput={(e) => setsearchValue((e.target as HTMLInputElement).value)}
        value={searchValue}
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
        <div> 搜索框输入内容: {searchValue}</div>
        <div> defered内容: {deferedSearchValue}</div>
      </div>
      <h2>列表</h2>
      <h2>查找到 {showList.length} 条</h2>
      {showList.map((i) => (
        <BigListItem {...i} />
      ))}
    </div>
  );
}
