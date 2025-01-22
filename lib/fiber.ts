import { Flags, NoFlags } from "./flags";
import {
  Key,
  ReactElement,
  ReactElementChildren,
  ReactElementProps,
  ReactElementType,
} from "./React";
import { REACT_FRAGMENT_TYPE } from "./ReactSymbols";
import { UpdateQueue } from "./updateQueue";
import { Fragment, FunctionComponent, HostComponent, WorkTag } from "./workTag";

export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

/** Fiber节点类 */
export class FiberNode {
  // 唯一id
  key: Key;
  // fiber节点的类型
  tag: WorkTag;
  /** element对应的Type */
  type: ReactElementType;

  // 对应的dom节点 可能为null
  stateNode: any;
  // 记录状态信息
  memorizedState: any;
  // 记录的Props
  memorizedProps: ReactElementProps;

  // 表示fiber node之间的关系
  index: number; // diff比较的index
  sibling: FiberNode | null; // 兄弟节点
  return: FiberNode | null; //父节点
  child: FiberNode | null; // 子节点

  // flags 副作用
  flags: Flags; // 当前节点的flag
  subTreeFlags: Flags; // 当前节点为根的子树flag的merge
  pendingProps: ReactElementProps; // 待处理的props
  delections: FiberNode[];

  // 更新队列
  updateQueue: UpdateQueue<any> | null;

  // 双缓存
  alternate: FiberNode | null;

  constructor(tag: WorkTag, pendingProps: ReactElementProps, key: Key) {
    // 没传key的情况下 都是null 在Diff reconcileArray的时候 会使用index
    this.key = key || null;
    this.tag = tag;
    this.type = null;

    this.stateNode = null;
    this.memorizedState = null;
    this.memorizedProps = null;

    this.index = 0;
    this.sibling = null;
    this.child = null;
    this.return = null;

    // 副作用
    this.flags = NoFlags;
    this.subTreeFlags = NoFlags;
    this.pendingProps = pendingProps;
    this.delections = null;

    this.updateQueue = null;
    this.alternate = null;
  }
}

/** 只有一个 整个应用的根 */
export class FiberRootNode {
  current: FiberNode;
  container: Container;
  finishedWork: FiberNode | null;

  /** 需要传入container 和 第一个HostRootFiber */
  constructor(conatiner: Container, hostRootFiber: FiberNode) {
    /** 保存container */
    this.container = conatiner;
    this.finishedWork = null;
    /** 需要建立关系：
     *  FiberRootNode.current -> hostRootFiber
     *  hostRootFiber.stateNode -> FiberRootNode
     */
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
  }
}

/** 根据现有的Fiber节点，创建更新的Fiber节点
 * 如果当前Fiber节点存在alternate 复用
 * 弱不存在，创建新的FiberNode
 * 将current的内容拷贝过来 包含lane memorizedState/props child 等
 *
 * 在Fiber节点内容可以复用的情况调用，新的fiber节点的 tag type stateNode 等会复用 ｜ props，lane flags delecation这些副作用 会重置
 */
export function createWorkInProgress(
  currentFiber: FiberNode,
  pendingProps: ReactElementProps
) {
  /** 创建wip 当前的workInProgress 先看看能不能复用.alternate */
  let wip = currentFiber.alternate;

  if (wip === null) {
    /** mount阶段，说明对面不存在alternate节点 */
    wip = new FiberNode(currentFiber.tag, pendingProps, currentFiber.key);
    /** stateNode为fiber对应的真实dom节点 */
    wip.stateNode = currentFiber.stateNode;
    /** 建立双向的alternate链接 */
    wip.alternate = currentFiber;
    currentFiber.alternate = wip;
  } else {
    /** update节点，复用 重置副作用 */
    currentFiber.flags = NoFlags;
    currentFiber.subTreeFlags = NoFlags;
    currentFiber.pendingProps = pendingProps;
    currentFiber.delections = null;
  }

  // 剩下的可以复用
  wip.key = currentFiber.key;
  wip.tag = currentFiber.tag;
  wip.type = currentFiber.type;
  wip.memorizedState = currentFiber.memorizedState;
  wip.memorizedProps = currentFiber.memorizedProps;
  wip.updateQueue = currentFiber.updateQueue;
  //  这里需要注意，只需要复用child 可以理解为 新的节点的child指向currentFiber.child 因为后面diff的时候 只需要用的child，仅做对比，
  // 后面会创建新的fiber 此处不需要sibling和return 进行了连接 可以理解成 只复用alternate的内容 不复用其节点之间的关系
  // stateNode也不需要复用 因为alternate和currentFiber之间 如果有关联，那么type一定是相等的
  wip.child = null;
  return wip;
}

/**
 * 从ReactElement对象 创建Fiber对象
 * @param element
 */
export function creareFiberFromElement(element: ReactElement): FiberNode {
  // 默认fiberTag = FunctionComponent
  let fiberTag: WorkTag = FunctionComponent;
  let pendingProps: ReactElementProps = element.props;

  // hostComponent的element.type为string
  if (typeof element.type === "string") {
    fiberTag = HostComponent;
  } else if (typeof element.type === "object") {
    // TODO
  } else if (element.type === REACT_FRAGMENT_TYPE) {
    fiberTag = Fragment;
    return createFiberFromFragment(element.props.children, element.key);
  }

  const fiber =  new FiberNode(fiberTag, pendingProps, element.key);
	fiber.type = element.type;
  return fiber
}

export function createFiberFromFragment(
  elemenst: ReactElementChildren[],
  key: Key
) {
  const fragmentFiber = new FiberNode(Fragment, elemenst, key);
  return fragmentFiber;
}
