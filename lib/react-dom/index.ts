import { initEvent } from "../events/SyntheticEvent";
import { Container, FiberNode, FiberRootNode } from "../react-reconciler/fiber";
import { ReactElement } from "../react";
import { Update, UpdateQueue } from "../react-reconciler/updateQueue";
import { scheduleUpdateOnFiber } from "../react-reconciler/workLoop";
import { HostRoot } from "../react-reconciler/workTag";
import { requestUpdateLane } from "../react-reconciler/fiberLanes";
import scheduler, { PriorityLevel } from "../scheduler";

/** 创建应用根节点FiberRootNode 以及第一个HostRoot节点 hostRootFiber */
const createContainer = (container: Container) => {
  // 第一个hostRoot节点
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  // 创建整个应用的根节点： FiberRootNode
  const root = new FiberRootNode(container, hostRootFiber);
  // 创建一个hostRootFiber的更新队列 （updateQueue） 存放的是新的root element
  hostRootFiber.updateQueue = new UpdateQueue<ReactElement>();
  return root;
};

/**
 * 更新container 需要传入
 * @param element 新的element节点
 * @param root APP根节点
 */
const updateContainer = (element: ReactElement, root: FiberRootNode) => {
  // 默认情况下 同步渲染
  scheduler.runWithPriority(PriorityLevel.IMMEDIATE_PRIORITY, () => {
    // 请求获得当前更新lane
    const lane = requestUpdateLane();
    // 获hostRootFiber
    const hostRootFiber = root.current;
    // 更新的Element元素入队
    hostRootFiber.updateQueue?.enqueue(
      new Update<ReactElement>(element, lane),
      hostRootFiber,
      lane
    );
    // scheduleUpdateOnFiber 调度更新
    scheduleUpdateOnFiber(root.current, lane);
  });
};

/** 创建根节点的入口 */
export function createRoot(container: Container) {
  // 创建FiberRootNode
  const root = createContainer(container);
  return {
    render(element: ReactElement) {
      // TODO
      // 初始化合成事件
      initEvent(container);
      // 更新contianer
      return updateContainer(element, root);
    },
  };
}
