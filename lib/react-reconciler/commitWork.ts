import { Container, FiberNode, FiberRootNode } from "./fiber";
import {
  ChildDeletion,
  Flags,
  LayoutMask,
  MutationMask,
  NoFlags,
  PassiveEffect,
  PassiveMask,
  Placement,
  Ref,
  Update,
  Visibility,
} from "./flags";
import { updateFiberProps } from "../events/SyntheticEvent";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  OffscreenComponent,
} from "./workTag";
import { FCUpdateQueue } from "./updateQueue";
import { Effect, EffectCallback } from "./fiberHooks";
import { HookEffectTag, HookHasEffect, Layout } from "./hookEffectTags";
import { removeLanes } from "./fiberLanes";

/**
 * 本模块用来处理 Commit 阶段
 * react更新阶段分为   render ---------------------> commit
 *           beginwork completeWork          Mutation      Layout
 * Commit先后分为 Mutation Commit 和 Layout Commit阶段
 * Commit阶段是有副作用的 不可打断 和render阶段区分
 * Mutation = （原地）改变已有事物的内部状态 负责处理DOM的挂在，删除，属性更新，副作用收集，Ref卸载
 * Layout = 布局 / 排版 / 空间结构 负责Ref挂载 执行LayoutEffect 再次阶段可以获取到最新的DOM对象，但是可能影响性能
 * 在Ref阶段可以获取最新的 Ref useEffect反而不一定能获取最新的Ref
 */

/** commit回调类型 */
type CommitCallback = (finishedWork: FiberNode, root: FiberRootNode) => void;

/** 高阶函数 用来处理Effect */
function commitEffect(
  phrase: "mutation" | "layout",
  mask: Flags,
  callback: CommitCallback
): CommitCallback {
  /** 递归，DFS 找到最深的无subflags的节点 下面的不需要commit了 因为没有副作用 */
  return (finishedWork, root) => {
    // DFS
    let nextFinishedWork = finishedWork;
    while (nextFinishedWork !== null) {
      if (
        (nextFinishedWork.subTreeFlags & mask) !== NoFlags &&
        nextFinishedWork.child
      ) {
        // 递
        nextFinishedWork = nextFinishedWork.child;
      } else {
        while (nextFinishedWork !== null) {
          // 归
          callback(nextFinishedWork, root);
          if (nextFinishedWork.sibling !== null) {
            nextFinishedWork = nextFinishedWork.sibling;
            break;
          }
          nextFinishedWork = nextFinishedWork.return;
        }
      }
    }
  };
}

/**
 * commitMutationEffectsOnFiber：
 * 用来处理 Mutation副作用 [Placement | Update | ChildDeletion]
 * 负责处理DOM的挂在，删除，属性更新，副作用收集，Ref卸载
 * Mutation Commit 是 React 真正“修改宿主环境”的阶段
 * @param finishedWork
 * @param root
 */
const commitMutationEffectsOnFiber: CommitCallback = (finishedWork, root) => {
  // 处理每个节点的Effect
  // 获取节点的flags
  const flags = finishedWork.flags;

  // 处理节点放置 Placement
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    // 去掉副作用flag
    // 去掉某个flag: 0b0111&(~0b0100) => 0b0111&0b1011=> 0b0011 去掉了 0b0100
    finishedWork.flags &= ~Placement;
  }

  /** 处理节点更新 Update */
  if ((flags & Update) !== NoFlags) {
    commitUpdate(finishedWork);
    finishedWork.flags &= ~Update;
  }

  /**
   * 处理节点删除
   *  注意，节点删除指的是，当前节点包含需要删除的节点，不是当前节点被删除
   *  如果某节点有次标记 就需要删除其记录在deletion数组中的子Fiber节点对应的真实DOM
   */
  if ((flags & ChildDeletion) !== NoFlags) {
    const deletion = finishedWork.delections;
    deletion.forEach((deleteOldFiber) => {
      commitDeletion(deleteOldFiber, root);
    });
    finishedWork.flags &= ~ChildDeletion;
  }

  /**
   * 运行 Layout Effect Destory
   */
  if ((finishedWork.updateQueue as FCUpdateQueue<any>)?.lastEffect) {
    commitHookEffectListDestory(
      Layout | HookHasEffect,
      (finishedWork.updateQueue as FCUpdateQueue<any>).lastEffect
    );
  }

  /** 收集副作用 */
  if ((flags & PassiveEffect) !== NoFlags) {
    // 收集被动副作用
    commitPassiveEffect(finishedWork, root, "update");
    // 去掉标记
    finishedWork.lanes = removeLanes(finishedWork.lanes, PassiveEffect);
  }

  // 卸载Ref 只有hostComponent需要卸载,Layout阶段再挂在Ref
  if (finishedWork.tag === HostComponent && (flags & Ref) !== NoFlags) {
    const current = finishedWork.alternate;
    if (current) {
      // 需要卸载current的ref 其实本质上current和finishedWork的ref都是一个
      saftyDetachRef(current);
    }

    // 卸载之后由于可能还会加载ref 所以这里的flag不能~Ref
  }

  // 处理 offscreenComponent
  if (
    finishedWork.tag === OffscreenComponent &&
    (flags & Visibility) !== NoFlags
  ) {
    hideOrUnhideAllChilden(
      finishedWork,
      finishedWork.pendingProps?.mode === "hidden"
    );
    finishedWork.flags &= ~Visibility;
  }
};

