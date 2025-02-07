import {
  cloneChildFibers,
  mountChildFiber,
  reconcileChildFiber,
} from "./childReconciler";
import { FiberNode } from "./fiber";
import { ReactElementChildren } from "../react";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  MemoComponent,
} from "./workTag";
import { bailoutHook, renderWithHooks } from "./fiberHooks";
import { includeSomeLanes, Lane, NoLane } from "./fiberLanes";
import { Ref } from "./flags";
import shallowEqual from "../utils/shallowEqual";

/** 是否收到更新 默认为false 即没有更新 开启bailout */
let didReceiveUpdate: boolean = false;

/** 标记当前wip存在更新 不能bailout
 * 导出接口 方便其他模块 （hooks） 使用 */
export function markWipReceiveUpdate() {
  didReceiveUpdate = true;
}

/** 递的过程 */
export function beginWork(wip: FiberNode, renderLane: Lane): FiberNode | null {
  /** bailout策略
   *  四要素
   *  1. props相等
   *  2. state相等 （无update -> update结果不变）
   *  3. type相等
   *  4. context相等 TODO
   */
  // 重置didReceiveUpdate
  didReceiveUpdate = false;

  // 获取current
  const current = wip.alternate;

  if (current !== null) {
    /** 更新模式下 才检查是否bailout */
    /** 检查props和type */
    const prevProps = current.memorizedProps;
    const wipProps = wip.pendingProps;
    /**
     * 注意 bailout的props直接检查对象地址是否相等
     * 如果父节点存在更新 那么子节点无法bailout 需要通过childReconcile创建
     * 那么子节点的 props一定和current.props不一样 因为createElement中传入的对象也不是相同地址 比如
     * current createElement('div',{a:100}) -父节点不同，导致reconcilechild-> createElement('div',{a:100})
     * 注意 虽然都是{a:100} 但是两个对象来源于两次render 其对象地址不同，这也就导致如果父节点没能bailout 子节点也无法bailout 就必须使用memo来shallowEqual
     */
    if (prevProps !== wipProps || current.type !== wip.type) {
      // 检查不通过
      didReceiveUpdate = true;
    } else {
      // 如果props和type都检查通过 检查state和context TODO
      if (!checkUpdate(wip, renderLane)) {
        // 进入bailout
        didReceiveUpdate = false;
        return bailoutOnAlreadyFinishedWork(wip, renderLane);
      }
    }
  }

  /** 给wip.lanes 置空
   *  当存在跳过的update时，processQueue的onSkipUpdate回调会返回跳过的lane 再次加上即可
   */
  wip.lanes = NoLane;

  // 比较，当前的fiber 和 旧的fiber
  switch (wip.tag) {
    case Fragment:
      return updateFragment(wip);
    case MemoComponent:
      return updateMemoComponent(wip, renderLane);
    case HostRoot:
      return updateHostRoot(wip, renderLane);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip, wip.type as Function, renderLane);
    default:
      console.warn("beginWork未实现的类型", wip.tag);
      break;
  }
  return null;
}

/** 检查是否存在更新 即检查wip.lanes 是否包含当前renderLane */
function checkUpdate(wip: FiberNode, renderLane: Lane) {
  // 注意 这里不要用wip.lanes直接检查，因为checkUpdate 也会在 wip.lanes = NoLane 之后调用，比如Memo中
  // 此时wip.lanes可能为NoLane 所以需要使用在enqueueUpdate中同步的 current.lanes
  const current = wip.alternate;
  if (current !== null && includeSomeLanes(current.lanes, renderLane)) {
    return true;
  }

  return false;
}

/** 进一步bailout
 *  1. 如果childLanes也不包含renderLane 表示已经没有更新了 直接返回null 进入completework阶段
 *  2. 如果childLanes还包含renderLane 表示还有更新 但是此wip节点可以直接复用子节点
 */
function bailoutOnAlreadyFinishedWork(wip: FiberNode, renderLane: Lane) {
  /** 判断childLanes */
  if (!includeSomeLanes(wip.childLanes, renderLane)) {
    return null;
  }

  /** clone节点 */
  cloneChildFibers(wip);
  return wip.child;
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
    // bailout
    bailoutOnAlreadyFinishedWork(wip, renderLane);
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
function updateFunctionComponent(
  wip: FiberNode,
  Component: Function,
  renderLane: Lane
): FiberNode {
  // renderWithHooks 中检查，如果状态改变 则置didReceiveUpdate = true
  const nextChildElement = renderWithHooks(wip, Component, renderLane);
  if (wip.alternate !== null && !didReceiveUpdate) {
    // bailout
    // 重置hook
    bailoutHook(wip, renderLane);
    return bailoutOnAlreadyFinishedWork(wip, renderLane);
  }
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

/** 更新MemoComponent */
function updateMemoComponent(wip: FiberNode, renderLane: Lane) {
  // 需要检验四要素 type state(update) props context(TODO)
  // 运行到此 type一定是相等的 需要判断state props context

  const current = wip.alternate;
  if (current !== null) {
    // update阶段才bailout检查
    const oldProps = current.pendingProps;
    const newProps = wip.pendingProps;

    // Props默认需要用ShallowEqual判断 可以传入compare函数替换
    const compare = (wip.type as any).compare || shallowEqual;

    if (compare(oldProps, newProps)) {
      // 判断state context
      if (!checkUpdate(wip, renderLane)) {
        // 需要bailout
        didReceiveUpdate = false;
        // 重置props 注意 这里的oldProps newProps地址不一定一样
        wip.pendingProps = oldProps;
        // 重置当前lane
        // 推出之后 需要恢复lanes
        wip.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(wip, renderLane);
      }
    }
  }

  // 如果不能bailout 执行函数
  const Component = (wip.type as any).type;
  return updateFunctionComponent(wip, Component, renderLane);
}
