import { ReactElement, ReactElementProps, ReactElementType } from ".";
import { REACT_MEMO_TYPE } from "../share/ReactSymbols";

/** memo函数 接收一个ReactElementType 组件 返回一个 REACT_MEMO_TYPE类型的ReactElement*/
export function memo(
  /** 包裹的组件类型 */
  type: ReactElementType,
  compare?: (
    oldProps: ReactElementProps,
    newProps: ReactElementProps
  ) => boolean
): ReactElementType {
  return {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare,
  } as any;
}
