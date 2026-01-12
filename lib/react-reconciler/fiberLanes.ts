/** 实现车道模型优先级 */

import scheduler, { PriorityLevel } from "../scheduler";
import { TRANSITION_CONFIG } from "../share/transition";
import type { FiberRootNode } from "./fiber";

/** 单车道 */
export type Lane = number;
/** 多车道 （优先级合集） */
export type Lanes = number;

export const TotalLanes = 31;

export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncHydrationLane: Lane = /*               */ 0b0000000000000000000000000000001;
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000010;
export const SyncLaneIndex: number = 1;

export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000100;
export const InputContinuousLane: Lane = /*             */ 0b0000000000000000000000000001000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000010000;
export const DefaultLane: Lane = /*                     */ 0b0000000000000000000000000100000;

export const SyncUpdateLanes: Lane =
  SyncLane | InputContinuousLane | DefaultLane;

export const TransitionLane: Lane = /*                        */ 0b0000000000000000000000010000000;
const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000000000001000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111111111110000000;
const TransitionLane1: Lane = /*                        */ 0b0000000000000000000000010000000;
const TransitionLane2: Lane = /*                        */ 0b0000000000000000000000100000000;
const TransitionLane3: Lane = /*                        */ 0b0000000000000000000001000000000;
const TransitionLane4: Lane = /*                        */ 0b0000000000000000000010000000000;
const TransitionLane5: Lane = /*                        */ 0b0000000000000000000100000000000;
const TransitionLane6: Lane = /*                        */ 0b0000000000000000001000000000000;
const TransitionLane7: Lane = /*                        */ 0b0000000000000000010000000000000;
const TransitionLane8: Lane = /*                        */ 0b0000000000000000100000000000000;
const TransitionLane9: Lane = /*                        */ 0b0000000000000001000000000000000;
const TransitionLane10: Lane = /*                       */ 0b0000000000000010000000000000000;
const TransitionLane11: Lane = /*                       */ 0b0000000000000100000000000000000;
const TransitionLane12: Lane = /*                       */ 0b0000000000001000000000000000000;
const TransitionLane13: Lane = /*                       */ 0b0000000000010000000000000000000;
const TransitionLane14: Lane = /*                       */ 0b0000000000100000000000000000000;
const TransitionLane15: Lane = /*                       */ 0b0000000001000000000000000000000;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;
const RetryLane1: Lane = /*                             */ 0b0000000010000000000000000000000;
const RetryLane2: Lane = /*                             */ 0b0000000100000000000000000000000;
const RetryLane3: Lane = /*                             */ 0b0000001000000000000000000000000;
const RetryLane4: Lane = /*                             */ 0b0000010000000000000000000000000;

export const SomeRetryLane: Lane = RetryLane1;

export const SelectiveHydrationLane: Lane = /*          */ 0b0000100000000000000000000000000;

const NonIdleLanes: Lanes = /*                          */ 0b0000111111111111111111111111111;

export const IdleHydrationLane: Lane = /*               */ 0b0001000000000000000000000000000;
export const IdleLane: Lane = /*                        */ 0b0010000000000000000000000000000;

export const OffscreenLane: Lane = /*                   */ 0b0100000000000000000000000000000;
export const DeferredLane: Lane = /*                    */ 0b1000000000000000000000000000000;

// 主要用到 SyncLane  InputContinuousLane  DefaultLane  TransitionLane  IdleLane

// 需要实现的方法

/**
 * 合并两个优先级
 * @param lane1
 * @param lane2
 * @returns mergedLanes
 */
export function mergeLane(lane1: Lane, lane2: Lane): Lanes {
  return lane1 | lane2;
}

/**
 * 从某个lanes集合中 移除单个lane/lanes
 * @param laneSet
 * @param subset
 * @returns
 */
export function removeLanes(laneSet: Lanes, subset: Lane | Lanes): Lanes {
  return laneSet & ~subset;
}

/**
 * 从某个lanes集合中，找到优先级最高的lane
 * 注意，lane模型中，越小优先级越高，计算对应如下
 * ( min(lanes) = lanes&-lanes 注意-lanes 是二进制的取反+1)
 *  举例： 0b00110 => 取反 0b11001 => 加1 => 0b11010 => 0b00110 & 0b11010 = 0b00010
 * @param lanes
 * @returns
 */
export function getHighestPriorityLane(lanes: Lanes): Lane {
  return lanes & -lanes;
}

/**
 * 判断某个lane集合是不是另外一个lanes集合的子集 sub必须完全包含在
 * @param laneSet
 * @param subSet
 */
export function isSubsetOfLanes(laneSet: Lanes, subSet: Lanes | Lane) {
  return (laneSet & subSet) === subSet;
}

/**
 * 某个set集合 是否包含某个集合的部分lane 包含即可
 * @param laneSet
 * @param subSet
 * @returns
 */
export function includeSomeLanes(laneSet: Lanes, subSet: Lanes | Lanes) {
  return (laneSet & subSet) !== NoLanes;
}

/** 和root操作相关 */
/**
 * 获取当前root优先级最高的lan
 * 已经挂起的lane优先级比没挂起的低 即便已经 pinged
 * @param lanes
 */
