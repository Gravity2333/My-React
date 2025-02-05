import { currentDispatcher } from "../react/currentDispatcher";
import { FiberNode } from "./fiber";
import { Lane, NoLane, requestUpdateLane } from "./fiberLanes";
import { Flags, PassiveEffect } from "./flags";
import { HookHasEffect, Passive } from "./hookEffectTags";
import {
  Action,
  Dispatch,
  FCUpdateQueue,
  Update,
  UpdateQueue,
} from "./updateQueue";
import { scheduleUpdateOnFiber } from "./workLoop";

/** 定义Hook类型 */
export interface Hook {
  memorizedState: any;
  updateQueue: UpdateQueue<any>;
  next: Hook | null;
}

export type HookDeps = any[] | null;

export type EffectCallback = () => EffectCallback | void;

/** 定义effect */
export interface Effect {
  tags: Flags;
  // 依赖数组
  deps: HookDeps;
  // 传入的创建effect
  create: EffectCallback | null;
  // 清除effect
  destory: EffectCallback | null;
  // next 用来连接在updateQueu中的Effect对象，Effect存在hook.memorizedState和fiber.updateQueue上
  next: Effect;
}

/** 定义一些全局变量 */
/** 当前正在渲染的hook */
let currentRenderingFiber: FiberNode | null = null;
/** 当前正在处理的HOOK */
let workInProgressHook: Hook | null = null;
/** currentHook current fiber和当前workInProgressHook对应的hook */
let currentHook: Hook | null = null;
// 需要注意 wipxxx都是当前处理fiber tree上的 current都是当前已经渲染的fiber tre上的属性
let renderLane: Lane = NoLane;
// 导出共享变量
export let isTransition = false

/** 运行函数组件以及hooks */
export function renderWithHooks(wip: FiberNode,lane: Lane) {
  // 主要作用是，运行函数组件 并且在函数运行上下文挂载currentDispatcher 在运行之后 卸载Dispatcher
  // 保证hook只能在函数组件内运行

  // 设置当前正在渲染的fiber
  currentRenderingFiber = wip;

  // 清空memoizedState
  wip.memorizedState = null;
  // 重置 effect链表
  wip.updateQueue = null;

  // 当前已经渲染的fiber
  const current = wip.alternate;
	renderLane = lane;
  if (current !== null) {
    // update
    currentDispatcher.current = {
      useState: updateState,
      useEffect: updateEffect,
      useTransition: updateTransition,
    };
  } else {
    // mount
    currentDispatcher.current = {
      useState: mountState,
      useEffect: mountEffect,
      useTransition: mountTransition,
    };
  }

  // 运行函数
  const ComponentFn = wip.type as Function;
  const pendingProps = wip.pendingProps;
  const childrenElements = ComponentFn(pendingProps);

  // 恢复
  currentRenderingFiber = null;
  workInProgressHook = null;
  currentHook = null;
  currentDispatcher.current = null;
	renderLane = NoLane;
  return childrenElements;
}

/** 挂载state */
function mountState<T>(initialState): [T, Dispatch<T>] {
  const hook = mountWorkInProgressHook();
 
  let memorizedState: T;
  // 计算初始值
  if (typeof initialState === "function") {
    memorizedState = initialState();
  } else {
    memorizedState = initialState;
  }

  // 挂载memorizedState到hook 注意别挂载错了 currentRenderingFiber 也有一样的memorizedState
  hook.memorizedState = memorizedState;
  // 设置hook.taskQueue.dispatch 并且返回,注意dispatch是可以拿到函数组件外部使用的，所以这里需要绑定当前渲染fiber和updateQueue
  hook.updateQueue.dispatch = dispatchSetState.bind(
    null,
    currentRenderingFiber,
    hook.updateQueue
  );
  hook.updateQueue.baseState = memorizedState
  return [memorizedState, hook.updateQueue.dispatch];
}

/** 更新state */
function updateState<T>(): [T, Dispatch<T>] {
  const hook = updateWorkInProgressHook();

  const { memorizedState } = hook.updateQueue.process(
    renderLane,
    true
  );
  hook.memorizedState = memorizedState;
  return [memorizedState, hook.updateQueue.dispatch];
}

/** 挂载当前的workInProgressHook 并且返回 */
function mountWorkInProgressHook() {
  if (!currentRenderingFiber) {
    throw new Error("hooks必须在函数组件内部调用！");
  }
  const hook: Hook = {
    memorizedState: null,
    updateQueue: new UpdateQueue(),
    next: null,
  };

  // hook的挂载方式是 currentRenderdingFiber.memorizedState -> hook1 -next-> hook2 -next-> hook3 -next-> null
  if (currentRenderingFiber.memorizedState === null) {
    // 第一次挂载
    currentRenderingFiber.memorizedState = hook;
  } else {
    // 非第一次挂载
    workInProgressHook.next = hook;
  }
  // 设置workInProgressHook
  workInProgressHook = hook;
  return hook;
}

/** 根据current 挂载当前的workInProgressHook 并且返回 */
function updateWorkInProgressHook() {
  if (!currentRenderingFiber) {
    throw new Error("hooks必须在函数组件内部调用！");
  }

  // 找到当前已经渲染的fiber -> current
  const current = currentRenderingFiber.alternate;

  // currentHook是指向current元素的hook指针
  if (currentHook === null) {
    // 当前还没有currentHook 第一个元素
    if (current) {
      currentHook = current.memorizedState;
    } else {
      currentHook = null;
    }
  } else {
    // 如果有currentHook 说明不是第一个hook
    currentHook = currentHook.next;
  }

  // 如果没找到currentHook 说明hook数量对不上
  if (currentHook === null) {
    throw new Error("render more hooks than previouse render!");
  }

  // 拿到currentHook了 需要根据其构建当前的workInProgrerssHook
  const hook: Hook = {
    memorizedState: currentHook.memorizedState,
    updateQueue: currentHook.updateQueue,
    next: null,
  };

  if (currentRenderingFiber.memorizedState === null) {
    currentRenderingFiber.memorizedState = hook;
  } else {
    workInProgressHook.next = hook;
  }

  workInProgressHook = hook;
  return hook;
}

