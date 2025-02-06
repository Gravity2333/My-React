/** 更新队列
 * 更新队列是一个环状链表 包含next 指向下一个Update
 * 最后一个Update的next又指向第一个Update
 */

import { FiberNode } from "./fiber";
import { Effect } from "./fiberHooks";
import { isSubsetOfLanes, Lane, mergeLane, NoLane } from "./fiberLanes";

/** 更新的Action 可以是State 也可以是函数 */
export type Action<State> = State | ((prevState: State) => State);
/** 定义Dispatch函数 */
export type Dispatch<State> = (action: Action<State>) => void;
/** 更新对象 */
export class Update<State> {
  next: Update<State>;
  action: Action<State>;
  lane: Lane; // 当前更新的优先级Lane
  /** eagerState的逻辑
   *  eagerState 急迫的状态修改
   *  当 当前updateQueue中无update时，会启用该优化
   *  次优化会在调度update之前就运行一下action 判断值是否变化 如果没变化 则把update加入queue 并且推出此次update 调度
   */
  hasEagerState: boolean;
  eagerState: State;
  constructor(action: Action<State>, lane: Lane) {
    this.action = action;
    this.next = null;
    this.lane = lane;
    this.hasEagerState = false;
    this.eagerState = null;
  }
}

/** 更新队列 */
export class UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
  /** 派发函数 */
  dispatch: Dispatch<State>;
  /** 基础队列 */
  baseQueue: Update<State> | null;
  /** 基础state */
  baseState: State;
  /** 上一次的state 历史记录 用来检查state是否改变 */
  lastRenderedState: State;
  constructor() {
    /** 初始化 */
    this.shared = {
      pending: null,
    };

    this.dispatch = null;
    this.baseQueue = null;
    this.baseState = null;

    this.lastRenderedState = null;
  }

  /** 入队，构造环状链表 */
  enqueue(update: Update<State>, fiber: FiberNode, lane: Lane) {
    if (this.shared.pending === null) {
      // 插入第一个元素，此时的结构为
      // shared.pending -> firstUpdate.next -> firstUpdate
      update.next = update;
      this.shared.pending = update;
    } else {
      // 插入第二个元素
      update.next = this.shared.pending.next;
      this.shared.pending.next = update;
      this.shared.pending = update;
    }
    /** 在当前的fiber上设置lane */
    fiber.lanes = mergeLane(fiber.lanes, lane);
    /** 在current上也设置lane 因为在beginwork阶段 wip.lane = NoLane 如果bailout 需要从current恢复 */
    const current = fiber.alternate;
    if (current) {
      current.lanes = mergeLane(current.lanes, lane);
    }
  }

  /** 处理任务 */
  process(
    renderLane: Lane,
    clean: boolean = false,
    onSkipUpdate?: (update: Update<any>) => void
  ) {
    let cacheState = this.shared.pending;

    /** 获取baseQueue pending 完成拼接 */
    let baseState = this.baseState;
    let baseQueue = this.baseQueue;
    const currentPending = this.shared.pending;

    // 生成新的baseQueue过程
    if (currentPending !== null) {
      if (baseQueue !== null) {
        // 拼接两个队列
        // pending -> p1 -> p2 -> p3
        const pendingFirst = currentPending.next; // p1
        // baseQueue -> b1->b2->b3
        const baseFirst = baseQueue.next; // b1
        // 拼接
        currentPending.next = baseFirst; // p1 -> p2 -> p3 -> pending -> b1 -> b2 -> b3
        baseQueue.next = pendingFirst; //b1-> b2 -> b3 -> baseQueue -> p1 -> p2 -> p3
        // p1 -> p2 -> p3 -> pending -> b1 -> b2 -> b3 baseQueue
      }
      // 合并 此时 baseQueue -> b1 -> b2 -> b3 -> p1 -> p2 -> p3
      baseQueue = currentPending;

      // 覆盖新的baseQueue
      this.baseQueue = baseQueue;

      // pending可以置空了
      this.shared.pending = null;

      if (!clean) {
        this.shared.pending = cacheState;
      }
    }

    // 消费baseQueue过程
    // 设置新的basestate和basequeue
    let newBaseState: State = baseState;
    let newBaseQueueFirst: Update<State> | null = null;
    let newBaseQueueLast: Update<State> | null = null;
    // 新的计算值
    let memorizedState: State = baseState;

    // 当前遍历到的update
    let currentUpdate = this.baseQueue?.next;
    if (currentUpdate) {
      do {
        const currentUpdateLane = currentUpdate.lane;
        // 看是否有权限
        if (isSubsetOfLanes(renderLane, currentUpdateLane)) {
          // 有权限
          if (newBaseQueueFirst !== null) {
            // 已经存在newBaseFirst 则往后加此次的update 并且将此次update的lane设置为NoLane 保证下次一定能运行
            const clone = new Update(currentUpdate.action, NoLane);
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }

          if (currentUpdate.hasEagerState) {
            memorizedState = currentUpdate.eagerState;
          } else {
            // 不论存不存在newBaseFirst 都要计算memorizedState
            const currentAction = currentUpdate.action;
            if (currentAction instanceof Function) {
              /** Action是函数类型 运行返回newState */
              memorizedState = currentAction(memorizedState);
            } else {
              /** 非函数类型，直接赋给新的state */
              memorizedState = currentAction;
            }
          }
        } else {
          // 无权限
          const clone = new Update(currentUpdate.action, currentUpdate.lane);
          if (onSkipUpdate) {
            onSkipUpdate(clone);
          }
          // 如果newBaseQueueFirst === null 则从第一个开始添加newbaseQueue队列
          if (newBaseQueueFirst === null) {
            newBaseQueueFirst = newBaseQueueLast = clone;
            // newBaseState到此 不在往后更新 下次从此开始
            newBaseState = memorizedState;
          } else {
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }
        }

        currentUpdate = currentUpdate.next;
      } while (currentUpdate !== this.baseQueue?.next);
    }

    if (newBaseQueueFirst === null) {
      // 此次没有update被跳过，更新newBaseState
      newBaseState = memorizedState;
    } else {
      // newbaseState不变 newBaseQueueFirst newBaseQueueLast 成环
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    // 保存baseState和BaseQueue
    this.baseQueue = newBaseQueueLast;
    this.baseState = newBaseState;
    return { memorizedState };
  }
}

/** 函数组件专用的UpdateQueue增加了lastEffect 指向当前收集到的Effect */
export class FCUpdateQueue<State> extends UpdateQueue<State> {
  public lastEffect: Effect | null = null;
}
