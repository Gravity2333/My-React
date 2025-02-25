import { Action, Dispatch } from "../react-reconciler/updateQueue";
import { EffectCallback, HookDeps } from "../react-reconciler/fiberHooks";

export interface Dispatcher {
  useState: <T>(initialState: T | (() => T)) => [T, Dispatch<T>];
  useEffect: (create: EffectCallback, deps: HookDeps) => EffectCallback | void;
  useTransition: () => [boolean, (callback: () => void) => void];
  useDeferedValue: <T>(T) => T;
  useRef: <T>(initialValue: T) => { current: T };
  useMemo: <T>(nextCreate: () => T, deps: HookDeps) => T;
  useCallback: <T>(callback: T, deps: HookDeps) => T;
}

/** 共享的 当前的Dispatcher */
export const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

/** 解析 返回dispatcher */
export function resolveDispatcher(): Dispatcher {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error("无法在函数组件外部使用hooks");
  }
  return dispatcher;
}
