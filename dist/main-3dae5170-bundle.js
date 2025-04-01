/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   memo: () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_2__.memo),
/* harmony export */   useCallback: () => (/* binding */ useCallback),
/* harmony export */   useContext: () => (/* binding */ useContext),
/* harmony export */   useDeferedValue: () => (/* binding */ useDeferedValue),
/* harmony export */   useEffect: () => (/* binding */ useEffect),
/* harmony export */   useMemo: () => (/* binding */ useMemo),
/* harmony export */   useRef: () => (/* binding */ useRef),
/* harmony export */   useState: () => (/* binding */ useState),
/* harmony export */   useTransition: () => (/* binding */ useTransition)
/* harmony export */ });
/* harmony import */ var _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _currentDispatcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/** element为文字的情况
 *  element的type可能为 HOSTComponent 即 div span
 *  函数
 *  文字，TEXT_ELEMENT_TYPE
 */




/** 属性类型 */

/** key */

/** Ref
 *  说一下Ref为什么要设计成 {current} 这种数据结构
 *  一个比较重要的点是 要保证ref的稳定性
 *  比如在函数组件内 ref的内容是保存在fiber.memorizedState上的
 *  每次函数执行的时候 如果保存的是简单类型，虽然能保证每次都取得fiber.memorizedState上的值 但是react无法感知到ref的修改
 *  const ref = useRef(0)
 *  如果ref是简单类型 ref++ 只是在当前函数的作用域内的ref更新了 但是由于简单类型是拷贝 fiber.memorziedState无法感知到更新
 *  如果是复杂类型 ref.current++ 在fiber.memorizesState中就可以同步更改
 */

/** children  */

/** Element元素类型 */

/** 实现createElement方法 */
function createElement(type) {
  let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }
  return {
    $$typeof: _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_0__.REACT_ELEMENT_TYPE,
    type,
    /**
     * 这里说一下ref
     * ref的作用
     * 1. 对于class组件，获取类组件的实例
     * 2. 对于hostComponent 获取对应的原生DOM元素
     * (对于稳定保存值不触发react渲染这个不是ref的设计本意)
     *
     * 为什么需要forwardRef&useImpreciateHandle
     * 对于函数组件，每次刷新都是重新运行函数 没有什么需要获取的 ref看似对于函数组件没意义 但是函数组件需要帮忙转发ref
     * 疑问？ 为什么不能直接通过props传递ref
     * 因为react会对ref做特殊处理，比如
     * 1. 在createElement阶段 会把props.ref单独提取出来作为ReactElement的属性
     * 2. beginWork阶段 会跟许ref是否变动 标记flags |= Ref
     * 3. 在commitLayout阶段 会对变动的ref重新赋值 对卸载组件的ref赋null
     * 很明显，对于函数组件，如果只想转发ref 是不能直接传递ref属性的 因为会产生冲突 解决办法
     * 1. 使用其他属性名 如 <FnComp InnerRef={ref}/>
     * 2. 使用forwardRef
     *
     * forwardRef作用
     * forwardRef会产生一个 FordRefType类型的Fiber节点，用其包裹函数组件
     * 在函数组件运行时，会执行renderWithHooks 其中会包含secondArg 参数 此时会传入转发的ref
     * renderWithHooks运行时，会执行Component(props,secondArg) 也就是会把ref作为第二个参数传入
     * 这样也就"绕过" react对于ref这个特殊props的特殊处理
     *
     * 对于函数组件来说 与HostComponent和ClassComponent不同的是 转发的ref需要由开发者自行决定其指向
     * 你可以在函数组件内将转发来的ref赋给一个Host/Class组件 或者使用useImmpreciateHandle自行对ref绑定值
     *
     * forwardRef 会给ts推理带来麻烦 并且由于多了一层fiber组件 会造成性能降低 在v19将会移除
     *
     *
     */
    ref: props?.ref ? props?.ref : null,
    key: props?.key ? String(props?.key) : null,
    props: {
      ...props,
      /** 源码这里做了处理 如果只有一个child 直接放到children 如果有多个 则children为一个数组 */
      children: children?.length === 1 ? children[0] : children
    }
  };
}
function useState(initialState) {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useState(initialState);
}
function useEffect(create, deps) {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useEffect(create, deps);
}
function useTransition() {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useTransition();
}
function useDeferedValue(value) {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useDeferedValue(value);
}
function useRef(initialValue) {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useRef(initialValue);
}

// useMemo 和 useCallback的区别仅仅是 memo会运行nextCreate取得结果 useCallback会直接返回callback
function useMemo(nextCreate, deps) {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useMemo(nextCreate, deps);
}
function useCallback(callback, deps) {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useCallback(callback, deps);
}
function useContext(context) {
  const dispatcher = (0,_currentDispatcher__WEBPACK_IMPORTED_MODULE_1__.resolveDispatcher)();
  return dispatcher.useContext(context);
}

const React = {
  createElement,
  useState,
  useEffect,
  useTransition,
  useDeferedValue,
  useCallback,
  useContext,
  useRef,
  useMemo
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (React);

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REACT_CONTEXT_TYPE: () => (/* binding */ REACT_CONTEXT_TYPE),
/* harmony export */   REACT_ELEMENT_TYPE: () => (/* binding */ REACT_ELEMENT_TYPE),
/* harmony export */   REACT_FRAGMENT_TYPE: () => (/* binding */ REACT_FRAGMENT_TYPE),
/* harmony export */   REACT_LAZY_TYPE: () => (/* binding */ REACT_LAZY_TYPE),
/* harmony export */   REACT_MEMO_TYPE: () => (/* binding */ REACT_MEMO_TYPE),
/* harmony export */   REACT_PROVIDER_TYPE: () => (/* binding */ REACT_PROVIDER_TYPE),
/* harmony export */   REACT_SUSPENSE_TYPE: () => (/* binding */ REACT_SUSPENSE_TYPE)
/* harmony export */ });
const supportSymbol = typeof Symbol === 'function' && Symbol.for;
const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react.element') : 0xeac7;
const REACT_FRAGMENT_TYPE = supportSymbol ? Symbol.for('react.fragment') : 0xeaca;
const REACT_CONTEXT_TYPE = supportSymbol ? Symbol.for('react.context') : 0xeacc;
const REACT_PROVIDER_TYPE = supportSymbol ? Symbol.for('react.provider') : 0xeac2;
const REACT_SUSPENSE_TYPE = supportSymbol ? Symbol.for('react.suspense') : 0xead1;
const REACT_LAZY_TYPE = supportSymbol ? Symbol.for('react.lazy') : 0xead4;
const REACT_MEMO_TYPE = supportSymbol ? Symbol.for('react.memo') : 0xead3;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currentDispatcher: () => (/* binding */ currentDispatcher),
/* harmony export */   resolveDispatcher: () => (/* binding */ resolveDispatcher)
/* harmony export */ });
/** 共享的 当前的Dispatcher */
const currentDispatcher = {
  current: null
};

/** 解析 返回dispatcher */
function resolveDispatcher() {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error("无法在函数组件外部使用hooks");
  }
  return dispatcher;
}

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   memo: () => (/* binding */ memo)
/* harmony export */ });
/* harmony import */ var _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


/** memo函数 接收一个ReactElementType 组件 返回一个 REACT_MEMO_TYPE类型的ReactElement*/
function memo(/** 包裹的组件类型 */
type, compare) {
  return {
    $$typeof: _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_0__.REACT_MEMO_TYPE,
    type,
    compare
  };
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRoot: () => (/* binding */ createRoot)
/* harmony export */ });
/* harmony import */ var _events_SyntheticEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _react_reconciler_fiber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _react_reconciler_updateQueue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _react_reconciler_workLoop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16);
/* harmony import */ var _react_reconciler_workTag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);
/* harmony import */ var _react_reconciler_fiberLanes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8);








/** 创建应用根节点FiberRootNode 以及第一个HostRoot节点 hostRootFiber */
const createContainer = container => {
  // 第一个hostRoot节点
  const hostRootFiber = new _react_reconciler_fiber__WEBPACK_IMPORTED_MODULE_1__.FiberNode(_react_reconciler_workTag__WEBPACK_IMPORTED_MODULE_4__.HostRoot, {}, null);
  // 创建整个应用的根节点： FiberRootNode
  const root = new _react_reconciler_fiber__WEBPACK_IMPORTED_MODULE_1__.FiberRootNode(container, hostRootFiber);
  // 创建一个hostRootFiber的更新队列 （updateQueue） 存放的是新的root element
  hostRootFiber.updateQueue = new _react_reconciler_updateQueue__WEBPACK_IMPORTED_MODULE_2__.UpdateQueue();
  return root;
};

/**
 * 更新container 需要传入
 * @param element 新的element节点
 * @param root APP根节点
 */
const updateContainer = (element, root) => {
  // 默认情况下 同步渲染
  _scheduler__WEBPACK_IMPORTED_MODULE_6__["default"].runWithPriority(_scheduler__WEBPACK_IMPORTED_MODULE_6__.PriorityLevel.IMMEDIATE_PRIORITY, () => {
    // 请求获得当前更新lane
    const lane = (0,_react_reconciler_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.requestUpdateLane)();
    // 获hostRootFiber
    const hostRootFiber = root.current;
    // 更新的Element元素入队
    hostRootFiber.updateQueue?.enqueue(new _react_reconciler_updateQueue__WEBPACK_IMPORTED_MODULE_2__.Update(element, lane), hostRootFiber, lane);
    // scheduleUpdateOnFiber 调度更新
    (0,_react_reconciler_workLoop__WEBPACK_IMPORTED_MODULE_3__.scheduleUpdateOnFiber)(root.current, lane);
  });
};

/** 创建根节点的入口 */
function createRoot(container) {
  // 创建FiberRootNode
  const root = createContainer(container);
  return {
    render(element) {
      // TODO
      // 初始化合成事件
      (0,_events_SyntheticEvent__WEBPACK_IMPORTED_MODULE_0__.initEvent)(container);
      // 更新contianer
      return updateContainer(element, root);
    }
  };
}

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFiberAttribute: () => (/* binding */ getFiberAttribute),
/* harmony export */   getFiberEvents: () => (/* binding */ getFiberEvents),
/* harmony export */   getFiberProps: () => (/* binding */ getFiberProps),
/* harmony export */   initEvent: () => (/* binding */ initEvent),
/* harmony export */   updateFiberProps: () => (/* binding */ updateFiberProps)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);



/** 转换Style */
function camelToKebab(str) {
  return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

/** 合成事件 */
const elementPropsKey = "__props";

/** 阻止冒泡Key */
const stopPropagationKey = "__stopPropagation";

/** 判断是否为事件 */
const isEvent = key => _events__WEBPACK_IMPORTED_MODULE_0__.reactEventSet.has(key);

/** 判断是否为属性（排除过滤掉event和children） */
const isAttribute = key => key !== "children";
// && !isEvent(key);

/**
 * 在DOM上挂上Fiber代理的属性 方便合成事件这些操作
 * @param node
 * @param props
 */
function updateFiberProps(node, props) {
  updateAttributes(node, props);
  node[elementPropsKey] = props;
}

/** 转换属性 */
function covertAttribute(attributes) {
  return Object.keys(attributes).filter(isAttribute).reduce((prev, key) => {
    if ("style" === key) {
      if (typeof attributes["style"] === "object" && attributes["style"] !== null) {
        return {
          ...prev,
          style: Object.entries(attributes[key]).reduce((prevStyle, _ref) => {
            let [key, value] = _ref;
            return prevStyle + `${camelToKebab(key)}:${value};`;
          }, "")
        };
      }
      return prev;
    }
    return {
      ...prev,
      [key.toLowerCase()]: attributes[key]
    };
  }, {});
}

/** 更新属性 */
function updateAttributes(node, props) {
  const prevAttribute = getFiberAttribute(node);
  const currentAttirbute = covertAttribute(props);
  Object.entries(currentAttirbute).forEach(_ref2 => {
    let [key, value] = _ref2;
    node[key] = value;
    if (prevAttribute[key]) {
      delete prevAttribute[key];
    }
  });
  Object.keys(prevAttribute).forEach(key => {
    delete prevAttribute[key];
    delete node[key];
  });
}

/** 获取事件 */
function getFiberEvents(node) {
  const _prop = node[elementPropsKey];
  return _prop.filter(isEvent);
}

/** 获取所有属性 */
function getFiberProps(node) {
  return node[elementPropsKey];
}

/** 过滤获得属性 */
function getFiberAttribute(node) {
  const _prop = node[elementPropsKey] || {};
  return covertAttribute(_prop);
}
/**
 * 从target到source 收集冒泡/捕获事件
 * @param source
 * @param eventType
 * @param event
 * @returns
 */
function collectEvents(source, eventType, event) {
  /** 收集的事件对象 */
  const events = {
    captureCallbacks: [],
    bubbleCallbacks: []
  };
  let currentNode = event.target;
  const reactEvent = _events__WEBPACK_IMPORTED_MODULE_0__.reactEvents[eventType];
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
    currentNode = currentNode.parentNode;
  }
  return events;
}

/* 执行事件 */
function triggerEventListeners(listeners, event) {
  listeners.forEach(listener => _scheduler__WEBPACK_IMPORTED_MODULE_1__["default"].runWithPriority((0,_events__WEBPACK_IMPORTED_MODULE_0__.eventTypeToSchedulerPriority)(event.type), () => {
    listener(event);
  }));
}

/**
 * 触发合成事件
 * @param container 委托的container
 * @param eventType 原生事件类型
 * @param event 事件对象
 */
function dispatchSyntheticEvent(container, eventType, event) {
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
function initEvent(container) {
  /** 本质上就是在Container上的事件委托 */
  _events__WEBPACK_IMPORTED_MODULE_0__.nativeEvents.forEach(nativeEvent => {
    /** 对每种支持的原生事件 构建委托 */
    container.addEventListener(nativeEvent, dispatchSyntheticEvent.bind(null, container, nativeEvent));
  });
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   eventTypeToSchedulerPriority: () => (/* binding */ eventTypeToSchedulerPriority),
/* harmony export */   nativeEvents: () => (/* binding */ nativeEvents),
/* harmony export */   reactEventSet: () => (/* binding */ reactEventSet),
/* harmony export */   reactEvents: () => (/* binding */ reactEvents)
/* harmony export */ });
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);


/** 事件转优先级 */
function eventTypeToSchedulerPriority(eventType) {
  switch (eventType) {
    case "click":
    case "keydown":
    case "keyup":
    case "keydown":
    case "keypress":
    case "keyup":
    case "focusin":
    case "focusout":
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.IMMEDIATE_PRIORITY;
    case "scroll":
    case "resize":
    case "mousemove":
    case "mouseenter":
    case "mouseleave":
    case "touchstart":
    case "touchmove":
    case "touchend":
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.USER_BLOCKING_PRIORITY;
    case "input":
    case "change":
    case "submit":
    case "focus":
    case "blur":
    case "select":
    case "drag":
    case "drop":
    case "pause":
    case "play":
    case "waiting":
    case "ended":
    case "canplay":
    case "canplaythrough":
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.NORMAL_PRIORITY;
    case "abort":
    case "load":
    case "loadeddata":
    case "loadedmetadata":
    case "error":
    case "durationchange":
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.LOW_PRIORITY;
    default:
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.IDLE_PRIORITY;
  }
}

/** 可以代理的原生事件 */
const nativeEvents = ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup", "keydown", "keypress", "keyup", "focus", "blur", "change", "input", "submit", "invalid", "select", "touchcancel", "touchend", "touchmove", "touchstart", "scroll", "drag", "dragend", "dragenter", "dragexit", "dragleave", "dragover", "dragstart", "drop", "abort", "canplay", "canplaythrough", "durationchange", "emptied", "ended", "loadeddata", "loadedmetadata", "pause", "play", "playing", "progress", "ratechange", "seeked", "seeking", "stalled", "stop", "suspend", "timeupdate", "volumechange", "waiting", "resize", "pointerdown", "pointermove", "pointerup", "pointercancel", "copy", "cut", "paste", "focus", "blur"];

