import { Container } from "../react-reconciler/fiber";
import { ReactElementProps } from "../react";
import {
  eventTypeToSchedulerPriority,
  nativeEvents,
  reactEvents,
  reactEventSet,
} from "./events";
import scheduler, { PriorityLevel } from "../scheduler";

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

/** 补充一下W3C 事件模型
 * 阶段	名称	描述
1️⃣	捕获阶段（capturing phase）	事件从 window → document → body → ... → 目标元素 一路向下传递，直到到达目标元素。此时可以在捕获阶段监听事件。
2️⃣	目标阶段（target phase）	事件到达目标元素本身，这时既可以触发捕获监听，也可以触发冒泡监听。
3️⃣	冒泡阶段（bubbling phase）	事件从目标元素开始，沿着 父级 → body → document → window 一路向上传递。
 */
type CollectedEvents = {
  captureCallbacks: SyntheticEventListener[];
  bubbleCallbacks: SyntheticEventListener[];
};

/**
 * 从target到source 收集冒泡/捕获事件
 * @param source 一般为代理节点 container
 * @param eventType 事件类型 比如 click hover ...
 * @param event 事件对象本身
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
  // 收集顺序 从 target -> source 初始化收集节点为 target （事件触发节点）
  let currentNode = event.target as Element;
  // 根据事件类型，获取react合成事件代理的回调函数名 比如 click => [onClickCapture,onClick]
  const reactEvent = reactEvents[eventType];
  // 没有匹配到 合成事件无法处理！
  if (!reactEvent) return events;
  while (currentNode !== source) {
    // 从target收集到source
    // 当前收集节点的 所有属性 props
    const nodeProps = getFiberProps(currentNode);
    // 收集事件处理函数
    if (nodeProps[reactEvent[1]]) {
      // 冒泡事件
      events.bubbleCallbacks.push(nodeProps[reactEvent[1]]);
    }
    if (nodeProps[reactEvent[0]]) {
      // 捕获事件， 注意捕获顺序是反向收集的
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
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    scheduler.runWithPriority(eventTypeToSchedulerPriority(event.type), () => {
      listener(event);
    });

    // 结束传播
    if (!event[stopPropagationKey]) {
      break;
    }
  }
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
  // 收集事件路径上的代理事件
  const collectedEvents = collectEvents(container, eventType, event);

  // 没有任何代理事件，提前结束
  if (
    collectedEvents.bubbleCallbacks?.length === 0 &&
    collectedEvents.captureCallbacks?.length == 0
  ) {
    return;
  }

  // 代理阻止冒泡事件
  event[stopPropagationKey] = false;

  // 原始的 stopPropagation 函数
  const originStopPropagation = event.stopPropagation;

  // 使用Monkey Patch打补丁 包装一层 stopPropagation函数
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
