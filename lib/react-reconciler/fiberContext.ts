/** 处理context相关 */

import { Context } from "../react/context";
import { FiberNode } from "./fiber";

/**
 * 对于
 * Provider1 初始化为 'provider1 init'
 * Provider2 初始化为 'provider2 init'
 *
 * <Provider1 value={provider1 new}>
 *  <Provider2 value={provider2 new}>
 *          consumer
 *  </Provider2>
 *</Provider1>
 * 此时，beginWork到第一层Provider时，prevContextValueStack.push(prevContextValue) -> [null]
 * prevContextValue = provider第一层._context._currentValue =  'provider1 init'
 * provider第一层._context._currentValue = "provider1 new"
 *
 * beginWork到第二层时，此时prevContextvalueStack.push(prevContextValue) -> [null,'provider1 init']
 * prevContextValue = provider第二层._context._currentValue = 'provider2 init'
 * provider第二层._context._currentValue = provider2 new
 *
 * 此时 消费Provider1 为 provider1._context._currentValue = provider1 new
 * 此时 消费Provider2 为 provider2._context._currentValue = provider2 new
 *
 * completeWork到第二层Provider2时
 * provider2._context._currentValue = prevContextValue = 'provider2 init'
 * prevContextValue = prevContextValueStack.pop = 'provider1 init'
 * 此时 访问Provider2 其_currenValue => 'provider2 init'
 * 访问Provier1 其_currentValue 还是"provider2 new"
 *
 * completetwork到provider1时
 * 此时 provider1._context._currentValue = prevContextValue = "provider1 init"
 * prevContextValue = prevContextValueStack.pop = null
 * 此时，访问provider1 其currentValue为 "provider1 init"
 */

/**
 * 用来记录上一个context的值
 */
let prevContextValue: any = null;

/**
 * 用来记录prevContextValue的栈
 * 当Context嵌套的时候，会把上一个prevContextValue push到stack中
 *
 */
const prevContextValueStack: any[] = [];

/** 推入context beginwork调用 */
export function pushContext(context: Context<any>, newValue: any) {
  // 保存prevContextValue
  prevContextValueStack.push(prevContextValue);

  // 保存currentValue
  prevContextValue = context._currentValue;

  // 给context设置newValue
  context._currentValue = newValue;
}

/** 弹出context completetwork调用 */
export function popContext(context: Context<any>) {
  /** 从prevContextValue恢复context的值 */
  context._currentValue = prevContextValue;

  /** 从prevContextValueStack恢复prevContextValue的值 */
  prevContextValue = prevContextValueStack.pop();
}

export function readContextImpl<T>(consumer: FiberNode, context: Context<T>) {
  if (!consumer) {
    throw new Error("useContext Error: 请不要在函数组件外部调用hooks");
  }
  return context._currentValue;
}