// React 合成事件对象
const reactEvents = {
  click: ["onClickCapture", "onClick"],
  contextmenu: ["onContextMenuCapture", "onContextMenu"],
  dblclick: ["onDoubleClickCapture", "onDoubleClick"],
  mousedown: ["onMouseDownCapture", "onMouseDown"],
  mouseenter: ["onMouseEnterCapture", "onMouseEnter"],
  mouseleave: ["onMouseLeaveCapture", "onMouseLeave"],
  mousemove: ["onMouseMoveCapture", "onMouseMove"],
  mouseout: ["onMouseOutCapture", "onMouseOut"],
  mouseover: ["onMouseOverCapture", "onMouseOver"],
  mouseup: ["onMouseUpCapture", "onMouseUp"],
  keydown: ["onKeyDownCapture", "onKeyDown"],
  keypress: ["onKeyPressCapture", "onKeyPress"],
  keyup: ["onKeyUpCapture", "onKeyUp"],
  focus: ["onFocusCapture", "onFocus"],
  blur: ["onBlurCapture", "onBlur"],
  change: ["onChangeCapture", "onChange"],
  input: ["onInputCapture", "onInput"],
  submit: ["onSubmitCapture", "onSubmit"],
  invalid: ["onInvalidCapture", "onInvalid"],
  select: ["onSelectCapture", "onSelect"],
  touchcancel: ["onTouchCancelCapture", "onTouchCancel"],
  touchend: ["onTouchEndCapture", "onTouchEnd"],
  touchmove: ["onTouchMoveCapture", "onTouchMove"],
  touchstart: ["onTouchStartCapture", "onTouchStart"],
  scroll: ["onScrollCapture", "onScroll"],
  drag: ["onDragCapture", "onDrag"],
  dragend: ["onDragEndCapture", "onDragEnd"],
  dragenter: ["onDragEnterCapture", "onDragEnter"],
  dragexit: ["onDragExitCapture", "onDragExit"],
  dragleave: ["onDragLeaveCapture", "onDragLeave"],
  dragover: ["onDragOverCapture", "onDragOver"],
  dragstart: ["onDragStartCapture", "onDragStart"],
  drop: ["onDropCapture", "onDrop"],
  abort: ["onAbortCapture", "onAbort"],
  canplay: ["onCanPlayCapture", "onCanPlay"],
  canplaythrough: ["onCanPlayThroughCapture", "onCanPlayThrough"],
  durationchange: ["onDurationChangeCapture", "onDurationChange"],
  emptied: ["onEmptiedCapture", "onEmptied"],
  ended: ["onEndedCapture", "onEnded"],
  loadeddata: ["onLoadedDataCapture", "onLoadedData"],
  loadedmetadata: ["onLoadedMetadataCapture", "onLoadedMetadata"],
  pause: ["onPauseCapture", "onPause"],
  play: ["onPlayCapture", "onPlay"],
  playing: ["onPlayingCapture", "onPlaying"],
  progress: ["onProgressCapture", "onProgress"],
  ratechange: ["onRateChangeCapture", "onRateChange"],
  seeked: ["onSeekedCapture", "onSeeked"],
  seeking: ["onSeekingCapture", "onSeeking"],
  stalled: ["onStalledCapture", "onStalled"],
  stop: ["onStopCapture", "onStop"],
  suspend: ["onSuspendCapture", "onSuspend"],
  timeupdate: ["onTimeUpdateCapture", "onTimeUpdate"],
  volumechange: ["onVolumeChangeCapture", "onVolumeChange"],
  waiting: ["onWaitingCapture", "onWaiting"],
  resize: ["onResizeCapture", "onResize"],
  pointerdown: ["onPointerDownCapture", "onPointerDown"],
  pointermove: ["onPointerMoveCapture", "onPointerMove"],
  pointerup: ["onPointerUpCapture", "onPointerUp"],
  pointercancel: ["onPointerCancelCapture", "onPointerCancel"],
  copy: ["onCopyCapture", "onCopy"],
  cut: ["onCutCapture", "onCut"],
  paste: ["onPasteCapture", "onPaste"]
};
const reactEventSet = new Set(["onClick", "onContextMenu", "onDoubleClick", "onMouseDown", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp", "onKeyDown", "onKeyPress", "onKeyUp", "onFocus", "onBlur", "onChange", "onInput", "onSubmit", "onInvalid", "onSelect", "onTouchCancel", "onTouchEnd", "onTouchMove", "onTouchStart", "onScroll", "onDrag", "onDragEnd", "onDragEnter", "onDragExit", "onDragLeave", "onDragOver", "onDragStart", "onDrop", "onAbort", "onCanPlay", "onCanPlayThrough", "onDurationChange", "onEmptied", "onEnded", "onLoadedData", "onLoadedMetadata", "onPause", "onPlay", "onPlaying", "onProgress", "onRateChange", "onSeeked", "onSeeking", "onStalled", "onStop", "onSuspend", "onTimeUpdate", "onVolumeChange", "onWaiting", "onResize", "onPointerDown", "onPointerMove", "onPointerUp", "onPointerCancel", "onCopy", "onCut", "onPaste"]);

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PriorityLevel: () => (/* binding */ PriorityLevel),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mini_heap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);


/** 比较函数 */
const compare = (a, b) => {
  const diff = a.expirationTime - b.expirationTime;
  return diff !== 0 ? diff : a.id - b.id;
};

/** 调度优先级 */
let PriorityLevel = /*#__PURE__*/function (PriorityLevel) {
  /** 立即执行优先级 优先级最高 */
  PriorityLevel["IMMEDIATE_PRIORITY"] = "IMMEDIATE_PRIORITY";
  /** 用户阻塞优先级 此之 */
  PriorityLevel["USER_BLOCKING_PRIORITY"] = "USER_BLOCKING_PRIORITY";
  /** 正常默认优先级  */
  PriorityLevel["NORMAL_PRIORITY"] = "NORMAL_PRIORITY";
  /** 低优先级 */
  PriorityLevel["LOW_PRIORITY"] = "LOW_PRIORITY";
  /** IDLE 优先级 优先级最低 等待时间无限长 */
  PriorityLevel["IDLE_PRIORITY"] = "IDLE_PRIORITY";
  return PriorityLevel;
}({});

/** 优先级到超时时间的映射  */
const PRIORITY_LEVEL_TO_TIMEOUT_MAP = {
  [PriorityLevel.IMMEDIATE_PRIORITY]: -1,
  [PriorityLevel.USER_BLOCKING_PRIORITY]: 250,
  [PriorityLevel.NORMAL_PRIORITY]: 500,
  [PriorityLevel.LOW_PRIORITY]: 1000,
  [PriorityLevel.IDLE_PRIORITY]: Number.MAX_SAFE_INTEGER
};

/** 接受参数didUserCallbackTimeout 表示当前是否已经超时,返回值可以是函数(更小的任务) 或者 undefined */

/** 每个任务的最长时间 默认5ms */
const frameYieldMs = 5;

/** 用户任务
 *  Callback 会被封装成Task
 */

/** 导出一个Scheduler 调度器 */
class Scheduler {
  /** 声明任务队列 */
  taskQueue = (() => new _mini_heap__WEBPACK_IMPORTED_MODULE_0__.MiniHeap(compare))();
  /** 声明延迟队列 */
  timerQueue = (() => new _mini_heap__WEBPACK_IMPORTED_MODULE_0__.MiniHeap(compare))();
  /** 任务计数器 */
  userTaskCnt = 0;
  /** 锁属性 */
  /** 时间轴
   *  messageLoop
   * ｜______________________________MessageLoop__________________________________|
   *  hostCallbackScheduled
   * |____hostCa..duled__|
   *  performWork
   *                     |__performWork__|    |__performWork__|   |__performWork__|
   *
   *
   */

  /**
   * MessageLoop锁
   * 本锁表示WorkLoop正在运行， 只要taskQueue中有任务 loop就会持续运行
   * 增加这个锁 为了防止loop被重复开启
   */
  isMessageLoopRunning = false;

  /**
   * HostCallbackScheduled
   * 给HostCallback被调度这个过程上锁，也就是一个时刻只能有一个HostCallback被调度
   * 注意，Scheduler的MessageLoop不会一直空转，只有当taskQueue有任务的时候，才会启动循环
   * scheduler没有一直监测taskQueue是否为空，而是通过，
   *  1. 如果有普通任务被注册，就开启循环，执行完关闭
   *  2. 如果有延迟任务到达延迟时间被放倒taskQueue 就开启循环
   * HostCallbackScheduled 需要保证，一次只能有一个“触发loop过程” 如果同时有大量任务被注册，每次注册都会触发一次loop 会造成资源浪费
   */
  isHostCallbackScheduled = false;

  /** 给perform加锁
   *  同一时刻只能有一个workLoop运行，对其进行加锁
   */
  isPerformingWork = false;

  /** hostTimeoutScheduled 定时任务加锁，一次只能有一个定时任务运行 */
  isHostTimeoutScheduled = false;

  /** 计时器id 用来清理定时器 */
  timerId = (() => void 0)();

  /** 全局任务开始时间 */
  startTime = (() => -1)();

  /** 当前执行的优先级 */
  currentPriorityLevel = (() => PriorityLevel.NORMAL_PRIORITY)();

  /** 注册回调任务 */
  scheduleCallback() {
    let priorityLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PriorityLevel.NORMAL_PRIORITY;
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => {};
    let delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    /** 获取当前高精度时间 */
    const currentTime = performance.now();
    /** 任务开始时间
     *  如果非延迟 就是currentTime
     *  如果配置了delay 则startTime = currentTime + delay
     */
    const startTime = currentTime + delay;

    /** 根据优先级，计算timeout
     *  默认为NORMAL 即 500
     */
    const timeout = PRIORITY_LEVEL_TO_TIMEOUT_MAP[priorityLevel] || PRIORITY_LEVEL_TO_TIMEOUT_MAP[PriorityLevel.NORMAL_PRIORITY];

    /** 过期时间
     *  对于普通任务 currentTime + timeout
     *  对于延迟任务 currentTime + delay + timeout
     */
    const expirationTime = startTime + timeout;

    /** 把callback封装成UserCallbackTask  */
    const userCallbackTask = {
      id: this.userTaskCnt++,
      priorityLevel,
      startTime,
      expirationTime,
      callback,
      sortIndex: -1
    };
    if (startTime > currentTime) {
      /** 如果是延迟任务, 用startTime来用作sortIndex排序调度 当达到开始时间后，转移到taskQueue */
      userCallbackTask.sortIndex = startTime;
      /** 加入延迟队列 */
      this.timerQueue.push(userCallbackTask);
      // 看一下当前最新的timertask是不是当前task，如果不是不用管 此时要么有运行中的定时器，要么messageLoop在运行
      if (this.timerQueue.peek() === userCallbackTask) {
        // 如果当前有timer 取消
        this.cancelHostTimeout();
        this.requestHostTimeout(this.handleTimeout, userCallbackTask.startTime - performance.now());
      }
    } else {
      /** 如果是普通任务 普通任务使用expirationTime 作为sortIndex调度 */
      userCallbackTask.sortIndex = expirationTime;
      /** 加入taskQueue */
      this.taskQueue.push(userCallbackTask);
      // 没有loop触发事件在运行时 触发loop
      if (!this.isHostCallbackScheduled && !this.isPerformingWork) {
        this.isHostCallbackScheduled = true; // 上锁
        this.requestHostCallback();
      }
    }
    return userCallbackTask;
  }

  /** 取消任务 */
  cancelCallback(task) {
    task.callback = null;
  }

  /** 开启任务循环 */
  requestHostCallback() {
    /** 在这里开启循环，并且上锁，保证只有一个performWorkUntilDeadline在运行 */
    if (!this.isMessageLoopRunning) {
      this.isMessageLoopRunning = true;
      this.schedulePerformWorkUntilDeadline();
    }
  }
  advacneTimers() {}

  /** 处理完成延迟
   * 1. 解锁
   * 2. 查看messageloop是否在运行，如果没有运行则触发
   */
  handleTimeout() {
    // 解锁
    this.isHostTimeoutScheduled = false;
    this.advacneTimers();

    // 检查taskQueue
    if (!this.isHostTimeoutScheduled) {
      // 这里isPerformingWork一定是false 因为在执行任务的时候 会把timer都取消掉
      const task = this.taskQueue.peek();
      if (task) {
        // 开始调度触发循环
        this.isHostTimeoutScheduled = true;
        this.requestHostCallback();
      } else {
        // 如果没有触发循环，则需要再次检查timerQueue 还有没有任务
        const peekTimer = this.timerQueue.peek();
        if (peekTimer) {
          this.requestHostTimeout(this.handleTimeout, peekTimer.startTime - performance.now());
        }
      }
    }
  }

  /** 对settimeout的包装，并且保存timerId */
  requestHostTimeout(handler, delay) {
    // 加锁
    if (!this.isHostTimeoutScheduled) {
      this.isHostTimeoutScheduled = true;
      this.timerId = setTimeout(handler, delay);
    }
  }

  /** 取消定时任务 */
  cancelHostTimeout() {
    if (this.isHostTimeoutScheduled) {
      clearTimeout(this.timerId);
      this.timerId = void 0;
      // 解锁
      this.isHostTimeoutScheduled = false;
    }
  }

  /** 持续循环运行任务
   * 开启一个时间切片的任务，时间切片的宽度为frameYieldMs 默认5ms
   * 每次时间切片运行结束后，如果还有任务，重复调用performWorkUntilDeadline继续运行
   * 没有任务了，则释放isMessageLoopRunning锁，循环停止运行
   */
  performWorkUntilDeadline() {
    if (this.isMessageLoopRunning) {
      /** 获得每次循环的开始时间 */
      const workStartTime = performance.now();
      this.startTime = workStartTime;
      /**
       * 解释一下，这里为什么用try..finally
       * try中调用flushWork 执行任务，每次执行任务时，会从taskQueue中peek一个任务运行
       * peek出来之后，会先把task.callback保存到一个临时变量callback中，并且给 task.callback 赋 null
       * 判断这个临时的callback 如果是function 则运行，运行之后如果还有没运行完的任务 再给task.callback = remainingTaskFunc
       * 如果callback 不存在 或者不是函数 不可运行 则直接弹出这个任务
       *
       * 如果callback执行内部报错，那么此时 task.callback = null 并且跳出flushWork 这里的做法是，如果有错误则忽略掉，通过finally继续开启下一个performWorkUntilDeadline
       * 当下一个performWorkUntilDeadline开启后，由于task.callback = null 会直接pop出taskQueue 做到了忽略错误继续运行loop
       */
      let hasMorkWork = true;
      try {
        hasMorkWork = this.flushWork(workStartTime);
      } finally {
        if (hasMorkWork) {
          /** 还有任务 继续运行 */
          this.schedulePerformWorkUntilDeadline();
        } else {
          /** 没有任务了 关闭loop */
          this.isMessageLoopRunning = false;
        }
      }
    }
  }

  /** 调度任务 使用messageChannel
   *  messageChannel的好处是
   *  1. 可以创建宏任务 不阻塞主线程
   *  2. 相比于settimeout 延迟更小
   *  3. 在没有messageChannel的情况下，使用settimeout兜底
   */
  schedulePerformWorkUntilDeadline() {
    if (typeof MessageChannel === "function") {
      const messageChannel = new MessageChannel();
      messageChannel.port2.onmessage = this.performWorkUntilDeadline.bind(this);
      /** 发送消息 */
      messageChannel.port1.postMessage(null);
    } else {
      /* 没有MessageChannel 用settimeout兜底*/
      setTimeout(() => {
        this.performWorkUntilDeadline();
      });
    }
  }

  /**
   * flushWork 运行任务 一个5ms的时间 并且返回是否还有任务
   * @param workStartTime
   * @returns
   */
  flushWork(workStartTime) {
    /** flushWork 的作用是
     * 1. 调用workloop 并且保证workloop是临界资源，对其加锁
     * 2. 如果有延迟任务在运行，则取消掉，因为延迟任务没意义了
     * （延迟任务就是为了在延迟到达的时候把任务放到taskQueue 并且开启loop 在当前任务执行完之前 延迟任务即使到达了 也只能等着，在每次workLoop的小循环运行结束和workLoop运行结束 都会advaned）
     * 3.任务开始了 代表 hostCallbackSchedule的调度过程（loop触发过程）已经结束 释放锁
     * 4. 使用try..finally 忽略错误，在finally中释放isPerformWork
     *
     */
    this.isHostCallbackScheduled = false;
    // 定时任务没必要和messageLoop一起运行，这里取消掉定时器
    this.cancelHostTimeout();

    // 加锁
    this.isPerformingWork = true;
    const previousPriorityLeve = this.currentPriorityLevel;
    try {
      return this.workLoop(workStartTime);
    } finally {
      /** 注意 这里finally一定会在最后执行 即便上面有return （return只是标记了返回点） */
      this.isPerformingWork = false;
      /** 恢复优先级 */
      this.currentPriorityLevel = previousPriorityLeve;
    }
  }

  /**
   * workLoop
   * @param workStartTime
   */
  workLoop(workStartTime) {
    /** workloop是个临界资源
     *  其功能是，在一个时间片内 （5ms）持续运行任务，直到时间片耗完
     *  注意，为什么要设计一个固定时间5ms 很多任务是很小的，可能其运行时间很短，如果一个workLoop只运行一个任务，很可能造成浪费
     *  进入workLoop之前会做很多准备 比如加锁 计算时间等 如果只为了运行一个小人物 很浪费资源，所以这里设计成了 一个时间片就是5ms
     *  如果运行完一个任务还有时间 就继续运行 直到5ms
     */
    // 当前时间
    let workCurrentTime = workStartTime;
    // 先检查一下有没有延迟任务需要加入到taskQueue
    this.advacneTimers();
    // 取得优先级最高的任务
    let currentTask = this.taskQueue.peek();

    /** 开始循环，每次循环都取新的currentTask
     * 有几种情况会停止循环
     * 1. 当前过期时间最小的任务还没过期 同时时间片结束 跳出循环，释放主线程
     * 2. 如果已经过期，并且时间片也结束，会继续运行，交给用户决定要不要继续运行，如果继续运行则用户会在callback中继续执行逻辑，带来的可能是页面卡顿
     *    如果用户不继续执行了，返回一个新的callback function 来处理剩下的任务即可
     * 3. workloop 对于小任务 会在一次执行过程（时间片5ms）内 执行多个，但是对于大任务，只会执行一个部分
     * 4. 如果定义大任务，如果用户的callback返回了一个函数 代表此任务为大任务 还有剩余任务，此时即便时间片还没用完 也要结束workLoop 释放主线程，下一个loop在执行
     */

    let isUserCallbackTimeout = false;
    while (currentTask) {
      // 更新判断是否超时
      isUserCallbackTimeout = currentTask.expirationTime < workCurrentTime;
      if (!isUserCallbackTimeout && this.shouldYieldToHost()) {
        // 让出主线程
        break;
      }

      /** 还有时间 执行callback */
      const callback = currentTask.callback;
      if (typeof callback === "function") {
        // callback置空
        currentTask.callback = null;
        // 更新优先级
        this.currentPriorityLevel = currentTask.priorityLevel;
        // 保证callback可调用
        const continuationCallback = callback(isUserCallbackTimeout);
        if (typeof continuationCallback === "function") {
          // 如果返回了剩余任务，表示当前执行的是大任务，重新给task的callback赋值，结束workloop
          currentTask.callback = continuationCallback;
          // 看一下是否有可以加入到taskQueue的延迟任务
          this.advacneTimers();
          // 表示还有任务
          return true;
        } else {
          // 当前任务执行完了，小任务，继续while执行
          if (currentTask === this.taskQueue.peek()) {
            this.taskQueue.pop(); // 弹出当前执行完的任务
          }
          // 看一下是否有可以加入到taskQueue的延迟任务
          this.advacneTimers();
        }
      } else {
        // 如果callback为空 或者不是函数，说明当前任务不可执行 也可能是当前任务已经报错了，直接弹出
        this.taskQueue.pop();
      }

      // 此时 继续循环执行小任务 取下一个任务
      currentTask = this.taskQueue.peek();
    }

    // 执行到这里，1.可能是是currentTask没超时，但是没有时间片了，推出workLoop，返回true表示还是任务 2.可能是没任务了
    if (currentTask) {
      return true;
    } else {
      // taskQueue没有任务了，此时返回false，此时flushwork结束，messageLoop结束，需要开启延迟任务，以确保在延迟到达时，能启动messageLoop
      const timerTask = this.timerQueue.peek();
      if (timerTask) {
        // 检查timerQueue 有任务则开启
        const firstTimer = this.timerQueue.peek();
        if (firstTimer) {
          this.requestHostTimeout(this.handleTimeout, firstTimer.startTime - performance.now());
        }
      }
      return false;
    }
  }

  /** 是否应当让出主线程 */
  shouldYieldToHost() {
    const timeElapsed = performance.now() - this.startTime;
    if (timeElapsed < frameYieldMs) {
      // The main thread has only been blocked for a really short amount of time;
      // smaller than a single frame. Don't yield yet.
      return false;
    }
    // Yield now.
    return true;
  }

  /** 获取当前的优先级 */
  getCurrentPriorityLevel() {
    return this.currentPriorityLevel;
  }

  /** 以某优先级同步运行 */
  runWithPriority(priorityLevel, callback) {
    const priviouseLevel = this.currentPriorityLevel;
    this.currentPriorityLevel = priorityLevel;
    try {
      callback();
    } catch (e) {
      console.warn(e);
    } finally {
      this.currentPriorityLevel = priviouseLevel;
    }
  }
}
const scheduler = new Scheduler();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (scheduler);

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MiniHeap: () => (/* binding */ MiniHeap)
/* harmony export */ });
/** 实现一个小顶堆 用来维护最高优先级任务队列 */
class MiniHeap {
  constructor(compare) {
    this.data = [];
    this.compare = compare || function (a, b) {
      return a - b;
    };
  }

  /** 增加元素 */
  push(value) {
    const index = this.data.length;
    this.data[index] = value;
    this.shiftUp(index);
  }

  /** 获取顶部元素 */
  peek() {
    return this.data[0];
  }

  /** 从顶部删除元素 */
  pop() {
    if (this.data.length <= 1) {
      return this.data.shift();
    }
    const root = this.data[0];
    const last = this.data.pop();
    if (last !== void 0 && root !== last) {
      this.data[0] = last;
      this.shiftDown(0);
      return root;
    } else {
      return root;
    }
  }

  /* 向上调整 */
  shiftUp(i) {
    /** i === 0 根节点不用向上调整 */
    while (i > 0) {
      // 找到parentIndex
      const parentIndex = i >>> 1;
      const parentValue = this.data[parentIndex];
      const currentValue = this.data[i];
      if (this.compare(parentValue, currentValue) > 0) {
        /** 和父节点交换 */
        swap(this.data, i, parentIndex);

        /** 设置新的i */
        i = parentIndex;
      } else {
        /** 满足小顶堆 不调整 */
        return;
      }
    }
  }

  /** 向下调整 */
  shiftDown(i) {
    /** 调整到最后一个非叶子结点 */
    const len = this.data.length;
    const lastParentIndex = (len >>> 1) - 1;
    /** 叶子结点 不用调整 */
    while (i <= lastParentIndex) {
      /** 获取左右孩子 */
      const leftChildIndex = (i + 1) * 2 - 1;
      const rightChildIndex = leftChildIndex + 1;
      const currentValue = this.data[i];
      const leftChild = this.data[leftChildIndex];
      const rightChild = this.data[rightChildIndex];
      /** i 不是叶子结点 一定有左孩子 */
      if (this.compare(currentValue, leftChild) > 0) {
        /** i不是最小的情况下 leftChild小 需要和rightChild（若存在） 比 找到最小的一个 */
        if (rightChildIndex < len && this.compare(leftChild, rightChild) > 0) {
          /** right存在 且小 交换right和i 并且修改i为rightIndex [i > left > right]*/
          swap(this.data, i, rightChildIndex);
          i = rightChildIndex;
        } else {
          /** right不存在 或者 left < right 交换left和i 并且修改i为leftIndex [i > right > left]*/
          swap(this.data, i, leftChildIndex);
          i = leftChildIndex;
        }
      } else {
        /** i 可能是最小的情况下  此时比较i和right 找出最小值 （若存在）*/
        if (rightChildIndex < len && this.compare(currentValue, rightChild) > 0) {
          /** right存在 且最小 left > i > right */
          swap(this.data, i, rightChildIndex);
          i = rightChildIndex;
        } else {
          /** 最后一种 i最小 不处理 已经是小顶堆 */
          return;
        }
      }
    }
  }

