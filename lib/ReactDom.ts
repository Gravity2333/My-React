import { IDeadline } from "../lib/polyfill";
import { IElement, IFiber } from "./typings";

const { polyfillRequestIdleCallback } = require("./utils/polyfill");

/**
 *  polyfill requestIdleCallback函数
 *   防止某些浏览器环境不支持此方法 如:safiri
 *   具体可以查看 whatCanIUse
 */
polyfillRequestIdleCallback();

// 全局工作变量定义
// 下一个待处理节点
let nextUnitOfWOrk: IFiber | null = null;
// 待挂载的Fiber Tree Root , 用来控制调度
let workInProgressRoot: IFiber | null = null;
// 记录上一次Fiber Tree
let lastFiberRoot: IFiber | null = null;
// 待删除节点
let delection = [];

// 处理Fiber节点
function performUnitOfWork(): IFiber | null {
  return;
}

// 提交函数 根据Fiber修改DOM
function commit() {
  // 待挂载的Fiber Tree Root置为空
  workInProgressRoot = null;
}

// 调度函数
const scheduler = (deadline: IDeadline) => {
  if (!deadline.didTimeout && deadline.timeRemaining() > 0 && nextUnitOfWOrk) {
    // 如果还有空闲时间 AND 还有待处理的Fiber节点，则处理Fiber节点
    nextUnitOfWOrk = performUnitOfWork();
  }

  // 说明处理完成
  if (workInProgressRoot && !nextUnitOfWOrk) {
    commit();
  }

  window.requestIdleCallback(scheduler);
};

export function render(elements: IElement, container: HTMLElement) {
  /* 创建初始Fiber节点,elements作为其子节点 */
  workInProgressRoot = nextUnitOfWOrk = {
    dom: container,
    props: {
      children: [elements],
    },
    // 记录上一次的fiber tree root
    alternate: lastFiberRoot,
  };
  // 重置删除节点
  delection = [];
}

// 开始调度
window.requestIdleCallback(scheduler);