/** 派发修改state */
function dispatchSetState<State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  action: Action<State>
) {
  // 获取一个优先级 根据 dispatchSetState 执行所在的上下文
  const lane = requestUpdateLane();
  // 创建一个update对象
  const update = new Update(action, lane);
  // 入队 并且加入到fiber上
  updateQueue.enqueue(update, fiber, lane);
  // 开启调度时，也需要传入当前优先级
  scheduleUpdateOnFiber(fiber, lane);
}

/** 挂载Effect */
function mountEffect(
  create: EffectCallback,
  deps: HookDeps
): EffectCallback | void {
  /** effect 在hook中的存储方式是：
   *  hook:
   *     memorizedState = Effect
   *     updateQueue = null
   *     next = nextHook
   *  fiber:
   *     updateQueue -> Effect1 -next-> Effect2 -...
   */

  // 获取到hook
  const hook = mountWorkInProgressHook();
  // 给fiber设置PassiveEffect 表示存在被动副作用
  (currentRenderingFiber as FiberNode).flags |= PassiveEffect;
  hook.memorizedState = pushEffect(
    // 初始化状态下，所有的useEffect都执行，所以这里flag设置为   PassiveEffect|HookHasEffect
    Passive | HookHasEffect,
    create,
    null,
    deps
  );
}

/** 更新Effect */
function updateEffect(
  create: EffectCallback,
  deps: HookDeps
): EffectCallback | void {
  // 获取当前hook
  const hook = updateWorkInProgressHook();
  const prevDeps = hook.memorizedState.deps;
  const destory = hook.memorizedState.destory;
  if (shallowEqual(prevDeps, deps)) {
    // 相等 pushEffect 并且设置tag为Passive 被动副作用
    hook.memorizedState = pushEffect(
      Passive,
      create,
      // 前一个副作用hook的destory
      destory,
      deps
    );
  } else {
    /** 不等 表示hook有Effect */
    hook.memorizedState = pushEffect(
      Passive | HookHasEffect, // 注意这里是 Passive 是Effect的tag 区分fiber的tag PassiveEffect
      create,
      // 前一个副作用hook的destory
      destory,
      deps
    );
  }
  (currentRenderingFiber as FiberNode).flags |= PassiveEffect;
}

/** 创建Effect对象，把effect加入到fiber.updateQueue 并且返回创建的Effect */
function pushEffect(
  tags: Flags,
  create: EffectCallback | null,
  destory: EffectCallback | null,
  deps: HookDeps
) {
  const effect: Effect = {
    tags,
    create,
    destory,
    deps: deps === undefined ? null : deps,
    next: null,
  };

  const updateQueue = currentRenderingFiber.updateQueue;

  if (!updateQueue || !(updateQueue instanceof FCUpdateQueue)) {
    // 创建一个FCUpdateQueue
    const fcUpdateQueue = new FCUpdateQueue<Effect>();
    effect.next = effect; // 构建环
    fcUpdateQueue.lastEffect = effect;
    currentRenderingFiber.updateQueue = fcUpdateQueue;
  } else {
    // 已经存在 FCUpdateQueue 添加 后加环
    const fcUpdateQueue =
      currentRenderingFiber.updateQueue as FCUpdateQueue<Effect>;
    if (fcUpdateQueue.lastEffect) {
      effect.next = fcUpdateQueue.lastEffect.next;
      fcUpdateQueue.lastEffect.next = effect;
      fcUpdateQueue.lastEffect = effect;
    }
  }

  return effect;
}

/** 潜比较Deps */
function shallowEqual(prevDeps: HookDeps, curDeps: HookDeps) {
  if (prevDeps === null || curDeps === null) return false;
  if (prevDeps?.length !== curDeps?.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
    if (Object.is(prevDeps[i], curDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}

/** transition */
function mountTransition() {
  // 设置pending state
  const [isPending, setPending] = mountState<boolean>(false)
  // 获得hook
  const hook = mountWorkInProgressHook()
  // 创建startTransition
  const start = startTransition.bind(null, setPending)
  // 记录start
  hook.memorizedState = start
  // 返回pending和start
  return [isPending, start] as [boolean, (callback: () => void) => void]
}

function updateTransition() {
  const [isPending] = updateState<boolean>()
  const hook = updateWorkInProgressHook()
  const start = hook.memorizedState
  return [isPending, start] as [boolean, (callback: () => void) => void]
}

function startTransition(setPending: Dispatch<boolean>, callback: () => void) {
  // 开始transition 第一次更新 此时优先级高
  setPending(true)
  // transition过程，下面的优先级低
  const prevTransition = isTransition

  // 设置标记 表示处于transition过程中，在fiberHook.ts/requestUpdateLane会判断这个变量，如果true则返回transtionLane
  isTransition = true
  // 设置标记 （在react原版中 这里是 1）
  // 第二次更新 优先级低
  callback()
  // 第三次更新 重新设置pending 优先级低
  setPending(false)
  // 恢复isTransition
  isTransition = prevTransition
}