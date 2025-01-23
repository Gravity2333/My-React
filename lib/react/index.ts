/** element为文字的情况
 *  element的type可能为 HOSTComponent 即 div span
 *  函数
 *  文字，TEXT_ELEMENT_TYPE
 */

import { EffectCallback, HookDeps } from "../react-reconciler/fiberHooks";
import { REACT_ELEMENT_TYPE } from "../react-reconciler/ReactSymbols";
import { currentDispatcher, resolveDispatcher } from "./currentDispatcher";

export type ReactElementType = string | Function | Symbol | number;
/** 属性类型 */
export type ReactElementProps = Record<string, any>;
/** key */
export type Key = string;
/** children  */
export type ReactElementChildren =
  | ReactElement
  | string
  | Array<ReactElementChildren>;

/** Element元素类型 */
export interface ReactElement {
  $$typeof: Symbol | number;
  key: Key;
  type: ReactElementType;
  props: ReactElementProps;
}

function handleChildren(child: ReactElementChildren) {
  if (typeof child === "string") {
    // 子节点为文字的情况
    return child;
  } else {
    // 普通节点的情况，递归调用createElement
    return child;
  }
}

/** 实现createElement方法 */
export function createElement(
  type: ReactElementType,
  props: ReactElementProps,
  ...children: ReactElementChildren[]
): ReactElement {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key: props.key ? String(props.key) : null,
    props: {
      ...props,
      /** 源码这里做了处理 如果只有一个child 直接放到children 如果有多个 则children为一个数组 */
      children:
        children?.length === 1
          ? handleChildren(children[0])
          : children.map(handleChildren),
    },
  };
}

export function useState<State>(initialState: (() => State) | State) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

export function useEffect(create: EffectCallback, deps: HookDeps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
