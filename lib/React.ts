import {
  ElementChildren,
  ElementProps,
  ElementType,
  IElement,
  _TEXT_ELEMENT_,
} from "./typings";

/** 用来创建文本节点 */
export function createTextElement(text: string): IElement {
  return {
    type: _TEXT_ELEMENT_,
    props: {
      nodeValue: text,
    },
  };
}

/** 用来创建节点 */
export function createElement(
  type: ElementType,
  props: ElementProps,
  children: ElementChildren[]
) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "object") {
          return createElement(
            (child as IElement).type,
            (child as IElement).props,
            (child as IElement).props?.children || []
          );
        } else {
          return createTextElement(child);
        }
      }),
    },
  };
}
