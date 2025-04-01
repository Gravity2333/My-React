import React, { memo } from "../../../lib/react";

const MemoComp= memo(() => {
  console.log("memo rerender!");
  return (
    <div
      style={{
        backgroundColor: "lightgray",
        color: "white",
        fontSize: "16px",
      }}
    >
      MEMO COMPONENT （when menu change, this component never rerender）
    </div>
  );
});

export default MemoComp;