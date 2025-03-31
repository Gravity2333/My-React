/** 处理context相关 */

import { Context } from "../react/context";
import { markWipReceiveUpdate } from "./beginwork";
import { FiberNode } from "./fiber";
import { isSubsetOfLanes, Lane, mergeLane, NoLanes } from "./fiberLanes";
import { ContextProvider } from "./workTag";

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

/** context在dependencies中以链表的方式连接 其链表项为 ContextItem */
export type ContextItem<T> = {
  context: Context<T>;
  next: ContextItem<T>;
  memorizedState: T;
};

/** 上一个dependency */
let lastContextDepItem: ContextItem<any> | null = null;

/** readContext之前的准备工作  每次函数调用之前执行 重新设置dependencies*/
export function prepareToReadContext(wip: FiberNode, renderLane: Lane) {
  lastContextDepItem = null; // 置空
  if (wip.dependencies !== null) {
    if (isSubsetOfLanes(wip.dependencies.lanes, renderLane)) {
      // 当前函数组件内的Context 包含当前renderLane更新优先级的更新
      markWipReceiveUpdate(); // 当前函数组件 不能bailout
    }
    wip.dependencies = null; // 置空
  }
}

/** 获取context内容
 *  还需要生成新的dependencies
 */
export function readContextImpl<T>(consumer: FiberNode, context: Context<T>) {
  if (!consumer) {
    throw new Error("useContext Error: 请不要在函数组件外部调用hooks");
  }
  // 建立新的dependencies
  const contextItem: ContextItem<T> = {
    context,
    next: null,
    memorizedState: context._currentValue,
  };

  // 绑定到consumer
  if (lastContextDepItem === null) {
    // 第一个contextItem
    consumer.dependencies = {
      firstContext: contextItem,
      lanes: NoLanes,
    };

    lastContextDepItem = contextItem;
  } else {
    // 不是第一个
    lastContextDepItem = lastContextDepItem.next = contextItem;
  }

  return context._currentValue;
}

/** 传播context变化 */
export function propagateContextChange(
  wip: FiberNode,
  context: Context<any>,
  renderLane: Lane
) {
  let nextFiber = wip.child;
  while (nextFiber !== null && nextFiber !== wip) {
    const deps = nextFiber.dependencies;
    if (deps) {
      let contextItem = deps.firstContext;
      while (contextItem !== null) {
        if (contextItem.context === context) {
          // 找到对应的Context 设置lane
          // 设置fiber和alternate的lane
          nextFiber.lanes = mergeLane(nextFiber.lanes, renderLane);
          if (nextFiber.alternate !== null) {
            nextFiber.alternate.lanes = mergeLane(
              nextFiber.alternate.lanes,
              renderLane
            );
          }
          // 从当前Fiber到Provide的Fiber 标记childLanes
          scheduleContextOnParentPath(nextFiber, wip, renderLane);
          // 设置deps.lane
          deps.lanes = mergeLane(deps.lanes, renderLane);
          // break
          break;
        }else{
          contextItem =contextItem.next
        }
      }
    } else if (
      ((nextFiber.tag === ContextProvider && nextFiber.type !== wip.type) ||
        nextFiber.tag !== ContextProvider) &&
      nextFiber.child !== null
    ) {
      nextFiber = nextFiber.child;
      continue;
    }
    // 回溯
    while (nextFiber.sibling === null) {
      if (nextFiber.return === null || nextFiber.return === wip) {
        break;
      }
      nextFiber = nextFiber.return;
    }

    nextFiber = nextFiber.sibling;
  }
}

/** 在parent路径上调度Context
 * 从当前找到context的节点，到provider节点 标记childLanes
 */
function scheduleContextOnParentPath(
  from: FiberNode,
  to: FiberNode,
  renderLane: Lane
) {
  if (from === to) return;
  let parentNode = from.return;
  while (parentNode !== null && from !== to) {
    parentNode.childLanes = mergeLane(parentNode.childLanes, renderLane);
    if (parentNode.alternate !== null) {
      parentNode.alternate.childLanes = mergeLane(
        parentNode.alternate.childLanes,
        renderLane
      );
    }
    parentNode = parentNode.return;
  }
}
