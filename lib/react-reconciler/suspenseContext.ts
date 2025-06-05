import { FiberNode } from "./fiber";

/** 用来记录Suspense上下文 */

const SUSPENSE_CONTEXTS: FiberNode[] = [];

/** 获取最近的Suspense */
export function getNearestSuspenseFiber() {
  if (SUSPENSE_CONTEXTS.length === 0) return null;
  return SUSPENSE_CONTEXTS[SUSPENSE_CONTEXTS.length - 1];
}

/** 推入 suspense [beginWork] */
export function pushSuspenseFiber(suspense: FiberNode) {
  SUSPENSE_CONTEXTS.push(suspense);
}
/** 弹出 suspense [completeWork , unwindWork] */
export function popSuspenseFiber() {
  SUSPENSE_CONTEXTS.pop();
}