  /** 展示树结构 */
  show() {
    const arr = this.data;
    if (!arr || arr.length === 0) return "";

    // Helper function to build the tree string
    function buildTreeString(index, level, space) {
      if (index >= arr.length || arr[index] === null || arr[index] === undefined) return "";
      const node = arr[index];
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;
      let treeString = "";

      // Build right subtree
      treeString += buildTreeString(rightIndex, level + 1, space + 6);

      // Add current node with proper indentation and branch lines
      treeString += " ".repeat(space) + node + "\n";

      // Build left subtree
      treeString += buildTreeString(leftIndex, level + 1, space + 6);
      return treeString;
    }

    // Start building the tree string from the root node (index 0)
    return buildTreeString(0, 0, 0);
  }
  toString = this.show;
  toJSON = this.show;
  valueOf = this.show;
}
function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FiberNode: () => (/* binding */ FiberNode),
/* harmony export */   FiberRootNode: () => (/* binding */ FiberRootNode),
/* harmony export */   createFiberFromElement: () => (/* binding */ createFiberFromElement),
/* harmony export */   createFiberFromFragment: () => (/* binding */ createFiberFromFragment),
/* harmony export */   createWorkInProgress: () => (/* binding */ createWorkInProgress)
/* harmony export */ });
/* harmony import */ var _flags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _workTag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _fiberLanes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);





/** 记录当前Fiber对象依赖的Context
 *   firstContext 依赖的第一个Context
 *   lanes 所有依赖context对应更新的
 */

/** Fiber节点类 */
class FiberNode {
  // 唯一id

  // fiber节点的类型

  /** element对应的Type */

  /** ref */

  // 对应的dom节点 可能为null

  // 记录状态信息

  // 记录的Props

  // 表示fiber node之间的关系
  // diff比较的index
  // 兄弟节点
  //父节点
  // 子节点

  // flags 副作用
  // 当前节点的flag
  // 当前节点为根的子树flag的merge
  // 待处理的props

  // 更新队列

  // 双缓存

  /** lane相关 */
  /** 当前fiber上的更新lanes */

  /** 当前fiber的子fiber树上的优先级 */

  /** Fiber依赖的Context */

  constructor(tag, pendingProps, key) {
    // 没传key的情况下 都是null 在Diff reconcileArray的时候 会使用index
    this.key = key || null;
    this.tag = tag;
    this.type = null;
    this.ref = null;
    this.stateNode = null;
    this.memorizedState = null;
    this.memorizedProps = null;
    this.index = 0;
    this.sibling = null;
    this.child = null;
    this.return = null;

    // 副作用
    this.flags = _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags;
    this.subTreeFlags = _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags;
    this.pendingProps = pendingProps;
    this.delections = null;
    this.updateQueue = null;
    this.alternate = null;

    /** lanes相关 */
    this.lanes = _fiberLanes__WEBPACK_IMPORTED_MODULE_3__.NoLanes;
    this.childLanes = _fiberLanes__WEBPACK_IMPORTED_MODULE_3__.NoLanes;
    this.dependencies = null;
  }
}

/** 只有一个 整个应用的根 */
class FiberRootNode {
  /** 表示commit阶段收集到的 等待被处理的被动Effect  被动Effect: 不会引起重新渲染的effect*/

  /** 和lane相关的属性 */
  /** 当前还未运行的任务的lane合集 */

  /** 已经完成运行的更新对应的lane 在render阶段结束之后设置，在commit阶段置空 类似于finishedWork */

  /** 需要传入container 和 第一个HostRootFiber */
  constructor(conatiner, hostRootFiber) {
    /** 保存container */
    this.container = conatiner;
    this.finishedWork = null;
    /** 需要建立关系：
     *  FiberRootNode.current -> hostRootFiber
     *  hostRootFiber.stateNode -> FiberRootNode
     */
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;

    /** 初始化pendingPassiveEffect */
    this.pendingPassiveEffects = {
      unmount: [],
      update: []
    };

    /** 初始化lane */
    this.pendingLanes = _fiberLanes__WEBPACK_IMPORTED_MODULE_3__.NoLanes;
    this.finishedLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_3__.NoLane;
  }
}

/** 根据现有的Fiber节点，创建更新的Fiber节点
 * 如果当前Fiber节点存在alternate 复用
 * 弱不存在，创建新的FiberNode
 * 将current的内容拷贝过来 包含lane memorizedState/props child 等
 *
 * 在Fiber节点内容可以复用的情况调用，新的fiber节点的 tag type stateNode 等会复用 ｜ props，lane flags delecation这些副作用 会重置
 */
function createWorkInProgress(currentFiber, pendingProps) {
  /** 创建wip 当前的workInProgress 先看看能不能复用.alternate */
  let wip = currentFiber.alternate;
  if (wip === null) {
    /** mount阶段，说明对面不存在alternate节点 */
    wip = new FiberNode(currentFiber.tag, pendingProps, currentFiber.key);
    /** stateNode为fiber对应的真实dom节点 */
    wip.stateNode = currentFiber.stateNode;
    /** 建立双向的alternate链接 */
    wip.alternate = currentFiber;
    currentFiber.alternate = wip;
  } else {
    /** update节点，复用 重置副作用 */
    wip.flags = _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags;
    wip.subTreeFlags = _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags;
    wip.pendingProps = pendingProps;
    wip.delections = null;
  }

  // 剩下的可以复用
  wip.key = currentFiber.key;
  wip.tag = currentFiber.tag;
  wip.type = currentFiber.type;
  // ref需要传递
  wip.ref = currentFiber.ref;
  wip.memorizedState = currentFiber.memorizedState;
  wip.memorizedProps = currentFiber.memorizedProps;
  wip.updateQueue = currentFiber.updateQueue;
  //  这里需要注意，只需要复用child 可以理解为 新的节点的child指向currentFiber.child 因为后面diff的时候 只需要用的child，仅做对比，
  // 后面会创建新的fiber 此处不需要sibling和return 进行了连接 可以理解成 只复用alternate的内容 不复用其节点之间的关系
  // stateNode也不需要复用 因为alternate和currentFiber之间 如果有关联，那么type一定是相等的
  wip.child = currentFiber.child;

  /** 注意复用的时候 一定要把lane拷贝过去 */
  wip.lanes = currentFiber.lanes;
  wip.childLanes = currentFiber.childLanes;
  /** 需要拷贝dependencies */
  wip.dependencies = currentFiber.dependencies ? {
    ...currentFiber.dependencies
  } : null;
  return wip;
}

/**
 * 从ReactElement对象 创建Fiber对象
 * @param element
 */
function createFiberFromElement(element) {
  // 默认fiberTag = FunctionComponent
  let fiberTag = _workTag__WEBPACK_IMPORTED_MODULE_2__.FunctionComponent;
  let pendingProps = element.props;

  // hostComponent的element.type为string
  if (typeof element.type === "string") {
    fiberTag = _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent;
  } else if (typeof element.type === "object") {
    switch (element.type?.$$typeof) {
      case _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_1__.REACT_MEMO_TYPE:
        // 设置memo类型的fiberTag
        fiberTag = _workTag__WEBPACK_IMPORTED_MODULE_2__.MemoComponent;
        break;
      case _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_1__.REACT_PROVIDER_TYPE:
        // 设置Context.Provider类型的FiberTag
        fiberTag = _workTag__WEBPACK_IMPORTED_MODULE_2__.ContextProvider;
        break;
    }
  } else if (element.type === _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_1__.REACT_FRAGMENT_TYPE || element.type === void 0) {
    fiberTag = _workTag__WEBPACK_IMPORTED_MODULE_2__.Fragment;
    return createFiberFromFragment(element.props.children, element.key);
  }
  const fiber = new FiberNode(fiberTag, pendingProps, element.key);
  fiber.type = element.type;
  // 这里需要设置ref 新创建的fiber节点 非复用的情况下 需要从element.ref获取ref
  fiber.ref = element.ref;
  return fiber;
}
function createFiberFromFragment(elemenst, key) {
  const fragmentFiber = new FiberNode(_workTag__WEBPACK_IMPORTED_MODULE_2__.Fragment, elemenst, key);
  return fragmentFiber;
}

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChildDeletion: () => (/* binding */ ChildDeletion),
/* harmony export */   DidCapture: () => (/* binding */ DidCapture),
/* harmony export */   HostEffectMask: () => (/* binding */ HostEffectMask),
/* harmony export */   LayoutMask: () => (/* binding */ LayoutMask),
/* harmony export */   MutationMask: () => (/* binding */ MutationMask),
/* harmony export */   NoFlags: () => (/* binding */ NoFlags),
/* harmony export */   PassiveEffect: () => (/* binding */ PassiveEffect),
/* harmony export */   PassiveMask: () => (/* binding */ PassiveMask),
/* harmony export */   Placement: () => (/* binding */ Placement),
/* harmony export */   Ref: () => (/* binding */ Ref),
/* harmony export */   ShouldCapture: () => (/* binding */ ShouldCapture),
/* harmony export */   Update: () => (/* binding */ Update),
/* harmony export */   Visibility: () => (/* binding */ Visibility)
/* harmony export */ });
const NoFlags = 0b0000000;
const Placement = 0b0000001;
const Update = 0b0000010;
const ChildDeletion = 0b0000100;
const PassiveEffect = 0b0001000;
const Ref = 0b0010000;
const Visibility = 0b0100000;

// 捕获到 something
const DidCapture = 0b1000000;

// unwind应该捕获、还未捕获到
const ShouldCapture = 0b1000000000000;

// mutation阶段的mask 需要包含ref
const MutationMask = Placement | Update | ChildDeletion | Ref | Visibility;
// layout阶段的mask
const LayoutMask = Ref;
const PassiveMask = PassiveEffect | ChildDeletion;
const HostEffectMask = MutationMask | LayoutMask | PassiveMask | DidCapture;

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContextProvider: () => (/* binding */ ContextProvider),
/* harmony export */   Fragment: () => (/* binding */ Fragment),
/* harmony export */   FunctionComponent: () => (/* binding */ FunctionComponent),
/* harmony export */   HostComponent: () => (/* binding */ HostComponent),
/* harmony export */   HostRoot: () => (/* binding */ HostRoot),
/* harmony export */   HostText: () => (/* binding */ HostText),
/* harmony export */   LazyComponent: () => (/* binding */ LazyComponent),
/* harmony export */   MemoComponent: () => (/* binding */ MemoComponent),
/* harmony export */   OffscreenComponent: () => (/* binding */ OffscreenComponent),
/* harmony export */   SuspenseComponent: () => (/* binding */ SuspenseComponent)
/* harmony export */ });
/** workTag 记录Fiber节点的类型 */

const FunctionComponent = 0;
const HostRoot = 3;
const HostComponent = 5;
// <div>123</div>
const HostText = 6;
const Fragment = 7;
const ContextProvider = 8;
const SuspenseComponent = 13;
const OffscreenComponent = 14;
const LazyComponent = 16;
const MemoComponent = 15;

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultHydrationLane: () => (/* binding */ DefaultHydrationLane),
/* harmony export */   DefaultLane: () => (/* binding */ DefaultLane),
/* harmony export */   DeferredLane: () => (/* binding */ DeferredLane),
/* harmony export */   IdleHydrationLane: () => (/* binding */ IdleHydrationLane),
/* harmony export */   IdleLane: () => (/* binding */ IdleLane),
/* harmony export */   InputContinuousHydrationLane: () => (/* binding */ InputContinuousHydrationLane),
/* harmony export */   InputContinuousLane: () => (/* binding */ InputContinuousLane),
/* harmony export */   NoLane: () => (/* binding */ NoLane),
/* harmony export */   NoLanes: () => (/* binding */ NoLanes),
/* harmony export */   OffscreenLane: () => (/* binding */ OffscreenLane),
/* harmony export */   SelectiveHydrationLane: () => (/* binding */ SelectiveHydrationLane),
/* harmony export */   SomeRetryLane: () => (/* binding */ SomeRetryLane),
/* harmony export */   SyncHydrationLane: () => (/* binding */ SyncHydrationLane),
/* harmony export */   SyncLane: () => (/* binding */ SyncLane),
/* harmony export */   SyncLaneIndex: () => (/* binding */ SyncLaneIndex),
/* harmony export */   SyncUpdateLanes: () => (/* binding */ SyncUpdateLanes),
/* harmony export */   TotalLanes: () => (/* binding */ TotalLanes),
/* harmony export */   TransitionLane: () => (/* binding */ TransitionLane),
/* harmony export */   getHighestPriorityLane: () => (/* binding */ getHighestPriorityLane),
/* harmony export */   getNextLane: () => (/* binding */ getNextLane),
/* harmony export */   includeSomeLanes: () => (/* binding */ includeSomeLanes),
/* harmony export */   isSubsetOfLanes: () => (/* binding */ isSubsetOfLanes),
/* harmony export */   lanesToSchedulerPriority: () => (/* binding */ lanesToSchedulerPriority),
/* harmony export */   markRootFinished: () => (/* binding */ markRootFinished),
/* harmony export */   markRootUpdated: () => (/* binding */ markRootUpdated),
/* harmony export */   mergeLane: () => (/* binding */ mergeLane),
/* harmony export */   removeLanes: () => (/* binding */ removeLanes),
/* harmony export */   requestUpdateLane: () => (/* binding */ requestUpdateLane),
/* harmony export */   schedulerPriorityToLane: () => (/* binding */ schedulerPriorityToLane)
/* harmony export */ });
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _share_transition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/** 实现车道模型优先级 */




/** 单车道 */

/** 多车道 （优先级合集） */

const TotalLanes = 31;
const NoLanes = /*                        */0b0000000000000000000000000000000;
const NoLane = /*                          */0b0000000000000000000000000000000;
const SyncHydrationLane = /*               */0b0000000000000000000000000000001;
const SyncLane = /*                        */0b0000000000000000000000000000010;
const SyncLaneIndex = 1;
const InputContinuousHydrationLane = /*    */0b0000000000000000000000000000100;
const InputContinuousLane = /*             */0b0000000000000000000000000001000;
const DefaultHydrationLane = /*            */0b0000000000000000000000000010000;
const DefaultLane = /*                     */0b0000000000000000000000000100000;
const SyncUpdateLanes = SyncLane | InputContinuousLane | DefaultLane;
const TransitionLane = /*                        */0b0000000000000000000000010000000;
const TransitionHydrationLane = /*                */0b0000000000000000000000001000000;
const TransitionLanes = /*                       */0b0000000001111111111111110000000;
const TransitionLane1 = /*                        */0b0000000000000000000000010000000;
const TransitionLane2 = /*                        */0b0000000000000000000000100000000;
const TransitionLane3 = /*                        */0b0000000000000000000001000000000;
const TransitionLane4 = /*                        */0b0000000000000000000010000000000;
const TransitionLane5 = /*                        */0b0000000000000000000100000000000;
const TransitionLane6 = /*                        */0b0000000000000000001000000000000;
const TransitionLane7 = /*                        */0b0000000000000000010000000000000;
const TransitionLane8 = /*                        */0b0000000000000000100000000000000;
const TransitionLane9 = /*                        */0b0000000000000001000000000000000;
const TransitionLane10 = /*                       */0b0000000000000010000000000000000;
const TransitionLane11 = /*                       */0b0000000000000100000000000000000;
const TransitionLane12 = /*                       */0b0000000000001000000000000000000;
const TransitionLane13 = /*                       */0b0000000000010000000000000000000;
const TransitionLane14 = /*                       */0b0000000000100000000000000000000;
const TransitionLane15 = /*                       */0b0000000001000000000000000000000;
const RetryLanes = /*                            */0b0000011110000000000000000000000;
const RetryLane1 = /*                             */0b0000000010000000000000000000000;
const RetryLane2 = /*                             */0b0000000100000000000000000000000;
const RetryLane3 = /*                             */0b0000001000000000000000000000000;
const RetryLane4 = /*                             */0b0000010000000000000000000000000;
const SomeRetryLane = RetryLane1;
const SelectiveHydrationLane = /*          */0b0000100000000000000000000000000;
const NonIdleLanes = /*                          */0b0000111111111111111111111111111;
const IdleHydrationLane = /*               */0b0001000000000000000000000000000;
const IdleLane = /*                        */0b0010000000000000000000000000000;
const OffscreenLane = /*                   */0b0100000000000000000000000000000;
const DeferredLane = /*                    */0b1000000000000000000000000000000;

// 主要用到 SyncLane  InputContinuousLane  DefaultLane  TransitionLane  IdleLane

// 需要实现的方法

/**
 * 合并两个优先级
 * @param lane1
 * @param lane2
 * @returns mergedLanes
 */
function mergeLane(lane1, lane2) {
  return lane1 | lane2;
}

/**
 * 从某个lanes集合中 移除单个lane/lanes
 * @param laneSet
 * @param subset
 * @returns
 */
function removeLanes(laneSet, subset) {
  return laneSet & ~subset;
}

/**
 * 从某个lanes集合中，找到优先级最高的lane
 * 注意，lane模型中，越小优先级越高，计算对应如下
 * ( min(lanes) = lanes&-lanes 注意-lanes 是二进制的取反+1)
 *  举例： 0b00110 => 取反 0b11001 => 加1 => 0b11010 => 0b00110 & 0b11010 = 0b00010
 * @param lanes
 * @returns
 */
function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}

/**
 * 判断某个lane集合是不是另外一个lanes集合的子集 sub必须完全包含在
 * @param laneSet
 * @param subSet
 */
function isSubsetOfLanes(laneSet, subSet) {
  return (laneSet & subSet) === subSet;
}

/**
 * 某个set集合 是否包含某个集合的部分lane 包含即可
 * @param laneSet
 * @param subSet
 * @returns
 */
function includeSomeLanes(laneSet, subSet) {
  return (laneSet & subSet) !== NoLanes;
}

/** 和root操作相关 */
/**
 * 获取当前root优先级最高的lan
 * @param lanes
 */
function getNextLane(root) {
  const pendingLanes = root.pendingLanes;
  /** 调用getHighestPriorityLane 获取最高优先级lane */
  return getHighestPriorityLane(pendingLanes);
}

/**
 * 把某个更新的lane加入到root.pendingLanes
 * @param root
 * @param lane
 */
function markRootUpdated(root, lane) {
  root.pendingLanes = mergeLane(root.pendingLanes, lane);
}

/**
 * 去掉root的某条lane （标记lane对应任务执行完成）
 * @param root
 * @param lane
 */
function markRootFinished(root, lane) {
  root.pendingLanes = removeLanes(root.pendingLanes, lane);
}

/** 转换函数 */
/**
 * scheduler 优先级 转 lane优先级
 * @param schdulerPriority
 */
function schedulerPriorityToLane(schdulerPriority) {
  switch (schdulerPriority) {
    case _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.IMMEDIATE_PRIORITY:
      return SyncLane;
    case _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.USER_BLOCKING_PRIORITY:
      return InputContinuousLane;
    case _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.NORMAL_PRIORITY:
      return DefaultLane;
    default:
      return IdleLane;
  }
}

/**
 * lanes优先级转scheduler优先级 （取lanes中优先级最高的lane 调用getHighestPriorityLane）
 * @param lanes
 */
function lanesToSchedulerPriority(lanes) {
  const highestPriorityLane = getHighestPriorityLane(lanes);
  switch (highestPriorityLane) {
    case SyncLane:
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.IMMEDIATE_PRIORITY;
    case InputContinuousLane:
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.USER_BLOCKING_PRIORITY;
    case TransitionLane:
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.LOW_PRIORITY;
    case DeferredLane:
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.IDLE_PRIORITY;
    default:
      return _scheduler__WEBPACK_IMPORTED_MODULE_0__.PriorityLevel.NORMAL_PRIORITY;
  }
}

/**
 * 根据当前update触发上下文 获取update优先级
 * 比如 setState在effect中触发和在onclick中触发 有不一样的优先级
 */
function requestUpdateLane() {
  if (_share_transition__WEBPACK_IMPORTED_MODULE_1__.TRANSITION_CONFIG.isTransition) {
    return TransitionLane;
  }
  const currentUpdateLane = schedulerPriorityToLane(_scheduler__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrentPriorityLevel());
  return currentUpdateLane;
}

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TRANSITION_CONFIG: () => (/* binding */ TRANSITION_CONFIG)
/* harmony export */ });
// 导出共享变量
const TRANSITION_CONFIG = {
  isTransition: false
};

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FCUpdateQueue: () => (/* binding */ FCUpdateQueue),
/* harmony export */   Update: () => (/* binding */ Update),
/* harmony export */   UpdateQueue: () => (/* binding */ UpdateQueue)
/* harmony export */ });
/* harmony import */ var _fiberLanes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/** 更新队列
 * 更新队列是一个环状链表 包含next 指向下一个Update
 * 最后一个Update的next又指向第一个Update
 */



