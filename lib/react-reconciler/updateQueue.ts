/** 更新队列
 * 更新队列是一个环状链表 包含next 指向下一个Update
 * 最后一个Update的next又指向第一个Update
 */

import { Effect } from "./fiberHooks";

/** 更新的Action 可以是State 也可以是函数 */
export type Action<State> = State | ((prevState: State) => State);
/** 定义Dispatch函数 */
export type Dispatch<State> = (action: Action<State>) => void;
/** 更新对象 */
export class Update<State> {
  next: Update<State>;
  action: Action<State>;
  constructor(action: Action<State>) {
    this.action = action;
    this.next = null;
  }
}

/** 更新队列 */
export class UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
  /** 派发函数 */
  dispatch: Dispatch<State>;

  constructor() {
    /** 初始化 */
    this.shared = {
      pending: null,
    };

    this.dispatch = null;
  }

  /** 入队，构造环状链表 */
  enqueue(update: Update<State>) {
    if (this.shared.pending === null) {
      // 插入第一个元素，此时的结构为
      // shared.pending -> firstUpdate.next -> firstUpdate
      update.next = update;
      this.shared.pending = update;
    } else {
      // 插入第二个元素
      update.next = this.shared.pending.next;
      this.shared.pending.next = update;
    }
  }

  /** 处理任务 */
  process(baseState: State, clean = false) {
    /** 遍历pending */
    let current = this.shared.pending?.next || null; // 第一个元素
    if (!current) return { memorizedState: baseState };
    let newState: State = baseState;
    do {
      const currentAction = current.action;
      if (currentAction instanceof Function) {
        /** Action是函数类型 运行返回newState */
        newState = currentAction(newState);
      } else {
        /** 非函数类型，直接赋给新的state */
        newState = currentAction;
      }
      current = current.next;
    } while (current !== this.shared.pending.next);

    if (clean) {
      this.shared.pending = null;
    }
    return {
      memorizedState: newState,
    };
  }
}

/** 函数组件专用的UpdateQueue增加了lastEffect 指向当前收集到的Effect */
export class FCUpdateQueue<State> extends UpdateQueue<State> {
  public lastEffect: Effect | null = null;
}

