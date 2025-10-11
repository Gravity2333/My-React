/** 用来注册唤醒suspense */

import { Wakeable } from "../share/ReactTypes";
import { FiberNode, FiberRootNode } from "./fiber";
import {
  Lane,
  markRootFinished,
  markRootPinged,
  markRootUpdated,
  mergeLane,
  requestUpdateLane,
} from "./fiberLanes";
import { ShouldCapture } from "./flags";
import { getNearestSuspenseFiber } from "./suspenseContext";
import { ensureRootIsScheduled, scheduleUpdateOnFiber } from "./workLoop";

/** 用来处理被抛出的thenable对象,当fulfilled的时候重新渲染 */

/** 同一个lane会多次进入 attachPingListener吗？ 考虑：*/
// function Component() {
//   const data = use(promise);  // 同一个 promise，同一个 lane
//   return <div>{data}</div>;
// }

// function App() {
//   return (
//     <>
//       <Suspense fallback="Loading1">
//         <Component />  {/* 第一次 throwException */}
//       </Suspense>
//       <Suspense fallback="Loading2">
//         <Component />  {/* 第二次 throwException，同一个 lane */}
//       </Suspense>
//     </>
//   );
// }

/** 保证 一个thenable的一个lane 之对应一个任务监听 */
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
    wakeableLanes.add(lane);
    // 第一次进入才listen
    const ping = () => {
      if (root.pingCache?.has(wakeable)) {
        root.pingCache.delete(wakeable);
      }
      markRootUpdated(root, lane);
      markRootPinged(root, lane);
      /** 由于不需要改变 childLanes 只需要ensureRootIsSchedule即可 */
      ensureRootIsScheduled(root);
    };

    wakeable.then(ping, ping);
  }
}

/** 处理异常抛出，给最近的Suspense 设置 */
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
      const nearsetSuspenseFiber = getNearestSuspenseFiber();
      if (nearsetSuspenseFiber) {
        nearsetSuspenseFiber.flags |= ShouldCapture;
      }
      // 注册listener
      attachPingListener(root, wip, thrownValue as Wakeable, lane);
    }
  }
}