/** 更新的Action 可以是State 也可以是函数 */

/** 定义Dispatch函数 */

/** 更新对象 */
class Update {
  // 当前更新的优先级Lane
  /** eagerState的逻辑
   *  eagerState 急迫的状态修改
   *  当 当前updateQueue中无update时，会启用该优化
   *  次优化会在调度update之前就运行一下action 判断值是否变化 如果没变化 则把update加入queue 并且推出此次update 调度
   */

  constructor(action, lane) {
    this.action = action;
    this.next = null;
    this.lane = lane;
    this.hasEagerState = false;
    this.eagerState = null;
  }
}

/** 更新队列 */
class UpdateQueue {
  /** 派发函数 */

  /** 基础队列 */

  /** 基础state */

  /** 上一次的state 历史记录 用来检查state是否改变 */

  constructor() {
    /** 初始化 */
    this.shared = {
      pending: null
    };
    this.dispatch = null;
    this.baseQueue = null;
    this.baseState = null;
    this.lastRenderedState = null;
  }

  /** 入队，构造环状链表 */
  enqueue(update, fiber, lane) {
    if (this.shared.pending === null) {
      // 插入第一个元素，此时的结构为
      // shared.pending -> firstUpdate.next -> firstUpdate
      update.next = update;
      this.shared.pending = update;
    } else {
      // 插入第二个元素
      update.next = this.shared.pending.next;
      this.shared.pending.next = update;
      this.shared.pending = update;
    }
    /** 在当前的fiber上设置lane */
    fiber.lanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_0__.mergeLane)(fiber.lanes, lane);
    /** 在current上也设置lane 因为在beginwork阶段 wip.lane = NoLane 如果bailout 需要从current恢复 */
    const current = fiber.alternate;
    if (current) {
      current.lanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_0__.mergeLane)(current.lanes, lane);
    }
  }

  /** 处理任务 */
  process(renderLane, onSkipUpdate) {
    /** 获取baseQueue pending 完成拼接 */
    let baseState = this.baseState;
    let baseQueue = this.baseQueue;
    const currentPending = this.shared.pending;

    // 生成新的baseQueue过程
    if (currentPending !== null) {
      if (baseQueue !== null) {
        // 拼接两个队列
        // pending -> p1 -> p2 -> p3
        const pendingFirst = currentPending.next; // p1
        // baseQueue -> b1->b2->b3
        const baseFirst = baseQueue.next; // b1
        // 拼接
        currentPending.next = baseFirst; // p1 -> p2 -> p3 -> pending -> b1 -> b2 -> b3
        baseQueue.next = pendingFirst; //b1-> b2 -> b3 -> baseQueue -> p1 -> p2 -> p3
        // p1 -> p2 -> p3 -> pending -> b1 -> b2 -> b3 baseQueue
      }
      // 合并 此时 baseQueue -> b1 -> b2 -> b3 -> p1 -> p2 -> p3
      baseQueue = currentPending;

      // 覆盖新的baseQueue
      this.baseQueue = baseQueue;

      // pending可以置空了
      this.shared.pending = null;
    }

    // 消费baseQueue过程
    // 设置新的basestate和basequeue
    let newBaseState = baseState;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    // 新的计算值
    let memorizedState = baseState;

    // 当前遍历到的update
    let currentUpdate = this.baseQueue?.next;
    if (currentUpdate) {
      do {
        const currentUpdateLane = currentUpdate.lane;
        // 看是否有权限
        if ((0,_fiberLanes__WEBPACK_IMPORTED_MODULE_0__.isSubsetOfLanes)(renderLane, currentUpdateLane)) {
          // 有权限
          if (newBaseQueueFirst !== null) {
            // 已经存在newBaseFirst 则往后加此次的update 并且将此次update的lane设置为NoLane 保证下次一定能运行
            const clone = new Update(currentUpdate.action, _fiberLanes__WEBPACK_IMPORTED_MODULE_0__.NoLane);
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }
          if (currentUpdate.hasEagerState) {
            memorizedState = currentUpdate.eagerState;
          } else {
            // 不论存不存在newBaseFirst 都要计算memorizedState
            const currentAction = currentUpdate.action;
            if (currentAction instanceof Function) {
              /** Action是函数类型 运行返回newState */
              memorizedState = currentAction(memorizedState);
            } else {
              /** 非函数类型，直接赋给新的state */
              memorizedState = currentAction;
            }
          }
        } else {
          // 无权限
          const clone = new Update(currentUpdate.action, currentUpdate.lane);
          if (onSkipUpdate) {
            onSkipUpdate(clone);
          }
          // 如果newBaseQueueFirst === null 则从第一个开始添加newbaseQueue队列
          if (newBaseQueueFirst === null) {
            newBaseQueueFirst = newBaseQueueLast = clone;
            // newBaseState到此 不在往后更新 下次从此开始
            newBaseState = memorizedState;
          } else {
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }
        }
        currentUpdate = currentUpdate.next;
      } while (currentUpdate !== this.baseQueue?.next);
    }
    if (newBaseQueueFirst === null) {
      // 此次没有update被跳过，更新newBaseState
      newBaseState = memorizedState;
    } else {
      // newbaseState不变 newBaseQueueFirst newBaseQueueLast 成环
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    // 保存baseState和BaseQueue
    this.baseQueue = newBaseQueueLast;
    this.baseState = newBaseState;
    return {
      memorizedState
    };
  }
}

/** 函数组件专用的UpdateQueue增加了lastEffect 指向当前收集到的Effect */
class FCUpdateQueue extends UpdateQueue {
  lastEffect = null;
}

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   commitRoot: () => (/* binding */ commitRoot),
/* harmony export */   ensureRootIsScheduled: () => (/* binding */ ensureRootIsScheduled),
/* harmony export */   markUpdateLaneFromFiberToRoot: () => (/* binding */ markUpdateLaneFromFiberToRoot),
/* harmony export */   performConcurrentWorkOnRoot: () => (/* binding */ performConcurrentWorkOnRoot),
/* harmony export */   performSyncWorkOnRoot: () => (/* binding */ performSyncWorkOnRoot),
/* harmony export */   renderRoot: () => (/* binding */ renderRoot),
/* harmony export */   scheduleUpdateOnFiber: () => (/* binding */ scheduleUpdateOnFiber)
/* harmony export */ });
/* harmony import */ var _beginwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _commitWork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);
/* harmony import */ var _completeWork__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(24);
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var _flags__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(11);
/* harmony import */ var _fiberLanes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8);
/* harmony import */ var _syncTaskQueue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(25);
/* harmony import */ var _workTag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(12);
/* harmony import */ var _hookEffectTags__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(21);











/** 工作中间状态 */
// 工作中的状态
const RootInProgress = 0;
/**
 * RootInComplete 和 RootCompleted 用来控制并发模式下 重新执行performConcurrentOnRoot
 * 这个状态由renderRoot返回 判断方式是 并发模式 在workConcurrentkloop执行后 workInProgress不为 null
 * */
// 并发中间状态
const RootInComplete = 1;
// 完成状态
const RootCompleted = 2;
// 未完成状态，不用进入commit阶段
const RootDidNotComplete = 3;

/** 全局变量，表示当前正在处理的Fiber */
let workInProgress = null;
/** 表示当前正在render阶段对应的任务对应的lane 用来在任务中断后重启判断跳过初始化流程 */
let wipRootRenderLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.NoLane;

/**
 * 从当前fiberNode找到root节点 并且更新沿途fiber的childLanes
 * @param fiberNode
 */
function markUpdateLaneFromFiberToRoot(fiberNode, lane) {
  let parent = fiberNode.return; // parent表示父节点
  let node = fiberNode; // node标记当前节点
  while (parent !== null) {
    parent.childLanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.mergeLane)(parent.childLanes, lane);
    const alternate = parent.alternate;
    if (alternate !== null) {
      alternate.childLanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.mergeLane)(alternate.childLanes, lane);
    }
    // 处理parent节点的childLanes
    node = parent;
    parent = parent.return;
  }

  /** 检查当前是否找到了hostRootFiber */
  if (node.tag === _workTag__WEBPACK_IMPORTED_MODULE_8__.HostRoot) {
    return node.stateNode;
  }
  return null;
}

/** 在Fiber中调度更新 */
function scheduleUpdateOnFiber(fiberNode, lane) {
  /** 先从更新的fiber节点递归到hostRootFiber
   *  这个过程中，一个目的是寻找fiberRootNode节点
   *  一个是更新沿途的 childLines
   */
  const fiberRootNode = markUpdateLaneFromFiberToRoot(fiberNode, lane);
  // 更新root的pendingLane, 更新root节点的pendingLanes 表示当前正在处理的lanes
  (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.markRootUpdated)(fiberRootNode, lane);
  // 保证根节点被正确调度
  ensureRootIsScheduled(fiberRootNode);
}
function ensureRootIsScheduled(root) {
  // 先实现同步调度 获取当前最高优先级
  const highestPriorityLane = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.getNextLane)(root);
  // 判断，如果不存在优先级 说明没有任务需要继续调度了 直接returna
  if (highestPriorityLane === _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.NoLane) return;
  // 批处理更新, 微任务调用更新
  if (highestPriorityLane === _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.SyncLane) {
    (0,_syncTaskQueue__WEBPACK_IMPORTED_MODULE_7__.scheduleSyncCallback)(performSyncWorkOnRoot.bind(null, root));
    // 设置微任务回调 冲洗缓冲区
    (0,_syncTaskQueue__WEBPACK_IMPORTED_MODULE_7__.flushSyncCallbacks)();
  } else {
    // 其他优先级 使用scheduler调度
    _scheduler__WEBPACK_IMPORTED_MODULE_6__["default"].scheduleCallback((0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.lanesToSchedulerPriority)(highestPriorityLane), performConcurrentWorkOnRoot.bind(null, root));
  }
}

/** 从root开始 处理同步任务 */
function performSyncWorkOnRoot(root) {
  // 获取当前的优先级
  const lane = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.getNextLane)(root);
  if (lane !== _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.SyncLane) {
    /**
     * 这里 lane如果不是同步任务了，说明同步任务的lane已经被remove 应该执行低优先级的任务了
     *  此时应该停止执行当前任务 重新调度
     * 【实现同步任务的批处理，当第一次执行完之后 commit阶段remove SyncLane 这里就继续不下去了，
     * 后面微任务中的 performSyncWorkOnRoot都不执行了】
     */
    return ensureRootIsScheduled(root);
  }

  // 开始生成fiber 关闭并发模式
  const exitStatus = renderRoot(root, lane, false);
  switch (exitStatus) {
    // 注意 同步任务一次性执行完 不存在RootInComplete中断的情况
    case RootCompleted:
      // 执行成功 设置finishedWork 和 finishedLane 并且commit
      // 设置root.finishedWork
      root.finishedWork = root.current.alternate;
      root.finishedLane = lane;
      // 设置wipRootRenderLane = NoLane;
      wipRootRenderLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.NoLane;
      commitRoot(root);
    default:
    // TODO Suspense的情况
  }
}

/** 从root开始 处理并发任务
 *  这个函数是要传入schduler中的 其中didTimeout就是当前任务是否超时
 */
function performConcurrentWorkOnRoot(root, didTimeout) {
  const lane = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.getNextLane)(root);
  if (lane === _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.NoLane) {
    // 没有任务需要处理了 这里也不需要调度了 用来完成批处理
    return;
  }

  // 开始生成fiber 关闭并发模式 ,在没有超时的情况下，可以开启并发中断
  const exitStatus = renderRoot(root, lane, !didTimeout);
  switch (exitStatus) {
    case RootInComplete:
      // 中断的情况 需要返回subTask 重新注册任务
      return performConcurrentWorkOnRoot.bind(null, root);
    case RootCompleted:
      //任务完成 收尾 commit
      // 设置root.finishedWork
      root.finishedWork = root.current.alternate;
      root.finishedLane = lane;
      // 设置wipRootRenderLane = NoLane;
      wipRootRenderLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.NoLane;
      commitRoot(root);
  }
}

/**
 * prepareFreshStack 这个函数的命名可能会让人觉得它与“刷新（refresh）”相关，
 * 但它的作用实际上是为了 准备一个新的工作栈，而不是刷新。
 * @param root
 * @param lane 当前车道
 */
function prepareRefreshStack(root, lane) {
  // 重新赋finishedWork
  root.finishedWork = null;
  root.finishedLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.NoLane;
  // 设置当前的运行任务lane
  wipRootRenderLane = lane;
  /** 给workInProgress赋值 */
  /** 这里在首次进入的时候 会创建一个新的hostRootFiber
   * 在react中存在两棵fiber树，两个hostRootFiber根节点 用alternate链接，成为双缓存
   */

  workInProgress = (0,_fiber__WEBPACK_IMPORTED_MODULE_3__.createWorkInProgress)(root.current, {});
}
function completeUnitOfWork(fiber) {
  // 归
  while (fiber !== null) {
    (0,_completeWork__WEBPACK_IMPORTED_MODULE_2__.completeWork)(fiber);
    if (fiber.sibling !== null) {
      // 有子节点 修改wip 退出继续递的过程
      workInProgress = fiber.sibling;
      return;
    }

    /** 向上归 修改workInProgress */
    fiber = fiber.return;
    workInProgress = fiber;
  }
}

/**
 * 处理单个fiber单元 包含 递，归 2个过程
 * @param fiber
 */
function performUnitOfWork(fiber) {
  // beginWork 递的过程
  const next = (0,_beginwork__WEBPACK_IMPORTED_MODULE_0__.beginWork)(fiber, wipRootRenderLane);
  // 递的过程结束，保存pendingProps
  fiber.memorizedProps = fiber.pendingProps;
  // 这里不能直接给workInProgress赋值，如果提前赋workInProgress为null 会导致递归提前结束
  // 如果next为 null 则表示已经递到叶子节点，需要开启归到过程
  if (next === null) {
    /** 开始归的过程 */
    completeUnitOfWork(fiber);
  } else {
    // 继续递
    workInProgress = next;
  }
  // 递的过程可打断，每执行完一个beginWork 切分成一个任务
  // complete归的过程不可打断，需要执行到下一个有sibling的节点/根节点 (return === null)
}

/** 递归循环 */
function workLoop() {
  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
}

/** 在并发模式下，如果shouldYieldToHost 则让出主线程 暂停render过程 */
function workConcurrentLoop() {
  while (workInProgress && !_scheduler__WEBPACK_IMPORTED_MODULE_6__["default"].shouldYieldToHost()) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 渲染root 生成fiber对象
 * @param root  当前根节点
 * @param lane  当前车道
 * @param shouldTimeSlice 是否开启并发
 */
function renderRoot(root, lane, shouldTimeSlice) {
  let workLoopRetryTimes = 0;
  if (wipRootRenderLane !== lane) {
    console.log('中断');
    // 避免重新进行初始化
    /** 先进行准备初始化 */
    prepareRefreshStack(root, lane);
  }
  while (true) {
    try {
      // 开启时间片 scheduler调度
      shouldTimeSlice ? workConcurrentLoop() : workLoop();
      break;
    } catch (e) {
      /** 使用try catch保证workLoop顺利执行 多次尝试 */
      workLoopRetryTimes++;
      if (workLoopRetryTimes > 20) {
        console.warn("workLoop执行错误！", e);
        break;
      }
    }
  }

  /** 判断任务是否执行完成 如果执行完成RootCompleted 否则 返回RootInCompleted*/
  if (shouldTimeSlice && workInProgress !== null) {
    return RootInComplete;
  }

  // 任务完成
  return RootCompleted;
}

/** commit阶段 */
function commitRoot(root) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) return;
  const lane = root.finishedLane;
  root.finishedWork = null;
  root.finishedLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_5__.NoLane;

  // 从root.pendingLanes去掉当前的lane
  (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_5__.markRootFinished)(root, lane);

  /** 设置调度 执行passiveEffect */
  /** 真正执行会在commit之后 不影响渲染 */
  /** commit阶段会收集effect到root.pendingPassiveEffect */
  // 有删除 或者收集到Passive 都运行
  if ((finishedWork.flags & _flags__WEBPACK_IMPORTED_MODULE_4__.PassiveMask) !== _flags__WEBPACK_IMPORTED_MODULE_4__.NoFlags || (finishedWork.subTreeFlags & _flags__WEBPACK_IMPORTED_MODULE_4__.PassiveMask) !== _flags__WEBPACK_IMPORTED_MODULE_4__.NoFlags) {
    // 调度副作用
    _scheduler__WEBPACK_IMPORTED_MODULE_6__["default"].scheduleCallback(_scheduler__WEBPACK_IMPORTED_MODULE_6__.PriorityLevel.NORMAL_PRIORITY, flushPassiveEffect.bind(null, root.pendingPassiveEffects));
  }

  /** hostRootFiber是否有effect  */
  const hostRootFiberHasEffect = (finishedWork.flags & (_flags__WEBPACK_IMPORTED_MODULE_4__.MutationMask | _flags__WEBPACK_IMPORTED_MODULE_4__.PassiveMask)) !== _flags__WEBPACK_IMPORTED_MODULE_4__.NoFlags;

  /** hostRootFiber的子树是否有effect  */
  const subtreeHasEffect = (finishedWork.subTreeFlags & (_flags__WEBPACK_IMPORTED_MODULE_4__.MutationMask | _flags__WEBPACK_IMPORTED_MODULE_4__.PassiveMask)) !== _flags__WEBPACK_IMPORTED_MODULE_4__.NoFlags;

  /** 有Effect才处理 */
  if (hostRootFiberHasEffect || subtreeHasEffect) {
    (0,_commitWork__WEBPACK_IMPORTED_MODULE_1__.commitMutationEffects)(finishedWork, root);
  }
  // commit完成 修改current指向新的树
  root.current = finishedWork;
  // commitLayout阶段 处理Attach Ref
  (0,_commitWork__WEBPACK_IMPORTED_MODULE_1__.commitLayoutEffects)(finishedWork, root);
  // 确保可以继续调度
  ensureRootIsScheduled(root);
}

// 处理被动Effect
// 此函数会被作为宏任务调用 / 使用schduler调度
function flushPassiveEffect(pendingPassiveEffect) {
  // 处理卸载 把所有的Passive flag的effect都执行destor
  pendingPassiveEffect.unmount.forEach(unmountEffect => {
    (0,_commitWork__WEBPACK_IMPORTED_MODULE_1__.commitHookEffectListUnmount)(_hookEffectTags__WEBPACK_IMPORTED_MODULE_9__.Passive, unmountEffect);
  });
  pendingPassiveEffect.unmount = [];
  // 处理update 的destory flag为Passive|HookHasEffect
  pendingPassiveEffect.update.forEach(updateEffect => {
    (0,_commitWork__WEBPACK_IMPORTED_MODULE_1__.commitHookEffectListDestory)(_hookEffectTags__WEBPACK_IMPORTED_MODULE_9__.Passive | _hookEffectTags__WEBPACK_IMPORTED_MODULE_9__.HookHasEffect, updateEffect);
  });
  // 处理update的create flag为Passive| HookHasEffect
  pendingPassiveEffect.update.forEach(updateEffect => {
    (0,_commitWork__WEBPACK_IMPORTED_MODULE_1__.commitHookEffectListCreate)(_hookEffectTags__WEBPACK_IMPORTED_MODULE_9__.Passive | _hookEffectTags__WEBPACK_IMPORTED_MODULE_9__.HookHasEffect, updateEffect);
  });
  pendingPassiveEffect.update = [];
}

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   beginWork: () => (/* binding */ beginWork),
/* harmony export */   markWipReceiveUpdate: () => (/* binding */ markWipReceiveUpdate)
/* harmony export */ });
/* harmony import */ var _childReconciler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _workTag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _fiberHooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _fiberLanes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _flags__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(11);
/* harmony import */ var _utils_shallowEqual__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(22);
/* harmony import */ var _fiberContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(20);








/** 是否收到更新 默认为false 即没有更新 开启bailout */
let didReceiveUpdate = false;

/** 标记当前wip存在更新 不能bailout
 * 导出接口 方便其他模块 （hooks） 使用 */
function markWipReceiveUpdate() {
  didReceiveUpdate = true;
}

