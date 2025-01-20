import { beginWork } from "./beginwork";
import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber";
import { Lane, NoLane } from "./lane";
import scheduler, { PriorityLevel } from "./scheduler";
import { flushSyncCallbacks, scheduleSyncCallback } from "./syncTaskQueue";
import { HostRoot } from "./workTag";

/** 全局变量，表示当前正在处理的Fiber */
let workInProgress: FiberNode = null;

/**
 * 从当前fiberNode找到root节点 并且更新沿途fiber的childLanes
 * @param fiberNode
 */
export function markUpdateLaneFromFiberToRoot(fiberNode: FiberNode) {
  let parent = fiberNode.return;
  while (parent !== null) {
    // 处理parent节点的childLanes
    parent = parent.return;
  }

  /** 检查当前是否找到了hostRootFiber */
  if (parent.tag === HostRoot) {
    return parent.stateNode;
  }

  return null;
}

/** 在Fiber中调度更新 */
export function scheduleUpdateOnFiber(fiberNode: FiberNode) {
  /** 先从更新的fiber节点递归到hostRootFiber
   *  这个过程中，一个目的是寻找fiberRootNode节点
   *  一个是更新沿途的 childLines  TODO
   */
  const fiberRootNode = markUpdateLaneFromFiberToRoot(fiberNode);
  // 更新root的pendingLane
  // 保证根节点被正确调度
  ensureRootIsScheduled(fiberRootNode);
}

export function ensureRootIsScheduled(root: FiberRootNode) {
  // 先实现同步调度
  // 批处理更新, 微任务调用更新
  // 调度同步任务，进入同步队列
  scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
  // 设置微任务回调
  flushSyncCallbacks();
}

/** 从root开始 处理同步任务 */
export function performSyncWorkOnRoot(root: FiberRootNode) {
  // 开始生成fiber 关闭并发模式
  renderRoot(root, NoLane, false);
  commitRoot();
}

/** 从root开始 处理并发任务 */
export function performConcurrentWOrkOnRoot() {}

/**
 * prepareFreshStack 这个函数的命名可能会让人觉得它与“刷新（refresh）”相关，
 * 但它的作用实际上是为了 准备一个新的工作栈，而不是刷新。
 * @param root
 * @param lane 当前车道
 */
function prepareRefreshStack(root: FiberRootNode, lane: Lane) {
  // 重新赋finishedWork
  root.finishedWork = null;
  /** 给workInProgress赋值 */
  /** 这里在首次进入的时候 会创建一个新的hostRootFiber
   * 在react中存在两棵fiber树，两个hostRootFiber根节点 用alternate链接，成为双缓存
   */
  workInProgress = createWorkInProgress(root.current, {});
}

/**
 * 处理单个fiber单元 包含 递，归 2个过程
 * @param fiber
 */
function performUnitOfWork(fiber: FiberNode) {
  // beginWork 递的过程
  const next = beginWork(fiber);

  // 这里不能之间给workInProgress赋值，如果提前赋workInProgress为null 会导致递归提前结束
  // 如果next为 null 则表示已经递到叶子节点，需要开启归到过程
  if (next === null) {
    // completeWork(next)
  } else {
    // 继续递
    workInProgress = next;
  }
  // 递的过程可打断，每执行完一个beginWork 切分成一个任务
  // complete归的过程不可打断，需要执行到下一个有sibling的节点/根节点 (return === null)
}

/** 递归循环 */
function workLoop() {
  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 渲染root 生成fiber对象
 * @param root  当前根节点
 * @param lane  当前车道
 * @param shouldTimeSlice 是否开启并发
 */
export function renderRoot(
  root: FiberRootNode,
  lane: Lane,
  shouldTimeSlice: boolean
) {
  let workLoopRetryTimes = 0;
  /** 先进行准备初始化 */
  prepareRefreshStack(root, lane);

  while (true) {
    try {
      if (shouldTimeSlice) {
        // 开启时间片 scheduler调度
        scheduler.scheduleCallback(PriorityLevel.IMMEDIATE_PRIORITY, workLoop);
      } else {
        workLoop();
      }
    } catch (e) {
      /** 使用try catch保证workLoop顺利执行 多次尝试 */
      workLoopRetryTimes++;
      if (workLoopRetryTimes > 20) {
        console.warn("workLoop执行错误！");
        break;
      }
    }
  }
}

export function commitRoot() {}