/** 用来处理 Layout副作用 [Ref] */
const commitLayoutEffectsOnFiber: CommitCallback = (finishedWork) => {
  // 处理每个节点的Effect
  // 获取节点的flags
  const flags = finishedWork.flags;

  /** 为什么Ref挂在放在Layout阶段？
   * Mutation 阶段 DOM还不稳定！
   * 这其实体现了 React 的一个核心哲学：“Mutation 只做破坏性操作，Layout 才允许安全地观测。”
   */
  if (finishedWork.tag === HostComponent && (flags & Ref) !== NoFlags) {
    saftyAttachRef(finishedWork);
    finishedWork.flags &= ~Ref; // 此时 才去掉Ref的Flag标记
  }

  /** 处理 Layout Effect的 Mount
   *  注意 Layout Effect的Mount 一定在 装载Ref之后 保证能使用Ref
   *  Layout Effect的卸载一定在卸载Ref之前 保证卸载函数中也可以使用Ref
   */
  if ((finishedWork.updateQueue as FCUpdateQueue<any>)?.lastEffect) {
    commitHookEffectListCreate(
      Layout | HookHasEffect,
      (finishedWork.updateQueue as FCUpdateQueue<any>).lastEffect
    );
  }
};

/**
 * commitPassiveEffect: 收集被动副作用，这个函数可能会在
 * 1. commitMutationEffectsOnFiber调用
 * 2. 在delection时调用
 * 注意 这个函数是把Mutation阶段的副作用加入到root.PendingPassiveEffect
 * Mutation Effect的执行会交给 scheduler调度 优先级更低
 *
 * My-React中 副作用包含2种 Passive Effect 和布局无关的副作用
 *                       LayoutEffet 和布局相关的副作用
 * PassiveEffect的FnUpdateQueue 会被加入到root.pendingPassiveEffecr
 * LayoutEffect的FnUpdateQueue 不会，其会在Mutation阶段处理Unmount 在 Layout阶段处理Mount
 * @param fiber
 * @param root
 * @param type
 * @returns
 */
function commitPassiveEffect(
  fiber: FiberNode,
  root: FiberRootNode,
  type: "update" | "unmount"
) {
  if (fiber.tag !== FunctionComponent) return;
  if (type === "update" && (fiber.flags & PassiveEffect) === NoFlags) return;
  const fcUpdateQueue = fiber.updateQueue as FCUpdateQueue<Effect>;
  if (fcUpdateQueue && fcUpdateQueue.lastEffect) {
    // 收集effect
    root.pendingPassiveEffects[type].push(fcUpdateQueue.lastEffect);
  }
}

/**
 * 处理Placement
 *  处理放置/插入 节点
 *  当前节点的DOM还没有插入到DOM树，此时需要找到当前Fiber节点的真实DOM父节点，和真实DOM sibling节点
 *  步骤
 *   1 找到真实dom节点对应的父 Fiber => getHostParent
 *   2 找到真实dom节点对应的兄弟 Fiver => getHostSibling
 *   3 调用 insertBefore BOM函数插入 DOM元素
 * @param finishedWork
 */
function commitPlacement(finishedWork: FiberNode) {
  /** 获取finishedWork的hostparent 用来挂载finishedWork对应的DOM （finishedWork可能也不是Host 后面有处理） */
  const hostParent = getHostParent(finishedWork) as Container;
  /** 获取finishedWork的Host sibling节点  */
  const hostSibling = getHostSibling(finishedWork) as Element;
  // 拿到parent和sibling了，就可以插入dom了
  // hostsibling不存在就是append 存在就是插入
  if (hostParent !== null) {
    insertOrAppendPlacementNodeIntoConatiner(
      finishedWork,
      hostParent,
      hostSibling
    );
  }
}