/** 递的过程 */
function beginWork(wip, renderLane) {
  /** bailout策略
   *  四要素
   *  1. props相等
   *  2. state相等 （无update -> update结果不变）
   *  3. type相等
   *  4. context相等 TODO
   */
  // 重置didReceiveUpdate
  didReceiveUpdate = false;

  // 获取current
  const current = wip.alternate;
  if (current !== null) {
    /** 更新模式下 才检查是否bailout */
    /** 检查props和type */
    const prevProps = current.memorizedProps;
    const wipProps = wip.pendingProps;
    /**
     * 注意 bailout的props直接检查对象地址是否相等
     * 如果父节点存在更新 那么子节点无法bailout 需要通过childReconcile创建
     * 那么子节点的 props一定和current.props不一样 因为createElement中传入的对象也不是相同地址 比如
     * current createElement('div',{a:100}) -父节点不同，导致reconcilechild-> createElement('div',{a:100})
     * 注意 虽然都是{a:100} 但是两个对象来源于两次render 其对象地址不同，这也就导致如果父节点没能bailout 子节点也无法bailout 就必须使用memo来shallowEqual
     */
    if (prevProps !== wipProps || current.type !== wip.type) {
      // 检查不通过
      didReceiveUpdate = true;
    } else {
      // 如果props和type都检查通过 检查state和context TODO
      if (!checkUpdateOrContext(wip, renderLane)) {
        // 进入bailout
        didReceiveUpdate = false;
        // 这地方一定要加context的判读，即使bailout 也需要pushContext
        if (wip.tag === _workTag__WEBPACK_IMPORTED_MODULE_1__.ContextProvider) {
          (0,_fiberContext__WEBPACK_IMPORTED_MODULE_6__.pushContext)(wip.type._context, wip.pendingProps.value);
        }
        return bailoutOnAlreadyFinishedWork(wip, renderLane);
      }
    }
  }

  /** 给wip.lanes 置空
   *  当存在跳过的update时，processQueue的onSkipUpdate回调会返回跳过的lane 再次加上即可
   */
  wip.lanes = _fiberLanes__WEBPACK_IMPORTED_MODULE_3__.NoLane;

  // 比较，当前的fiber 和 旧的fiber
  switch (wip.tag) {
    case _workTag__WEBPACK_IMPORTED_MODULE_1__.Fragment:
      return updateFragment(wip);
    case _workTag__WEBPACK_IMPORTED_MODULE_1__.MemoComponent:
      return updateMemoComponent(wip, renderLane);
    case _workTag__WEBPACK_IMPORTED_MODULE_1__.HostRoot:
      return updateHostRoot(wip, renderLane);
    case _workTag__WEBPACK_IMPORTED_MODULE_1__.HostComponent:
      return updateHostComponent(wip);
    case _workTag__WEBPACK_IMPORTED_MODULE_1__.HostText:
      return null;
    case _workTag__WEBPACK_IMPORTED_MODULE_1__.FunctionComponent:
      return updateFunctionComponent(wip, wip.type, renderLane);
    case _workTag__WEBPACK_IMPORTED_MODULE_1__.ContextProvider:
      return updateContextProvider(wip, renderLane);
    default:
      console.warn("beginWork未实现的类型", wip.tag);
      break;
  }
  return null;
}

/** 检查是否存在更新 即检查wip.lanes 是否包含当前renderLane */
function checkUpdateOrContext(wip, renderLane) {
  // 注意 这里不要用wip.lanes直接检查，因为checkUpdate 也会在 wip.lanes = NoLane 之后调用，比如Memo中
  // 此时wip.lanes可能为NoLane 所以需要使用在enqueueUpdate中同步的 current.lanes
  const current = wip.alternate;
  if (current !== null && (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_3__.includeSomeLanes)(current.lanes, renderLane)) {
    return true;
  }
  return false;
}

/** 进一步bailout
 *  1. 如果childLanes也不包含renderLane 表示已经没有更新了 直接返回null 进入completework阶段
 *  2. 如果childLanes还包含renderLane 表示还有更新 但是此wip节点可以直接复用子节点
 */
function bailoutOnAlreadyFinishedWork(wip, renderLane) {
  /** 判断childLanes */
  if (!(0,_fiberLanes__WEBPACK_IMPORTED_MODULE_3__.includeSomeLanes)(wip.childLanes, renderLane)) {
    return null;
  }

  /** clone节点 */
  (0,_childReconciler__WEBPACK_IMPORTED_MODULE_0__.cloneChildFibers)(wip);
  return wip.child;
}

/**
 * 协调当前节点和其子节点
 * @param wip
 * @param children
 */
function reconcileChildren(wip, children) {
  /** 这里需要注明一下：
   * 当wip.alternate === null 的时候 也就是挂载阶段，此时children不需要添加副作用 即flags subtreeFlags delection 这些，因为当前dom中
   * 并不存在先前的节点，在completeWork阶段 会创建这些节点 并且完成福子节点之间的链接
   * 并不需要对其进行挂载等操作，由于hostRootFiber 一定有alternate节点，在prepareRefreshStack中构建，所以只在hostRootFiber中挂载即可
   */

  if (wip.alternate !== null) {
    // update阶段
    wip.child = (0,_childReconciler__WEBPACK_IMPORTED_MODULE_0__.reconcileChildFiber)(wip, wip.child, children);
  } else {
    // mount阶段
    wip.child = (0,_childReconciler__WEBPACK_IMPORTED_MODULE_0__.mountChildFiber)(wip, children);
  }
}

/** 处理HostRoot节点的比较 */
function updateHostRoot(wip, renderLane) {
  /** 对于HostRoot节点 其memorizedState存储的是其children Element 因为其在dom/jsx中没有对应的节点，所以不存在props.children
   * 将其children放在memorizedState
   */
  const preChildren = wip.memorizedState;
  /** 获取updateQueue */
  const updateQueue = wip.updateQueue;
  /** 这里hostRoot的update由updateContainer放入，其对应的action就是其element */
  const {
    memorizedState: newChildren
  } = updateQueue.process(renderLane);
  /* 重新存储memroizedState */
  wip.memorizedState = newChildren;
  if (newChildren === preChildren) {
    // bailout
    bailoutOnAlreadyFinishedWork(wip, renderLane);
  }

  /** 协调其子节点 */
  reconcileChildren(wip, newChildren);

  /** 返回下一个待处理节点 即wip.child */
  return wip.child;
}

/** 处理普通节点的比较 */
function updateHostComponent(wip) {
  /** 1.获取element.children */
  const hostChildren = wip.pendingProps?.children;
  // 目前只有在HostComponent中标记Ref
  markRef(wip);
  /** 2. 协调子元素 */
  reconcileChildren(wip, hostChildren);
  /** 3.返回第一个child */
  return wip.child;
}

/** 处理函数节点的比较 */
function updateFunctionComponent(wip, Component, renderLane) {
  /** 重制dependencies信息 */
  (0,_fiberContext__WEBPACK_IMPORTED_MODULE_6__.prepareToReadContext)(wip, renderLane);
  // renderWithHooks 中检查，如果状态改变 则置didReceiveUpdate = true
  const nextChildElement = (0,_fiberHooks__WEBPACK_IMPORTED_MODULE_2__.renderWithHooks)(wip, Component, renderLane);
  if (wip.alternate !== null && !didReceiveUpdate) {
    // bailout
    // 重置hook
    (0,_fiberHooks__WEBPACK_IMPORTED_MODULE_2__.bailoutHook)(wip, renderLane);
    return bailoutOnAlreadyFinishedWork(wip, renderLane);
  }
  reconcileChildren(wip, nextChildElement);
  return wip.child;
}

/** 处理Fragment */
function updateFragment(wip) {
  /** fragment的pendingProps就是children */
  const nextChildElement = wip.pendingProps;
  reconcileChildren(wip, nextChildElement);
  return wip.child;
}

/** 标记Ref [生产Ref] */
function markRef(wip) {
  const current = wip.alternate;
  const ref = wip.ref;
  if (current === null && ref !== null) {
    // mount阶段 如果wip有ref则绑定flag
    wip.flags |= _flags__WEBPACK_IMPORTED_MODULE_4__.Ref;
    return;
  }
  if (current !== null && ref !== current.ref) {
    // update阶段 wip.ref和current.ref不相等 （useImmpreciatHandle改变ref）需要重新挂载ref
    wip.flags |= _flags__WEBPACK_IMPORTED_MODULE_4__.Ref;
    return;
  }
}

/** 更新MemoComponent */
function updateMemoComponent(wip, renderLane) {
  // 需要检验四要素 type state(update) props context(TODO)
  // 运行到此 type一定是相等的 需要判断state props context

  const current = wip.alternate;
  if (current !== null) {
    // update阶段才bailout检查
    const oldProps = current.pendingProps;
    const newProps = wip.pendingProps;

    // Props默认需要用ShallowEqual判断 可以传入compare函数替换
    const compare = wip.type.compare || _utils_shallowEqual__WEBPACK_IMPORTED_MODULE_5__["default"];
    if (compare(oldProps, newProps)) {
      // 判断state context
      if (!checkUpdateOrContext(wip, renderLane)) {
        // 需要bailout
        didReceiveUpdate = false;
        // 重置props 注意 这里的oldProps newProps地址不一定一样
        wip.pendingProps = oldProps;
        // 重置当前lane
        // 推出之后 需要恢复lanes
        wip.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(wip, renderLane);
      }
    }
  }

  // 如果不能bailout 执行函数
  const Component = wip.type.type;
  return updateFunctionComponent(wip, Component, renderLane);
}

/** 更新ContextProvider */
function updateContextProvider(wip, renderLane) {
  const context = wip.type._context;
  const memorizedProps = wip.memorizedProps;
  const pendingProps = wip.pendingProps;
  const newValue = pendingProps?.value;
  const oldValue = memorizedProps?.value;
  // 推入Context
  (0,_fiberContext__WEBPACK_IMPORTED_MODULE_6__.pushContext)(context, newValue);

  // TODO bailout逻辑
  if (Object.is(oldValue, newValue) && memorizedProps.children === pendingProps.children) {
    /** 两次value相等 并且children不能变化，children变化 哪怕value不变 也要更新下面的Fiber */
    return bailoutOnAlreadyFinishedWork(wip, renderLane);
  } else {
    /** 传播Context变化 */
    (0,_fiberContext__WEBPACK_IMPORTED_MODULE_6__.propagateContextChange)(wip, context, renderLane);
  }

  // reconcile child
  reconcileChildren(wip, pendingProps.children);
  return wip.child;
}

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cloneChildFibers: () => (/* binding */ cloneChildFibers),
/* harmony export */   mountChildFiber: () => (/* binding */ mountChildFiber),
/* harmony export */   reconcileChildFiber: () => (/* binding */ reconcileChildFiber)
/* harmony export */ });
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _flags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _workTag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);





/**
 * 协调子节点  用闭包的方式存储处理函数
 * @param shouldTrackEffect 是否追踪副作用
 */
function childReconciler(shouldTrackEffect) {
  /**
   *  删除子节点
   * @param returnFiber 父节点
   * @param childToDelete 待删除的子节点
   * @returns
   */
  function deleteChild(returnFiber, childToDelete) {
    // 不需要标记副作用
    if (!shouldTrackEffect) return;
    if (!returnFiber.delections) {
      // 当前returnFiber下 没有等待删除的节点
      returnFiber.delections = [childToDelete];
      returnFiber.flags |= _flags__WEBPACK_IMPORTED_MODULE_1__.ChildDeletion;
    } else {
      // 当前returnFiber下 已经有等待删除的节点 就不用重复设置flags了
      returnFiber.delections.push(childToDelete);
    }
  }
  /**
   * 批量删除剩余的子节点
   * @param returnFiber 父节点
   * @param remainingFirstChild 剩余待删除的子节点中的第一个
   */
  function deleteRemainingChildren(returnFiber, remainingFirstChild) {
    // 不需要标记副作用
    if (!shouldTrackEffect) return;
    while (remainingFirstChild !== null) {
      deleteChild(returnFiber, remainingFirstChild);
      remainingFirstChild = remainingFirstChild.sibling;
    }
  }
  /** 处理多个子节点的情况 */
  function reconcileArray(wip, currentChild, newChild) {
    /** 设置几个指针 */
    let lastPlacedIndex = 0; // 最后一个可复用DOM的index
    let firstNewFiber = null; // 第一个新的Fiber
    let lastNewFiber = null; // 最后一个新的Fiber
    /** 把当前currentChild存储到一个Map中 */
    const existingChildren = new Map();
    let currentExistingChild = currentChild;
    while (currentExistingChild !== null) {
      /** fiber一定有key，直接获取 没有用index */
      const currentExistingChildKey = currentExistingChild.key !== null ? currentExistingChild.key : currentExistingChild.index;
      /** 入Map */
      existingChildren.set(String(currentExistingChildKey), currentExistingChild);
      currentExistingChild = currentExistingChild.sibling;
    }

    /** 遍历newChild 创建Fiber */
    for (let i = 0; i < newChild.length; i++) {
      /** 根据child获取新的fiber 可以复用 可以创建 */
      const newChildFiber = generateNewFiberFromMap(existingChildren, i, newChild[i]);
      if (null === newChildFiber) {
        continue;
      }

      // 设置父return
      newChildFiber.return = wip;
      // 根据顺序设置新的index
      newChildFiber.index = i;

      // 连接新的fiber节点
      if (lastNewFiber === null && firstNewFiber === null) {
        /** 初次进入 两个指针都指向第一个fiber */
        firstNewFiber = lastNewFiber = newChildFiber;
      } else {
        /** 移动lastNewFiber指针 */
        lastNewFiber.sibling = newChildFiber;
        lastNewFiber = newChildFiber;
      }

      /** 设置副作用 */
      if (shouldTrackEffect) {
        /** 具体思路是 设置一个lastPlacedIndex = 0 每次检查newFiber的oldIndex 如果比这个高 则不动 修改lastPlacedIndex = oldIndex
         *  如果比lastPlacedIndex小 则设置Placement 也就是要移动
         *
         * 如果没有alternate 则直接设置为Placment
         */

        const alternate = newChildFiber.alternate;
        if (alternate) {
          const oldIndex = alternate.index;
          if (oldIndex < lastPlacedIndex) {
            newChildFiber.flags |= _flags__WEBPACK_IMPORTED_MODULE_1__.Placement;
            lastPlacedIndex = oldIndex;
          } else {
            // 不设置副作用 移动lastNewFiber
            lastPlacedIndex = oldIndex;
          }
        } else {
          newChildFiber.flags |= _flags__WEBPACK_IMPORTED_MODULE_1__.Placement;
        }
      }
    }

    /** 处理完所有的element节点，此时existingChildren剩下的为删除节点 设置副作用删除 */
    existingChildren.forEach(needDeletedFiber => deleteChild(wip, needDeletedFiber));

    /** 返回第一个新的Fiber */
    return firstNewFiber;
  }

  /** 处理单个子节点的情况 */
  function reconcileSingle(wip, currentChild, newChild) {
    /** 先判断  如果element类型不对，直接报错 */
    if (newChild.$$typeof !== _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_2__.REACT_ELEMENT_TYPE) {
      throw new Error("[object] is not a valid react element!");
    }
    while (currentChild !== null) {
      // 先判断key
      if (newChild.key === currentChild.key) {
        // 再判断类型
        if (newChild.type === currentChild.type) {
          // 类型和key都一样，可以复用
          let pendingProps = newChild.props;
          // 判断 是不是Fragment类型
          if (newChild.type === _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_2__.REACT_FRAGMENT_TYPE) {
            // 设置props,element元素的props就是children 不支持其他的props
            pendingProps = newChild.props.children;
          }
          const existingFiber = useFiber(currentChild, pendingProps);
          existingFiber.return = wip;
          // 找到节点，删除剩下的节点
          deleteRemainingChildren(wip, currentChild.sibling);
          return existingFiber;
        }
      }
      // 删除当前节点
      deleteChild(wip, currentChild);
      // 设置下一个 childFiber
      currentChild = currentChild.sibling;
    }

    // 都没摘到key和type都相同的 创建
    const newFiber = (0,_fiber__WEBPACK_IMPORTED_MODULE_0__.createFiberFromElement)(newChild);
    newFiber.return = wip;
    if (shouldTrackEffect) {
      /** 设置副作用 */
      newFiber.flags |= _flags__WEBPACK_IMPORTED_MODULE_1__.Placement;
    }
    return newFiber;
  }

  /** 处理文本子节点的情况 */
  function reconcileTextNode(wip, currentChild, content) {
    /** 遍历wip的child fiber 找到一个tag为HostText的 使用useFiber复用，并且标记其他的为可删除 */
    while (currentChild !== null) {
      if (currentChild.tag === _workTag__WEBPACK_IMPORTED_MODULE_3__.HostText) {
        // 找到文本节点，复用,修改pendingProps
        const existingFiber = useFiber(currentChild, {
          content
        });
        // 设置return
        existingFiber.return = wip;
        // 找到文本节点了 剩下的节点没用了 可以删除了
        deleteRemainingChildren(wip, currentChild.sibling);
        // 返回文本节点
        return existingFiber;
      } else {
        // 当前节点不是文本节点 直接删除
        deleteChild(wip, currentChild);
      }
      /** 移动到下一个child */
      currentChild = currentChild.sibling;
    }

    /** 都没找到文本节点，直接创建 */
    const textNodeFiber = new _fiber__WEBPACK_IMPORTED_MODULE_0__.FiberNode(_workTag__WEBPACK_IMPORTED_MODULE_3__.HostText, {
      content
    }, null);
    textNodeFiber.return = wip;
    if (shouldTrackEffect) {
      /** 设置副作用 */
      textNodeFiber.flags != _flags__WEBPACK_IMPORTED_MODULE_1__.Placement;
    }
    return textNodeFiber;
  }
  return (wip, currentChild, newChild) => {
    // 处理Fragment
    if (typeof newChild === "object" && newChild !== null) {
      if (newChild.type === _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_2__.REACT_FRAGMENT_TYPE) {
        // 更新newChild 为Fragment内容
        newChild = newChild?.props?.children;
      }

      // 如果是多节点 Diff
      if (Array.isArray(newChild)) {
        return reconcileArray(wip, currentChild, newChild);
      }
      // 如果是单节点 看是否key type一样 是否可复用
      return reconcileSingle(wip, currentChild, newChild);
    }

    // 如果是文本节点 (文字或者数字 -> 转换成文本节点)
    if (typeof newChild === "string" || typeof newChild === "number") {
      return reconcileTextNode(wip, currentChild, newChild);
    }
    return null;
  };
}

/**
 * 原版叫updateFromMap 感觉这个名称不好理解
 * 根据existingChildren Map 生成element的新的Fiber
 * @param returnFiber
 * @param existingChildren
 * @param index
 * @param element
 */
function generateNewFiberFromMap(existingChildren, index, element) {
  /** 获取elementKey
   * element 有三种可能
   * 1. React.Element
   * 2. Array<newChild>
   * 3. Text
   */
  const elementKey = String(Array.isArray(element) || typeof element === "string" || typeof element === "number" || element === undefined || element === null || element.key === null || element.key === undefined ? index : element.key);

  /** 查找Map 看有没有已经存在可以复用的Fiber */
  const beforeFiber = existingChildren.get(elementKey);

  /** 按照类型处理 */
  if (Array.isArray(element)) {
    /** 对于数组类型的element 做法是包一层Fragment
     * 检查 如果beforeFiber是Fragment则复用
     *      不是则创建新的Fragment
     */
    if (beforeFiber && beforeFiber.tag === _workTag__WEBPACK_IMPORTED_MODULE_3__.Fragment) {
      // 复用了 删除existingChildren中的元素
      existingChildren.delete(elementKey);
      return useFiber(beforeFiber, element);
    } else {
      // 没有before 或者类型不是Fragment 创建Fiber
      return (0,_fiber__WEBPACK_IMPORTED_MODULE_0__.createFiberFromFragment)(element, elementKey);
    }
  }

  /** 如果是文字类型 */
  if (typeof element === "string" || typeof element === "number") {
    if (beforeFiber && beforeFiber.tag === _workTag__WEBPACK_IMPORTED_MODULE_3__.HostText) {
      existingChildren.delete(elementKey);
      return useFiber(beforeFiber, {
        content: String(element)
      });
    } else {
      return new _fiber__WEBPACK_IMPORTED_MODULE_0__.FiberNode(_workTag__WEBPACK_IMPORTED_MODULE_3__.HostText, {
        content: String(element)
      }, elementKey);
    }
  }

  /** 如果是普通类型 */
  if (typeof element === "object" && element !== null && element.$$typeof === _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_2__.REACT_ELEMENT_TYPE) {
    if (beforeFiber && beforeFiber.type === element.type) {
      existingChildren.delete(elementKey);
      return useFiber(beforeFiber, element.props);
    } else {
      return (0,_fiber__WEBPACK_IMPORTED_MODULE_0__.createFiberFromElement)(element);
    }
  }
  return null;
}

