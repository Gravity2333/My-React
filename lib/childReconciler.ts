import {
  creareFiberFromElement,
  createWorkInProgress,
  FiberNode,
} from "./fiber";
import { ChildDeletion } from "./flags";
import { ReactElement, ReactElementProps } from "./React";
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "./ReactSymbols";
import { Fragment, HostText } from "./workTag";

/**
 * 协调子节点  用闭包的方式存储处理函数
 * @param shouldTrackEffect 是否追踪副作用
 */
function childReconciler(shouldTrackEffect: boolean) {
  /**
   *  删除子节点
   * @param returnFiber 父节点
   * @param childToDelete 待删除的子节点
   * @returns
   */
  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
    // 不需要标记副作用
    if (!shouldTrackEffect) return;
    if (!returnFiber.delections) {
      // 当前returnFiber下 没有等待删除的节点
      returnFiber.delections = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      // 当前returnFiber下 已经有等待删除的节点 就不用重复设置flags了
      returnFiber.delections.push(childToDelete);
    }
  }
  /**
   * 批量删除剩余的子节点
   * @param returnFiber 父节点
   * @param remainingFirstChild 剩余待删除的子节点中的第一个
   */
  function deleteRemainingChildren(
    returnFiber: FiberNode,
    remainingFirstChild: FiberNode
  ) {
    // 不需要标记副作用
    if (!shouldTrackEffect) return;
    while (remainingFirstChild !== null) {
      deleteChild(returnFiber, remainingFirstChild);
      remainingFirstChild = remainingFirstChild.sibling;
    }
  }
  /** 处理多个子节点的情况 */
  function reconcileArray(
    wip: FiberNode,
    currentChild: FiberNode,
    newChild: ReactElement[]
  ): FiberNode {
    return 
  }

  /** 处理单个子节点的情况 */
  function reconcileSingle(
    wip: FiberNode,
    currentChild: FiberNode,
    newChild: ReactElement
  ): FiberNode {
    /** 先判断  如果element类型不对，直接报错 */
    if (newChild.$$typeof !== REACT_ELEMENT_TYPE) {
      throw new Error("[object] is not a valid react element!");
    }

    while (currentChild !== null) {
      // 先判断key
      if (newChild.key === currentChild.key) {
        // 再判断类型
        if (newChild.type === currentChild.type) {
          // 类型和key都一样，可以复用
          let pendingProps = newChild.props;
          // 判断 是不是Fragment类型
          if (newChild.type === REACT_FRAGMENT_TYPE) {
            // 设置props,element元素的props就是children 不支持其他的props
            pendingProps = newChild.props.children;
          }
          const existingFiber = useFiber(currentChild, pendingProps);
          existingFiber.return = wip;
          // 找到节点，删除剩下的节点
          deleteRemainingChildren(wip, currentChild.sibling);
          return existingFiber;
        }
      }
      // 删除当前节点
      deleteChild(wip, currentChild);
      // 设置下一个 childFiber
      currentChild = currentChild.sibling;
    }

    // 都没摘到key和type都相同的 创建
    const newFiber = creareFiberFromElement(newChild);
    newFiber.return = wip;
    return newFiber;
  }

  /** 处理文本子节点的情况 */
  function reconcileTextNode(
    wip: FiberNode,
    currentChild: FiberNode,
    content: string | number
  ): FiberNode {
    /** 遍历wip的child fiber 找到一个tag为HostText的 使用useFiber复用，并且标记其他的为可删除 */
    while (currentChild !== null) {
      if (currentChild.tag === HostText) {
        // 找到文本节点，复用,修改pendingProps
        const existingFiber = useFiber(currentChild, { content });
        // 设置return
        existingFiber.return = wip;
        // 找到文本节点了 剩下的节点没用了 可以删除了
        deleteRemainingChildren(wip, currentChild.sibling);
        // 返回文本节点
        return existingFiber;
      } else {
        // 当前节点不是文本节点 直接删除
        deleteChild(wip, currentChild);
      }
      /** 移动到下一个child */
      currentChild = currentChild.sibling;
    }

    /** 都没找到文本节点，直接创建 */
    const textNodeFiber = new FiberNode(HostText, { content }, null);
    textNodeFiber.return = wip;
    return textNodeFiber;
  }

  return (
    wip: FiberNode,
    currentChild: FiberNode,
    newChild: any
  ): FiberNode => {
    // 处理Fragment
    if (typeof (newChild as ReactElement) === "object" && newChild !== null) {
      if ((newChild as ReactElement).type === REACT_FRAGMENT_TYPE) {
        // 更新newChild 为Fragment内容
        newChild = newChild?.props?.children;
      }
    }

    // 如果是普通节点
    if (typeof newChild === "object" && typeof newChild !== null) {
      // 如果是多节点 Diff
      if (Array.isArray(newChild)) {
        return reconcileArray(wip, currentChild, newChild);
      }
      // 如果是单节点 看是否key type一样 是否可复用
      return reconcileSingle(wip, currentChild, newChild);
    }
    // 如果是文本节点 (文字或者数字 -> 转换成文本节点)
    if (typeof newChild === "string" || typeof newChild === "number") {
      return reconcileTextNode(wip, currentChild, newChild);
    }

    return null;
  };
}

/** 复用节点，如果存在alternate则复用 不存在则创建 调用createWorkInProgress */
function useFiber(currentFiber: FiberNode, pendingProps: ReactElementProps) {
  const wip = createWorkInProgress(currentFiber, pendingProps);
  wip.sibling = null;
  wip.index = 0;
  return wip;
}

/** 协调子元素 */
export function reconcileChildFiber(
  wip: FiberNode,
  currentChild: FiberNode,
  children: ReactElement
) {
  return childReconciler(true)(wip, currentChild, children);
}

/** 挂载子元素 */
export function mountChildFiber(wip: FiberNode, children: ReactElement) {
  return childReconciler(false)(wip, null, children);
}
