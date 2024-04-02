import { DOMType, ElementProps } from "../typings";

/** 判断是否为事件 */
const isEvent = (key) => key?.startsWith("on");

/** 判断是否为属性（排除过滤掉event和children） */
const isProps = (key) => key !== "children" && !isEvent(key);

/** nextProps改变/新增的属性 - 需要在Object.keys(nextProps)的map中使用 */
const isChange = (oldProps: ElementProps, nextProps: ElementProps) => (key) =>
  oldProps[key] !== nextProps[key];

/** nextProps中删除的属性 - 需要在Object.keys(oldProps)的map使用 */
const isGone = (nextProps: ElementProps) => (key) => !(key in nextProps);

/**
 * 用来更新dom属性
 * @param dom: dom节点
 * @param oldProps: 旧属性
 * @param nextProp: 新属性
 */
export default function updateProps(
  dom: DOMType,
  oldProps: ElementProps = {},
  nextProps: ElementProps = {}
) {
  /** 处理事件 */
  /** 1.删除掉在nextProps中，已经不存在 或者发生变化的 oldProps中的事件 */
  Object.keys(oldProps)
    .filter(isEvent)
    .filter((k) => isChange(oldProps, nextProps)(k) || isGone(nextProps)(k))
    .forEach((k) => {
      // 移除有变更的事件
      const eventType = k.toLowerCase()?.slice(2);
      dom.removeEventListener(eventType, oldProps[k]);
    });

  /** 2. 重新注册新增/变化的事件 */
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isChange(oldProps, nextProps))
    .forEach((k) => {
      // 注册有变更的事件
      const eventType = k.toLowerCase()?.slice(2);
      dom.addEventListener(eventType, nextProps[k]);
    });

  /** 处理属性 */
  /** 3. 去除再nextProps中已经不存在的oldProps属性 */
  Object.keys(oldProps)
    .filter(isProps)
    .filter(isGone(nextProps))
    .forEach((k) => {
      dom[k] = "";
    });

  /** 4. 在dom上增加nextProps新增或者改变的属性 */
  Object.keys(nextProps)
    .filter(isProps)
    .filter(isChange(oldProps, nextProps))
    .forEach((k) => {
      dom[k] = nextProps[k];
    });
}