/** 复用节点，如果存在alternate则复用 不存在则创建 调用createWorkInProgress */
function useFiber(currentFiber, pendingProps) {
  const wip = (0,_fiber__WEBPACK_IMPORTED_MODULE_0__.createWorkInProgress)(currentFiber, pendingProps);
  wip.sibling = null;
  wip.index = 0;
  return wip;
}

/** 协调子元素 */
function reconcileChildFiber(wip, currentChild, children) {
  return childReconciler(true)(wip, currentChild, children);
}

/** 挂载子元素 */
function mountChildFiber(wip, children) {
  return childReconciler(false)(wip, null, children);
}
function cloneChildFibers(wip) {
  // 此时wip的child还是alternate的child （可能没有alternate）
  if (wip.child === null) {
    return;
  }
  let currentChild = wip.child;
  let newChild = (0,_fiber__WEBPACK_IMPORTED_MODULE_0__.createWorkInProgress)(currentChild, currentChild.pendingProps);
  newChild.return = wip;
  wip.child = newChild;
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    // 找子节点
    newChild = newChild.sibling = (0,_fiber__WEBPACK_IMPORTED_MODULE_0__.createWorkInProgress)(currentChild, currentChild.pendingProps);
    newChild.return = wip;
  }
}

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bailoutHook: () => (/* binding */ bailoutHook),
/* harmony export */   renderWithHooks: () => (/* binding */ renderWithHooks)
/* harmony export */ });
/* harmony import */ var _react_currentDispatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _share_transition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _beginwork__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17);
/* harmony import */ var _fiberContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony import */ var _fiberLanes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var _flags__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var _hookEffectTags__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(21);
/* harmony import */ var _updateQueue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(15);
/* harmony import */ var _workLoop__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);










/** 定义Hook类型 */

/** 定义effect */

/** 定义一些全局变量 */
/** 当前正在渲染的hook */
let currentRenderingFiber = null;
/** 当前正在处理的HOOK */
let workInProgressHook = null;
/** currentHook current fiber和当前workInProgressHook对应的hook */
let currentHook = null;
// 需要注意 wipxxx都是当前处理fiber tree上的 current都是当前已经渲染的fiber tre上的属性
let renderLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_4__.NoLane;

/** 运行函数组件以及hooks */
function renderWithHooks(wip, Component, lane) {
  // 主要作用是，运行函数组件 并且在函数运行上下文挂载currentDispatcher 在运行之后 卸载Dispatcher
  // 保证hook只能在函数组件内运行

  // 设置当前正在渲染的fiber
  currentRenderingFiber = wip;

  // 清空memoizedState
  wip.memorizedState = null;
  // 重置 effect链表
  wip.updateQueue = null;

  // 当前已经渲染的fiber
  const current = wip.alternate;
  renderLane = lane;
  if (current !== null) {
    // update
    _react_currentDispatcher__WEBPACK_IMPORTED_MODULE_0__.currentDispatcher.current = {
      useState: updateState,
      useEffect: updateEffect,
      useTransition: updateTransition,
      useDeferedValue: updateDeferedValue,
      useRef: updateRef,
      useMemo: updateMemo,
      useCallback: updateCallback,
      useContext: readContext
    };
  } else {
    // mount
    _react_currentDispatcher__WEBPACK_IMPORTED_MODULE_0__.currentDispatcher.current = {
      useState: mountState,
      useEffect: mountEffect,
      useTransition: mountTransition,
      useDeferedValue: mountDeferedValue,
      useRef: mountRef,
      useMemo: mountMemo,
      useCallback: mountCallback,
      useContext: readContext
    };
  }

  // 运行函数
  const pendingProps = wip.pendingProps;
  const childrenElements = Component(pendingProps);

  // 恢复
  currentRenderingFiber = null;
  workInProgressHook = null;
  currentHook = null;
  _react_currentDispatcher__WEBPACK_IMPORTED_MODULE_0__.currentDispatcher.current = null;
  renderLane = _fiberLanes__WEBPACK_IMPORTED_MODULE_4__.NoLane;
  return childrenElements;
}

/** 挂载state */
function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  let memorizedState;
  // 计算初始值
  if (typeof initialState === "function") {
    memorizedState = initialState();
  } else {
    memorizedState = initialState;
  }

  // 挂载memorizedState到hook 注意别挂载错了 currentRenderingFiber 也有一样的memorizedState
  hook.memorizedState = memorizedState;
  // 设置hook.taskQueue.dispatch 并且返回,注意dispatch是可以拿到函数组件外部使用的，所以这里需要绑定当前渲染fiber和updateQueue
  hook.updateQueue.dispatch = dispatchSetState.bind(null, currentRenderingFiber, hook.updateQueue);
  hook.updateQueue.baseState = memorizedState;
  // 保存上一次的值
  hook.updateQueue.lastRenderedState = memorizedState;
  return [memorizedState, hook.updateQueue.dispatch];
}

/** 更新state */
function updateState() {
  const hook = updateWorkInProgressHook();
  const {
    memorizedState
  } = hook.updateQueue.process(renderLane, update => {
    currentRenderingFiber.lanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_4__.mergeLane)(currentRenderingFiber.lanes, update.lane);
  });
  // 检查state是否变化
  if (!Object.is(hook.updateQueue.lastRenderedState, memorizedState)) {
    (0,_beginwork__WEBPACK_IMPORTED_MODULE_2__.markWipReceiveUpdate)();
  }
  hook.memorizedState = memorizedState;
  hook.updateQueue.lastRenderedState = memorizedState;
  return [memorizedState, hook.updateQueue.dispatch];
}

/** 挂载当前的workInProgressHook 并且返回 */
function mountWorkInProgressHook() {
  if (!currentRenderingFiber) {
    throw new Error("hooks必须在函数组件内部调用！");
  }
  const hook = {
    memorizedState: null,
    updateQueue: new _updateQueue__WEBPACK_IMPORTED_MODULE_7__.UpdateQueue(),
    next: null
  };

  // hook的挂载方式是 currentRenderdingFiber.memorizedState -> hook1 -next-> hook2 -next-> hook3 -next-> null
  if (currentRenderingFiber.memorizedState === null) {
    // 第一次挂载
    currentRenderingFiber.memorizedState = hook;
  } else {
    // 非第一次挂载
    workInProgressHook.next = hook;
  }
  // 设置workInProgressHook
  workInProgressHook = hook;
  return hook;
}

/** 根据current 挂载当前的workInProgressHook 并且返回 */
function updateWorkInProgressHook() {
  if (!currentRenderingFiber) {
    throw new Error("hooks必须在函数组件内部调用！");
  }

  // 找到当前已经渲染的fiber -> current
  const current = currentRenderingFiber.alternate;

  // currentHook是指向current元素的hook指针
  if (currentHook === null) {
    // 当前还没有currentHook 第一个元素
    if (current) {
      currentHook = current.memorizedState;
    } else {
      currentHook = null;
    }
  } else {
    // 如果有currentHook 说明不是第一个hook
    currentHook = currentHook.next;
  }

  // 如果没找到currentHook 说明hook数量对不上
  if (currentHook === null) {
    throw new Error("render more hooks than previouse render!");
  }

  // 拿到currentHook了 需要根据其构建当前的workInProgrerssHook
  const hook = {
    memorizedState: currentHook.memorizedState,
    updateQueue: currentHook.updateQueue,
    next: null
  };
  if (currentRenderingFiber.memorizedState === null) {
    currentRenderingFiber.memorizedState = hook;
  } else {
    workInProgressHook.next = hook;
  }
  workInProgressHook = hook;
  return hook;
}

/** 派发修改state */
function dispatchSetState(fiber, updateQueue, action) {
  // 获取一个优先级 根据 dispatchSetState 执行所在的上下文
  const lane = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_4__.requestUpdateLane)();
  // 创建一个update对象
  const update = new _updateQueue__WEBPACK_IMPORTED_MODULE_7__.Update(action, lane);
  if (updateQueue.shared.pending === null && fiber.lanes === _fiberLanes__WEBPACK_IMPORTED_MODULE_4__.NoLane) {
    // 没有其他更新任务的时候进行eagerState优化
    const currentState = updateQueue.lastRenderedState;
    let eagerState;
    if (typeof action === "function") {
      eagerState = action(currentState);
    } else {
      eagerState = action;
    }

    // 判断 eagerState 和 currentState
    if (Object.is(eagerState, currentState)) {
      update.hasEagerState = true;
      update.eagerState = eagerState;
      // updateQueue.enqueue(update, fiber, NoLane); // 优先级为NoLane 保证在下一次update可以消耗掉此次update
      return;
    }
  }
  // 入队 并且加入到fiber上
  updateQueue.enqueue(update, fiber, lane);
  // 开启调度时，也需要传入当前优先级
  (0,_workLoop__WEBPACK_IMPORTED_MODULE_8__.scheduleUpdateOnFiber)(fiber, lane);
}

/** 挂载Effect */
function mountEffect(create, deps) {
  /** effect 在hook中的存储方式是：
   *  hook:
   *     memorizedState = Effect
   *     updateQueue = null
   *     next = nextHook
   *  fiber:
   *     updateQueue -> Effect1 -next-> Effect2 -...
   */

  // 获取到hook
  const hook = mountWorkInProgressHook();
  // 给fiber设置PassiveEffect 表示存在被动副作用
  currentRenderingFiber.flags |= _flags__WEBPACK_IMPORTED_MODULE_5__.PassiveEffect;
  hook.memorizedState = pushEffect(
  // 初始化状态下，所有的useEffect都执行，所以这里flag设置为   Passive|HookHasEffect
  _hookEffectTags__WEBPACK_IMPORTED_MODULE_6__.Passive | _hookEffectTags__WEBPACK_IMPORTED_MODULE_6__.HookHasEffect, create, null, deps);
}

/** 更新Effect */
function updateEffect(create, deps) {
  // 获取当前hook
  const hook = updateWorkInProgressHook();
  const prevDeps = hook.memorizedState.deps;
  const destory = hook.memorizedState.destory;
  if (areHookInputsEqual(prevDeps, deps)) {
    // 相等 pushEffect 并且设置tag为Passive 被动副作用
    hook.memorizedState = pushEffect(_hookEffectTags__WEBPACK_IMPORTED_MODULE_6__.Passive, create,
    // 前一个副作用hook的destory
    destory, deps);
  } else {
    /** 不等 表示hook有Effect */
    hook.memorizedState = pushEffect(_hookEffectTags__WEBPACK_IMPORTED_MODULE_6__.Passive | _hookEffectTags__WEBPACK_IMPORTED_MODULE_6__.HookHasEffect,
    // 注意这里是 Passive 是Effect的tag 区分fiber的tag PassiveEffect
    create,
    // 前一个副作用hook的destory
    destory, deps);
  }
  currentRenderingFiber.flags |= _flags__WEBPACK_IMPORTED_MODULE_5__.PassiveEffect;
}

/** 创建Effect对象，把effect加入到fiber.updateQueue 并且返回创建的Effect */
function pushEffect(tags, create, destory, deps) {
  const effect = {
    tags,
    create,
    destory,
    deps: deps === undefined ? null : deps,
    next: null
  };
  const updateQueue = currentRenderingFiber.updateQueue;
  if (!updateQueue || !(updateQueue instanceof _updateQueue__WEBPACK_IMPORTED_MODULE_7__.FCUpdateQueue)) {
    // 创建一个FCUpdateQueue
    const fcUpdateQueue = new _updateQueue__WEBPACK_IMPORTED_MODULE_7__.FCUpdateQueue();
    effect.next = effect; // 构建环
    fcUpdateQueue.lastEffect = effect;
    currentRenderingFiber.updateQueue = fcUpdateQueue;
  } else {
    // 已经存在 FCUpdateQueue 添加 后加环
    const fcUpdateQueue = currentRenderingFiber.updateQueue;
    if (fcUpdateQueue.lastEffect) {
      effect.next = fcUpdateQueue.lastEffect.next;
      fcUpdateQueue.lastEffect.next = effect;
      fcUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}

/** 潜比较Deps */
function areHookInputsEqual(prevDeps, curDeps) {
  if (prevDeps === null || curDeps === null) return false;
  if (prevDeps?.length !== curDeps?.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
    if (Object.is(prevDeps[i], curDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}

/** transition */
function mountTransition() {
  // 设置pending state
  const [isPending, setPending] = mountState(false);
  // 获得hook
  const hook = mountWorkInProgressHook();
  // 创建startTransition
  const start = startTransition.bind(null, setPending);
  // 记录start
  hook.memorizedState = start;
  // 返回pending和start
  return [isPending, start];
}
function updateTransition() {
  const [isPending] = updateState();
  const hook = updateWorkInProgressHook();
  const start = hook.memorizedState;
  return [isPending, start];
}
function startTransition(setPending, callback) {
  // 开始transition 第一次更新 此时优先级高
  setPending(true);
  // transition过程，下面的优先级低
  const prevTransition = _share_transition__WEBPACK_IMPORTED_MODULE_1__.TRANSITION_CONFIG.isTransition;

  // 设置标记 表示处于transition过程中，在fiberHook.ts/requestUpdateLane会判断这个变量，如果true则返回transtionLane
  _share_transition__WEBPACK_IMPORTED_MODULE_1__.TRANSITION_CONFIG.isTransition = true;
  // 设置标记 （在react原版中 这里是 1）
  // 第二次更新 优先级低
  callback();
  // 第三次更新 重新设置pending 优先级低
  setPending(false);
  // 恢复isTransition
  _share_transition__WEBPACK_IMPORTED_MODULE_1__.TRANSITION_CONFIG.isTransition = prevTransition;
}

/** 挂载Ref */
function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  hook.memorizedState = {
    current: initialValue
  };
  return hook.memorizedState;
}

/** 更新Ref 其实就是保存一个值 */
function updateRef() {
  const hook = updateWorkInProgressHook();
  return hook.memorizedState;
}

/** useMemo */
function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook();
  hook.memorizedState = [nextCreate(), deps];
  return hook.memorizedState[0];
}
function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook();
  const [prevValue, prevDeps] = hook.memorizedState;
  if (areHookInputsEqual(prevDeps, deps)) {
    hook.memorizedState = [prevValue, deps];
  } else {
    hook.memorizedState = [nextCreate(), deps];
  }
  return hook.memorizedState[0];
}

/** useCallback */
function mountCallback(callback, deps) {
  const hook = mountWorkInProgressHook();
  hook.memorizedState = [callback, deps];
  return hook.memorizedState[0];
}
function updateCallback(callback, deps) {
  const hook = updateWorkInProgressHook();
  const [prevCallback, prevDeps] = hook.memorizedState;
  if (areHookInputsEqual(prevDeps, deps)) {
    hook.memorizedState = [prevCallback, deps];
  } else {
    hook.memorizedState = [callback, deps];
  }
  return hook.memorizedState[0];
}

/** deferedValue */
function updateDeferedValue(value) {
  const hook = updateWorkInProgressHook();
  const prevValue = hook.memorizedState;
  // 相同 没变化，直接返回
  if (Object.is(value, prevValue)) return value;
  if ((0,_fiberLanes__WEBPACK_IMPORTED_MODULE_4__.isSubsetOfLanes)(renderLane, _fiberLanes__WEBPACK_IMPORTED_MODULE_4__.DeferredLane)) {
    // 低优先级DeferedLane时
    hook.memorizedState = value;
    return value;
  } else {
    // 优先级高于Deferedlane时
    currentRenderingFiber.lanes |= _fiberLanes__WEBPACK_IMPORTED_MODULE_4__.DeferredLane;
    (0,_workLoop__WEBPACK_IMPORTED_MODULE_8__.scheduleUpdateOnFiber)(currentRenderingFiber, _fiberLanes__WEBPACK_IMPORTED_MODULE_4__.DeferredLane);
    return prevValue;
  }
}
function mountDeferedValue(value) {
  const hook = mountWorkInProgressHook();
  hook.memorizedState = value;
  return hook.memorizedState;
}

// context不会在memorizedState上记录数据
function readContext(context) {
  const consumer = currentRenderingFiber;
  return (0,_fiberContext__WEBPACK_IMPORTED_MODULE_3__.readContextImpl)(consumer, context);
}

/** 重置hook */
function bailoutHook(wip, renderLane) {
  const current = wip.alternate;
  if (current !== null) {
    wip.updateQueue = current.updateQueue; // effectes
    wip.flags &= ~_flags__WEBPACK_IMPORTED_MODULE_5__.PassiveEffect;
    // 去掉current上的renderLane 因为此次renderLane没生效
    current.lanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_4__.removeLanes)(current.lanes, renderLane);
  }
}

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   popContext: () => (/* binding */ popContext),
/* harmony export */   prepareToReadContext: () => (/* binding */ prepareToReadContext),
/* harmony export */   propagateContextChange: () => (/* binding */ propagateContextChange),
/* harmony export */   pushContext: () => (/* binding */ pushContext),
/* harmony export */   readContextImpl: () => (/* binding */ readContextImpl)
/* harmony export */ });
/* harmony import */ var _beginwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _fiberLanes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _workTag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/** 处理context相关 */





/**
 * 对于
 * Provider1 初始化为 'provider1 init'
 * Provider2 初始化为 'provider2 init'
 *
 * <Provider1 value={provider1 new}>
 *  <Provider2 value={provider2 new}>
 *          consumer
 *  </Provider2>
 *</Provider1>
 * 此时，beginWork到第一层Provider时，prevContextValueStack.push(prevContextValue) -> [null]
 * prevContextValue = provider第一层._context._currentValue =  'provider1 init'
 * provider第一层._context._currentValue = "provider1 new"
 *
 * beginWork到第二层时，此时prevContextvalueStack.push(prevContextValue) -> [null,'provider1 init']
 * prevContextValue = provider第二层._context._currentValue = 'provider2 init'
 * provider第二层._context._currentValue = provider2 new
 *
 * 此时 消费Provider1 为 provider1._context._currentValue = provider1 new
 * 此时 消费Provider2 为 provider2._context._currentValue = provider2 new
 *
 * completeWork到第二层Provider2时
 * provider2._context._currentValue = prevContextValue = 'provider2 init'
 * prevContextValue = prevContextValueStack.pop = 'provider1 init'
 * 此时 访问Provider2 其_currenValue => 'provider2 init'
 * 访问Provier1 其_currentValue 还是"provider2 new"
 *
 * completetwork到provider1时
 * 此时 provider1._context._currentValue = prevContextValue = "provider1 init"
 * prevContextValue = prevContextValueStack.pop = null
 * 此时，访问provider1 其currentValue为 "provider1 init"
 */

/**
 * 用来记录上一个context的值
 */
let prevContextValue = null;

/**
 * 用来记录prevContextValue的栈
 * 当Context嵌套的时候，会把上一个prevContextValue push到stack中
 *
 */
const prevContextValueStack = [];

/** 推入context beginwork调用 */
function pushContext(context, newValue) {
  // 保存prevContextValue
  prevContextValueStack.push(prevContextValue);

  // 保存currentValue
  prevContextValue = context._currentValue;

  // 给context设置newValue
  context._currentValue = newValue;
}

/** 弹出context completetwork调用 */
function popContext(context) {
  /** 从prevContextValue恢复context的值 */
  context._currentValue = prevContextValue;

  /** 从prevContextValueStack恢复prevContextValue的值 */
  prevContextValue = prevContextValueStack.pop();
}

/** context在dependencies中以链表的方式连接 其链表项为 ContextItem */

/** 上一个dependency */
let lastContextDepItem = null;

/** readContext之前的准备工作  每次函数调用之前执行 重新设置dependencies*/
function prepareToReadContext(wip, renderLane) {
  lastContextDepItem = null; // 置空
  if (wip.dependencies !== null) {
    if ((0,_fiberLanes__WEBPACK_IMPORTED_MODULE_1__.isSubsetOfLanes)(wip.dependencies.lanes, renderLane)) {
      // 当前函数组件内的Context 包含当前renderLane更新优先级的更新
      (0,_beginwork__WEBPACK_IMPORTED_MODULE_0__.markWipReceiveUpdate)(); // 当前函数组件 不能bailout
    }
    wip.dependencies = null; // 置空
  }
}

/** 获取context内容
 *  还需要生成新的dependencies
 */
