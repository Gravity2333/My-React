import {
  creareFiberFromElement,
  createFiberFromFragment,
  createWorkInProgress,
  FiberNode,
} from "./fiber";
import { ChildDeletion, Placement } from "./flags";
import {
  Key,
  ReactElement,
  ReactElementChildren,
  ReactElementProps,
} from "../react";
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
    newChild: ReactElementChildren[]
  ): FiberNode {
    /** 设置几个指针 */
    let lastPlacedIndex = 0; // 最后一个可复用DOM的index
    let firstNewFiber: FiberNode | null = null; // 第一个新的Fiber
    let lastNewFiber: FiberNode | null = null; // 最后一个新的Fiber
    /** 把当前currentChild存储到一个Map中 */
    const existingChildren = new Map<Key, FiberNode>();
    let currentExistingChild = currentChild;
    while (currentExistingChild !== null) {
      /** fiber一定有key，直接获取 没有用index */
      const currentExistingChildKey =
        currentExistingChild.key !== null
          ? currentExistingChild.key
          : currentExistingChild.index;
      /** 入Map */
      existingChildren.set(
        String(currentExistingChildKey),
        currentExistingChild
      );
      currentExistingChild = currentExistingChild.sibling;
    }

    /** 遍历newChild 创建Fiber */
    for (let i = 0; i < newChild.length; i++) {
      /** 根据child获取新的fiber 可以复用 可以创建 */
      const newChildFiber = generateNewFiberFromMap(
        existingChildren,
        i,
        newChild[i]
      );

      if (null === newChildFiber) {
        continue;
      }

      // 设置父return
      newChildFiber.return = wip;
      // 根据顺序设置新的index
      newChildFiber.index = i;

      // 连接新的fiber节点
      if (lastNewFiber === null && firstNewFiber === null) {
        /** 初次进入 两个指针都指向第一个fiber */
        firstNewFiber = lastNewFiber = newChildFiber;
      } else {
        /** 移动lastNewFiber指针 */
        lastNewFiber.sibling = newChildFiber;
        lastNewFiber = newChildFiber;
      }

      /** 设置副作用 */
      if (shouldTrackEffect) {
        /** 具体思路是 设置一个lastPlacedIndex = 0 每次检查newFiber的oldIndex 如果比这个高 则不动 修改lastPlacedIndex = oldIndex
         *  如果比lastPlacedIndex小 则设置Placement 也就是要移动
         *
         * 如果没有alternate 则直接设置为Placment
         */

        const alternate = newChildFiber.alternate;
        if (alternate) {
          const oldIndex = alternate.index;
          if (oldIndex < lastPlacedIndex) {
            newChildFiber.flags |= Placement;
            lastPlacedIndex = oldIndex;
          } else {
            // 不设置副作用 移动lastNewFiber
            lastPlacedIndex = oldIndex;
          }
        } else {
          newChildFiber.flags |= Placement;
        }
      }
    }

    /** 处理完所有的element节点，此时existingChildren剩下的为删除节点 设置副作用删除 */
    existingChildren.forEach((needDeletedFiber) =>
      deleteChild(wip, needDeletedFiber)
    );

    /** 返回第一个新的Fiber */
    return firstNewFiber;
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
    if (shouldTrackEffect) {
      /** 设置副作用 */
      newFiber.flags |= Placement;
    }
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
    if (shouldTrackEffect) {
      /** 设置副作用 */
      textNodeFiber.flags != Placement;
    }
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

/**
 * 原版叫updateFromMap 感觉这个名称不好理解
 * 根据existingChildren Map 生成element的新的Fiber
 * @param returnFiber
 * @param existingChildren
 * @param index
 * @param element
 */
function generateNewFiberFromMap(
  existingChildren: Map<Key, FiberNode>,
  index: number,
  element: ReactElementChildren
) {
  /** 获取elementKey
   * element 有三种可能
   * 1. React.Element
   * 2. Array<newChild>
   * 3. Text
   */
  const elementKey: Key = String(
    Array.isArray(element) ||
      typeof element === "string" ||
      typeof element === "number" ||
      element === undefined ||
      element === null ||
      element.key === null ||
      element.key === undefined
      ? index
      : element.key
  );

  /** 查找Map 看有没有已经存在可以复用的Fiber */
  const beforeFiber = existingChildren.get(elementKey);

  /** 按照类型处理 */
  if (Array.isArray(element)) {
    /** 对于数组类型的element 做法是包一层Fragment
     * 检查 如果beforeFiber是Fragment则复用
     *      不是则创建新的Fragment
     */
    if (beforeFiber && beforeFiber.tag === Fragment) {
      // 复用了 删除existingChildren中的元素
      existingChildren.delete(elementKey);
      return useFiber(beforeFiber, element);
    } else {
      // 没有before 或者类型不是Fragment 创建Fiber
      return createFiberFromFragment(element, elementKey);
    }
  }

  /** 如果是文字类型 */
  if (typeof element === "string" || typeof element === "number") {
    if (beforeFiber && beforeFiber.tag === HostText) {
      existingChildren.delete(elementKey);
      return useFiber(beforeFiber, {
        content: String(element),
      });
    } else {
      return new FiberNode(HostText, { content: String(element) }, elementKey);
    }
  }

  /** 如果是普通类型 */
  if (
    typeof element === "object" &&
    element !== null &&
    element.$$typeof === REACT_ELEMENT_TYPE
  ) {
    if (beforeFiber && beforeFiber.type === element.type) {
      existingChildren.delete(elementKey);
      return useFiber(beforeFiber, element.props);
    } else {
      return creareFiberFromElement(element);
    }
  }

  return null;
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
  children: ReactElementChildren
) {
  return childReconciler(true)(wip, currentChild, children);
}

/** 挂载子元素 */
export function mountChildFiber(
  wip: FiberNode,
  children: ReactElementChildren
) {
  return childReconciler(false)(wip, null, children);
}
