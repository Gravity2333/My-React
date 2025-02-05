import { mountChildFiber, reconcileChildFiber } from "./childReconciler";
import { FiberNode } from "./fiber";
import { ReactElementChildren } from "../react";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTag";
import { renderWithHooks } from "./fiberHooks";
import { Lane } from "./fiberLanes";
import { Ref } from "./flags";

/** 递的过程 */
export function beginWork(wip: FiberNode, renderLane: Lane): FiberNode | null {
  // 比较，当前的fiber 和 旧的fiber
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip, renderLane);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip, renderLane);
    case Fragment:
      return updateFragment(wip);
    default:
      console.warn("beginWork未实现的类型", wip.tag);
      break;
  }
  return null;
}

/**
 * 协调当前节点和其子节点
 * @param wip
 * @param children
 */
function reconcileChildren(wip: FiberNode, children: ReactElementChildren) {
  /** 这里需要注明一下：
   * 当wip.alternate === null 的时候 也就是挂载阶段，此时children不需要添加副作用 即flags subtreeFlags delection 这些，因为当前dom中
   * 并不存在先前的节点，在completeWork阶段 会创建这些节点 并且完成福子节点之间的链接
   * 并不需要对其进行挂载等操作，由于hostRootFiber 一定有alternate节点，在prepareRefreshStack中构建，所以只在hostRootFiber中挂载即可
   */

  if (wip.alternate !== null) {
    // update阶段
    wip.child = reconcileChildFiber(wip, wip.child, children);
  } else {
    // mount阶段
    wip.child = mountChildFiber(wip, children);
  }
}

/** 处理HostRoot节点的比较 */
function updateHostRoot(wip: FiberNode, renderLane: Lane): FiberNode {
  /** 对于HostRoot节点 其memorizedState存储的是其children Element 因为其在dom/jsx中没有对应的节点，所以不存在props.children
   * 将其children放在memorizedState
   */
  const preChildren = wip.memorizedState;
  /** 获取updateQueue */
  const updateQueue = wip.updateQueue;
  /** 这里hostRoot的update由updateContainer放入，其对应的action就是其element */
  const { memorizedState: newChildren } = updateQueue.process(renderLane);

  if (newChildren === preChildren) {
    // bail out 由于hostroot不存在状态的问题 可以直接bailout TODO
  }

  /** 协调其子节点 */
  reconcileChildren(wip, newChildren);

  /** 返回下一个待处理节点 即wip.child */
  return wip.child;
}

/** 处理普通节点的比较 */
function updateHostComponent(wip: FiberNode): FiberNode {
  /** 1.获取element.children */
  const hostChildren = wip.pendingProps?.children;
  // 目前只有在HostComponent中标记Ref
  markRef(wip);
  /** 2. 协调子元素 */
  reconcileChildren(wip, hostChildren);
  /** 3.返回第一个child */
  return wip.child;
}

/** 处理函数节点的比较 */
function updateFunctionComponent(wip: FiberNode, renderLane: Lane): FiberNode {
  const nextChildElement = renderWithHooks(wip, renderLane);
  reconcileChildren(wip, nextChildElement);
  return wip.child;
}

/** 处理Fragment */
function updateFragment(wip: FiberNode): FiberNode {
  /** fragment的pendingProps就是children */
  const nextChildElement = wip.pendingProps as ReactElementChildren;
  reconcileChildren(wip, nextChildElement);
  return wip.child;
}

/** 标记Ref [生产Ref] */
function markRef(wip: FiberNode) {
  const current = wip.alternate;
  const ref = wip.ref;

  if (current === null && ref !== null) {
    // mount阶段 如果wip有ref则绑定flag
    wip.flags |= Ref;
    return;
  }

  if (current !== null && ref !== current.ref) {
    // update阶段 wip.ref和current.ref不相等 （useImmpreciatHandle改变ref）需要重新挂载ref
    wip.flags |= Ref;
    return;
  }
}
