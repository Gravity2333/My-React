# My-React 项目

## 项目简介

My-React 是一个轻量级的 React 克隆实现，包含核心的 `createElement`、`useState`、`useEffect`、`useTransition` 等功能。

本项目简化了React关键逻辑，实现清晰易懂，并且附加详细注释

## 主要功能

- **虚拟 DOM 创建**: 提供 `createElement` 方法创建虚拟 DOM 结构。
- **Hooks 支持**: 实现了 `useState`、`useEffect`、`useTransition`、`useRef`、`useMemo`、`useCallback`。
- **组件管理**: 支持函数组件和类组件，提供 `forwardRef` 机制。

## 代码解析

### `createElement` 方法

`createElement` 用于创建 ReactElement，并对 `children` 进行处理。

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

// 使用示例
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

// 使用示例
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

// 使用示例
const [isPending, startTransition] = useTransition();
function handleClick() {
  startTransition(() => {
    setData(newData);
  });
}

<button onClick={handleClick} disabled={isPending}>
  {isPending ? "Loading..." : "更新数据"}
</button>
```

#### `useMemo`

缓存计算结果，避免不必要的重新计算。

```tsx
export function useMemo<T>(nextCreate: () => T, deps: HookDeps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useMemo<T>(nextCreate, deps);
}

// 使用示例
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

#### `useCallback`

缓存回调函数，避免不必要的重新创建。

```tsx
export function useCallback<T>(callback: T, deps: HookDeps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useCallback<T>(callback, deps);
}

// 使用示例
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

#### `useRef`

创建一个可变的 ref 对象，不会触发组件重新渲染。

```tsx
export function useRef<T>(initialValue: T) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useRef<T>(initialValue);
}

// 使用示例
const inputRef = useRef(null);
<input ref={inputRef} />;
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

