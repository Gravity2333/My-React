import { ReactElementProps } from "./React";

/** 合成事件 */
export const elementPropsKey = "__props";

/**
 * 在DOM上挂上Fiber代理的属性 方便合成事件这些操作
 * @param node
 * @param props
 */
export function updateFiberProps(node: Element, props: ReactElementProps) {
  node[elementPropsKey] = props;
}
