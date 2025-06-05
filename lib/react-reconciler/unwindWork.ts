import { ContextProviderType } from "../share/ReactTypes";
import { FiberNode } from "./fiber";
import { popContext } from "./fiberContext";
import { mergeLane, requestUpdateLane } from "./fiberLanes";
import { DidCapture, HostEffectMask, NoFlags, ShouldCapture } from "./flags";
import { popSuspenseFiber } from "./suspenseContext";
import { ContextProvider, SuspenseComponent } from "./workTag";

export function unwindWork(wip: FiberNode) {
  let parent = wip.return;
  while (parent !== null) {
    switch (parent.tag) {
      case SuspenseComponent:
        // 向上走 处理suspense
        popSuspenseFiber();
        if ((parent.flags & ShouldCapture) !== NoFlags) {
          parent.flags &= ~ShouldCapture;
          parent.flags |= DidCapture;
          return parent;
        }
        break;
      case ContextProvider:
        // 向上走 需要处理context
        popContext(wip.type._context);
        break;
    }
    parent = parent.return;
  }
}
