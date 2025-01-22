import { Container } from "../react-reconciler/fiber";
import { ReactElementProps } from "../react";
import { nativeEvents, reactEvents, reactEventSet } from "./events";

/** 转换Style */
function camelToKebab(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

/** 合成事件 */
const elementPropsKey = "__props";

/** 阻止冒泡Key */
const stopPropagationKey = "__stopPropagation";

/** 判断是否为事件 */
const isEvent = (key) => reactEventSet.has(key);

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

type SyntheticEventListener = (e: Event) => void;

type CollectedEvents = {
  captureCallbacks: SyntheticEventListener[];
  bubbleCallbacks: SyntheticEventListener[];
};

/**
 * 从target到source 收集冒泡/捕获事件
 * @param source
 * @param eventType
 * @param event
 * @returns
 */
function collectEvents(
  source: Element,
  eventType: string,
  event: Event
): CollectedEvents {
  /** 收集的事件对象 */
  const events: CollectedEvents = {
    captureCallbacks: [],
    bubbleCallbacks: [],
  };

  let currentNode = event.target as Element;
  const reactEvent = reactEvents[eventType];
  if (!reactEvent) return events;
  while (currentNode !== source) {
    // 从target收集到source
    const nodeProps = getFiberProps(currentNode);
    if (nodeProps[reactEvent[1]]) {
       // 冒泡事件
      events.bubbleCallbacks.push(nodeProps[reactEvent[1]]);
    }
    if (nodeProps[reactEvent[0]]) {
     // 捕获事件
      events.captureCallbacks.unshift(nodeProps[reactEvent[0]]);
    }
    currentNode = currentNode.parentNode as Element;
  }

  return events;
}

/* 执行事件 */
function triggerEventListeners(
  listeners: SyntheticEventListener[],
  event: Event
) {
  listeners.forEach((listener) => listener(event));
}

/**
 * 触发合成事件
 * @param container 委托的container
 * @param eventType 原生事件类型
 * @param event 事件对象
 */
function dispatchSyntheticEvent(
  container: Container,
  eventType: string,
  event: Event
) {
  const collectedEvents = collectEvents(container, eventType, event);

  // 代理阻止冒泡事件
  event[stopPropagationKey] = false;

  const originStopPropagation = event.stopPropagation;

  event.stopPropagation = () => {
    event[stopPropagationKey] = true;
    originStopPropagation();
  };

  // 执行捕获事件
  triggerEventListeners(collectedEvents.captureCallbacks, event);
  if (!event[stopPropagationKey]) {
    triggerEventListeners(collectedEvents.bubbleCallbacks, event);
  }
}

/** 初始化合成事件 */
export function initEvent(container: Container) {
  /** 本质上就是在Container上的事件委托 */
  nativeEvents.forEach((nativeEvent) => {
    /** 对每种支持的原生事件 构建委托 */
    container.addEventListener(
      nativeEvent,
      dispatchSyntheticEvent.bind(null, container, nativeEvent)
    );
  });
}