/**
 * 处理Update副作用
 * 如果是是文本就替换 textNode的nodeValue
 * 如果是host节点 比如 div span 就更新属性值
 * @param fiber
 */
function commitUpdate(fiber: FiberNode) {
  if (fiber.tag === HostText) {
    fiber.stateNode.nodeValue = fiber.memorizedProps.content;
  } else {
    updateFiberProps(fiber.stateNode, fiber.memorizedProps);
  }
}

/** 隐藏 / 不隐藏 所有的offscreen的子children */
function hideOrUnhideAllChilden(wip: FiberNode, hidden: boolean) {
  let child = wip.child;
  while (child !== null) {
    if (child.tag === HostComponent) {
      if (hidden) {
        (child.stateNode as HTMLElement).style?.setProperty(
          "display",
          "none",
          "important"
        );
      } else {
        (child.stateNode as HTMLElement).style?.setProperty("display", "");
      }
    } else if (child.tag === HostText) {
      if (hidden) {
        (child.stateNode as HTMLElement).nodeValue = "";
      } else {
        (child.stateNode as HTMLElement).nodeValue =
          child.memorizedProps.content;
      }
    } else {
      // 都不是 Host节点 递归处理
      hideOrUnhideAllChilden(child, hidden);
    }
    child = child.sibling;
  }
}

/**
 * 删除节点 废弃 用commitDeletion替代 更好理解一些
 * @param fiber
 * @param root
 */
function commitDeletion_NonRecruison(fiber: FiberNode, root: FiberRootNode) {
  const parent = getHostParent(fiber);
  if (
    (fiber.tag === HostComponent || fiber.tag === HostText) &&
    fiber.stateNode
  ) {
    parent.removeChild(fiber.stateNode);
    if (fiber.tag === HostComponent) {
      // HostComponent删除的时候 需要卸载Ref
      saftyDetachRef(fiber);
    }
  } else {
    const childToDelete: FiberNode[] = [];

    const findFn = () => {
      while (hostChild !== null) {
        if (
          hostChild.stateNode &&
          (hostChild.tag === HostComponent || hostChild.tag === HostText)
        ) {
          childToDelete.push(hostChild);

          if (hostChild.tag === HostComponent) {
            // HostComponent删除的时候 需要卸载Ref
            saftyDetachRef(hostChild);
          }
          return;
        } else if (hostChild.tag === FunctionComponent) {
          commitPassiveEffect(hostChild, root, "unmount");
        }

        if (hostChild.child !== null) {
          hostChild = hostChild.child;
        } else {
          break;
        }
      }
    };

    // fiber不是host 递归查找
    let hostChild = fiber.child;
    findChild: while (hostChild !== null) {
      findFn();
      // 归
      while (hostChild.sibling === null) {
        if (hostChild.return === null || hostChild.return === fiber)
          break findChild;
        hostChild = hostChild.return;
      }
      hostChild = hostChild.sibling;
    }

    childToDelete.forEach((child) => {
      if (parent.contains(child.stateNode)) {
        parent.removeChild(child.stateNode);
      }
    });
  }
  // 断开链接
  const current = fiber.alternate;
  if (current) {
    current.alternate = null;
  }
  fiber.alternate = null;
  fiber.child = null;
  if (fiber.return !== null) {
    if (fiber.return.child === fiber) {
      // 第一个元素
      fiber.return.child = fiber.sibling;
    } else {
      let firstChild = fiber.return.child;
      while (firstChild.sibling && fiber.sibling !== fiber) {
        firstChild = firstChild.sibling;
      }
      if (firstChild.sibling && firstChild.sibling === fiber) {
        firstChild.sibling = fiber.sibling;
      }
    }
  }
  fiber.return = null;
  fiber.sibling = null;
}

/**
 * commitDeletion: 从父节点上删除子节点对应的 DOM
 * 1. 找到待删除节点的父节点
 * 2. 调用_deleteNodeFromContainer 递归删除这个节点
 * @param needToDelFiber 待删除的子节点
 * @param root 根节点
 */
function commitDeletion(needToDelFiber: FiberNode, root: FiberRootNode) {
  const container = getHostParent(needToDelFiber);
  if (container) {
    _deleteNodeFromContainer(container, needToDelFiber, root);
  }
}

