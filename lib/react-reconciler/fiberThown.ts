/** 用来注册唤醒suspense */

import { Wakeable } from "../share/ReactTypes";
import { FiberNode, FiberRootNode } from "./fiber";
import { Lane, mergeLane, requestUpdateLane } from "./fiberLanes";
import { ShouldCapture } from "./flags";
import { getNearestSuspenseFiber } from "./suspenseContext";
import { ensureRootIsScheduled, scheduleUpdateOnFiber } from "./workLoop";

function attachPingListener(
  root: FiberRootNode,
  wip: FiberNode,
  wakeable: Wakeable,
  lane: Lane
) {
  let wakeableLanes: Set<Lane> = null;

  if (!root.pingCache) {
    // 没有 pingChache就创建
    wakeableLanes = new Set<Lane>();
    root.pingCache = new WeakMap();
    root.pingCache.set(wakeable, wakeableLanes);
  } else {
    // 有 pingCache 查找wakeable 是否存在，如果不存在就加入
    wakeableLanes = root.pingCache.get(wakeable);
    if (!wakeableLanes) {
      wakeableLanes = new Set<Lane>();
      root.pingCache.set(wakeable, wakeableLanes);
    }
  }

  // 只有一个lane的第一次 才能注册 不同lane对应一个wakeable可以多次注册 注册多个 唤醒
  if (!wakeableLanes.has(lane)) {
    // 第一次进入才listen
    const ping = () => {
      if (root.pingCache.has(wakeable)) {
        root.pingCache.delete(wakeable);
      }
      const updateLane = requestUpdateLane()
      wip.lanes = mergeLane(wip.lanes,updateLane)
      scheduleUpdateOnFiber(wip,updateLane)
    };

    wakeable.then(ping, ping);
  }
}

export function handleThrownException(
  root: FiberRootNode,
  wip: FiberNode,
  thrownValue: any,
  lane: Lane
) {
  if (thrownValue !== null && typeof thrownValue === "object") {
    if (typeof thrownValue.then === "function") {
      // 处理 thenbale异常
      // 标记最近的suspense ShouldCapture
      const nearsetSuspenseFiber = getNearestSuspenseFiber()
      if(nearsetSuspenseFiber){
        nearsetSuspenseFiber.flags |= ShouldCapture
      }
      // 注册listener
      attachPingListener(root,wip, thrownValue as Wakeable, lane);
    }
  }
}
