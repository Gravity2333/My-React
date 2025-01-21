import { FiberNode } from "./fiber";
import { NoFlags, Update } from "./flags";
import { updateFiberProps } from "./SyntheticEvent";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTag";

/** 归的过程 主要逻辑有
 * 1. 不能复用的DOM创建 赋给stateNode
 * 2. 连接父子节点
 * 3. flags冒泡
 */
export function completeWork(wip: FiberNode) {
  /** 真正需要操作的 只有HostComponent和HostText */
  const pendingProps = wip.pendingProps; //需要处理props
  const currentFiber = wip.alternate; // 当前生效的fiber

  switch (wip.tag) {
    case HostComponent:
      /** 处理HostComponent的情况 */
      if (currentFiber && currentFiber.stateNode) {
        // update
        // 检查pendingProps和memroizedProps 如何不同则打上Update更新标签
        if (pendingProps === wip.memorizedProps) {
          return;
        }
        wip.flags != Update;
      } else {
        // mount
        // 挂载阶段，直接创建DOM,保存到stateNode
        const domInstance = document.createElement(wip.type as string);
        // 在DOM上更新属性
        updateFiberProps(domInstance, pendingProps);
        // stateNode保存instance
        wip.stateNode = domInstance;
        // 把所有的children dom元素加入到instance中
        // completeWork时 其所有子节点已经完成了递归
        appendAllChildren(domInstance, wip); // 这个操作只有HostComponent处理 HostText由于已经没有子节点 不需要这样操作
      }
      // 冒泡处理属性
      bubbleProperties(wip);
      return null;
    case HostText:
      if (currentFiber && currentFiber.stateNode) {
        // update
        if (currentFiber.memorizedProps?.content === pendingProps?.content) {
          return;
        }
        wip.flags |= Update;
      } else {
        // mount
        const textInstance = document.createTextNode(pendingProps?.content);
        wip.stateNode = textInstance;
      }
      bubbleProperties(wip);
      return null;
    case HostRoot:
    case FunctionComponent:
    case Fragment:
      bubbleProperties(wip);
      return null;
    default:
      console.warn("未处理的completeWork类型！");
  }
}

/**
 * 注意 这个函数只找一层HostComponent / HostText，并且完成连接
 * 如果中间遇到Function Fragment等 会跳过去连接 直到空或者遇到的第一个Host元素为止
 *  因为挂载DOM只会挂载DOM 需要跳过Function Fragment等
 */
function appendAllChildren(instance: Element, wip: FiberNode) {
  let node = wip.child;
  while (node !== null && node !== wip) {
    if (node.tag === HostComponent || node.tag === HostText) {
      instance.appendChild(node.stateNode);
    } else if (node.child) {
      node.child.return = node; // 冗余操作
      /** 查找其子元素 */
      node = node.child;
      continue; // 返回继续检查是否为Host
    }

    /** 走到这里，说明完成这条路线的一个Host元素的append */

    /** 开始向上归 此时路径上 除了wip 和当前节点（如果不为空的情况下）其余的应该都是非Host节点 比如Function或Fragment */
    /** 如果归的时候 某个节点有sibling 那么这个sibling下的第一个Host元素 也是挂在instance下的 需要处理 */
    while (node.sibling === null) {
      // 由于wip的sibling也可能为null node.sibling === null不能判断是否到了wip 这样会一直循环下去 需要在每个循环单独判断一下，当前节点的return是不是wip
      if (node.return === wip || node.return === null) {
        return;
      }
      // 如果没有兄弟 就向上归
      node = node.return;
    }

    /** 如果有兄弟，node指向兄弟 继续循环处理 */
    node.sibling.return = node.return; // 冗余操作
    node = node.sibling;
  }
}

/** 把当前节点所有子节点的属性都merge到当前节点
 * 需要处理
 * 1. subtreeFlags
 * 2. childLanes
 */
function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags;
  // TODO childLanes

  let node = wip.child;
  while (node !== null) {
    // merge subtreeFlags
    subtreeFlags |= node.subTreeFlags;

    node.return = wip; // 冗余操作
    node = node.sibling; // 找下一个node
  }

  wip.subTreeFlags = subtreeFlags;
}
