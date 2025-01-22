import { ReactElementProps } from "../React";

/** 转换Style */
function camelToKebab(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

/** 合成事件 */
export const elementPropsKey = "__props";

/** 判断是否为事件 */
const isEvent = (key) => key?.startsWith("on");

/** 判断是否为属性（排除过滤掉event和children） */
const isAttribute = (key) => key !== "children" && !isEvent(key);



/**
 * 在DOM上挂上Fiber代理的属性 方便合成事件这些操作
 * @param node
 * @param props
 */
export function updateFiberProps(node: Element, props: ReactElementProps) {
  updateAttributes(node, props);
  node[elementPropsKey] = props;
}

/** 转换属性 */
function covertAttribute(attributes: Record<string, any>) {
  return Object.keys(attributes)
    .filter(isAttribute)
    .reduce((prev, key) => {
      if ("style" === key) {
        if (
          typeof attributes["style"] === "object" &&
          attributes["style"] !== null
        ) {
          return {
            ...prev,
            style: Object.entries(attributes[key]).reduce(
              (prevStyle, [key, value]) =>
                prevStyle + `${camelToKebab(key)}:${value};`,
              ""
            ),
          };
        }
        return prev;
      }

      return {
        ...prev,
        [key.toLowerCase()]: attributes[key],
      };
    }, {});
}

/** 更新属性 */
function updateAttributes(node: Element, props: ReactElementProps) {
  const prevAttribute = getFiberAttribute(node);
  const currentAttirbute = covertAttribute(props);
  Object.entries(currentAttirbute).forEach(([key, value]) => {
    node[key] = value;
    if (prevAttribute[key]) {
      delete prevAttribute[key];
    }
  });

  Object.keys(prevAttribute).forEach((key) => {
    delete prevAttribute[key];
    delete node[key];
  });
}

/** 获取事件 */
export function getFiberEvents(node: Element) {
  const _prop = node[elementPropsKey];
  return _prop.filter(isEvent);
}

/** 获取所有属性 */
export function getFiberProps(node: Element) {
  return node[elementPropsKey];
}

/** 过滤获得属性 */
export function getFiberAttribute(node: Element) {
  const _prop = node[elementPropsKey] || {};
  return covertAttribute(_prop);
}
