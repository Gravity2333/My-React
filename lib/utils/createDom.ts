import { DOMType, IElement, _TEXT_ELEMENT_ } from "../typings";
import updateProps from "./updateProps";

/**
 * 根据IElement对象，生成dom节点
 */
export default function createDom(element: IElement): DOMType {
  let dom: DOMType;
  if (element.type === _TEXT_ELEMENT_) {
    // 处理文本节点
    dom = document.createTextNode("");
  } else {
    // 处理普通节点
    dom = document.createElement(element.type as string);
  }

  // 更新props
  updateProps(dom, {}, element.props);

  return dom;
}
