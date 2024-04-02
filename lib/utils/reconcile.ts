import { EffectTag, IElement, IFiber } from "../typings";

/** 协调，diff比较旧的Fiber节点的子节点和新的element元素 */
export default function reconcile(
  currentFiber: IFiber,
  currentElements: IElement[],
  delection: IFiber[]
) {
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
      if (previousChild) {
        /** 不是第一个子元素 用sibling连接 */
        previousChild.sibling = newFiber;
      }
    }
    /** 设置前一个Child Fiber */
    previousChild = newFiber;
    /** 自增index */
    index++;
    if (oldChild) {
      /** 找到下一个oldChild */
      oldChild = oldChild?.sibling;
    }
  }
}