function readContextImpl(consumer, context) {
  if (!consumer) {
    throw new Error("useContext Error: 请不要在函数组件外部调用hooks");
  }
  // 建立新的dependencies
  const contextItem = {
    context,
    next: null,
    memorizedState: context._currentValue
  };

  // 绑定到consumer
  if (lastContextDepItem === null) {
    // 第一个contextItem
    consumer.dependencies = {
      firstContext: contextItem,
      lanes: _fiberLanes__WEBPACK_IMPORTED_MODULE_1__.NoLanes
    };
    lastContextDepItem = contextItem;
  } else {
    // 不是第一个
    lastContextDepItem = lastContextDepItem.next = contextItem;
  }
  return context._currentValue;
}

/** 传播context变化 */
function propagateContextChange(wip, context, renderLane) {
  let nextFiber = wip.child;
  while (nextFiber !== null && nextFiber !== wip) {
    const deps = nextFiber.dependencies;
    if (deps) {
      let contextItem = deps.firstContext;
      while (contextItem !== null) {
        if (contextItem.context === context) {
          // 找到对应的Context 设置lane
          // 设置fiber和alternate的lane
          nextFiber.lanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_1__.mergeLane)(nextFiber.lanes, renderLane);
          if (nextFiber.alternate !== null) {
            nextFiber.alternate.lanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_1__.mergeLane)(nextFiber.alternate.lanes, renderLane);
          }
          // 从当前Fiber到Provide的Fiber 标记childLanes
          scheduleContextOnParentPath(nextFiber, wip, renderLane);
          // 设置deps.lane
          deps.lanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_1__.mergeLane)(deps.lanes, renderLane);
          // break
          break;
        } else {
          contextItem = contextItem.next;
        }
      }
    } else if ((nextFiber.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.ContextProvider && nextFiber.type !== wip.type || nextFiber.tag !== _workTag__WEBPACK_IMPORTED_MODULE_2__.ContextProvider) && nextFiber.child !== null) {
      nextFiber = nextFiber.child;
      continue;
    }
    // 回溯
    while (nextFiber.sibling === null) {
      if (nextFiber.return === null || nextFiber.return === wip) {
        break;
      }
      nextFiber = nextFiber.return;
    }
    nextFiber = nextFiber.sibling;
  }
}

/** 在parent路径上调度Context
 * 从当前找到context的节点，到provider节点 标记childLanes
 */
function scheduleContextOnParentPath(from, to, renderLane) {
  if (from === to) return;
  let parentNode = from.return;
  while (parentNode !== null && from !== to) {
    parentNode.childLanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_1__.mergeLane)(parentNode.childLanes, renderLane);
    if (parentNode.alternate !== null) {
      parentNode.alternate.childLanes = (0,_fiberLanes__WEBPACK_IMPORTED_MODULE_1__.mergeLane)(parentNode.alternate.childLanes, renderLane);
    }
    parentNode = parentNode.return;
  }
}

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HookHasEffect: () => (/* binding */ HookHasEffect),
/* harmony export */   Passive: () => (/* binding */ Passive)
/* harmony export */ });
// 被动的effect 默认存在
/**
 * PassiveEffect 是一种副作用标志，用于表示在组件的生命周期中执行的副作用类型。
 * 副作用是指在组件渲染期间可能执行的操作，例如订阅、取消订阅、数据获取等。
 * 而 PassiveEffect 表示一种被动的、不会触发组件重新渲染的副作用。
 * 这意味着在执行这种副作用时，React 不会因为副作用的执行而重新渲染组件。
 * 这对于性能优化非常有用，因为它允许开发人员在不影响渲染性能的情况下执行副作用操作。
 */
const Passive = 0b0010;
// 当前hook存在effect需要处理
const HookHasEffect = 0b0001;

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shallowEqual)
/* harmony export */ });
/** 对比两个对象中的属性是否浅比较相等
 *  shallowEqual在React.memo 对比curent.memorizedProps 和 wip.pendingProps中使用 区分hooks中的 areHookInputsEqual 后者判断的是数组
 */
function shallowEqual(obj1, obj2) {
  // 先用Object.is 对比排除 基本类型 相同地址对象的情况
  if (Object.is(obj1, obj2)) {
    return true;
  }

  // 排除obj1 obj2 任意一个不是对象或者null的情况
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  // 运行到此 obj1 obj2 一定是对象 并且都不是null 开始判断其属性
  // 属性数量判断 不一样一定属性不相等
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // 逐个判断属性
  for (const key in obj1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key) || Object.is(obj1[key], obj2[key])) {
      // 判断 key在obj1内 但是为undefined 但是在obj2中不存在的情况 或者 都存在 但是值不等的情况
      return false;
    }
  }
  return true;
}

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   commitHookEffectListCreate: () => (/* binding */ commitHookEffectListCreate),
/* harmony export */   commitHookEffectListDestory: () => (/* binding */ commitHookEffectListDestory),
/* harmony export */   commitHookEffectListUnmount: () => (/* binding */ commitHookEffectListUnmount),
/* harmony export */   commitLayoutEffects: () => (/* binding */ commitLayoutEffects),
/* harmony export */   commitMutationEffects: () => (/* binding */ commitMutationEffects)
/* harmony export */ });
/* harmony import */ var _flags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _events_SyntheticEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _workTag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _hookEffectTags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21);





/** commit回调类型 */

/** 高阶函数 用来处理Effect */
function commitEffect(phrase, mask, callback) {
  /** 递归，DFS 找到最深的无subflags的节点 下面的不需要commit了 因为没有副作用 */
  return (finishedWork, root) => {
    // DFS
    let nextFinishedWork = finishedWork;
    while (nextFinishedWork !== null) {
      if ((nextFinishedWork.subTreeFlags & mask) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags && nextFinishedWork.child) {
        // 递
        nextFinishedWork = nextFinishedWork.child;
      } else {
        while (nextFinishedWork !== null) {
          // 归
          callback(nextFinishedWork, root);
          if (nextFinishedWork.sibling !== null) {
            nextFinishedWork = nextFinishedWork.sibling;
            break;
          }
          nextFinishedWork = nextFinishedWork.return;
        }
      }
    }
  };
}

/** 用来处理 Mutation副作用 [Placement | Update | ChildDeletion // TODO PassiveEffect] */
const commitMutationEffectsOnFiber = (finishedWork, root) => {
  // 处理每个节点的Effect
  // 获取节点的flags
  const flags = finishedWork.flags;
  if ((flags & _flags__WEBPACK_IMPORTED_MODULE_0__.Placement) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) {
    // 存在Placement
    // 处理placement
    commitPlacement(finishedWork);
    // 去掉副作用flag
    // 去掉某个flag: 0b0111&(~0b0100) => 0b0111&0b1011=> 0b0011 去掉了 0b0100
    finishedWork.flags &= ~_flags__WEBPACK_IMPORTED_MODULE_0__.Placement;
  }
  if ((flags & _flags__WEBPACK_IMPORTED_MODULE_0__.Update) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) {
    commitUpdate(finishedWork);
    finishedWork.flags &= ~_flags__WEBPACK_IMPORTED_MODULE_0__.Update;
  }
  if ((flags & _flags__WEBPACK_IMPORTED_MODULE_0__.ChildDeletion) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) {
    const deletion = finishedWork.delections;
    deletion.forEach(deleteOldFiber => {
      commitDeletion(deleteOldFiber, root);
    });
    finishedWork.flags &= ~_flags__WEBPACK_IMPORTED_MODULE_0__.ChildDeletion;
  }
  if ((flags & _flags__WEBPACK_IMPORTED_MODULE_0__.PassiveEffect) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) {
    // 存在被动副作用
    commitPassiveEffect(finishedWork, root, "update");
  }

  // 卸载Ref 只有hostComponent需要卸载
  if (finishedWork.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent && (flags & _flags__WEBPACK_IMPORTED_MODULE_0__.Ref) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) {
    const current = finishedWork.alternate;
    if (current) {
      // 需要卸载current的ref 其实本质上current和finishedWork的ref都是一个
      saftyDetachRef(current);
    }

    // 卸载之后由于可能还会加载ref 所以这里的flag不能~Ref
  }
};

/** 用来处理 Layout副作用 [Ref] */
const commitLayoutEffectsOnFiber = finishedWork => {
  // 处理每个节点的Effect
  // 获取节点的flags
  const flags = finishedWork.flags;
  if (finishedWork.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent && (flags & _flags__WEBPACK_IMPORTED_MODULE_0__.Ref) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) {
    saftyAttachRef(finishedWork);
    finishedWork.flags &= ~_flags__WEBPACK_IMPORTED_MODULE_0__.Ref;
  }
};

/** 收集被动副作用，这个函数可能会在
 *  1. commitMutationEffectsOnFiber调用
 *  2.  在delection时调用
 */
function commitPassiveEffect(fiber, root, type) {
  if (fiber.tag !== _workTag__WEBPACK_IMPORTED_MODULE_2__.FunctionComponent) return;
  if (type === "update" && (fiber.flags & _flags__WEBPACK_IMPORTED_MODULE_0__.PassiveEffect) === _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) return;
  const fcUpdateQueue = fiber.updateQueue;
  if (fcUpdateQueue && fcUpdateQueue.lastEffect) {
    // 收集effect
    root.pendingPassiveEffects[type].push(fcUpdateQueue.lastEffect);
  }
}

/** 处理Placement */
function commitPlacement(finishedWork) {
  /** 获取finishedWork的hostparent 用来挂载finishedWork对应的DOM （finishedWork可能也不是Host 后面有处理） */
  const hostParent = getHostParent(finishedWork);
  /** 获取finishedWork的Host sibling节点  */
  const hostSibling = getHostSibling(finishedWork);
  // 拿到parent和sibling了，就可以插入dom了
  // hostsibling不存在就是append 存在就是插入
  if (hostParent !== null) {
    insertOrAppendPlacementNodeIntoConatiner(finishedWork, hostParent, hostSibling);
  }
}

/** 处理update副作用 */
function commitUpdate(fiber) {
  if (fiber.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText) {
    fiber.stateNode.nodeValue = fiber.memorizedProps.content;
  } else {
    (0,_events_SyntheticEvent__WEBPACK_IMPORTED_MODULE_1__.updateFiberProps)(fiber.stateNode, fiber.memorizedProps);
  }
}

/** 删除节点 */
function commitDeletion_NonRecruison(fiber, root) {
  const parent = getHostParent(fiber);
  if ((fiber.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent || fiber.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText) && fiber.stateNode) {
    parent.removeChild(fiber.stateNode);
    if (fiber.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent) {
      // HostComponent删除的时候 需要卸载Ref
      saftyDetachRef(fiber);
    }
  } else {
    const childToDelete = [];
    const findFn = () => {
      while (hostChild !== null) {
        if (hostChild.stateNode && (hostChild.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent || hostChild.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText)) {
          childToDelete.push(hostChild);
          if (hostChild.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent) {
            // HostComponent删除的时候 需要卸载Ref
            saftyDetachRef(hostChild);
          }
          return;
        } else if (hostChild.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.FunctionComponent) {
          commitPassiveEffect(hostChild, root, "unmount");
        }
        if (hostChild.child !== null) {
          hostChild = hostChild.child;
        } else {
          break;
        }
      }
    };

    // fiber不是host 递归查找
    let hostChild = fiber.child;
    findChild: while (hostChild !== null) {
      findFn();
      // 归
      while (hostChild.sibling === null) {
        if (hostChild.return === null || hostChild.return === fiber) break findChild;
        hostChild = hostChild.return;
      }
      hostChild = hostChild.sibling;
    }
    childToDelete.forEach(child => {
      if (parent.contains(child.stateNode)) {
        parent.removeChild(child.stateNode);
      }
    });
  }
  // 断开链接
  const current = fiber.alternate;
  if (current) {
    current.alternate = null;
  }
  fiber.alternate = null;
  fiber.child = null;
  if (fiber.return !== null) {
    if (fiber.return.child === fiber) {
      // 第一个元素
      fiber.return.child = fiber.sibling;
    } else {
      let firstChild = fiber.return.child;
      while (firstChild.sibling && fiber.sibling !== fiber) {
        firstChild = firstChild.sibling;
      }
      if (firstChild.sibling && firstChild.sibling === fiber) {
        firstChild.sibling = fiber.sibling;
      }
    }
  }
  fiber.return = null;
  fiber.sibling = null;
}
function commitDeletion(fiber, root) {
  const container = getHostParent(fiber);
  if (container) {
    deleteNodeFromContainer(container, fiber, root);
  }
}

/** 递归的方式删除节点 */
function deleteNodeFromContainer(container, childToDelete, root) {
  if (!container || !childToDelete) return;
  if ((childToDelete.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent || childToDelete.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText) && childToDelete.stateNode !== null) {
    /** 如果是host节点，直接删除即可 */
    if (container.contains(childToDelete.stateNode)) {
      container.removeChild(childToDelete.stateNode);
    }

    // 删除时，卸载Ref
    if (childToDelete.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent) {
      // HostComponent删除的时候 需要卸载Ref

      saftyDetachRef(childToDelete);
    }
  } else {
    /** 非host节点，递归删除 */
    if (childToDelete.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.FunctionComponent) {
      /** 函数组件的情况下，需要收集Effect */
      commitPassiveEffect(childToDelete, root, "unmount");
    }
    let deleteNodeChild = childToDelete.child;
    while (deleteNodeChild !== null) {
      deleteNodeFromContainer(container, deleteNodeChild, root);
      deleteNodeChild = deleteNodeChild.sibling;
    }
  }
}

/** 获取HostParent
 *  获取当前节点的HostComponent/HostRoot parent
 */
function getHostParent(fiber) {
  let node = fiber.return;
  while (node !== null) {
    if (node.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent) {
      // host component 返回其stateNode
      return node.stateNode;
    }
    if (node.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostRoot) {
      // hostRoot 其stateNode -> FiberRootNode 需要通过FiberRootNode.container获取
      return node.stateNode.container;
    }
    // 向上找
    node = node.return;
  }
  return null;
}
/**
 * 查找fiber的sibling host节点 （难点）
 *  这里注意，sibling节点可能是不同级的
 *  同时 对于Placement的节点，由于其和其child节点都还没放置 不能作为sibling节点
 * 查找方向
 * 1. 查看当前节点有没有sibling，如果有从sibling往下找(child) 如果child为hostComponent/HostTag 并且flag不为placement 则返回
 *    如果查找的节点为placement 不论什么类型 查找和以下的节点都不能用 开始回溯
 * 2. 回溯，找查找节点的parent，如果有sibling 则回到 （1） 查找其sibling 直到找到一个不为placement的hostCom/hostText为止
 *    如果回溯的过程中，遇到了hostcomponent/hostroot 或者 null的节点 则直接返回null （因为回溯的过程中 一定走的都是非host节点 因为如果是host节点就肯定已经返回了）
 *    如果回溯到过程中遇到host 那么一定是parent节点 或者已经找到hostRoot了 表示没找到
 * @param fiber
 */
function getHostSibling(fiber) {
  let node = fiber;
  // 找sibling节点,没有找parent，如果遇到hostComponent / hostRoot 直接返回null
  findSibling: while (true) {
    while (node.sibling === null) {
      const parent = node.return;
      if (parent === null || parent.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent || parent.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostRoot) {
        /** 回溯的过程中 如果遇到了 hostComponent / hostRoot 说明找到了parent节点 不能再往上找了 */
        return null;
      }

      /** 继续往上查找 */
      node = parent;
    }

    // 执行到这里，说明存在sibling，移动node节点 -> sibling
    node.sibling.return = node.return;
    node = node.sibling;

    // 找到sibling了 此时开始向下查找，这里要注意，寻找的节点必须满足
    // 1. 是hostComponent / hostText
    // 2. 不能是placement节点 如果不满足，返回到回溯阶段
    while (node.tag !== _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent && node.tag !== _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText) {
      // 都不是，如果此时为Placement 下面的不用看了 因为当前节点下的DOM还没挂载,直接回溯
      if ((node.flags & _flags__WEBPACK_IMPORTED_MODULE_0__.Placement) !== _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags || node.child === null) {
        continue findSibling; // 直接跳到最外层循环,回溯
      }
      // 向下寻找
      node.child.return = node;
      node = node.child;
    }
    // 运行到此处 找到hostCompoent/hostText了 看是不是placement
    if ((node.flags & _flags__WEBPACK_IMPORTED_MODULE_0__.Placement) === _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags) {
      return node.stateNode;
    }
  }
}

/**
 * 插入或者追加finishwork节点到hostParent(container)中
 * @param finishedWork
 * @param hostParent
 * @param hostSibling
 */
function insertOrAppendPlacementNodeIntoConatiner(finishedWork, hostParent, hostSibling) {
  // 这里需要注意 finishedWork 可能也不是HostComponet
  if (finishedWork.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent || finishedWork.tag == _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText) {
    if (hostSibling) {
      hostParent.insertBefore(finishedWork.stateNode, hostSibling);
    } else {
      hostParent.append(finishedWork.stateNode);
    }
  } else {
    // 如果finishwork不是host 比如是Fragment或者Function
    // 需要遍历其子节点 并且添加
    let child = finishedWork.child;
    while (child !== null) {
      insertOrAppendPlacementNodeIntoConatiner(child, hostParent, hostSibling);
      child = child.sibling;
    }
  }
}

/** effect相关 遍历lastEffect 根据flags判断是否需要执行 调用callback */
function commitHookEffectList(flags, lastEffect, callback) {
  let currentEffect = lastEffect.next;
  do {
    if ((flags & currentEffect.tags) === flags) {
      // flag必须完全相等 执行callback
      callback(currentEffect);
    }
    currentEffect = currentEffect.next;
  } while (currentEffect !== lastEffect.next);
}

/** 执行卸载的effect */
function commitHookEffectListUnmount(flags, lastEffect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const destory = effect.destory;
    if (typeof destory === "function") {
      destory();
    }
    effect.tags &= ~_hookEffectTags__WEBPACK_IMPORTED_MODULE_3__.HookHasEffect;
  });
}

/** 执行destory的effect */
function commitHookEffectListDestory(flags, lastEffect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const destory = effect.destory;
    if (typeof destory === "function") {
      destory();
    }
  });
}

/** 执行创建的effect */
function commitHookEffectListCreate(flags, lastEffect) {
  commitHookEffectList(flags, lastEffect, effect => {
    const create = effect.create;
    if (typeof create === "function") {
      // 设置destory
      effect.destory = create();
    }
  });
}
const commitMutationEffects = commitEffect("mutation", _flags__WEBPACK_IMPORTED_MODULE_0__.MutationMask | _flags__WEBPACK_IMPORTED_MODULE_0__.PassiveMask, commitMutationEffectsOnFiber);
const commitLayoutEffects = commitEffect("layout", _flags__WEBPACK_IMPORTED_MODULE_0__.LayoutMask, commitLayoutEffectsOnFiber);

/** 卸载Ref
 *  卸载时机 commit的mutation阶段 包括
 *  1. 组件卸载
 *  2. 组件更新时包含Ref （Ref变动）
 */
function saftyDetachRef(current) {
  // 这里传入的是current的fiber 也就是旧的fiber 卸载的也是旧的fiber
  // fiber会在createWorkinprogress复用传递 这里的作用就是 ref.current = null / ref(null)
  const ref = current.ref;
  if (ref === null) return;
  // ref可以是函数或者对象 判读类型
  if (typeof ref === "function") {
    // 卸载/更新变动之前卸载时 都会执行下ref函数 并且传入null
    ref(null);
  } else {
    ref.current = null;
  }
}

/** 附加Ref 附加时机
 *  commit的layout阶段 也就是真实dom更新完成 渲染之前
 */
function saftyAttachRef(finishedWork) {
  const ref = finishedWork.ref;
  const dom = finishedWork.stateNode;
  if (ref !== null) {
    if (typeof ref === "function") {
      ref(dom);
    } else {
      ref.current = dom;
    }
  }
}

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   completeWork: () => (/* binding */ completeWork)
/* harmony export */ });
/* harmony import */ var _flags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _events_SyntheticEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _workTag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _fiberLanes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _fiberContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);






/** 归的过程 主要逻辑有
 * 1. 不能复用的DOM创建 赋给stateNode
 * 2. 连接父子节点
 * 3. flags冒泡
 */
