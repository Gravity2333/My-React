import { beginWork } from "./beginwork";
import {
  commitHookEffectListCreate,
  commitHookEffectListDestory,
  commitHookEffectListUnmount,
  commitLayoutEffects,
  commitMutationEffects,
} from "./commitWork";
import { completeWork } from "./completeWork";
import {
  createWorkInProgress,
  FiberNode,
  FiberRootNode,
  PendingPassiveEffect,
} from "./fiber";
import { MutationMask, NoFlags, PassiveMask } from "./flags";
import {
  getNextLane,
  Lane,
  lanesToSchedulerPriority,
  markRootFinished,
  markRootUpdated,
  mergeLane,
  NoLane,
  SyncLane,
} from "./fiberLanes";
import scheduler, { PriorityLevel } from "../scheduler";
import { flushSyncCallbacks, scheduleSyncCallback } from "./syncTaskQueue";
import { HostRoot } from "./workTag";
import { HookHasEffect, Passive } from "./hookEffectTags";

/** 工作中间状态 */
// 工作中的状态
const RootInProgress = 0;
/**
 * RootInComplete 和 RootCompleted 用来控制并发模式下 重新执行performConcurrentOnRoot
 * 这个状态由renderRoot返回 判断方式是 并发模式 在workConcurrentkloop执行后 workInProgress不为 null
 * */
// 并发中间状态
const RootInComplete = 1;
// 完成状态
const RootCompleted = 2;
// 未完成状态，不用进入commit阶段
const RootDidNotComplete = 3;

/** 全局变量，表示当前正在处理的Fiber */
let workInProgress: FiberNode = null;
/** 表示当前正在render阶段对应的任务对应的lane 用来在任务中断后重启判断跳过初始化流程 */
let wipRootRenderLane: Lane = NoLane;

/**
 * 从当前fiberNode找到root节点 并且更新沿途fiber的childLanes
 * @param fiberNode
 */
export function markUpdateLaneFromFiberToRoot(
  fiberNode: FiberNode,
  lane: Lane
) {
  let parent = fiberNode.return; // parent表示父节点
  let node = fiberNode; // node标记当前节点
  while (parent !== null) {
    parent.childLanes = mergeLane(parent.childLanes, lane);
    const alternate = parent.alternate;
    if (alternate !== null) {
      alternate.childLanes = mergeLane(alternate.childLanes, lane);
    }
    // 处理parent节点的childLanes
    node = parent;
    parent = parent.return;
  }

  /** 检查当前是否找到了hostRootFiber */
  if (node.tag === HostRoot) {
    return node.stateNode;
  }

  return null;
}

/** 在Fiber中调度更新 */
export function scheduleUpdateOnFiber(fiberNode: FiberNode, lane: Lane) {
  /** 先从更新的fiber节点递归到hostRootFiber
   *  这个过程中，一个目的是寻找fiberRootNode节点
   *  一个是更新沿途的 childLines
   */
  const fiberRootNode = markUpdateLaneFromFiberToRoot(fiberNode, lane);
  // 更新root的pendingLane, 更新root节点的pendingLanes 表示当前正在处理的lanes
  markRootUpdated(fiberRootNode, lane);
  // 保证根节点被正确调度
  ensureRootIsScheduled(fiberRootNode);
}

export function ensureRootIsScheduled(root: FiberRootNode) {
  // 先实现同步调度 获取当前最高优先级
  const highestPriorityLane = getNextLane(root);
  // 判断，如果不存在优先级 说明没有任务需要继续调度了 直接returna
  if (highestPriorityLane === NoLane) return;
  // 批处理更新, 微任务调用更新
  if (highestPriorityLane === SyncLane) {
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    // 设置微任务回调 冲洗缓冲区
    flushSyncCallbacks();
  } else {
    // 其他优先级 使用scheduler调度
    scheduler.scheduleCallback(
      lanesToSchedulerPriority(highestPriorityLane),
      performConcurrentWorkOnRoot.bind(null, root)
    );
  }
}

