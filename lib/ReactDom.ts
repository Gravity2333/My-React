import { Container, FiberNode, FiberRootNode } from "./fiber";
import { ReactElement } from "./React";
import { Update, UpdateQueue } from "./updateQueue";
import { scheduleUpdateOnFiber } from "./workLoop";
import { HostRoot } from "./workTag";

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
  // 更新的Element元素入队
  root.current.updateQueue?.enqueue(new Update<ReactElement>(element));
  // scheduleUpdateOnFiber 调度更新
  scheduleUpdateOnFiber(root.current);
};

/** 创建根节点的入口 */
export function createRoot(container: Container) {
  const root = createContainer(container);
  return {
    render(element: ReactElement) {
      // TODO
      // 初始化合成事件
      // 更新contianer
      return updateContainer(element, root);
    },
  };
}
