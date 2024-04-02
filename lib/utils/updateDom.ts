import { EffectTag, IFiber } from "../typings";
import updateProps from "./updateProps";

/**
 * 更新DOM 挂载/更新
 * @param: fiberTreeRoot Fiber tree 根节点
 */
export default function updateDom(fiberTreeNode: IFiber) {
  if (!fiberTreeNode) return;
  // 深度优先更新dom
  /** 根节点不处理,无dom节点的(函数节点)不处理 */

  if (
    fiberTreeNode?.returns &&
    !!fiberTreeNode.dom &&
    typeof fiberTreeNode.type !== "function"
  ) {
    // 找到parent
    let parent: IFiber | null = fiberTreeNode.returns;
    while (parent && (!parent?.dom || typeof parent.type === "function")) {
      parent = parent.returns;
    }
    if (parent) {
      switch (fiberTreeNode.effectTag) {
        case EffectTag.UPDATE:
          updateProps(
            fiberTreeNode.dom,
            fiberTreeNode?.alternate?.props,
            fiberTreeNode?.props
          );
        case EffectTag.PLACEMENT:
          parent.dom.appendChild(fiberTreeNode.dom);
      }
    }
  }
  // 递归更新子节点
  updateDom(fiberTreeNode?.child);
  // 递归更新兄弟节点
  updateDom(fiberTreeNode?.sibling);
}