/**
 * 递归的方式删除节点
 * 这个函数的思路和insertOrAppendChildNode 一样
 * 1. 如果待删除节点是个Host节点 直接调用removeChild删除
 * 2. 如果这个节点是个虚拟节点 比如 FunctionComponent 那么递归删除其第一层的HostComponent / HostText
 * @param container
 * @param childToDelete
 * @param root
 * @returns
 */
function _deleteNodeFromContainer(
  container: Container,
  childToDelete: FiberNode,
  root: FiberRootNode
) {
  if (!container || !childToDelete) return;
  if (
    (childToDelete.tag === HostComponent || childToDelete.tag === HostText) &&
    childToDelete.stateNode !== null
  ) {
    /** 如果是host节点，直接删除即可 */
    if (container.contains(childToDelete.stateNode)) {
      container.removeChild(childToDelete.stateNode);
    }

    // 删除时，卸载Ref
    if (childToDelete.tag === HostComponent) {
      // HostComponent删除的时候 需要卸载Ref

      saftyDetachRef(childToDelete);
    }
  } else {
    /** 非host节点，递归删除 */
    if (childToDelete.tag === FunctionComponent) {
      /** 卸载Layout Effect */
      if ((childToDelete.updateQueue as FCUpdateQueue<any>)?.lastEffect) {
        commitHookEffectListUnmount(
          Layout,
          (childToDelete.updateQueue as FCUpdateQueue<any>).lastEffect
        );
      }

      /** 函数组件的情况下，需要收集Effect */
      commitPassiveEffect(childToDelete, root, "unmount");
    }
    let deleteNodeChild = childToDelete.child;
    while (deleteNodeChild !== null) {
      _deleteNodeFromContainer(container, deleteNodeChild, root);
      deleteNodeChild = deleteNodeChild.sibling;
    }
  }
}

/**
 * getHostParent: 获取当前节点的真实DOM对应的Fiber节点
 * @param fiber
 * @returns
 */
function getHostParent(fiber: FiberNode): Element {
  let node = fiber.return;
  while (node !== null) {
    if (node.tag === HostComponent) {
      // host component 返回其stateNode
      return node.stateNode;
    }

    if (node.tag === HostRoot) {
      // hostRoot 其stateNode -> FiberRootNode 需要通过FiberRootNode.container获取
      return node.stateNode.container;
    }
    // 向上找
    node = node.return;
  }
  return null;
}

/**
 * 查找fiber的sibling host节点 （难点）
 *  这里注意，sibling节点可能是不同级的
 *  同时 对于Placement的节点，由于其和其child节点都还没放置 不能作为sibling节点
 * 查找方向
 * 1. 查看当前节点有没有sibling，如果有从sibling往下找(child) 如果child为hostComponent/HostTag 并且flag不为placement 则返回
 *    如果查找的节点为placement 不论什么类型 查找和以下的节点都不能用 开始回溯
 * 2. 回溯，找查找节点的parent，如果有sibling 则回到 （1） 查找其sibling 直到找到一个不为placement的hostCom/hostText为止
 *    如果回溯的过程中，遇到了hostcomponent/hostroot 或者 null的节点 则直接返回null （因为回溯的过程中 一定走的都是非host节点 因为如果是host节点就肯定已经返回了）
 *    如果回溯到过程中遇到host 那么一定是parent节点 或者已经找到hostRoot了 表示没找到
 * @param fiber
 */
function getHostSibling(fiber: FiberNode): Element {
  let node = fiber;
  // 找sibling节点,没有找parent，如果遇到hostComponent / hostRoot 直接返回null
  findSibling: while (true) {
    while (node.sibling === null) {
      const parent = node.return;

      if (
        parent === null ||
        parent.tag === HostComponent ||
        parent.tag === HostRoot
      ) {
        /** 回溯的过程中 如果遇到了 hostComponent / hostRoot 说明找到了parent节点 不能再往上找了 */
        return null;
      }

      /** 继续往上查找 */
      node = parent;
    }

    // 执行到这里，说明存在sibling，移动node节点 -> sibling
    node.sibling.return = node.return;
    node = node.sibling;

    // 找到sibling了 此时开始向下查找，这里要注意，寻找的节点必须满足
    // 1. 是hostComponent / hostText
    // 2. 不能是placement节点 如果不满足，返回到回溯阶段
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // 都不是，如果此时为Placement 下面的不用看了 因为当前节点下的DOM还没挂载,直接回溯
      if ((node.flags & Placement) !== NoFlags || node.child === null) {
        continue findSibling; // 直接跳到最外层循环,回溯
      }
      // 向下寻找
      node.child.return = node;
      node = node.child;
    }
    // 运行到此处 找到hostCompoent/hostText了 看是不是placement
    if ((node.flags & Placement) === NoFlags) {
      return node.stateNode;
    }
  }
}

