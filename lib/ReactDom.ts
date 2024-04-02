import { IDeadline, polyfillRequestIdleCallback } from "./utils/polyfill";
import { DOMType, EffectTag, IElement, IFiber } from "./typings";
import createDom from "./utils/createDom";

/**
 *  polyfill requestIdleCallback函数
 *   防止某些浏览器环境不支持此方法 如:safiri
 *   具体可以查看 whatCanIUse
 */
polyfillRequestIdleCallback();

// 全局工作变量定义
// 下一个待处理节点
let nextUnitOfWork: IFiber | null = null;
// 待挂载的Fiber Tree Root , 用来控制调度
let workInProgressRoot: IFiber | null = null;
// 记录上一次Fiber Tree
let lastFiberRoot: IFiber | null = null;
// 待删除节点
let delection = [];

/** 协调，diff比较旧的Fiber节点的子节点和新的element元素 */
function reconcile(currentFiber: IFiber, currentElements: IElement[]) {
  // 获取currentFiber旧Fiber节点的第一个孩子
  let oldChild = currentFiber?.alternate?.child;
  // 索引 用来遍历currentElements
  let index: number = 0;
  // 之前的Fiber节点，用来判断previousFiber如何连接子Fiber
  let previousChild: IFiber | null = null;
  // 遍历新的element和oldChild
  while (index < currentElements?.length || !!oldChild) {
    let newFiber: IFiber | null = null;
    const currentElement = currentElements[index];
    const reusable =
      currentElement && oldChild && currentElement?.type === oldChild?.type;
    /** 如果可以复用，复用dom */
    if (reusable) {
      newFiber = {
        dom: oldChild.dom,
        props: currentElement.props,
        type: currentElement.type,
        effectTag: EffectTag.UPDATE,
        returns: currentFiber,
        alternate: oldChild,
      };
    }

    /** 如果不能复用，且currentElement存在 则新增 */
    if (!reusable && currentElement) {
      newFiber = {
        props: currentElement.props,
        type: currentElement.type,
        effectTag: EffectTag.PLACEMENT,
        returns: currentFiber,
      };
    }

    /** 如果不能复用，且存在oldChild 则加入到删除队列中 */
    if (!reusable && oldChild) {
      oldChild.effectTag = EffectTag.DELECTION;
      delection.push(oldChild);
    }

    /** 处理完newFiber，开始挂载 */
    if (index === 0) {
      /** 说明是currentFiber第一个子元素，连接child */
      currentFiber.child = newFiber;
    } else {
      /** 不是第一个子元素 用sibling连接 */
      previousChild.sibling = newFiber;
    }
    /** 设置前一个Child Fiber */
    previousChild = newFiber;
    /** 自增index */
    index++;
    /** 找到下一个oldChild */
    oldChild = oldChild?.sibling;
  }
}

// 处理普通节点
function performCommonUnit() {
  /** 1. 如果Fiber没有对应的dom元素，则生成dom元素 */
  if (!nextUnitOfWork?.dom) {
    nextUnitOfWork.dom = createDom(nextUnitOfWork);
  }

  /** 获得Fiber的子元素 并进入reconcile阶段 diff比较 */
  const elements = nextUnitOfWork?.props?.children || [];
  reconcile(nextUnitOfWork, elements);
}

// 处理函数节点
function performFunctionalUnit() {
  // 注意 函数节点就是没有dom的 不用做类似于普通节点的判断
  // 只需要运行函数，获取element 并且进行diff对比即刻
  const elements = (nextUnitOfWork.type as Function)(
    nextUnitOfWork?.props || {}
  );
  reconcile(nextUnitOfWork, elements);
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
  // 待挂载的Fiber Tree Root置为空
  workInProgressRoot = null;
}

export function render(elements: IElement, container: DOMType) {
  /* 创建初始Fiber节点,elements作为其子节点 */
  workInProgressRoot = nextUnitOfWork = {
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

// 调度函数
const scheduler = (deadline: IDeadline) => {
  if (!deadline.didTimeout && deadline.timeRemaining() > 0 && nextUnitOfWork) {
    // 如果还有空闲时间 AND 还有待处理的Fiber节点，则处理Fiber节点
    nextUnitOfWork = performUnitOfWork();
  }

  // 说明处理完成
  if (workInProgressRoot && !nextUnitOfWork) {
    console.log(workInProgressRoot);
    commit();
  }

  window.requestIdleCallback(scheduler);
};

// 开始调度
window.requestIdleCallback(scheduler);
