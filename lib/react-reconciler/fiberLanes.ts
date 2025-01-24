/** 实现车道模型优先级 */

import scheduler, { PriorityLevel } from "../scheduler";
import { FiberRootNode } from "./fiber";

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
  return (laneSet && subSet) === subSet;
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
 * @param lanes
 */
export function getNextLane(root: FiberRootNode): Lane {
  const pendingLanes = root.pendingLanes;
  /** 调用getHighestPriorityLane 获取最高优先级lane */
  return getHighestPriorityLane(pendingLanes);
}

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
    default:
      return PriorityLevel.NORMAL_PRIORITY;
  }
}

/**
 * 根据当前update触发上下文 获取update优先级
 * 比如 setState在effect中触发和在onclick中触发 有不一样的优先级
 */
export function requestUpdateLane(): Lane {
  const currentUpdateLane = schedulerPriorityToLane(
    scheduler.getCurrentPriorityLevel()
  );
  return currentUpdateLane;
}
