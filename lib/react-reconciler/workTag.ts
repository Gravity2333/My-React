/** workTag 记录Fiber节点的类型 */
export type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText
  | typeof Fragment
  | typeof ContextProvider
  | typeof ContextConsumer
  | typeof SuspenseComponent
  | typeof OffscreenComponent
  | typeof LazyComponent
  | typeof MemoComponent;

export const FunctionComponent = 0;
export const HostRoot = 3;

export const HostComponent = 5; // 101
// <div>123</div>
export const HostText = 6; // 110
export const Fragment = 7; // 111
export const ContextProvider = 8; //1000
export const ContextConsumer = 9; //1001

// Suspense组件
export const SuspenseComponent = 13;
// 离屏组件
export const OffscreenComponent = 14;

export const LazyComponent = 16;
export const MemoComponent = 15;