/** 从root开始 处理同步任务 */
export function performSyncWorkOnRoot(root: FiberRootNode) {
  // 获取当前的优先级
  const lane = getNextLane(root);

  if (lane !== SyncLane) {
    /**
     * 这里 lane如果不是同步任务了，说明同步任务的lane已经被remove 应该执行低优先级的任务了
     *  此时应该停止执行当前任务 重新调度
     * 【实现同步任务的批处理，当第一次执行完之后 commit阶段remove SyncLane 这里就继续不下去了，
     * 后面微任务中的 performSyncWorkOnRoot都不执行了】
     */
    return ensureRootIsScheduled(root);
  }

  // 开始生成fiber 关闭并发模式
  const exitStatus = renderRoot(root, lane, false);
  switch (exitStatus) {
    // 注意 同步任务一次性执行完 不存在RootInComplete中断的情况
    case RootCompleted:
      // 执行成功 设置finishedWork 和 finishedLane 并且commit
      // 设置root.finishedWork
      root.finishedWork = root.current.alternate;
      root.finishedLane = lane;
      // 设置wipRootRenderLane = NoLane;
      wipRootRenderLane = NoLane;
      commitRoot(root);
    default:
    // TODO Suspense的情况
  }
}

/** 从root开始 处理并发任务
 *  这个函数是要传入schduler中的 其中didTimeout就是当前任务是否超时
 */
export function performConcurrentWorkOnRoot(
  root: FiberRootNode,
  didTimeout: boolean
) {
  const lane = getNextLane(root);
  if (lane === NoLane) {
    // 没有任务需要处理了 这里也不需要调度了 用来完成批处理
    return;
  }

  // 开始生成fiber 关闭并发模式 ,在没有超时的情况下，可以开启并发中断
  const exitStatus = renderRoot(root, lane, !didTimeout);
  switch (exitStatus) {
    case RootInComplete:
      // 中断的情况 需要返回subTask 重新注册任务
      return performConcurrentWorkOnRoot.bind(null, root);
    case RootCompleted:
      //任务完成 收尾 commit
      // 设置root.finishedWork
      root.finishedWork = root.current.alternate;
      root.finishedLane = lane;
      // 设置wipRootRenderLane = NoLane;
      wipRootRenderLane = NoLane;
      commitRoot(root);
  }
}

/**
 * prepareFreshStack 这个函数的命名可能会让人觉得它与“刷新（refresh）”相关，
 * 但它的作用实际上是为了 准备一个新的工作栈，而不是刷新。
 * @param root
 * @param lane 当前车道
 */
function prepareRefreshStack(root: FiberRootNode, lane: Lane) {
  // 重新赋finishedWork
  root.finishedWork = null;
  root.finishedLane = NoLane;
  // 设置当前的运行任务lane
  wipRootRenderLane = lane;
  /** 给workInProgress赋值 */
  /** 这里在首次进入的时候 会创建一个新的hostRootFiber
   * 在react中存在两棵fiber树，两个hostRootFiber根节点 用alternate链接，成为双缓存
   */

  workInProgress = createWorkInProgress(root.current, {});
}

function completeUnitOfWork(fiber: FiberNode) {
  // 归
  while (fiber !== null) {
    completeWork(fiber);

    if (fiber.sibling !== null) {
      // 有子节点 修改wip 退出继续递的过程
      workInProgress = fiber.sibling;
      return;
    }

    /** 向上归 修改workInProgress */
    fiber = fiber.return;
    workInProgress = fiber;
  }
}

/**
 * 处理单个fiber单元 包含 递，归 2个过程
 * @param fiber
 */