export function getNextLane(root: FiberRootNode): Lane {
  const pendingLanes = root.pendingLanes;
  const suspendedLanes = root.suspendedLanes;
  /** 先去掉suspenedLanes 要确保没被挂起的lane优先级更高执行 */
  const unSuspendedLanes = removeLanes(pendingLanes, suspendedLanes);
  if (unSuspendedLanes !== NoLane) {
    /** 调用getHighestPriorityLane 获取最高优先级lane */
    return getHighestPriorityLane(pendingLanes);
  } else {
    /** 说明所有的lane都挂起了 看一下哪个lane已经决策了 （pinged） */
    const pingedLanes = root.pingedLanes & suspendedLanes;
    if (pingedLanes !== NoLane) {
      const higestPingedLine = getHighestPriorityLane(pingedLanes);
      return higestPingedLine;
    }
  }
  return NoLane;
}

/**
 *  和挂起&恢复 相关的lanes操作
 *  这部分包含root上的几条lanes
 *  1. pendingLanes 即 可以正常调度的lane
 *  2. suspendedLanes 挂起的lane 在Promise决策之前 不可以调度
 *  3. pingedLanes 恢复的lane Promise已经决策，可以被调度
 *
 *  解决什么问题？
 *  当一个lane对应的任务被挂起，此任务会卡在render阶段，不会继续commit
 *  此时，react会重新调度，查找下一个优先级的lane
 *  如果当前被挂起的任务已经是优先级最高的lane，那么这个已经被挂起的任务会被反复的调度，低优先级的任务被阻塞，直到promise决策！
 *
 *  如何解决？
 *  当一个lane对应的render任务被挂起后，这个lane会被加入到 suspendedLanes 上，由于commit阶段没执行，所以挂起的lane不会从pendingLane上去掉！
 *  当Promise决策之后，这个lane会被挂到pingedLanes上，表示这个lane已经可以恢复调度
 *
 *  当Promise决策之后，会把对应的lane 加入到pingedLanes和pendingLanes
 *  对应的函数为 markRootPinged 和 markRootUpdated
 *
 *  getNextLane调度的时候，会优先调度没被挂起过的lane，如果没有未挂起过的lane 就去调度那些已经pingedLanes
 *  下面重点来了，当任意一个渲染任务被完整执行，就会调用markRootFinished 此时pingdedLanes和suspendedLanes会被置为Nolane
 *  为什么？ 因为一旦一个完整的更新被执行，此时的fiber结构可能改变，有可能已经不需要这个被挂起的组件了！ 此时的pingedLanes和suspendLanes可能都不准确了
 *  当下一次更新，如果还是更新到阻塞的lane，就会重新设置suspendedLanes 来保证suspendedLanes和pingdLaned 一直是正确的 最新的
 *
 *  回归本质，suspendedLanes 和 pingedLanes 只是为了不让挂起的更新 卡住 其他更新！
 */

/**
 * 把某个更新的lane加入到root.pendingLanes
 * @param root
 * @param lane
 */
export function markRootUpdated(root: FiberRootNode, lane: Lane) {
  root.pendingLanes = mergeLane(root.pendingLanes, lane);
}

/**
 * 去掉root的某条lane （标记lane对应任务执行完成）
 * @param root
 * @param lane
 */
export function markRootFinished(root: FiberRootNode, lane: Lane) {
  root.pendingLanes = removeLanes(root.pendingLanes, lane);

  // 重制
  root.suspendedLanes = NoLane;
  root.pingedLanes = NoLane;
}

/** 把某个Lane标记为挂起状态 */
export function markRootSuspended(root: FiberRootNode, lane: Lane) {
  root.suspendedLanes = mergeLane(root.suspendedLanes, lane);
  root.pingedLanes = removeLanes(root.pingedLanes, lane);
}

/** 把决策后的lane放到pingedLanes */
export function markRootPinged(root: FiberRootNode, lane: Lane) {
  root.pingedLanes = mergeLane(root.pingedLanes, lane & root.suspendedLanes);
}

/** 转换函数 */
/**
 * scheduler 优先级 转 lane优先级
 * @param schdulerPriority
 */
export function schedulerPriorityToLane(schdulerPriority: PriorityLevel): Lane {
  switch (schdulerPriority) {
    case PriorityLevel.IMMEDIATE_PRIORITY:
      return SyncLane;
    case PriorityLevel.USER_BLOCKING_PRIORITY:
      return InputContinuousLane;
    case PriorityLevel.NORMAL_PRIORITY:
      return DefaultLane;
    default:
      return IdleLane;
  }
}

/**
 * lanes优先级转scheduler优先级 （取lanes中优先级最高的lane 调用getHighestPriorityLane）
 * @param lanes
 */
export function lanesToSchedulerPriority(lanes: Lanes): PriorityLevel {
  const highestPriorityLane = getHighestPriorityLane(lanes);
  switch (highestPriorityLane) {
    case SyncLane:
      return PriorityLevel.IMMEDIATE_PRIORITY;
    case InputContinuousLane:
      return PriorityLevel.USER_BLOCKING_PRIORITY;
    case TransitionLane:
      return PriorityLevel.LOW_PRIORITY;
    case DeferredLane:
      return PriorityLevel.IDLE_PRIORITY;
    default:
      return PriorityLevel.NORMAL_PRIORITY;
  }
}

/**
 * 根据当前update触发上下文 获取update优先级
 * 比如 setState在effect中触发和在onclick中触发 有不一样的优先级
 */
export function requestUpdateLane(): Lane {
  if (TRANSITION_CONFIG.isTransition) {
    return TransitionLane;
  }
  const currentUpdateLane = schedulerPriorityToLane(
    scheduler.getCurrentPriorityLevel()
  );
  return currentUpdateLane;
}
