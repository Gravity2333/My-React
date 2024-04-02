import { IDeadline, polyfillRequestIdleCallback } from "./utils/polyfill";
import { DOMType, EffectTag, IElement, IFiber } from "./typings";
import createDom from "./utils/createDom";
import reconcile from "./utils/reconcile";
import updateDom from "./utils/updateDom";
import handleDelection from "./utils/removeDom";

/**
 *  polyfill requestIdleCallback函数
 *   防止某些浏览器环境不支持此方法 如:safiri
 *   具体可以查看 whatCanIUse
 */
polyfillRequestIdleCallback();

// 全局工作变量定义
// 下一个待处理节点
export let nextUnitOfWork: IFiber | null = null;
// 是否第一次加载
export let isMount: boolean = true
/** 重新渲染界面 */
export let reRender: any;
// 待挂载的Fiber Tree Root , 用来控制调度
let workInProgressRoot: IFiber | null = null;
// 记录上一次Fiber Tree
let lastFiberRoot: IFiber | null = null;
// 待删除节点
let delection: IFiber[] = [];


// 处理普通节点
function performCommonUnit() {
  /** 1. 如果Fiber没有对应的dom元素，则生成dom元素 */
  if (!nextUnitOfWork?.dom) {
    nextUnitOfWork.dom = createDom(nextUnitOfWork);
  }

  /** 获得Fiber的子元素 并进入reconcile阶段 diff比较 */
  const elements = nextUnitOfWork?.props?.children || [];
  reconcile(nextUnitOfWork, elements, delection);
}

// 处理函数节点
function performFunctionalUnit() {
  // 注意 函数节点就是没有dom的 不用做类似于普通节点的判断
  // 只需要运行函数，获取element 并且进行diff对比即刻
  const elements = (nextUnitOfWork.type as Function)(
    nextUnitOfWork?.props || {}
  )?.props?.children;
  reconcile(nextUnitOfWork, elements, delection);
}

// 处理Fiber节点
function performUnitOfWork(): IFiber | null {
  /** 处理当前unitofwork */
  if (typeof nextUnitOfWork?.type === "function") {
    performFunctionalUnit();
  } else {
    performCommonUnit();
  }

  /** 找到下一个unitofwork */
  /** 有child 返回child下一个loop处理 */
  if (nextUnitOfWork?.child) {
    return nextUnitOfWork.child;
  }

  /** 如果没有child 找sibling，sibling也没有则找父节点，继续找 */
  let nextFiber: IFiber | null = nextUnitOfWork;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.returns;
  }

  return null;
}

// 提交函数 根据Fiber修改DOM
function commit() {
  // 先删除delection
  handleDelection(delection)
  // 更新dom
  updateDom(workInProgressRoot);
  // 记录上一次fiber tree
  lastFiberRoot = workInProgressRoot;
  // 待挂载的Fiber Tree Root置为空
  workInProgressRoot = null;
  // 修改isMount
  isMount = false
}

/** 渲染界面 */
function render(elements: IElement, container: DOMType) {
  reRender = render.bind(null, elements, container)
  /* 创建初始Fiber节点,elements作为其子节点 */
  workInProgressRoot = nextUnitOfWork = {
    dom: container,
    props: {
      children: [elements],
    },
    // 记录上一次的fiber tree root
    alternate: lastFiberRoot,
  };
}



// 调度函数
const scheduler = (deadline: IDeadline) => {
  while (!deadline.didTimeout && deadline.timeRemaining() > 0 && nextUnitOfWork) {
    // 如果还有空闲时间 AND 还有待处理的Fiber节点，则处理Fiber节点
    nextUnitOfWork = performUnitOfWork();
  }

  // 说明处理完成
  if (workInProgressRoot && !nextUnitOfWork) {
    commit();
  }

  window.requestIdleCallback(scheduler);
};

// 开始调度
window.requestIdleCallback(scheduler);

export { render };
