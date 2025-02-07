import { createElement, memo } from "../../../lib/react";

export default memo(function MemoComp() {
  console.log('memo rerender!')
  return createElement(
    "div",
    {
      style: {
        backgroundColor: "lightgray", // 绿色
        color: "white",
        fontSize: "16px",
      },
    },
    "MEMO COMPONENT （when menu change， this component never rerender）"
  );
},
// compare 函数可以不传递
// ()=>true
);
