# My-React 项目

## 项目简介

My-React 是一个轻量级的 React 克隆实现，包含核心的 `createElement`、`useState`、`useEffect`、`useTransition` 等功能。

## 主要功能

- **虚拟 DOM 创建**: 提供 `createElement` 方法创建虚拟 DOM 结构。
- **Hooks 支持**: 实现了 `useState`、`useEffect`、`useTransition`、`useRef`、`useMemo`、`useCallback`。
- **组件管理**: 支持函数组件和类组件，提供 `forwardRef` 机制。

## 组件库使用示例

### `index.ts`

```tsx
import { createElement } from "../lib/react";
import { createRoot } from "../lib/react-dom";
import App from "./App";

const root = createRoot(document.querySelector("#root-master"));
root.render(createElement(App, {}));
```

### `app.ts`

```tsx
import { createElement, useState, useTransition } from "../lib/react";
import Counter from "./components/Counter";
import Input from "./components/Input";
import MemoComp from "./components/MemoComp";

function SlowPost() {
  const startTime = performance.now();
  while (performance.now() - startTime < 4) {}

  return createElement("h3", { style: { color: "#61dafb", fontSize: "28px", fontWeight: "700" } }, "Slow Item Render Need 4ms");
}

const PostsTab = () => {
  const items = [];
  for (let i = 0; i < 500; i++) {
    items.push(createElement(SlowPost, {}));
  }
  return items;
};

export default function App() {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<"counter" | "input" | "hugeData">("input");

  const content =
    type === "counter"
      ? createElement(Counter, {})
      : type === "input"
      ? createElement(Input, {})
      : createElement(PostsTab, {});

  return createElement("div", {}, [
    createElement("button", { key: "counter-btn", onClick: () => setType("counter") }, "计数器"),
    createElement("button", { key: "input-btn", onClick: () => setType("input") }, "输入框"),
    createElement("button", { key: "hugedata-btn", onClick: () => startTransition(() => setType("hugeData")) }, "大量数据 测试useTransition"),
    isPending ? "Loading Data..." : content,
    createElement(MemoComp, {}),
  ]);
}
```

## 代码解析

### `createElement`

```tsx
export function createElement(
  type: ReactElementType,
  props: ReactElementProps,
  ...children: ReactElementChildren[]
): ReactElement {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    ref: props.ref ? props.ref : null,
    key: props.key ? String(props.key) : null,
    props: {
      ...props,
      children:
        children?.length === 1
          ? handleChildren(children[0])
          : children.map(handleChildren),
    },
  };
}
```

### 实现的 Hooks

#### `useState`

管理组件状态，返回 `state` 及更新 `state` 的 `setState` 方法。

```tsx
export function useState<State>(initialState: (() => State) | State) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

const [count, setCount] = useState(0);
setCount(count + 1);
```

#### `useEffect`

执行副作用函数，类似于 React 的 `useEffect`。

```tsx
export function useEffect(create: EffectCallback, deps: HookDeps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}

useEffect(() => {
  console.log("组件挂载");
  return () => console.log("组件卸载");
}, []);
```

#### `useTransition`

优化高性能 UI 更新，避免长时间渲染阻塞 UI。

```tsx
export function useTransition() {
  const dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
}

const [isPending, startTransition] = useTransition();

function handleClick() {
  startTransition(() => {
    setType("hugeData");
  });
}

<button onClick={handleClick} disabled={isPending}>
  {isPending ? "Loading..." : "大量数据 测试useTransition"}
</button>
```

## 运行方式

1. **安装依赖**:
   ```sh
   npm install
   ```
2. **启动项目**:
   ```sh
   npm start
   ```

## 未来改进方向

- 支持 `useReducer`。
- 实现调度优化，提高性能。
- 兼容更多 React 特性，如 `Suspense`。

## 贡献指南

欢迎提交 Issue 和 PR 来优化该项目！