function performUnitOfWork(fiber: FiberNode) {
  // beginWork 递的过程
  const next = beginWork(fiber, wipRootRenderLane);
  // 递的过程结束，保存pendingProps
  fiber.memorizedProps = fiber.pendingProps;
  // 这里不能直接给workInProgress赋值，如果提前赋workInProgress为null 会导致递归提前结束
  // 如果next为 null 则表示已经递到叶子节点，需要开启归到过程
  if (next === null) {
    /** 开始归的过程 */
    completeUnitOfWork(fiber);
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

/** 在并发模式下，如果shouldYieldToHost 则让出主线程 暂停render过程 */
function workConcurrentLoop() {
  while (workInProgress && !scheduler.shouldYieldToHost()) {
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

  if (wipRootRenderLane !== lane) {
    console.log('中断')
    // 避免重新进行初始化
    /** 先进行准备初始化 */
    prepareRefreshStack(root, lane);
  }

  while (true) {
    try {
      // 开启时间片 scheduler调度
      shouldTimeSlice ? workConcurrentLoop() : workLoop();
      break;
    } catch (e) {
      /** 使用try catch保证workLoop顺利执行 多次尝试 */
      workLoopRetryTimes++;
      if (workLoopRetryTimes > 20) {
        console.warn("workLoop执行错误！", e);
        break;
      }
    }
  }

  /** 判断任务是否执行完成 如果执行完成RootCompleted 否则 返回RootInCompleted*/
  if (shouldTimeSlice && workInProgress !== null) {
    return RootInComplete;
  }

  // 任务完成
  return RootCompleted;
}

/** commit阶段 */
export function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;

  if (finishedWork === null) return;

  const lane = root.finishedLane;
  root.finishedWork = null;
  root.finishedLane = NoLane;

  // 从root.pendingLanes去掉当前的lane
  markRootFinished(root, lane);

  /** 设置调度 执行passiveEffect */
  /** 真正执行会在commit之后 不影响渲染 */
  /** commit阶段会收集effect到root.pendingPassiveEffect */
  // 有删除 或者收集到Passive 都运行
  if (
    (finishedWork.flags & PassiveMask) !== NoFlags ||
    (finishedWork.subTreeFlags & PassiveMask) !== NoFlags
  ) {
    // 调度副作用
    scheduler.scheduleCallback(
      PriorityLevel.NORMAL_PRIORITY,
      flushPassiveEffect.bind(null, root.pendingPassiveEffects)
    );
  }

  /** hostRootFiber是否有effect  */
  const hostRootFiberHasEffect =
    (finishedWork.flags & (MutationMask | PassiveMask)) !== NoFlags;

  /** hostRootFiber的子树是否有effect  */
  const subtreeHasEffect =
    (finishedWork.subTreeFlags & (MutationMask | PassiveMask)) !== NoFlags;

  /** 有Effect才处理 */
  if (hostRootFiberHasEffect || subtreeHasEffect) {
    commitMutationEffects(finishedWork, root);
  }
  // commit完成 修改current指向新的树
  root.current = finishedWork;
  // commitLayout阶段 处理Attach Ref
  commitLayoutEffects(finishedWork, root);
  // 确保可以继续调度
  ensureRootIsScheduled(root);
}

// 处理被动Effect
// 此函数会被作为宏任务调用 / 使用schduler调度
function flushPassiveEffect(pendingPassiveEffect: PendingPassiveEffect) {
  // 处理卸载 把所有的Passive flag的effect都执行destor
  pendingPassiveEffect.unmount.forEach((unmountEffect) => {
    commitHookEffectListUnmount(Passive, unmountEffect);
  });
  pendingPassiveEffect.unmount = [];
  // 处理update 的destory flag为Passive|HookHasEffect
  pendingPassiveEffect.update.forEach((updateEffect) => {
    commitHookEffectListDestory(Passive | HookHasEffect, updateEffect);
  });
  // 处理update的create flag为Passive| HookHasEffect
  pendingPassiveEffect.update.forEach((updateEffect) => {
    commitHookEffectListCreate(Passive | HookHasEffect, updateEffect);
  });
  pendingPassiveEffect.update = [];
}
