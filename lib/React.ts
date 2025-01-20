/** element为文字的情况
 *  element的type可能为 HOSTComponent 即 div span
 *  函数
 *  文字，TEXT_ELEMENT_TYPE
 */

import { REACT_ELEMENT_TYPE } from "./ReactSymbols";

const TEXT_ELEMENT_TYPE =
  "TEXT_ELEMENT"; /** 传入的Element类型 支持字符串/函数 */
export type ReactElementType =
  | string
  | Function
  | typeof TEXT_ELEMENT_TYPE
  | Symbol
  | number;
/** 属性类型 */
export type ReactElementProps = Record<string, any>;
/** key */
export type Key = string;
/** children  */
type Children = ReactElement | string;

/** Element元素类型 */
export interface ReactElement {
  $$typeof: Symbol | number;
  key: Key;
  type: ReactElementType;
  props: ReactElementProps;
}

/** 实现createElement方法 */
export function createElement(
  type: ReactElementType,
  props: ReactElementProps,
  ...children: Children[]
): ReactElement {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key: props.key ? String(props.key) : undefined,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "string") {
          // 子节点为文字的情况
          return createElement(TEXT_ELEMENT_TYPE, {
            nodeValue: child, // 需要记录一下TEXT元素的内容
          });
        } else {
          // 普通节点的情况，递归调用createElement
          return createElement(
            child.type,
            child.props,
            ...(child.props?.children || [])
          );
        }
      }),
    },
  };
}