function completeWork(wip) {
  /** 真正需要操作的 只有HostComponent和HostText */
  const pendingProps = wip.pendingProps; //需要处理props
  const currentFiber = wip.alternate; // 当前生效的fiber

  switch (wip.tag) {
    case _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent:
      /** 处理HostComponent的情况 */
      if (currentFiber && currentFiber.stateNode) {
        // update
        if (currentFiber.ref !== wip.ref) {
          wip.flags |= _flags__WEBPACK_IMPORTED_MODULE_0__.Ref;
        }
        // 检查pendingProps和memroizedProps 如何不同则打上Update更新标签
        // if (pendingProps !== wip.memorizedProps) {
        //   wip.flags |= Update;
        // }
        // 不要这样写 会导致事件处理函数的闭包陷阱 我们需要在每次更新的时候 update新的event
        wip.flags |= _flags__WEBPACK_IMPORTED_MODULE_0__.Update;
      } else {
        // mount
        // 挂载阶段，直接创建DOM,保存到stateNode
        const domInstance = document.createElement(wip.type);
        // 在DOM上更新属性
        (0,_events_SyntheticEvent__WEBPACK_IMPORTED_MODULE_1__.updateFiberProps)(domInstance, pendingProps);
        // stateNode保存instance
        wip.stateNode = domInstance;
        // 把所有的children dom元素加入到instance中
        // completeWork时 其所有子节点已经完成了递归
        appendAllChildren(domInstance, wip); // 这个操作只有HostComponent处理 HostText由于已经没有子节点 不需要这样操作
      }
      // 冒泡处理属性
      bubbleProperties(wip);
      return null;
    case _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText:
      if (currentFiber && currentFiber.stateNode) {
        // update
        if (currentFiber.memorizedProps?.content !== pendingProps?.content) {
          wip.flags |= _flags__WEBPACK_IMPORTED_MODULE_0__.Update;
        }
      } else {
        // mount
        const textInstance = document.createTextNode(pendingProps?.content);
        wip.stateNode = textInstance;
      }
      bubbleProperties(wip);
      return null;
    case _workTag__WEBPACK_IMPORTED_MODULE_2__.ContextProvider:
      // pop Context
      (0,_fiberContext__WEBPACK_IMPORTED_MODULE_4__.popContext)(wip.type._context);
      bubbleProperties(wip);
      return null;
    case _workTag__WEBPACK_IMPORTED_MODULE_2__.HostRoot:
    case _workTag__WEBPACK_IMPORTED_MODULE_2__.FunctionComponent:
    case _workTag__WEBPACK_IMPORTED_MODULE_2__.Fragment:
    case _workTag__WEBPACK_IMPORTED_MODULE_2__.MemoComponent:
      bubbleProperties(wip);
      return null;
    default:
      console.warn("未处理的completeWork类型！");
  }
}

/**
 * 注意 这个函数只找一层HostComponent / HostText，并且完成连接
 * 如果中间遇到Function Fragment等 会跳过去连接 直到空或者遇到的第一个Host元素为止
 *  因为挂载DOM只会挂载DOM 需要跳过Function Fragment等
 */
function appendAllChildren(instance, wip) {
  let node = wip.child;
  while (node !== null && node !== wip) {
    if (node.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostComponent || node.tag === _workTag__WEBPACK_IMPORTED_MODULE_2__.HostText) {
      instance.appendChild(node.stateNode);
    } else if (node.child) {
      node.child.return = node; // 冗余操作
      /** 查找其子元素 */
      node = node.child;
      continue; // 返回继续检查是否为Host
    }

    /** 走到这里，说明完成这条路线的一个Host元素的append */

    /** 开始向上归 此时路径上 除了wip 和当前节点（如果不为空的情况下）其余的应该都是非Host节点 比如Function或Fragment */
    /** 如果归的时候 某个节点有sibling 那么这个sibling下的第一个Host元素 也是挂在instance下的 需要处理 */
    while (node.sibling === null) {
      // 由于wip的sibling也可能为null node.sibling === null不能判断是否到了wip 这样会一直循环下去 需要在每个循环单独判断一下，当前节点的return是不是wip
      if (node.return === wip || node.return === null) {
        return;
      }
      // 如果没有兄弟 就向上归
      node = node.return;
    }

    /** 如果有兄弟，node指向兄弟 继续循环处理 */
    node.sibling.return = node.return; // 冗余操作
    node = node.sibling;
  }
}

/** 把当前节点所有子节点的属性都merge到当前节点
 * 需要处理
 * 1. subtreeFlags
 * 2. childLanes
 */
function bubbleProperties(wip) {
  let subtreeFlags = _flags__WEBPACK_IMPORTED_MODULE_0__.NoFlags;
  let childLanes = _fiberLanes__WEBPACK_IMPORTED_MODULE_3__.NoLane;
  let node = wip.child || null;
  while (node !== null) {
    // merge subtreeFlags
    subtreeFlags |= node.subTreeFlags;
    subtreeFlags |= node.flags;
    // merge childLanes
    childLanes |= node.lanes;
    childLanes |= node.childLanes;

    // 寻找下一个子节点
    node.return = wip; // 冗余操作
    node = node.sibling; // 找下一个node
  }
  wip.subTreeFlags = subtreeFlags;
  wip.childLanes = childLanes;
}

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   flushSyncCallbacks: () => (/* binding */ flushSyncCallbacks),
/* harmony export */   scheduleMicroTask: () => (/* binding */ scheduleMicroTask),
/* harmony export */   scheduleSyncCallback: () => (/* binding */ scheduleSyncCallback)
/* harmony export */ });
/** 同步任务更新队列 */

/** 存储callback数组 */
let syncTaskQueue = [];

/** 入队 */
function scheduleSyncCallback(callback) {
  syncTaskQueue.push(callback);
}

/** 队列flush lock 防止多次调用
 *  防止嵌套调用 flushSyncCallbacks
 */
let isFlushingSyncQueue = false;

/** flush清空队列 */
function _flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncTaskQueue.length > 0) {
    // 上锁
    isFlushingSyncQueue = true;
    try {
      // 执行任务
      syncTaskQueue.forEach(syncTask => scheduleMicroTask(syncTask));
    } catch (e) {
      console.error("同步微任务队列执行错误，错误信息:", e);
    } finally {
      // 执行结束  释放锁 清空队列
      isFlushingSyncQueue = false;
      syncTaskQueue = [];
    }
  }
}

/** 兼容多种环境的microTask */
const scheduleMicroTask = typeof queueMicrotask === "function" ? queueMicrotask : typeof Promise === "function" ? callback => Promise.resolve().then(callback) : setTimeout;

/** 微任务flush清空队列 */
const flushSyncCallbacks = () => scheduleMicroTask(_flushSyncCallbacks);

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _components_Counter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(27);
/* harmony import */ var _components_Input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28);
/* harmony import */ var _components_MemoComp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(29);
/* harmony import */ var _Pages_ContextDemo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(30);
/* harmony import */ var _Pages_Welcome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(32);






async function fetchMockMessage() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("Message From Mock Fetch!!!");
    }, 1000);
  });
}
function SlowPost(_ref) {
  let {
    index
  } = _ref;
  const startTime = performance.now();
  while (performance.now() - startTime < 4) {}
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "#f3f3f3",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      marginBottom: "15px",
      fontSize: "16px",
      fontWeight: 600,
      color: "#333",
      textAlign: "center"
    }
  }, "Slow Item Render Need 4ms");
}
const PostsTab = () => {
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].Fragment, null, Array.from({
    length: 50
  }).map((_, i) =>
  /*#__PURE__*/
  // @ts-ignore
  _lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(SlowPost, {
    key: i,
    index: i
  })));
};
const App = () => {
  const [isPending, startTransition] = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useTransition)();
  const [type, setType] = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useState)("welcome");
  const content = (() => {
    switch (type) {
      case "welcome":
        return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_Pages_Welcome__WEBPACK_IMPORTED_MODULE_5__["default"], null);
      case "counter":
        return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_components_Counter__WEBPACK_IMPORTED_MODULE_1__["default"], null);
      case "input":
        return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_components_Input__WEBPACK_IMPORTED_MODULE_2__["default"], null);
      case "context":
        return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_Pages_ContextDemo__WEBPACK_IMPORTED_MODULE_4__["default"], null);
      case "hugeData":
        return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(PostsTab, null);
      default:
        return null;
    }
  })();
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].Fragment, null, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("nav", {
    style: navContainerStyle
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("ul", {
    style: menuStyle
  }, menuItems.map(_ref2 => {
    let {
      key,
      label,
      value
    } = _ref2;
    return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("li", {
      key: key,
      onClick: () => ["hugeData", "context"].includes(value) ? startTransition(() => setType(value)) : setType(value),
      style: menuItemStyle
    }, label);
  }))), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: contentContainerStyle
  }, isPending ? /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      textAlign: "center",
      fontSize: "18px",
      color: "#888",
      marginTop: "20px"
    }
  }, "Loading Data...") : content), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_components_MemoComp__WEBPACK_IMPORTED_MODULE_3__["default"], {
    style: memoCompStyle
  }));
};
const menuItems = [{
  key: "welcome-menu",
  label: "Welcome",
  value: "welcome"
}, {
  key: "counter-menu",
  label: "计数器",
  value: "counter"
}, {
  key: "input-menu",
  label: "输入框",
  value: "input"
}, {
  key: "hugedata-menu",
  label: "大量数据 测试useTransition",
  value: "hugeData"
}, {
  key: "context-menu",
  label: "测试Context",
  value: "context"
}];
const menuItemStyle = {
  listStyle: "none",
  padding: "10px 20px",
  fontSize: "18px",
  fontWeight: 500,
  cursor: "pointer",
  color: "#fff",
  textTransform: "uppercase",
  transition: "background-color 0.3s, color 0.3s",
  margin: "0 15px",
  borderRadius: "5px",
  display: "inline-block"
};
const navContainerStyle = {
  backgroundColor: "#333",
  padding: "10px 0",
  position: "sticky",
  top: "0",
  zIndex: 100
};
const menuStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0",
  padding: "0"
};
const contentContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  height: "calc(100% - 93px)",
  backgroundColor: "#f5f5f5",
  fontFamily: "'Arial', sans-serif",
  overflow: "auto"
};
const memoCompStyle = {
  padding: "20px",
  marginTop: "30px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Counter)
/* harmony export */ });
/* harmony import */ var _lib_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

function Counter() {
  const [count, setCount] = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const testRef = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  const domRef = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const countPlusTen = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => count + 10, [count]);
  console.log("re-render");
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Roboto', sans-serif"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      width: "350px",
      height: "400px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("button", {
    style: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "18px",
      transition: "transform 0.2s ease, background-color 0.3s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "10px",
      textTransform: "uppercase"
    },
    ref: domRef,
    onClick: () => setCount(count + 1)
  }, "+1"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("button", {
    style: {
      backgroundColor: "#2196F3",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "18px",
      transition: "transform 0.2s ease, background-color 0.3s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "10px",
      textTransform: "uppercase"
    },
    onClick: () => setCount(count + 2)
  }, "+2"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("button", {
    style: {
      backgroundColor: "#FF5722",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "18px",
      transition: "transform 0.2s ease, background-color 0.3s ease",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "10px",
      textTransform: "uppercase"
    },
    onClick: () => {
      setTimeout(() => {
        setCount(prev => prev + 3);
      }, 1000);
    }
  }, "+3 (\u5C55\u793A\u95ED\u5305\u9677\u9631 \u70B9\u51FB\u540E\u5EF6\u8FDF\u66F4\u65B0 \u4F60\u53EF\u4EE5\u70B9\u51FB\u4E4B\u540E\u8FC5\u901F\u70B9\u51FB\u5176\u4ED6\u7684)"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      marginTop: "30px",
      fontSize: "24px",
      color: "#333",
      fontWeight: "500"
    }
  }, "\u8BA1\u6570\u5668\uFF1A", /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("span", {
    style: {
      fontWeight: "bold",
      fontSize: "36px",
      color: "#333"
    }
  }, count))));
}

/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var _lib_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

function SlowPost(_ref) {
  let {
    index
  } = _ref;
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {}
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h3", {
    style: {
      color: "#61dafb",
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "10px"
    }
  }, "Slow Item Render Need 1ms");
}
const PostsTab = function PostsTab(_ref2) {
  let {
    len = 0
  } = _ref2;
  const items = [];
  for (let i = 0; i < len * 100; i++) {
    //@ts-ignore
    items.push(/*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(SlowPost, {
      key: i,
      index: i
    }));
  }
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].Fragment, null, items);
};
function Input() {
  console.log("input re");
  const [appMessage, setAppMessage] = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useState)("测试输入框内容同步");
  const deferedAppMessage = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useDeferedValue)(appMessage);
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Roboto', sans-serif"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("input", {
    onInput: e => setAppMessage(e.target.value),
    value: appMessage,
    style: {
      display: "block",
      width: "100%",
      padding: "16px",
      fontSize: "18px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
      backgroundColor: "#f9f9f9",
      color: "#333",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      outline: "none",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px"
    },
    placeholder: "\u8BF7\u8F93\u5165\u5185\u5BB9"
  }), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      marginTop: "20px",
      fontSize: "18px",
      color: "#333"
    }
  }, appMessage));
}

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

const MemoComp = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.memo)(() => {
  console.log("memo rerender!");
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      backgroundColor: "lightgray",
      color: "white",
      fontSize: "16px"
    }
  }, "MEMO COMPONENT \uFF08when menu change, this component never rerender\uFF09");
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MemoComp);

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContextDemo)
/* harmony export */ });
/* harmony import */ var _lib_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _lib_react_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31);


const Context1 = (0,_lib_react_context__WEBPACK_IMPORTED_MODULE_1__["default"])("CONTEXT_1_INIT_VALUE");
const Context2 = (0,_lib_react_context__WEBPACK_IMPORTED_MODULE_1__["default"])("CONTEXT_2_INIT_VALUE");
const Context3 = (0,_lib_react_context__WEBPACK_IMPORTED_MODULE_1__["default"])("CONTEXT_3_INIT_VALUE");
function ContextReader(_ref) {
  let {
    title
  } = _ref;
  const context1Value = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useContext)(Context1);
  const context2Value = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useContext)(Context2);
  const context3Value = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useContext)(Context3);
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      border: "1px solid black",
      height: "100px"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h3", {
    style: {
      color: "black",
      textAlign: "center"
    }
  }, title), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      color: "green"
    }
  }, "Context1 value=", context1Value), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      color: "blue"
    }
  }, "Context2 value=", context2Value), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      color: "yellow"
    }
  }, "Context3 value=", context3Value));
}
function Provider1Component(_ref2) {
  let {
    children
  } = _ref2;
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      backgroundColor: "lightblue",
      width: "550px"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h3", {
    style: {
      color: "white",
      textAlign: "center"
    }
  }, "Provider1"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(Context1.Provider, {
    value: "PROVIDER1 NEW VALUE"
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(ContextReader, {
    title: "Provider1\u5185\u5C42Context\u7ED3\u679C"
  }), children));
}
function Provider2Component(_ref3) {
  let {
    children
  } = _ref3;
  const [provider2Value, setProvider2Value] = (0,_lib_react__WEBPACK_IMPORTED_MODULE_0__.useState)("PROVIDER2 NEW VALUE");
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      backgroundColor: "lightgray",
      width: "500px"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h3", {
    style: {
      color: "white",
      textAlign: "center"
    }
  }, "Provider2"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("button", {
    style: {
      backgroundColor: "red",
      cursor: "pointer"
    },
    onClick: () => setProvider2Value(`当前时间为: ${new Date()}`)
  }, "\u70B9\u51FB\u4FEE\u6539Provider2 value"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(Context2.Provider, {
    value: provider2Value
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(ContextReader, {
    title: "Provider2\u5185\u5C42Context\u7ED3\u679C"
  }), children));
}
function Provider3Component(_ref4) {
  let {
    children
  } = _ref4;
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      backgroundColor: "lightgreen",
      width: "400px"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h3", {
    style: {
      color: "white",
      textAlign: "center"
    }
  }, "Provider3"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(Context3.Provider, {
    value: "PROVIDER3 NEW VALUE"
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(ContextReader, {
    title: "\u6700\u5185\u5C42Context\u7ED3\u679C"
  }), children));
}
function ContextDemo() {
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].Fragment, null, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: {
      backgroundColor: "pink",
      width: "600px"
    }
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(ContextReader, {
    title: "\u6700\u5916\u5C42Context\u7ED3\u679C"
  }), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(Provider1Component, null, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(Provider2Component, null, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(Provider3Component, null)))));
}

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createContext)
/* harmony export */ });
/* harmony import */ var _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


/** context结构如下
 *  context: {
 *      $$typeof: REACT_CONTEXT_TYPE,
 *      Provider: 指向Provider,
 *      _currentValue: 当前context值
 * }
 *
 * provider: {
 *      $$typeof: REACT_PROVIDER_TYPE,
 *      _context: 指向context对象
 * }
 */

/** 创建一个Context对象 */
function createContext(defaultValue) {
  const _context = {
    $$typeof: _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_0__.REACT_CONTEXT_TYPE,
    Provider: null,
    _currentValue: defaultValue
  };
  _context.Provider = {
    $$typeof: _share_ReactSymbols__WEBPACK_IMPORTED_MODULE_0__.REACT_PROVIDER_TYPE,
    _context
  };
  return _context;
}

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

const WelcomePage = () => {
  return /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: pageStyle
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: leftPanelStyle
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h1", {
    style: titleStyle
  }, "Welcome to My-React!"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", {
    style: subtitleStyle
  }, "A lightweight React clone with core features like createElement, useState, useEffect, and more."), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: sectionStyle
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h2", {
    style: sectionTitleStyle
  }, "What is My-React?"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", {
    style: sectionTextStyle
  }, "My-React is a lightweight clone of React. It includes essential features like virtual DOM creation, state management with hooks, and task scheduling. The main goal is to understand the core principles behind React and its rendering lifecycle."))), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: rightPanelStyle
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h2", {
    style: sectionTitleStyle
  }, "Features"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("ul", {
    style: featureListStyle
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("li", null, "Virtual DOM creation with createElement"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("li", null, "Support for hooks like useState, useEffect, useTransition"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("li", null, "Component management for functional and class components"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("li", null, "Task scheduling with the scheduler for better performance")), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    style: footerStyle
  }, /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h3", {
    style: footerTitleStyle
  }, "Get Started"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", {
    style: footerTextStyle
  }, "To get started, follow the setup instructions below:"), /*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("pre", {
    style: codeBlockStyle
  }, `1. Install dependencies:
   npm install

2. Start the project:
   npm start`))));
};
const pageStyle = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  backgroundColor: "#f4f6f8",
  justifyContent: "space-between",
  padding: "40px",
  boxSizing: "border-box"
};
const leftPanelStyle = {
  flex: 1,
  padding: "40px",
  backgroundColor: "#61dafb",
  borderRadius: "8px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  color: "#fff"
};
const rightPanelStyle = {
  flex: 1,
  padding: "40px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  overflow: "hidden"
};
const titleStyle = {
  fontSize: "36px",
  fontWeight: 700
};
const subtitleStyle = {
  fontSize: "20px",
  marginTop: "10px"
};
const sectionStyle = {
  marginTop: "40px"
};
const sectionTitleStyle = {
  fontSize: "28px",
  fontWeight: 600,
  marginBottom: "15px"
};
const sectionTextStyle = {
  fontSize: "16px",
  lineHeight: "1.6"
};
const footerStyle = {
  marginTop: "40px",
  backgroundColor: "#4CAF50",
  padding: "20px",
  borderRadius: "8px",
  color: "#fff"
};
const footerTitleStyle = {
  fontSize: "24px",
  fontWeight: 600
};
const footerTextStyle = {
  fontSize: "18px"
};
const codeBlockStyle = {
  backgroundColor: "#2d2d2d",
  color: "#f7f7f7",
  padding: "20px",
  borderRadius: "8px",
  fontFamily: "monospace",
  fontSize: "16px",
  textAlign: "left",
  overflowX: "auto"
};
const featureListStyle = {
  listStyleType: "none",
  paddingLeft: "0",
  fontSize: "16px",
  color: "#444"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WelcomePage);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _lib_react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);



const root = (0,_lib_react_dom__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.querySelector("#root-master"));
console.log(/*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].Fragment, null));
root.render(/*#__PURE__*/_lib_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(_App__WEBPACK_IMPORTED_MODULE_2__["default"], null));
})();

/******/ })()
;
//# sourceMappingURL=main-3dae5170-bundle.js.map