/**
 * insertOrAppendPlacementNodeIntoConatiner
 * 插入或者追加finishwork节点到hostParent(container)中
 * 为什么是追加 或者 插入
 * 当待插入的节点存在已经插入的真实DOM节点，此时调用parentDOM.insertBefore(current,Sibling DOM)插入节点
 * 当不存在Sibling时，调用parentDOM.append(current)追加节点
 * 如果当前待插入节点是个虚拟节点 也就是 非HostCompoent / HostText 比如是个 FunctionComponent 那么此时就需要
 *  遍历其所有第一层子节点，并且递归调用本函数！
 * @param finishedWork
 * @param hostParent
 * @param hostSibling
 */
function insertOrAppendPlacementNodeIntoConatiner(
  finishedWork: FiberNode,
  hostParent: Container,
  hostSibling?: Element
) {
  // 这里需要注意 finishedWork 可能也不是HostComponet
  if (finishedWork.tag === HostComponent || finishedWork.tag == HostText) {
    if (hostSibling) {
      if (hostParent.contains(hostSibling)) {
        hostParent.insertBefore(finishedWork.stateNode, hostSibling);
      }
    } else {
      hostParent.append(finishedWork.stateNode);
    }
  } else {
    // 如果finishwork不是host 比如是Fragment或者Function
    // 需要遍历其子节点 并且添加
    let child = finishedWork.child;
    while (child !== null) {
      insertOrAppendPlacementNodeIntoConatiner(child, hostParent, hostSibling);
      child = child.sibling;
    }
  }
}

/** effect相关 遍历lastEffect 根据flags判断是否需要执行 调用callback */
function commitHookEffectList(
  flags: HookEffectTag,
  lastEffect: Effect | null,
  callback: (effect: Effect) => void
) {
  let currentEffect = lastEffect.next;
  do {
    if ((currentEffect.tags & flags) === flags) {
      // flag必须完全相等 执行callback
      callback(currentEffect);
    }
    currentEffect = currentEffect.next;
  } while (currentEffect !== lastEffect.next);
}

/** 执行卸载的effect */
export function commitHookEffectListUnmount(
  flags: HookEffectTag,
  lastEffect: Effect | null
) {
  commitHookEffectList(flags, lastEffect, (effect) => {
    const destory = effect.destory;
    if (typeof destory === "function") {
      destory();
    }
    effect.tags &= ~HookHasEffect;
  });
}

/** 执行destory的effect */
export function commitHookEffectListDestory(
  flags: HookEffectTag,
  lastEffect: Effect | null
) {
  commitHookEffectList(flags, lastEffect, (effect) => {
    const destory = effect.destory;
    if (typeof destory === "function") {
      destory();
    }
  });
}

/** 执行创建的effect */
export function commitHookEffectListCreate(
  flags: HookEffectTag,
  lastEffect: Effect | null
) {
  commitHookEffectList(flags, lastEffect, (effect) => {
    const create = effect.create;
    if (typeof create === "function") {
      // 设置destory
      effect.destory = create() as EffectCallback;
    }
  });
}

export const commitMutationEffects = commitEffect(
  "mutation",
  MutationMask | PassiveMask,
  commitMutationEffectsOnFiber
);

export const commitLayoutEffects = commitEffect(
  "layout",
  LayoutMask,
  commitLayoutEffectsOnFiber
);

/** 卸载Ref
 *  卸载时机 commit的mutation阶段 包括
 *  1. 组件卸载
 *  2. 组件更新时包含Ref （Ref变动）
 */
function saftyDetachRef(current: FiberNode) {
  // 这里传入的是current的fiber 也就是旧的fiber 卸载的也是旧的fiber
  // fiber会在createWorkinprogress复用传递 这里的作用就是 ref.current = null / ref(null)
  const ref = current.ref;
  if (ref === null) return;
  // ref可以是函数或者对象 判读类型
  if (typeof ref === "function") {
    // 卸载/更新变动之前卸载时 都会执行下ref函数 并且传入null
    ref(null);
  } else {
    ref.current = null;
  }
}

/** 附加Ref 附加时机
 *  commit的layout阶段 也就是真实dom更新完成 渲染之前
 */
function saftyAttachRef(finishedWork: FiberNode) {
  const ref = finishedWork.ref;
  const dom = finishedWork.stateNode;
  if (ref !== null) {
    if (typeof ref === "function") {
      ref(dom);
    } else {
      ref.current = dom;
    }
  }
}
