/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/** element为文字的情况
 *  element的type可能为 HOSTComponent 即 div span
 *  函数
 *  文字，TEXT_ELEMENT_TYPE
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createElement = createElement;
exports.useState = useState;
exports.useEffect = useEffect;
exports.useTransition = useTransition;
exports.useDeferedValue = useDeferedValue;
exports.useRef = useRef;
exports.useMemo = useMemo;
exports.useCallback = useCallback;
var ReactSymbols_1 = __webpack_require__(2);
var currentDispatcher_1 = __webpack_require__(3);
/** 实现createElement方法 */
function createElement(type, props) {
    if (props === void 0) { props = {}; }
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return {
        $$typeof: ReactSymbols_1.REACT_ELEMENT_TYPE,
        type: type,
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
        ref: (props === null || props === void 0 ? void 0 : props.ref) ? props === null || props === void 0 ? void 0 : props.ref : null,
        key: (props === null || props === void 0 ? void 0 : props.key) ? String(props === null || props === void 0 ? void 0 : props.key) : null,
        props: __assign(__assign({}, props), { 
            /** 源码这里做了处理 如果只有一个child 直接放到children 如果有多个 则children为一个数组 */
            children: (children === null || children === void 0 ? void 0 : children.length) === 1
                ? children[0]
                : children }),
    };
}
function useState(initialState) {
    var dispatcher = (0, currentDispatcher_1.resolveDispatcher)();
    return dispatcher.useState(initialState);
}
function useEffect(create, deps) {
    var dispatcher = (0, currentDispatcher_1.resolveDispatcher)();
    return dispatcher.useEffect(create, deps);
}
function useTransition() {
    var dispatcher = (0, currentDispatcher_1.resolveDispatcher)();
    return dispatcher.useTransition();
}
function useDeferedValue(value) {
    var dispatcher = (0, currentDispatcher_1.resolveDispatcher)();
    return dispatcher.useDeferedValue(value);
}
function useRef(initialValue) {
    var dispatcher = (0, currentDispatcher_1.resolveDispatcher)();
    return dispatcher.useRef(initialValue);
}
// useMemo 和 useCallback的区别仅仅是 memo会运行nextCreate取得结果 useCallback会直接返回callback
function useMemo(nextCreate, deps) {
    var dispatcher = (0, currentDispatcher_1.resolveDispatcher)();
    return dispatcher.useMemo(nextCreate, deps);
}
function useCallback(callback, deps) {
    var dispatcher = (0, currentDispatcher_1.resolveDispatcher)();
    return dispatcher.useCallback(callback, deps);
}
__exportStar(__webpack_require__(4), exports);


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.REACT_MEMO_TYPE = exports.REACT_LAZY_TYPE = exports.REACT_SUSPENSE_TYPE = exports.REACT_PROVIDER_TYPE = exports.REACT_CONTEXT_TYPE = exports.REACT_FRAGMENT_TYPE = exports.REACT_ELEMENT_TYPE = void 0;
var supportSymbol = typeof Symbol === 'function' && Symbol.for;
exports.REACT_ELEMENT_TYPE = supportSymbol
    ? Symbol.for('react.element')
    : 0xeac7;
exports.REACT_FRAGMENT_TYPE = supportSymbol
    ? Symbol.for('react.fragment')
    : 0xeaca;
exports.REACT_CONTEXT_TYPE = supportSymbol
    ? Symbol.for('react.context')
    : 0xeacc;
exports.REACT_PROVIDER_TYPE = supportSymbol
    ? Symbol.for('react.provider')
    : 0xeac2;
exports.REACT_SUSPENSE_TYPE = supportSymbol
    ? Symbol.for('react.suspense')
    : 0xead1;
exports.REACT_LAZY_TYPE = supportSymbol
    ? Symbol.for('react.lazy')
    : 0xead4;
exports.REACT_MEMO_TYPE = supportSymbol
    ? Symbol.for('react.memo')
    : 0xead3;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.currentDispatcher = void 0;
exports.resolveDispatcher = resolveDispatcher;
/** 共享的 当前的Dispatcher */
exports.currentDispatcher = {
    current: null,
};
/** 解析 返回dispatcher */
function resolveDispatcher() {
    var dispatcher = exports.currentDispatcher.current;
    if (dispatcher === null) {
        throw new Error("无法在函数组件外部使用hooks");
    }
    return dispatcher;
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.memo = memo;
var ReactSymbols_1 = __webpack_require__(2);
/** memo函数 接收一个ReactElementType 组件 返回一个 REACT_MEMO_TYPE类型的ReactElement*/
function memo(
/** 包裹的组件类型 */
type, compare) {
    return {
        $$typeof: ReactSymbols_1.REACT_MEMO_TYPE,
        type: type,
        compare: compare,
    };
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRoot = createRoot;
var SyntheticEvent_1 = __webpack_require__(6);
var fiber_1 = __webpack_require__(10);
var updateQueue_1 = __webpack_require__(19);
var workLoop_1 = __webpack_require__(20);
var workTag_1 = __webpack_require__(12);
var fiberLanes_1 = __webpack_require__(13);
var scheduler_1 = __webpack_require__(8);
/** 创建应用根节点FiberRootNode 以及第一个HostRoot节点 hostRootFiber */
var createContainer = function (container) {
    // 第一个hostRoot节点
    var hostRootFiber = new fiber_1.FiberNode(workTag_1.HostRoot, {}, null);
    // 创建整个应用的根节点： FiberRootNode
    var root = new fiber_1.FiberRootNode(container, hostRootFiber);
    // 创建一个hostRootFiber的更新队列 （updateQueue） 存放的是新的root element
    hostRootFiber.updateQueue = new updateQueue_1.UpdateQueue();
    return root;
};
/**
 * 更新container 需要传入
 * @param element 新的element节点
 * @param root APP根节点
 */
var updateContainer = function (element, root) {
    // 默认情况下 同步渲染
    scheduler_1.default.runWithPriority(scheduler_1.PriorityLevel.IMMEDIATE_PRIORITY, function () {
        var _a;
        // 请求获得当前更新lane
        var lane = (0, fiberLanes_1.requestUpdateLane)();
        // 获hostRootFiber
        var hostRootFiber = root.current;
        // 更新的Element元素入队
        (_a = hostRootFiber.updateQueue) === null || _a === void 0 ? void 0 : _a.enqueue(new updateQueue_1.Update(element, lane), hostRootFiber, lane);
        // scheduleUpdateOnFiber 调度更新
        (0, workLoop_1.scheduleUpdateOnFiber)(root.current, lane);
    });
};
/** 创建根节点的入口 */
function createRoot(container) {
    // 创建FiberRootNode
    var root = createContainer(container);
    return {
        render: function (element) {
            // TODO
            // 初始化合成事件
            (0, SyntheticEvent_1.initEvent)(container);
            // 更新contianer
            return updateContainer(element, root);
        },
    };
}


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateFiberProps = updateFiberProps;
exports.getFiberEvents = getFiberEvents;
exports.getFiberProps = getFiberProps;
exports.getFiberAttribute = getFiberAttribute;
exports.initEvent = initEvent;
var events_1 = __webpack_require__(7);
var scheduler_1 = __webpack_require__(8);
/** 转换Style */
function camelToKebab(str) {
    return str.replace(/[A-Z]/g, function (match) { return "-".concat(match.toLowerCase()); });
}
/** 合成事件 */
var elementPropsKey = "__props";
/** 阻止冒泡Key */
var stopPropagationKey = "__stopPropagation";
/** 判断是否为事件 */
var isEvent = function (key) { return events_1.reactEventSet.has(key); };
/** 判断是否为属性（排除过滤掉event和children） */
var isAttribute = function (key) { return key !== "children"; };
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
    return Object.keys(attributes)
        .filter(isAttribute)
        .reduce(function (prev, key) {
        var _a;
        if ("style" === key) {
            if (typeof attributes["style"] === "object" &&
                attributes["style"] !== null) {
                return __assign(__assign({}, prev), { style: Object.entries(attributes[key]).reduce(function (prevStyle, _a) {
                        var key = _a[0], value = _a[1];
                        return prevStyle + "".concat(camelToKebab(key), ":").concat(value, ";");
                    }, "") });
            }
            return prev;
        }
        return __assign(__assign({}, prev), (_a = {}, _a[key.toLowerCase()] = attributes[key], _a));
    }, {});
}
/** 更新属性 */
function updateAttributes(node, props) {
    var prevAttribute = getFiberAttribute(node);
    var currentAttirbute = covertAttribute(props);
    Object.entries(currentAttirbute).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        node[key] = value;
        if (prevAttribute[key]) {
            delete prevAttribute[key];
        }
    });
    Object.keys(prevAttribute).forEach(function (key) {
        delete prevAttribute[key];
        delete node[key];
    });
}
/** 获取事件 */
function getFiberEvents(node) {
    var _prop = node[elementPropsKey];
    return _prop.filter(isEvent);
}
/** 获取所有属性 */
function getFiberProps(node) {
    return node[elementPropsKey];
}
/** 过滤获得属性 */
function getFiberAttribute(node) {
    var _prop = node[elementPropsKey] || {};
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
    var events = {
        captureCallbacks: [],
        bubbleCallbacks: [],
    };
    var currentNode = event.target;
    var reactEvent = events_1.reactEvents[eventType];
    if (!reactEvent)
        return events;
    while (currentNode !== source) {
        // 从target收集到source
        var nodeProps = getFiberProps(currentNode);
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
    listeners.forEach(function (listener) {
        return scheduler_1.default.runWithPriority((0, events_1.eventTypeToSchedulerPriority)(event.type), function () {
            listener(event);
        });
    });
}
/**
 * 触发合成事件
 * @param container 委托的container
 * @param eventType 原生事件类型
 * @param event 事件对象
 */
function dispatchSyntheticEvent(container, eventType, event) {
    var collectedEvents = collectEvents(container, eventType, event);
    // 代理阻止冒泡事件
    event[stopPropagationKey] = false;
    var originStopPropagation = event.stopPropagation;
    event.stopPropagation = function () {
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
    events_1.nativeEvents.forEach(function (nativeEvent) {
        /** 对每种支持的原生事件 构建委托 */
        container.addEventListener(nativeEvent, dispatchSyntheticEvent.bind(null, container, nativeEvent));
    });
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reactEventSet = exports.reactEvents = exports.nativeEvents = void 0;
exports.eventTypeToSchedulerPriority = eventTypeToSchedulerPriority;
var scheduler_1 = __webpack_require__(8);
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
            return scheduler_1.PriorityLevel.IMMEDIATE_PRIORITY;
        case "scroll":
        case "resize":
        case "mousemove":
        case "mouseenter":
        case "mouseleave":
        case "touchstart":
        case "touchmove":
        case "touchend":
            return scheduler_1.PriorityLevel.USER_BLOCKING_PRIORITY;
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
            return scheduler_1.PriorityLevel.NORMAL_PRIORITY;
        case "abort":
        case "load":
        case "loadeddata":
        case "loadedmetadata":
        case "error":
        case "durationchange":
            return scheduler_1.PriorityLevel.LOW_PRIORITY;
        default:
            return scheduler_1.PriorityLevel.IDLE_PRIORITY;
    }
}
/** 可以代理的原生事件 */
exports.nativeEvents = [
    "click",
    "contextmenu",
    "dblclick",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "keydown",
    "keypress",
    "keyup",
    "focus",
    "blur",
    "change",
    "input",
    "submit",
    "invalid",
    "select",
    "touchcancel",
    "touchend",
    "touchmove",
    "touchstart",
    "scroll",
    "drag",
    "dragend",
    "dragenter",
    "dragexit",
    "dragleave",
    "dragover",
    "dragstart",
    "drop",
    "abort",
    "canplay",
    "canplaythrough",
    "durationchange",
    "emptied",
    "ended",
    "loadeddata",
    "loadedmetadata",
    "pause",
    "play",
    "playing",
    "progress",
    "ratechange",
    "seeked",
    "seeking",
    "stalled",
    "stop",
    "suspend",
    "timeupdate",
    "volumechange",
    "waiting",
    "resize",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "copy",
    "cut",
    "paste",
    "focus",
    "blur",
];
// React 合成事件对象
exports.reactEvents = {
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
    paste: ["onPasteCapture", "onPaste"],
};
exports.reactEventSet = new Set([
    "onClick",
    "onContextMenu",
    "onDoubleClick",
    "onMouseDown",
    "onMouseEnter",
    "onMouseLeave",
    "onMouseMove",
    "onMouseOut",
    "onMouseOver",
    "onMouseUp",
    "onKeyDown",
    "onKeyPress",
    "onKeyUp",
    "onFocus",
    "onBlur",
    "onChange",
    "onInput",
    "onSubmit",
    "onInvalid",
    "onSelect",
    "onTouchCancel",
    "onTouchEnd",
    "onTouchMove",
    "onTouchStart",
    "onScroll",
    "onDrag",
    "onDragEnd",
    "onDragEnter",
    "onDragExit",
    "onDragLeave",
    "onDragOver",
    "onDragStart",
    "onDrop",
    "onAbort",
    "onCanPlay",
    "onCanPlayThrough",
    "onDurationChange",
    "onEmptied",
    "onEnded",
    "onLoadedData",
    "onLoadedMetadata",
    "onPause",
    "onPlay",
    "onPlaying",
    "onProgress",
    "onRateChange",
    "onSeeked",
    "onSeeking",
    "onStalled",
    "onStop",
    "onSuspend",
    "onTimeUpdate",
    "onVolumeChange",
    "onWaiting",
    "onResize",
    "onPointerDown",
    "onPointerMove",
    "onPointerUp",
    "onPointerCancel",
    "onCopy",
    "onCut",
    "onPaste",
]);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PriorityLevel = void 0;
var mini_heap_1 = __webpack_require__(9);
/** 比较函数 */
var compare = function (a, b) {
    var diff = a.expirationTime - b.expirationTime;
    return diff !== 0 ? diff : a.id - b.id;
};
/** 调度优先级 */
var PriorityLevel;
(function (PriorityLevel) {
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
})(PriorityLevel || (exports.PriorityLevel = PriorityLevel = {}));
/** 优先级到超时时间的映射  */
var PRIORITY_LEVEL_TO_TIMEOUT_MAP = (_a = {},
    _a[PriorityLevel.IMMEDIATE_PRIORITY] = -1,
    _a[PriorityLevel.USER_BLOCKING_PRIORITY] = 250,
    _a[PriorityLevel.NORMAL_PRIORITY] = 500,
    _a[PriorityLevel.LOW_PRIORITY] = 1000,
    _a[PriorityLevel.IDLE_PRIORITY] = Number.MAX_SAFE_INTEGER,
    _a);
/** 每个任务的最长时间 默认5ms */
var frameYieldMs = 5;
/** 导出一个Scheduler 调度器 */
var Scheduler = /** @class */ (function () {
    function Scheduler() {
        /** 声明任务队列 */
        this.taskQueue = new mini_heap_1.MiniHeap(compare);
        /** 声明延迟队列 */
        this.timerQueue = new mini_heap_1.MiniHeap(compare);
        /** 任务计数器 */
        this.userTaskCnt = 0;
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
        this.isMessageLoopRunning = false;
        /**
         * HostCallbackScheduled
         * 给HostCallback被调度这个过程上锁，也就是一个时刻只能有一个HostCallback被调度
         * 注意，Scheduler的MessageLoop不会一直空转，只有当taskQueue有任务的时候，才会启动循环
         * scheduler没有一直监测taskQueue是否为空，而是通过，
         *  1. 如果有普通任务被注册，就开启循环，执行完关闭
         *  2. 如果有延迟任务到达延迟时间被放倒taskQueue 就开启循环
         * HostCallbackScheduled 需要保证，一次只能有一个“触发loop过程” 如果同时有大量任务被注册，每次注册都会触发一次loop 会造成资源浪费
         */
        this.isHostCallbackScheduled = false;
        /** 给perform加锁
         *  同一时刻只能有一个workLoop运行，对其进行加锁
         */
        this.isPerformingWork = false;
        /** hostTimeoutScheduled 定时任务加锁，一次只能有一个定时任务运行 */
        this.isHostTimeoutScheduled = false;
        /** 计时器id 用来清理定时器 */
        this.timerId = void 0;
        /** 全局任务开始时间 */
        this.startTime = -1;
        /** 当前执行的优先级 */
        this.currentPriorityLevel = PriorityLevel.NORMAL_PRIORITY;
    }
    /** 注册回调任务 */
    Scheduler.prototype.scheduleCallback = function (priorityLevel, callback, delay) {
        if (priorityLevel === void 0) { priorityLevel = PriorityLevel.NORMAL_PRIORITY; }
        if (callback === void 0) { callback = function () { }; }
        if (delay === void 0) { delay = 0; }
        /** 获取当前高精度时间 */
        var currentTime = performance.now();
        /** 任务开始时间
         *  如果非延迟 就是currentTime
         *  如果配置了delay 则startTime = currentTime + delay
         */
        var startTime = currentTime + delay;
        /** 根据优先级，计算timeout
         *  默认为NORMAL 即 500
         */
        var timeout = PRIORITY_LEVEL_TO_TIMEOUT_MAP[priorityLevel] ||
            PRIORITY_LEVEL_TO_TIMEOUT_MAP[PriorityLevel.NORMAL_PRIORITY];
        /** 过期时间
         *  对于普通任务 currentTime + timeout
         *  对于延迟任务 currentTime + delay + timeout
         */
        var expirationTime = startTime + timeout;
        /** 把callback封装成UserCallbackTask  */
        var userCallbackTask = {
            id: this.userTaskCnt++,
            priorityLevel: priorityLevel,
            startTime: startTime,
            expirationTime: expirationTime,
            callback: callback,
            sortIndex: -1,
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
        }
        else {
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
    };
    /** 取消任务 */
    Scheduler.prototype.cancelCallback = function (task) {
        task.callback = null;
    };
    /** 开启任务循环 */
    Scheduler.prototype.requestHostCallback = function () {
        /** 在这里开启循环，并且上锁，保证只有一个performWorkUntilDeadline在运行 */
        if (!this.isMessageLoopRunning) {
            this.isMessageLoopRunning = true;
            this.schedulePerformWorkUntilDeadline();
        }
    };
    Scheduler.prototype.advacneTimers = function () { };
    /** 处理完成延迟
     * 1. 解锁
     * 2. 查看messageloop是否在运行，如果没有运行则触发
     */
    Scheduler.prototype.handleTimeout = function () {
        // 解锁
        this.isHostTimeoutScheduled = false;
        this.advacneTimers();
        // 检查taskQueue
        if (!this.isHostTimeoutScheduled) {
            // 这里isPerformingWork一定是false 因为在执行任务的时候 会把timer都取消掉
            var task = this.taskQueue.peek();
            if (task) {
                // 开始调度触发循环
                this.isHostTimeoutScheduled = true;
                this.requestHostCallback();
            }
            else {
                // 如果没有触发循环，则需要再次检查timerQueue 还有没有任务
                var peekTimer = this.timerQueue.peek();
                if (peekTimer) {
                    this.requestHostTimeout(this.handleTimeout, peekTimer.startTime - performance.now());
                }
            }
        }
    };
    /** 对settimeout的包装，并且保存timerId */
    Scheduler.prototype.requestHostTimeout = function (handler, delay) {
        // 加锁
        if (!this.isHostTimeoutScheduled) {
            this.isHostTimeoutScheduled = true;
            this.timerId = setTimeout(handler, delay);
        }
    };
    /** 取消定时任务 */
    Scheduler.prototype.cancelHostTimeout = function () {
        if (this.isHostTimeoutScheduled) {
            clearTimeout(this.timerId);
            this.timerId = void 0;
            // 解锁
            this.isHostTimeoutScheduled = false;
        }
    };
    /** 持续循环运行任务
     * 开启一个时间切片的任务，时间切片的宽度为frameYieldMs 默认5ms
     * 每次时间切片运行结束后，如果还有任务，重复调用performWorkUntilDeadline继续运行
     * 没有任务了，则释放isMessageLoopRunning锁，循环停止运行
     */
    Scheduler.prototype.performWorkUntilDeadline = function () {
        if (this.isMessageLoopRunning) {
            /** 获得每次循环的开始时间 */
            var workStartTime = performance.now();
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
            var hasMorkWork = true;
            try {
                hasMorkWork = this.flushWork(workStartTime);
            }
            finally {
                if (hasMorkWork) {
                    /** 还有任务 继续运行 */
                    this.schedulePerformWorkUntilDeadline();
                }
                else {
                    /** 没有任务了 关闭loop */
                    this.isMessageLoopRunning = false;
                }
            }
        }
    };
    /** 调度任务 使用messageChannel
     *  messageChannel的好处是
     *  1. 可以创建宏任务 不阻塞主线程
     *  2. 相比于settimeout 延迟更小
     *  3. 在没有messageChannel的情况下，使用settimeout兜底
     */
    Scheduler.prototype.schedulePerformWorkUntilDeadline = function () {
        var _this = this;
        if (typeof MessageChannel === "function") {
            var messageChannel = new MessageChannel();
            messageChannel.port2.onmessage = this.performWorkUntilDeadline.bind(this);
            /** 发送消息 */
            messageChannel.port1.postMessage(null);
        }
        else {
            /* 没有MessageChannel 用settimeout兜底*/
            setTimeout(function () {
                _this.performWorkUntilDeadline();
            });
        }
    };
    /**
     * flushWork 运行任务 一个5ms的时间 并且返回是否还有任务
     * @param workStartTime
     * @returns
     */
    Scheduler.prototype.flushWork = function (workStartTime) {
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
        var previousPriorityLeve = this.currentPriorityLevel;
        try {
            return this.workLoop(workStartTime);
        }
        finally {
            /** 注意 这里finally一定会在最后执行 即便上面有return （return只是标记了返回点） */
            this.isPerformingWork = false;
            /** 恢复优先级 */
            this.currentPriorityLevel = previousPriorityLeve;
        }
    };
    /**
     * workLoop
     * @param workStartTime
     */
    Scheduler.prototype.workLoop = function (workStartTime) {
        /** workloop是个临界资源
         *  其功能是，在一个时间片内 （5ms）持续运行任务，直到时间片耗完
         *  注意，为什么要设计一个固定时间5ms 很多任务是很小的，可能其运行时间很短，如果一个workLoop只运行一个任务，很可能造成浪费
         *  进入workLoop之前会做很多准备 比如加锁 计算时间等 如果只为了运行一个小人物 很浪费资源，所以这里设计成了 一个时间片就是5ms
         *  如果运行完一个任务还有时间 就继续运行 直到5ms
         */
        // 当前时间
        var workCurrentTime = workStartTime;
        // 先检查一下有没有延迟任务需要加入到taskQueue
        this.advacneTimers();
        // 取得优先级最高的任务
        var currentTask = this.taskQueue.peek();
        /** 开始循环，每次循环都取新的currentTask
         * 有几种情况会停止循环
         * 1. 当前过期时间最小的任务还没过期 同时时间片结束 跳出循环，释放主线程
         * 2. 如果已经过期，并且时间片也结束，会继续运行，交给用户决定要不要继续运行，如果继续运行则用户会在callback中继续执行逻辑，带来的可能是页面卡顿
         *    如果用户不继续执行了，返回一个新的callback function 来处理剩下的任务即可
         * 3. workloop 对于小任务 会在一次执行过程（时间片5ms）内 执行多个，但是对于大任务，只会执行一个部分
         * 4. 如果定义大任务，如果用户的callback返回了一个函数 代表此任务为大任务 还有剩余任务，此时即便时间片还没用完 也要结束workLoop 释放主线程，下一个loop在执行
         */
        var isUserCallbackTimeout = false;
        while (currentTask) {
            // 更新判断是否超时
            isUserCallbackTimeout = currentTask.expirationTime < workCurrentTime;
            if (!isUserCallbackTimeout && this.shouldYieldToHost()) {
                // 让出主线程
                break;
            }
            /** 还有时间 执行callback */
            var callback = currentTask.callback;
            if (typeof callback === "function") {
                // callback置空
                currentTask.callback = null;
                // 更新优先级
                this.currentPriorityLevel = currentTask.priorityLevel;
                // 保证callback可调用
                var continuationCallback = callback(isUserCallbackTimeout);
                if (typeof continuationCallback === "function") {
                    // 如果返回了剩余任务，表示当前执行的是大任务，重新给task的callback赋值，结束workloop
                    currentTask.callback = continuationCallback;
                    // 看一下是否有可以加入到taskQueue的延迟任务
                    this.advacneTimers();
                    // 表示还有任务
                    return true;
                }
                else {
                    // 当前任务执行完了，小任务，继续while执行
                    if (currentTask === this.taskQueue.peek()) {
                        this.taskQueue.pop(); // 弹出当前执行完的任务
                    }
                    // 看一下是否有可以加入到taskQueue的延迟任务
                    this.advacneTimers();
                }
            }
            else {
                // 如果callback为空 或者不是函数，说明当前任务不可执行 也可能是当前任务已经报错了，直接弹出
                this.taskQueue.pop();
            }
            // 此时 继续循环执行小任务 取下一个任务
            currentTask = this.taskQueue.peek();
        }
        // 执行到这里，1.可能是是currentTask没超时，但是没有时间片了，推出workLoop，返回true表示还是任务 2.可能是没任务了
        if (currentTask) {
            return true;
        }
        else {
            // taskQueue没有任务了，此时返回false，此时flushwork结束，messageLoop结束，需要开启延迟任务，以确保在延迟到达时，能启动messageLoop
            var timerTask = this.timerQueue.peek();
            if (timerTask) {
                // 检查timerQueue 有任务则开启
                var firstTimer = this.timerQueue.peek();
                if (firstTimer) {
                    this.requestHostTimeout(this.handleTimeout, firstTimer.startTime - performance.now());
                }
            }
            return false;
        }
    };
    /** 是否应当让出主线程 */
    Scheduler.prototype.shouldYieldToHost = function () {
        var timeElapsed = performance.now() - this.startTime;
        if (timeElapsed < frameYieldMs) {
            // The main thread has only been blocked for a really short amount of time;
            // smaller than a single frame. Don't yield yet.
            return false;
        }
        // Yield now.
        return true;
    };
    /** 获取当前的优先级 */
    Scheduler.prototype.getCurrentPriorityLevel = function () {
        return this.currentPriorityLevel;
    };
    /** 以某优先级同步运行 */
    Scheduler.prototype.runWithPriority = function (priorityLevel, callback) {
        var priviouseLevel = this.currentPriorityLevel;
        this.currentPriorityLevel = priorityLevel;
        try {
            callback();
        }
        catch (e) {
            console.warn(e);
        }
        finally {
            this.currentPriorityLevel = priviouseLevel;
        }
    };
    return Scheduler;
}());
var scheduler = new Scheduler();
exports["default"] = scheduler;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiniHeap = void 0;
/** 实现一个小顶堆 用来维护最高优先级任务队列 */
var MiniHeap = /** @class */ (function () {
    function MiniHeap(compare) {
        this.toString = this.show;
        this.toJSON = this.show;
        this.valueOf = this.show;
        this.data = [];
        this.compare =
            compare ||
                function (a, b) {
                    return a - b;
                };
    }
    /** 增加元素 */
    MiniHeap.prototype.push = function (value) {
        var index = this.data.length;
        this.data[index] = value;
        this.shiftUp(index);
    };
    /** 获取顶部元素 */
    MiniHeap.prototype.peek = function () {
        return this.data[0];
    };
    /** 从顶部删除元素 */
    MiniHeap.prototype.pop = function () {
        if (this.data.length <= 1) {
            return this.data.shift();
        }
        var root = this.data[0];
        var last = this.data.pop();
        if (last !== void 0 && root !== last) {
            this.data[0] = last;
            this.shiftDown(0);
            return root;
        }
        else {
            return root;
        }
    };
    /* 向上调整 */
    MiniHeap.prototype.shiftUp = function (i) {
        /** i === 0 根节点不用向上调整 */
        while (i > 0) {
            // 找到parentIndex
            var parentIndex = i >>> 1;
            var parentValue = this.data[parentIndex];
            var currentValue = this.data[i];
            if (this.compare(parentValue, currentValue) > 0) {
                /** 和父节点交换 */
                swap(this.data, i, parentIndex);
                /** 设置新的i */
                i = parentIndex;
            }
            else {
                /** 满足小顶堆 不调整 */
                return;
            }
        }
    };
    /** 向下调整 */
    MiniHeap.prototype.shiftDown = function (i) {
        /** 调整到最后一个非叶子结点 */
        var len = this.data.length;
        var lastParentIndex = (len >>> 1) - 1;
        /** 叶子结点 不用调整 */
        while (i <= lastParentIndex) {
            /** 获取左右孩子 */
            var leftChildIndex = (i + 1) * 2 - 1;
            var rightChildIndex = leftChildIndex + 1;
            var currentValue = this.data[i];
            var leftChild = this.data[leftChildIndex];
            var rightChild = this.data[rightChildIndex];
            /** i 不是叶子结点 一定有左孩子 */
            if (this.compare(currentValue, leftChild) > 0) {
                /** i不是最小的情况下 leftChild小 需要和rightChild（若存在） 比 找到最小的一个 */
                if (rightChildIndex < len && this.compare(leftChild, rightChild) > 0) {
                    /** right存在 且小 交换right和i 并且修改i为rightIndex [i > left > right]*/
                    swap(this.data, i, rightChildIndex);
                    i = rightChildIndex;
                }
                else {
                    /** right不存在 或者 left < right 交换left和i 并且修改i为leftIndex [i > right > left]*/
                    swap(this.data, i, leftChildIndex);
                    i = leftChildIndex;
                }
            }
            else {
                /** i 可能是最小的情况下  此时比较i和right 找出最小值 （若存在）*/
                if (rightChildIndex < len &&
                    this.compare(currentValue, rightChild) > 0) {
                    /** right存在 且最小 left > i > right */
                    swap(this.data, i, rightChildIndex);
                    i = rightChildIndex;
                }
                else {
                    /** 最后一种 i最小 不处理 已经是小顶堆 */
                    return;
                }
            }
        }
    };
    /** 展示树结构 */
    MiniHeap.prototype.show = function () {
        var arr = this.data;
        if (!arr || arr.length === 0)
            return "";
        // Helper function to build the tree string
        function buildTreeString(index, level, space) {
            if (index >= arr.length ||
                arr[index] === null ||
                arr[index] === undefined)
                return "";
            var node = arr[index];
            var leftIndex = 2 * index + 1;
            var rightIndex = 2 * index + 2;
            var treeString = "";
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
    };
    return MiniHeap;
}());
exports.MiniHeap = MiniHeap;
function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiberRootNode = exports.FiberNode = void 0;
exports.createWorkInProgress = createWorkInProgress;
exports.createFiberFromElement = createFiberFromElement;
exports.createFiberFromFragment = createFiberFromFragment;
var flags_1 = __webpack_require__(11);
var ReactSymbols_1 = __webpack_require__(2);
var workTag_1 = __webpack_require__(12);
var fiberLanes_1 = __webpack_require__(13);
/** Fiber节点类 */
var FiberNode = /** @class */ (function () {
    function FiberNode(tag, pendingProps, key) {
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
        this.flags = flags_1.NoFlags;
        this.subTreeFlags = flags_1.NoFlags;
        this.pendingProps = pendingProps;
        this.delections = null;
        this.updateQueue = null;
        this.alternate = null;
        /** lanes相关 */
        this.lanes = fiberLanes_1.NoLanes;
        this.childLanes = fiberLanes_1.NoLanes;
    }
    return FiberNode;
}());
exports.FiberNode = FiberNode;
/** 只有一个 整个应用的根 */
var FiberRootNode = /** @class */ (function () {
    /** 需要传入container 和 第一个HostRootFiber */
    function FiberRootNode(conatiner, hostRootFiber) {
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
            update: [],
        };
        /** 初始化lane */
        this.pendingLanes = fiberLanes_1.NoLanes;
        this.finishedLane = fiberLanes_1.NoLane;
    }
    return FiberRootNode;
}());
exports.FiberRootNode = FiberRootNode;
/** 根据现有的Fiber节点，创建更新的Fiber节点
 * 如果当前Fiber节点存在alternate 复用
 * 弱不存在，创建新的FiberNode
 * 将current的内容拷贝过来 包含lane memorizedState/props child 等
 *
 * 在Fiber节点内容可以复用的情况调用，新的fiber节点的 tag type stateNode 等会复用 ｜ props，lane flags delecation这些副作用 会重置
 */
function createWorkInProgress(currentFiber, pendingProps) {
    /** 创建wip 当前的workInProgress 先看看能不能复用.alternate */
    var wip = currentFiber.alternate;
    if (wip === null) {
        /** mount阶段，说明对面不存在alternate节点 */
        wip = new FiberNode(currentFiber.tag, pendingProps, currentFiber.key);
        /** stateNode为fiber对应的真实dom节点 */
        wip.stateNode = currentFiber.stateNode;
        /** 建立双向的alternate链接 */
        wip.alternate = currentFiber;
        currentFiber.alternate = wip;
    }
    else {
        /** update节点，复用 重置副作用 */
        wip.flags = flags_1.NoFlags;
        wip.subTreeFlags = flags_1.NoFlags;
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
    return wip;
}
/**
 * 从ReactElement对象 创建Fiber对象
 * @param element
 */
function createFiberFromElement(element) {
    var _a;
    // 默认fiberTag = FunctionComponent
    var fiberTag = workTag_1.FunctionComponent;
    var pendingProps = element.props;
    // hostComponent的element.type为string
    if (typeof element.type === "string") {
        fiberTag = workTag_1.HostComponent;
    }
    else if (typeof element.type === "object") {
        switch ((_a = element.type) === null || _a === void 0 ? void 0 : _a.$$typeof) {
            case ReactSymbols_1.REACT_MEMO_TYPE:
                // 设置memo类型的fiberTag
                fiberTag = workTag_1.MemoComponent;
        }
    }
    else if (element.type === ReactSymbols_1.REACT_FRAGMENT_TYPE) {
        fiberTag = workTag_1.Fragment;
        return createFiberFromFragment(element.props.children, element.key);
    }
    var fiber = new FiberNode(fiberTag, pendingProps, element.key);
    fiber.type = element.type;
    // 这里需要设置ref 新创建的fiber节点 非复用的情况下 需要从element.ref获取ref
    fiber.ref = element.ref;
    return fiber;
}
function createFiberFromFragment(elemenst, key) {
    var fragmentFiber = new FiberNode(workTag_1.Fragment, elemenst, key);
    return fragmentFiber;
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HostEffectMask = exports.PassiveMask = exports.LayoutMask = exports.MutationMask = exports.ShouldCapture = exports.DidCapture = exports.Visibility = exports.Ref = exports.PassiveEffect = exports.ChildDeletion = exports.Update = exports.Placement = exports.NoFlags = void 0;
exports.NoFlags = 0;
exports.Placement = 1;
exports.Update = 2;
exports.ChildDeletion = 4;
exports.PassiveEffect = 8;
exports.Ref = 16;
exports.Visibility = 32;
// 捕获到 something
exports.DidCapture = 64;
// unwind应该捕获、还未捕获到
exports.ShouldCapture = 4096;
// mutation阶段的mask 需要包含ref
exports.MutationMask = exports.Placement | exports.Update | exports.ChildDeletion | exports.Ref | exports.Visibility;
// layout阶段的mask
exports.LayoutMask = exports.Ref;
exports.PassiveMask = exports.PassiveEffect | exports.ChildDeletion;
exports.HostEffectMask = exports.MutationMask | exports.LayoutMask | exports.PassiveMask | exports.DidCapture;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoComponent = exports.LazyComponent = exports.OffscreenComponent = exports.SuspenseComponent = exports.ContextProvider = exports.Fragment = exports.HostText = exports.HostComponent = exports.HostRoot = exports.FunctionComponent = void 0;
exports.FunctionComponent = 0;
exports.HostRoot = 3;
exports.HostComponent = 5;
// <div>123</div>
exports.HostText = 6;
exports.Fragment = 7;
exports.ContextProvider = 8;
exports.SuspenseComponent = 13;
exports.OffscreenComponent = 14;
exports.LazyComponent = 16;
exports.MemoComponent = 15;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/** 实现车道模型优先级 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeferredLane = exports.OffscreenLane = exports.IdleLane = exports.IdleHydrationLane = exports.SelectiveHydrationLane = exports.SomeRetryLane = exports.TransitionLane = exports.SyncUpdateLanes = exports.DefaultLane = exports.DefaultHydrationLane = exports.InputContinuousLane = exports.InputContinuousHydrationLane = exports.SyncLaneIndex = exports.SyncLane = exports.SyncHydrationLane = exports.NoLane = exports.NoLanes = exports.TotalLanes = void 0;
exports.mergeLane = mergeLane;
exports.removeLanes = removeLanes;
exports.getHighestPriorityLane = getHighestPriorityLane;
exports.isSubsetOfLanes = isSubsetOfLanes;
exports.includeSomeLanes = includeSomeLanes;
exports.getNextLane = getNextLane;
exports.markRootUpdated = markRootUpdated;
exports.markRootFinished = markRootFinished;
exports.schedulerPriorityToLane = schedulerPriorityToLane;
exports.lanesToSchedulerPriority = lanesToSchedulerPriority;
exports.requestUpdateLane = requestUpdateLane;
var scheduler_1 = __webpack_require__(8);
var fiberHooks_1 = __webpack_require__(14);
exports.TotalLanes = 31;
exports.NoLanes = 0;
exports.NoLane = 0;
exports.SyncHydrationLane = 1;
exports.SyncLane = 2;
exports.SyncLaneIndex = 1;
exports.InputContinuousHydrationLane = 4;
exports.InputContinuousLane = 8;
exports.DefaultHydrationLane = 16;
exports.DefaultLane = 32;
exports.SyncUpdateLanes = exports.SyncLane | exports.InputContinuousLane | exports.DefaultLane;
exports.TransitionLane = 128;
var TransitionHydrationLane = /*                */ 64;
var TransitionLanes = /*                       */ 4194176;
var TransitionLane1 = /*                        */ 128;
var TransitionLane2 = /*                        */ 256;
var TransitionLane3 = /*                        */ 512;
var TransitionLane4 = /*                        */ 1024;
var TransitionLane5 = /*                        */ 2048;
var TransitionLane6 = /*                        */ 4096;
var TransitionLane7 = /*                        */ 8192;
var TransitionLane8 = /*                        */ 16384;
var TransitionLane9 = /*                        */ 32768;
var TransitionLane10 = /*                       */ 65536;
var TransitionLane11 = /*                       */ 131072;
var TransitionLane12 = /*                       */ 262144;
var TransitionLane13 = /*                       */ 524288;
var TransitionLane14 = /*                       */ 1048576;
var TransitionLane15 = /*                       */ 2097152;
var RetryLanes = /*                            */ 62914560;
var RetryLane1 = /*                             */ 4194304;
var RetryLane2 = /*                             */ 8388608;
var RetryLane3 = /*                             */ 16777216;
var RetryLane4 = /*                             */ 33554432;
exports.SomeRetryLane = RetryLane1;
exports.SelectiveHydrationLane = 67108864;
var NonIdleLanes = /*                          */ 134217727;
exports.IdleHydrationLane = 134217728;
exports.IdleLane = 268435456;
exports.OffscreenLane = 536870912;
exports.DeferredLane = 1073741824;
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
    return (laneSet & subSet) !== exports.NoLanes;
}
/** 和root操作相关 */
/**
 * 获取当前root优先级最高的lan
 * @param lanes
 */
function getNextLane(root) {
    var pendingLanes = root.pendingLanes;
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
        case scheduler_1.PriorityLevel.IMMEDIATE_PRIORITY:
            return exports.SyncLane;
        case scheduler_1.PriorityLevel.USER_BLOCKING_PRIORITY:
            return exports.InputContinuousLane;
        case scheduler_1.PriorityLevel.NORMAL_PRIORITY:
            return exports.DefaultLane;
        default:
            return exports.IdleLane;
    }
}
/**
 * lanes优先级转scheduler优先级 （取lanes中优先级最高的lane 调用getHighestPriorityLane）
 * @param lanes
 */
function lanesToSchedulerPriority(lanes) {
    var highestPriorityLane = getHighestPriorityLane(lanes);
    switch (highestPriorityLane) {
        case exports.SyncLane:
            return scheduler_1.PriorityLevel.IMMEDIATE_PRIORITY;
        case exports.InputContinuousLane:
            return scheduler_1.PriorityLevel.USER_BLOCKING_PRIORITY;
        case exports.TransitionLane:
            return scheduler_1.PriorityLevel.LOW_PRIORITY;
        case exports.DeferredLane:
            return scheduler_1.PriorityLevel.IDLE_PRIORITY;
        default:
            return scheduler_1.PriorityLevel.NORMAL_PRIORITY;
    }
}
/**
 * 根据当前update触发上下文 获取update优先级
 * 比如 setState在effect中触发和在onclick中触发 有不一样的优先级
 */
function requestUpdateLane() {
    if (fiberHooks_1.isTransition) {
        return exports.TransitionLane;
    }
    var currentUpdateLane = schedulerPriorityToLane(scheduler_1.default.getCurrentPriorityLevel());
    return currentUpdateLane;
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isTransition = void 0;
exports.renderWithHooks = renderWithHooks;
exports.bailoutHook = bailoutHook;
var currentDispatcher_1 = __webpack_require__(3);
var beginwork_1 = __webpack_require__(15);
var fiberLanes_1 = __webpack_require__(13);
var flags_1 = __webpack_require__(11);
var hookEffectTags_1 = __webpack_require__(18);
var updateQueue_1 = __webpack_require__(19);
var workLoop_1 = __webpack_require__(20);
/** 定义一些全局变量 */
/** 当前正在渲染的hook */
var currentRenderingFiber = null;
/** 当前正在处理的HOOK */
var workInProgressHook = null;
/** currentHook current fiber和当前workInProgressHook对应的hook */
var currentHook = null;
// 需要注意 wipxxx都是当前处理fiber tree上的 current都是当前已经渲染的fiber tre上的属性
var renderLane = fiberLanes_1.NoLane;
// 导出共享变量
exports.isTransition = false;
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
    var current = wip.alternate;
    renderLane = lane;
    if (current !== null) {
        // update
        currentDispatcher_1.currentDispatcher.current = {
            useState: updateState,
            useEffect: updateEffect,
            useTransition: updateTransition,
            useDeferedValue: updateDeferedValue,
            useRef: updateRef,
            useMemo: updateMemo,
            useCallback: updateCallback,
        };
    }
    else {
        // mount
        currentDispatcher_1.currentDispatcher.current = {
            useState: mountState,
            useEffect: mountEffect,
            useTransition: mountTransition,
            useDeferedValue: mountDeferedValue,
            useRef: mountRef,
            useMemo: mountMemo,
            useCallback: mountCallback,
        };
    }
    // 运行函数
    var pendingProps = wip.pendingProps;
    var childrenElements = Component(pendingProps);
    // 恢复
    currentRenderingFiber = null;
    workInProgressHook = null;
    currentHook = null;
    currentDispatcher_1.currentDispatcher.current = null;
    renderLane = fiberLanes_1.NoLane;
    return childrenElements;
}
/** 挂载state */
function mountState(initialState) {
    var hook = mountWorkInProgressHook();
    var memorizedState;
    // 计算初始值
    if (typeof initialState === "function") {
        memorizedState = initialState();
    }
    else {
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
    var hook = updateWorkInProgressHook();
    var memorizedState = hook.updateQueue.process(renderLane, function (update) {
        currentRenderingFiber.lanes = (0, fiberLanes_1.mergeLane)(currentRenderingFiber.lanes, update.lane);
    }).memorizedState;
    // 检查state是否变化
    if (!Object.is(hook.updateQueue.lastRenderedState, memorizedState)) {
        (0, beginwork_1.markWipReceiveUpdate)();
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
    var hook = {
        memorizedState: null,
        updateQueue: new updateQueue_1.UpdateQueue(),
        next: null,
    };
    // hook的挂载方式是 currentRenderdingFiber.memorizedState -> hook1 -next-> hook2 -next-> hook3 -next-> null
    if (currentRenderingFiber.memorizedState === null) {
        // 第一次挂载
        currentRenderingFiber.memorizedState = hook;
    }
    else {
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
    var current = currentRenderingFiber.alternate;
    // currentHook是指向current元素的hook指针
    if (currentHook === null) {
        // 当前还没有currentHook 第一个元素
        if (current) {
            currentHook = current.memorizedState;
        }
        else {
            currentHook = null;
        }
    }
    else {
        // 如果有currentHook 说明不是第一个hook
        currentHook = currentHook.next;
    }
    // 如果没找到currentHook 说明hook数量对不上
    if (currentHook === null) {
        throw new Error("render more hooks than previouse render!");
    }
    // 拿到currentHook了 需要根据其构建当前的workInProgrerssHook
    var hook = {
        memorizedState: currentHook.memorizedState,
        updateQueue: currentHook.updateQueue,
        next: null,
    };
    if (currentRenderingFiber.memorizedState === null) {
        currentRenderingFiber.memorizedState = hook;
    }
    else {
        workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
    return hook;
}
/** 派发修改state */
function dispatchSetState(fiber, updateQueue, action) {
    // 获取一个优先级 根据 dispatchSetState 执行所在的上下文
    var lane = (0, fiberLanes_1.requestUpdateLane)();
    // 创建一个update对象
    var update = new updateQueue_1.Update(action, lane);
    if (updateQueue.shared.pending === null && fiber.lanes === fiberLanes_1.NoLane) {
        // 没有其他更新任务的时候进行eagerState优化
        var currentState = updateQueue.lastRenderedState;
        var eagerState = void 0;
        if (typeof action === "function") {
            eagerState = action(currentState);
        }
        else {
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
    (0, workLoop_1.scheduleUpdateOnFiber)(fiber, lane);
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
    var hook = mountWorkInProgressHook();
    // 给fiber设置PassiveEffect 表示存在被动副作用
    currentRenderingFiber.flags |= flags_1.PassiveEffect;
    hook.memorizedState = pushEffect(
    // 初始化状态下，所有的useEffect都执行，所以这里flag设置为   Passive|HookHasEffect
    hookEffectTags_1.Passive | hookEffectTags_1.HookHasEffect, create, null, deps);
}
/** 更新Effect */
function updateEffect(create, deps) {
    // 获取当前hook
    var hook = updateWorkInProgressHook();
    var prevDeps = hook.memorizedState.deps;
    var destory = hook.memorizedState.destory;
    if (areHookInputsEqual(prevDeps, deps)) {
        // 相等 pushEffect 并且设置tag为Passive 被动副作用
        hook.memorizedState = pushEffect(hookEffectTags_1.Passive, create, 
        // 前一个副作用hook的destory
        destory, deps);
    }
    else {
        /** 不等 表示hook有Effect */
        hook.memorizedState = pushEffect(hookEffectTags_1.Passive | hookEffectTags_1.HookHasEffect, // 注意这里是 Passive 是Effect的tag 区分fiber的tag PassiveEffect
        create, 
        // 前一个副作用hook的destory
        destory, deps);
    }
    currentRenderingFiber.flags |= flags_1.PassiveEffect;
}
/** 创建Effect对象，把effect加入到fiber.updateQueue 并且返回创建的Effect */
function pushEffect(tags, create, destory, deps) {
    var effect = {
        tags: tags,
        create: create,
        destory: destory,
        deps: deps === undefined ? null : deps,
        next: null,
    };
    var updateQueue = currentRenderingFiber.updateQueue;
    if (!updateQueue || !(updateQueue instanceof updateQueue_1.FCUpdateQueue)) {
        // 创建一个FCUpdateQueue
        var fcUpdateQueue = new updateQueue_1.FCUpdateQueue();
        effect.next = effect; // 构建环
        fcUpdateQueue.lastEffect = effect;
        currentRenderingFiber.updateQueue = fcUpdateQueue;
    }
    else {
        // 已经存在 FCUpdateQueue 添加 后加环
        var fcUpdateQueue = currentRenderingFiber.updateQueue;
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
    if (prevDeps === null || curDeps === null)
        return false;
    if ((prevDeps === null || prevDeps === void 0 ? void 0 : prevDeps.length) !== (curDeps === null || curDeps === void 0 ? void 0 : curDeps.length))
        return false;
    for (var i = 0; i < prevDeps.length; i++) {
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
    var _a = mountState(false), isPending = _a[0], setPending = _a[1];
    // 获得hook
    var hook = mountWorkInProgressHook();
    // 创建startTransition
    var start = startTransition.bind(null, setPending);
    // 记录start
    hook.memorizedState = start;
    // 返回pending和start
    return [isPending, start];
}
function updateTransition() {
    var isPending = updateState()[0];
    var hook = updateWorkInProgressHook();
    var start = hook.memorizedState;
    return [isPending, start];
}
function startTransition(setPending, callback) {
    // 开始transition 第一次更新 此时优先级高
    setPending(true);
    // transition过程，下面的优先级低
    var prevTransition = exports.isTransition;
    // 设置标记 表示处于transition过程中，在fiberHook.ts/requestUpdateLane会判断这个变量，如果true则返回transtionLane
    exports.isTransition = true;
    // 设置标记 （在react原版中 这里是 1）
    // 第二次更新 优先级低
    callback();
    // 第三次更新 重新设置pending 优先级低
    setPending(false);
    // 恢复isTransition
    exports.isTransition = prevTransition;
}
/** 挂载Ref */
function mountRef(initialValue) {
    var hook = mountWorkInProgressHook();
    hook.memorizedState = { current: initialValue };
    return hook.memorizedState;
}
/** 更新Ref 其实就是保存一个值 */
function updateRef() {
    var hook = updateWorkInProgressHook();
    return hook.memorizedState;
}
/** useMemo */
function mountMemo(nextCreate, deps) {
    var hook = mountWorkInProgressHook();
    hook.memorizedState = [nextCreate(), deps];
    return hook.memorizedState[0];
}
function updateMemo(nextCreate, deps) {
    var hook = updateWorkInProgressHook();
    var _a = hook.memorizedState, prevValue = _a[0], prevDeps = _a[1];
    if (areHookInputsEqual(prevDeps, deps)) {
        hook.memorizedState = [prevValue, deps];
    }
    else {
        hook.memorizedState = [nextCreate(), deps];
    }
    return hook.memorizedState[0];
}
/** useCallback */
function mountCallback(callback, deps) {
    var hook = mountWorkInProgressHook();
    hook.memorizedState = [callback, deps];
    return hook.memorizedState[0];
}
function updateCallback(callback, deps) {
    var hook = updateWorkInProgressHook();
    var _a = hook.memorizedState, prevCallback = _a[0], prevDeps = _a[1];
    if (areHookInputsEqual(prevDeps, deps)) {
        hook.memorizedState = [prevCallback, deps];
    }
    else {
        hook.memorizedState = [callback, deps];
    }
    return hook.memorizedState[0];
}
/** deferedValue */
function updateDeferedValue(value) {
    var hook = updateWorkInProgressHook();
    var prevValue = hook.memorizedState;
    // 相同 没变化，直接返回
    if (Object.is(value, prevValue))
        return value;
    if ((0, fiberLanes_1.isSubsetOfLanes)(renderLane, fiberLanes_1.DeferredLane)) {
        // 低优先级DeferedLane时
        hook.memorizedState = value;
        return value;
    }
    else {
        // 优先级高于Deferedlane时
        currentRenderingFiber.lanes |= fiberLanes_1.DeferredLane;
        (0, workLoop_1.scheduleUpdateOnFiber)(currentRenderingFiber, fiberLanes_1.DeferredLane);
        return prevValue;
    }
}
function mountDeferedValue(value) {
    var hook = mountWorkInProgressHook();
    hook.memorizedState = value;
    return hook.memorizedState;
}
/** 重置hook */
function bailoutHook(wip, renderLane) {
    var current = wip.alternate;
    if (current !== null) {
        wip.updateQueue = current.updateQueue; // effectes
        wip.flags &= ~flags_1.PassiveEffect;
        // 去掉current上的renderLane 因为此次renderLane没生效
        current.lanes = (0, fiberLanes_1.removeLanes)(current.lanes, renderLane);
    }
}


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.markWipReceiveUpdate = markWipReceiveUpdate;
exports.beginWork = beginWork;
var childReconciler_1 = __webpack_require__(16);
var workTag_1 = __webpack_require__(12);
var fiberHooks_1 = __webpack_require__(14);
var fiberLanes_1 = __webpack_require__(13);
var flags_1 = __webpack_require__(11);
var shallowEqual_1 = __webpack_require__(17);
/** 是否收到更新 默认为false 即没有更新 开启bailout */
var didReceiveUpdate = false;
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
    var current = wip.alternate;
    if (current !== null) {
        /** 更新模式下 才检查是否bailout */
        /** 检查props和type */
        var prevProps = current.memorizedProps;
        var wipProps = wip.pendingProps;
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
        }
        else {
            // 如果props和type都检查通过 检查state和context TODO
            if (!checkUpdate(wip, renderLane)) {
                // 进入bailout
                didReceiveUpdate = false;
                return bailoutOnAlreadyFinishedWork(wip, renderLane);
            }
        }
    }
    /** 给wip.lanes 置空
     *  当存在跳过的update时，processQueue的onSkipUpdate回调会返回跳过的lane 再次加上即可
     */
    wip.lanes = fiberLanes_1.NoLane;
    // 比较，当前的fiber 和 旧的fiber
    switch (wip.tag) {
        case workTag_1.Fragment:
            return updateFragment(wip);
        case workTag_1.MemoComponent:
            return updateMemoComponent(wip, renderLane);
        case workTag_1.HostRoot:
            return updateHostRoot(wip, renderLane);
        case workTag_1.HostComponent:
            return updateHostComponent(wip);
        case workTag_1.HostText:
            return null;
        case workTag_1.FunctionComponent:
            return updateFunctionComponent(wip, wip.type, renderLane);
        default:
            console.warn("beginWork未实现的类型", wip.tag);
            break;
    }
    return null;
}
/** 检查是否存在更新 即检查wip.lanes 是否包含当前renderLane */
function checkUpdate(wip, renderLane) {
    // 注意 这里不要用wip.lanes直接检查，因为checkUpdate 也会在 wip.lanes = NoLane 之后调用，比如Memo中
    // 此时wip.lanes可能为NoLane 所以需要使用在enqueueUpdate中同步的 current.lanes
    var current = wip.alternate;
    if (current !== null && (0, fiberLanes_1.includeSomeLanes)(current.lanes, renderLane)) {
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
    if (!(0, fiberLanes_1.includeSomeLanes)(wip.childLanes, renderLane)) {
        return null;
    }
    /** clone节点 */
    (0, childReconciler_1.cloneChildFibers)(wip);
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
        wip.child = (0, childReconciler_1.reconcileChildFiber)(wip, wip.child, children);
    }
    else {
        // mount阶段
        wip.child = (0, childReconciler_1.mountChildFiber)(wip, children);
    }
}
/** 处理HostRoot节点的比较 */
function updateHostRoot(wip, renderLane) {
    /** 对于HostRoot节点 其memorizedState存储的是其children Element 因为其在dom/jsx中没有对应的节点，所以不存在props.children
     * 将其children放在memorizedState
     */
    var preChildren = wip.memorizedState;
    /** 获取updateQueue */
    var updateQueue = wip.updateQueue;
    /** 这里hostRoot的update由updateContainer放入，其对应的action就是其element */
    var newChildren = updateQueue.process(renderLane).memorizedState;
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
    var _a;
    /** 1.获取element.children */
    var hostChildren = (_a = wip.pendingProps) === null || _a === void 0 ? void 0 : _a.children;
    // 目前只有在HostComponent中标记Ref
    markRef(wip);
    /** 2. 协调子元素 */
    reconcileChildren(wip, hostChildren);
    /** 3.返回第一个child */
    return wip.child;
}
/** 处理函数节点的比较 */
function updateFunctionComponent(wip, Component, renderLane) {
    // renderWithHooks 中检查，如果状态改变 则置didReceiveUpdate = true
    var nextChildElement = (0, fiberHooks_1.renderWithHooks)(wip, Component, renderLane);
    if (wip.alternate !== null && !didReceiveUpdate) {
        // bailout
        // 重置hook
        (0, fiberHooks_1.bailoutHook)(wip, renderLane);
        return bailoutOnAlreadyFinishedWork(wip, renderLane);
    }
    reconcileChildren(wip, nextChildElement);
    return wip.child;
}
/** 处理Fragment */
function updateFragment(wip) {
    /** fragment的pendingProps就是children */
    var nextChildElement = wip.pendingProps;
    reconcileChildren(wip, nextChildElement);
    return wip.child;
}
/** 标记Ref [生产Ref] */
function markRef(wip) {
    var current = wip.alternate;
    var ref = wip.ref;
    if (current === null && ref !== null) {
        // mount阶段 如果wip有ref则绑定flag
        wip.flags |= flags_1.Ref;
        return;
    }
    if (current !== null && ref !== current.ref) {
        // update阶段 wip.ref和current.ref不相等 （useImmpreciatHandle改变ref）需要重新挂载ref
        wip.flags |= flags_1.Ref;
        return;
    }
}
/** 更新MemoComponent */
function updateMemoComponent(wip, renderLane) {
    // 需要检验四要素 type state(update) props context(TODO)
    // 运行到此 type一定是相等的 需要判断state props context
    var current = wip.alternate;
    if (current !== null) {
        // update阶段才bailout检查
        var oldProps = current.pendingProps;
        var newProps = wip.pendingProps;
        // Props默认需要用ShallowEqual判断 可以传入compare函数替换
        var compare = wip.type.compare || shallowEqual_1.default;
        if (compare(oldProps, newProps)) {
            // 判断state context
            if (!checkUpdate(wip, renderLane)) {
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
    var Component = wip.type.type;
    return updateFunctionComponent(wip, Component, renderLane);
}


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reconcileChildFiber = reconcileChildFiber;
exports.mountChildFiber = mountChildFiber;
exports.cloneChildFibers = cloneChildFibers;
var fiber_1 = __webpack_require__(10);
var flags_1 = __webpack_require__(11);
var ReactSymbols_1 = __webpack_require__(2);
var workTag_1 = __webpack_require__(12);
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
        if (!shouldTrackEffect)
            return;
        if (!returnFiber.delections) {
            // 当前returnFiber下 没有等待删除的节点
            returnFiber.delections = [childToDelete];
            returnFiber.flags |= flags_1.ChildDeletion;
        }
        else {
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
        if (!shouldTrackEffect)
            return;
        while (remainingFirstChild !== null) {
            deleteChild(returnFiber, remainingFirstChild);
            remainingFirstChild = remainingFirstChild.sibling;
        }
    }
    /** 处理多个子节点的情况 */
    function reconcileArray(wip, currentChild, newChild) {
        /** 设置几个指针 */
        var lastPlacedIndex = 0; // 最后一个可复用DOM的index
        var firstNewFiber = null; // 第一个新的Fiber
        var lastNewFiber = null; // 最后一个新的Fiber
        /** 把当前currentChild存储到一个Map中 */
        var existingChildren = new Map();
        var currentExistingChild = currentChild;
        while (currentExistingChild !== null) {
            /** fiber一定有key，直接获取 没有用index */
            var currentExistingChildKey = currentExistingChild.key !== null
                ? currentExistingChild.key
                : currentExistingChild.index;
            /** 入Map */
            existingChildren.set(String(currentExistingChildKey), currentExistingChild);
            currentExistingChild = currentExistingChild.sibling;
        }
        /** 遍历newChild 创建Fiber */
        for (var i = 0; i < newChild.length; i++) {
            /** 根据child获取新的fiber 可以复用 可以创建 */
            var newChildFiber = generateNewFiberFromMap(existingChildren, i, newChild[i]);
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
            }
            else {
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
                var alternate = newChildFiber.alternate;
                if (alternate) {
                    var oldIndex = alternate.index;
                    if (oldIndex < lastPlacedIndex) {
                        newChildFiber.flags |= flags_1.Placement;
                        lastPlacedIndex = oldIndex;
                    }
                    else {
                        // 不设置副作用 移动lastNewFiber
                        lastPlacedIndex = oldIndex;
                    }
                }
                else {
                    newChildFiber.flags |= flags_1.Placement;
                }
            }
        }
        /** 处理完所有的element节点，此时existingChildren剩下的为删除节点 设置副作用删除 */
        existingChildren.forEach(function (needDeletedFiber) {
            return deleteChild(wip, needDeletedFiber);
        });
        /** 返回第一个新的Fiber */
        return firstNewFiber;
    }
    /** 处理单个子节点的情况 */
    function reconcileSingle(wip, currentChild, newChild) {
        /** 先判断  如果element类型不对，直接报错 */
        if (newChild.$$typeof !== ReactSymbols_1.REACT_ELEMENT_TYPE) {
            throw new Error("[object] is not a valid react element!");
        }
        while (currentChild !== null) {
            // 先判断key
            if (newChild.key === currentChild.key) {
                // 再判断类型
                if (newChild.type === currentChild.type) {
                    // 类型和key都一样，可以复用
                    var pendingProps = newChild.props;
                    // 判断 是不是Fragment类型
                    if (newChild.type === ReactSymbols_1.REACT_FRAGMENT_TYPE) {
                        // 设置props,element元素的props就是children 不支持其他的props
                        pendingProps = newChild.props.children;
                    }
                    var existingFiber = useFiber(currentChild, pendingProps);
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
        var newFiber = (0, fiber_1.createFiberFromElement)(newChild);
        newFiber.return = wip;
        if (shouldTrackEffect) {
            /** 设置副作用 */
            newFiber.flags |= flags_1.Placement;
        }
        return newFiber;
    }
    /** 处理文本子节点的情况 */
    function reconcileTextNode(wip, currentChild, content) {
        /** 遍历wip的child fiber 找到一个tag为HostText的 使用useFiber复用，并且标记其他的为可删除 */
        while (currentChild !== null) {
            if (currentChild.tag === workTag_1.HostText) {
                // 找到文本节点，复用,修改pendingProps
                var existingFiber = useFiber(currentChild, { content: content });
                // 设置return
                existingFiber.return = wip;
                // 找到文本节点了 剩下的节点没用了 可以删除了
                deleteRemainingChildren(wip, currentChild.sibling);
                // 返回文本节点
                return existingFiber;
            }
            else {
                // 当前节点不是文本节点 直接删除
                deleteChild(wip, currentChild);
            }
            /** 移动到下一个child */
            currentChild = currentChild.sibling;
        }
        /** 都没找到文本节点，直接创建 */
        var textNodeFiber = new fiber_1.FiberNode(workTag_1.HostText, { content: content }, null);
        textNodeFiber.return = wip;
        if (shouldTrackEffect) {
            /** 设置副作用 */
            textNodeFiber.flags != flags_1.Placement;
        }
        return textNodeFiber;
    }
    return function (wip, currentChild, newChild) {
        var _a;
        // 处理Fragment
        if (typeof newChild === "object" && newChild !== null) {
            if (newChild.type === ReactSymbols_1.REACT_FRAGMENT_TYPE) {
                // 更新newChild 为Fragment内容
                newChild = (_a = newChild === null || newChild === void 0 ? void 0 : newChild.props) === null || _a === void 0 ? void 0 : _a.children;
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
    var elementKey = String(Array.isArray(element) ||
        typeof element === "string" ||
        typeof element === "number" ||
        element === undefined ||
        element === null ||
        element.key === null ||
        element.key === undefined
        ? index
        : element.key);
    /** 查找Map 看有没有已经存在可以复用的Fiber */
    var beforeFiber = existingChildren.get(elementKey);
    /** 按照类型处理 */
    if (Array.isArray(element)) {
        /** 对于数组类型的element 做法是包一层Fragment
         * 检查 如果beforeFiber是Fragment则复用
         *      不是则创建新的Fragment
         */
        if (beforeFiber && beforeFiber.tag === workTag_1.Fragment) {
            // 复用了 删除existingChildren中的元素
            existingChildren.delete(elementKey);
            return useFiber(beforeFiber, element);
        }
        else {
            // 没有before 或者类型不是Fragment 创建Fiber
            return (0, fiber_1.createFiberFromFragment)(element, elementKey);
        }
    }
    /** 如果是文字类型 */
    if (typeof element === "string" || typeof element === "number") {
        if (beforeFiber && beforeFiber.tag === workTag_1.HostText) {
            existingChildren.delete(elementKey);
            return useFiber(beforeFiber, {
                content: String(element),
            });
        }
        else {
            return new fiber_1.FiberNode(workTag_1.HostText, { content: String(element) }, elementKey);
        }
    }
    /** 如果是普通类型 */
    if (typeof element === "object" &&
        element !== null &&
        element.$$typeof === ReactSymbols_1.REACT_ELEMENT_TYPE) {
        if (beforeFiber && beforeFiber.type === element.type) {
            existingChildren.delete(elementKey);
            return useFiber(beforeFiber, element.props);
        }
        else {
            return (0, fiber_1.createFiberFromElement)(element);
        }
    }
    return null;
}
/** 复用节点，如果存在alternate则复用 不存在则创建 调用createWorkInProgress */
function useFiber(currentFiber, pendingProps) {
    var wip = (0, fiber_1.createWorkInProgress)(currentFiber, pendingProps);
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
    var currentChild = wip.child;
    var newChild = (0, fiber_1.createWorkInProgress)(currentChild, currentChild.pendingProps);
    newChild.return = wip;
    wip.child = newChild;
    while (currentChild.sibling !== null) {
        currentChild = currentChild.sibling;
        // 找子节点
        newChild = newChild.sibling = (0, fiber_1.createWorkInProgress)(currentChild, currentChild.pendingProps);
        newChild.return = wip;
    }
}


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = shallowEqual;
/** 对比两个对象中的属性是否浅比较相等
 *  shallowEqual在React.memo 对比curent.memorizedProps 和 wip.pendingProps中使用 区分hooks中的 areHookInputsEqual 后者判断的是数组
 */
function shallowEqual(obj1, obj2) {
    // 先用Object.is 对比排除 基本类型 相同地址对象的情况
    if (Object.is(obj1, obj2)) {
        return true;
    }
    // 排除obj1 obj2 任意一个不是对象或者null的情况
    if (typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null) {
        return false;
    }
    // 运行到此 obj1 obj2 一定是对象 并且都不是null 开始判断其属性
    // 属性数量判断 不一样一定属性不相等
    if (Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;
    // 逐个判断属性
    for (var key in obj1) {
        if (!Object.prototype.hasOwnProperty.call(obj2, key) ||
            Object.is(obj1[key], obj2[key])) {
            // 判断 key在obj1内 但是为undefined 但是在obj2中不存在的情况 或者 都存在 但是值不等的情况
            return false;
        }
    }
    return true;
}


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HookHasEffect = exports.Passive = void 0;
// 被动的effect 默认存在
/**
 * PassiveEffect 是一种副作用标志，用于表示在组件的生命周期中执行的副作用类型。
 * 副作用是指在组件渲染期间可能执行的操作，例如订阅、取消订阅、数据获取等。
 * 而 PassiveEffect 表示一种被动的、不会触发组件重新渲染的副作用。
 * 这意味着在执行这种副作用时，React 不会因为副作用的执行而重新渲染组件。
 * 这对于性能优化非常有用，因为它允许开发人员在不影响渲染性能的情况下执行副作用操作。
 */
exports.Passive = 2;
// 当前hook存在effect需要处理
exports.HookHasEffect = 1;


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/** 更新队列
 * 更新队列是一个环状链表 包含next 指向下一个Update
 * 最后一个Update的next又指向第一个Update
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FCUpdateQueue = exports.UpdateQueue = exports.Update = void 0;
var fiberLanes_1 = __webpack_require__(13);
/** 更新对象 */
var Update = /** @class */ (function () {
    function Update(action, lane) {
        this.action = action;
        this.next = null;
        this.lane = lane;
        this.hasEagerState = false;
        this.eagerState = null;
    }
    return Update;
}());
exports.Update = Update;
/** 更新队列 */
var UpdateQueue = /** @class */ (function () {
    function UpdateQueue() {
        /** 初始化 */
        this.shared = {
            pending: null,
        };
        this.dispatch = null;
        this.baseQueue = null;
        this.baseState = null;
        this.lastRenderedState = null;
    }
    /** 入队，构造环状链表 */
    UpdateQueue.prototype.enqueue = function (update, fiber, lane) {
        if (this.shared.pending === null) {
            // 插入第一个元素，此时的结构为
            // shared.pending -> firstUpdate.next -> firstUpdate
            update.next = update;
            this.shared.pending = update;
        }
        else {
            // 插入第二个元素
            update.next = this.shared.pending.next;
            this.shared.pending.next = update;
            this.shared.pending = update;
        }
        /** 在当前的fiber上设置lane */
        fiber.lanes = (0, fiberLanes_1.mergeLane)(fiber.lanes, lane);
        /** 在current上也设置lane 因为在beginwork阶段 wip.lane = NoLane 如果bailout 需要从current恢复 */
        var current = fiber.alternate;
        if (current) {
            current.lanes = (0, fiberLanes_1.mergeLane)(current.lanes, lane);
        }
    };
    /** 处理任务 */
    UpdateQueue.prototype.process = function (renderLane, onSkipUpdate) {
        var _a, _b;
        /** 获取baseQueue pending 完成拼接 */
        var baseState = this.baseState;
        var baseQueue = this.baseQueue;
        var currentPending = this.shared.pending;
        // 生成新的baseQueue过程
        if (currentPending !== null) {
            if (baseQueue !== null) {
                // 拼接两个队列
                // pending -> p1 -> p2 -> p3
                var pendingFirst = currentPending.next; // p1
                // baseQueue -> b1->b2->b3
                var baseFirst = baseQueue.next; // b1
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
        var newBaseState = baseState;
        var newBaseQueueFirst = null;
        var newBaseQueueLast = null;
        // 新的计算值
        var memorizedState = baseState;
        // 当前遍历到的update
        var currentUpdate = (_a = this.baseQueue) === null || _a === void 0 ? void 0 : _a.next;
        if (currentUpdate) {
            do {
                var currentUpdateLane = currentUpdate.lane;
                // 看是否有权限
                if ((0, fiberLanes_1.isSubsetOfLanes)(renderLane, currentUpdateLane)) {
                    // 有权限
                    if (newBaseQueueFirst !== null) {
                        // 已经存在newBaseFirst 则往后加此次的update 并且将此次update的lane设置为NoLane 保证下次一定能运行
                        var clone = new Update(currentUpdate.action, fiberLanes_1.NoLane);
                        newBaseQueueLast = newBaseQueueLast.next = clone;
                    }
                    if (currentUpdate.hasEagerState) {
                        memorizedState = currentUpdate.eagerState;
                    }
                    else {
                        // 不论存不存在newBaseFirst 都要计算memorizedState
                        var currentAction = currentUpdate.action;
                        if (currentAction instanceof Function) {
                            /** Action是函数类型 运行返回newState */
                            memorizedState = currentAction(memorizedState);
                        }
                        else {
                            /** 非函数类型，直接赋给新的state */
                            memorizedState = currentAction;
                        }
                    }
                }
                else {
                    // 无权限
                    var clone = new Update(currentUpdate.action, currentUpdate.lane);
                    if (onSkipUpdate) {
                        onSkipUpdate(clone);
                    }
                    // 如果newBaseQueueFirst === null 则从第一个开始添加newbaseQueue队列
                    if (newBaseQueueFirst === null) {
                        newBaseQueueFirst = newBaseQueueLast = clone;
                        // newBaseState到此 不在往后更新 下次从此开始
                        newBaseState = memorizedState;
                    }
                    else {
                        newBaseQueueLast = newBaseQueueLast.next = clone;
                    }
                }
                currentUpdate = currentUpdate.next;
            } while (currentUpdate !== ((_b = this.baseQueue) === null || _b === void 0 ? void 0 : _b.next));
        }
        if (newBaseQueueFirst === null) {
            // 此次没有update被跳过，更新newBaseState
            newBaseState = memorizedState;
        }
        else {
            // newbaseState不变 newBaseQueueFirst newBaseQueueLast 成环
            newBaseQueueLast.next = newBaseQueueFirst;
        }
        // 保存baseState和BaseQueue
        this.baseQueue = newBaseQueueLast;
        this.baseState = newBaseState;
        return { memorizedState: memorizedState };
    };
    return UpdateQueue;
}());
exports.UpdateQueue = UpdateQueue;
/** 函数组件专用的UpdateQueue增加了lastEffect 指向当前收集到的Effect */
var FCUpdateQueue = /** @class */ (function (_super) {
    __extends(FCUpdateQueue, _super);
    function FCUpdateQueue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastEffect = null;
        return _this;
    }
    return FCUpdateQueue;
}(UpdateQueue));
exports.FCUpdateQueue = FCUpdateQueue;


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.markUpdateLaneFromFiberToRoot = markUpdateLaneFromFiberToRoot;
exports.scheduleUpdateOnFiber = scheduleUpdateOnFiber;
exports.ensureRootIsScheduled = ensureRootIsScheduled;
exports.performSyncWorkOnRoot = performSyncWorkOnRoot;
exports.performConcurrentWorkOnRoot = performConcurrentWorkOnRoot;
exports.renderRoot = renderRoot;
exports.commitRoot = commitRoot;
var beginwork_1 = __webpack_require__(15);
var commitWork_1 = __webpack_require__(21);
var completeWork_1 = __webpack_require__(22);
var fiber_1 = __webpack_require__(10);
var flags_1 = __webpack_require__(11);
var fiberLanes_1 = __webpack_require__(13);
var scheduler_1 = __webpack_require__(8);
var syncTaskQueue_1 = __webpack_require__(23);
var workTag_1 = __webpack_require__(12);
var hookEffectTags_1 = __webpack_require__(18);
/** 工作中间状态 */
// 工作中的状态
var RootInProgress = 0;
/**
 * RootInComplete 和 RootCompleted 用来控制并发模式下 重新执行performConcurrentOnRoot
 * 这个状态由renderRoot返回 判断方式是 并发模式 在workConcurrentkloop执行后 workInProgress不为 null
 * */
// 并发中间状态
var RootInComplete = 1;
// 完成状态
var RootCompleted = 2;
// 未完成状态，不用进入commit阶段
var RootDidNotComplete = 3;
/** 全局变量，表示当前正在处理的Fiber */
var workInProgress = null;
/** 表示当前正在render阶段对应的任务对应的lane 用来在任务中断后重启判断跳过初始化流程 */
var wipRootRenderLane = fiberLanes_1.NoLane;
/**
 * 从当前fiberNode找到root节点 并且更新沿途fiber的childLanes
 * @param fiberNode
 */
function markUpdateLaneFromFiberToRoot(fiberNode, lane) {
    var parent = fiberNode.return; // parent表示父节点
    var node = fiberNode; // node标记当前节点
    while (parent !== null) {
        parent.childLanes = (0, fiberLanes_1.mergeLane)(parent.childLanes, lane);
        var alternate = parent.alternate;
        if (alternate !== null) {
            alternate.childLanes = (0, fiberLanes_1.mergeLane)(alternate.childLanes, lane);
        }
        // 处理parent节点的childLanes
        node = parent;
        parent = parent.return;
    }
    /** 检查当前是否找到了hostRootFiber */
    if (node.tag === workTag_1.HostRoot) {
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
    var fiberRootNode = markUpdateLaneFromFiberToRoot(fiberNode, lane);
    // 更新root的pendingLane, 更新root节点的pendingLanes 表示当前正在处理的lanes
    (0, fiberLanes_1.markRootUpdated)(fiberRootNode, lane);
    // 保证根节点被正确调度
    ensureRootIsScheduled(fiberRootNode);
}
function ensureRootIsScheduled(root) {
    // 先实现同步调度 获取当前最高优先级
    var highestPriorityLane = (0, fiberLanes_1.getNextLane)(root);
    // 判断，如果不存在优先级 说明没有任务需要继续调度了 直接returna
    if (highestPriorityLane === fiberLanes_1.NoLane)
        return;
    // 批处理更新, 微任务调用更新
    if (highestPriorityLane === fiberLanes_1.SyncLane) {
        (0, syncTaskQueue_1.scheduleSyncCallback)(performSyncWorkOnRoot.bind(null, root));
        // 设置微任务回调 冲洗缓冲区
        (0, syncTaskQueue_1.flushSyncCallbacks)();
    }
    else {
        // 其他优先级 使用scheduler调度
        scheduler_1.default.scheduleCallback((0, fiberLanes_1.lanesToSchedulerPriority)(highestPriorityLane), performConcurrentWorkOnRoot.bind(null, root));
    }
}
/** 从root开始 处理同步任务 */
function performSyncWorkOnRoot(root) {
    // 获取当前的优先级
    var lane = (0, fiberLanes_1.getNextLane)(root);
    if (lane !== fiberLanes_1.SyncLane) {
        /**
         * 这里 lane如果不是同步任务了，说明同步任务的lane已经被remove 应该执行低优先级的任务了
         *  此时应该停止执行当前任务 重新调度
         * 【实现同步任务的批处理，当第一次执行完之后 commit阶段remove SyncLane 这里就继续不下去了，
         * 后面微任务中的 performSyncWorkOnRoot都不执行了】
         */
        return ensureRootIsScheduled(root);
    }
    // 开始生成fiber 关闭并发模式
    var exitStatus = renderRoot(root, lane, false);
    switch (exitStatus) {
        // 注意 同步任务一次性执行完 不存在RootInComplete中断的情况
        case RootCompleted:
            // 执行成功 设置finishedWork 和 finishedLane 并且commit
            // 设置root.finishedWork
            root.finishedWork = root.current.alternate;
            root.finishedLane = lane;
            // 设置wipRootRenderLane = NoLane;
            wipRootRenderLane = fiberLanes_1.NoLane;
            commitRoot(root);
        default:
        // TODO Suspense的情况
    }
}
/** 从root开始 处理并发任务
 *  这个函数是要传入schduler中的 其中didTimeout就是当前任务是否超时
 */
function performConcurrentWorkOnRoot(root, didTimeout) {
    var lane = (0, fiberLanes_1.getNextLane)(root);
    if (lane === fiberLanes_1.NoLane) {
        // 没有任务需要处理了 这里也不需要调度了 用来完成批处理
        return;
    }
    // 开始生成fiber 关闭并发模式 ,在没有超时的情况下，可以开启并发中断
    var exitStatus = renderRoot(root, lane, !didTimeout);
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
            wipRootRenderLane = fiberLanes_1.NoLane;
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
    root.finishedLane = fiberLanes_1.NoLane;
    // 设置当前的运行任务lane
    wipRootRenderLane = lane;
    /** 给workInProgress赋值 */
    /** 这里在首次进入的时候 会创建一个新的hostRootFiber
     * 在react中存在两棵fiber树，两个hostRootFiber根节点 用alternate链接，成为双缓存
     */
    workInProgress = (0, fiber_1.createWorkInProgress)(root.current, {});
}
function completeUnitOfWork(fiber) {
    // 归
    while (fiber !== null) {
        (0, completeWork_1.completeWork)(fiber);
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
    var next = (0, beginwork_1.beginWork)(fiber, wipRootRenderLane);
    // 递的过程结束，保存pendingProps
    fiber.memorizedProps = fiber.pendingProps;
    // 这里不能直接给workInProgress赋值，如果提前赋workInProgress为null 会导致递归提前结束
    // 如果next为 null 则表示已经递到叶子节点，需要开启归到过程
    if (next === null) {
        /** 开始归的过程 */
        completeUnitOfWork(fiber);
    }
    else {
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
    while (workInProgress && !scheduler_1.default.shouldYieldToHost()) {
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
    var workLoopRetryTimes = 0;
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
        }
        catch (e) {
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
    var finishedWork = root.finishedWork;
    if (finishedWork === null)
        return;
    var lane = root.finishedLane;
    root.finishedWork = null;
    root.finishedLane = fiberLanes_1.NoLane;
    // 从root.pendingLanes去掉当前的lane
    (0, fiberLanes_1.markRootFinished)(root, lane);
    /** 设置调度 执行passiveEffect */
    /** 真正执行会在commit之后 不影响渲染 */
    /** commit阶段会收集effect到root.pendingPassiveEffect */
    // 有删除 或者收集到Passive 都运行
    if ((finishedWork.flags & flags_1.PassiveMask) !== flags_1.NoFlags ||
        (finishedWork.subTreeFlags & flags_1.PassiveMask) !== flags_1.NoFlags) {
        // 调度副作用
        scheduler_1.default.scheduleCallback(scheduler_1.PriorityLevel.NORMAL_PRIORITY, flushPassiveEffect.bind(null, root.pendingPassiveEffects));
    }
    /** hostRootFiber是否有effect  */
    var hostRootFiberHasEffect = (finishedWork.flags & (flags_1.MutationMask | flags_1.PassiveMask)) !== flags_1.NoFlags;
    /** hostRootFiber的子树是否有effect  */
    var subtreeHasEffect = (finishedWork.subTreeFlags & (flags_1.MutationMask | flags_1.PassiveMask)) !== flags_1.NoFlags;
    /** 有Effect才处理 */
    if (hostRootFiberHasEffect || subtreeHasEffect) {
        (0, commitWork_1.commitMutationEffects)(finishedWork, root);
    }
    // commit完成 修改current指向新的树
    root.current = finishedWork;
    // commitLayout阶段 处理Attach Ref
    (0, commitWork_1.commitLayoutEffects)(finishedWork, root);
    // 确保可以继续调度
    ensureRootIsScheduled(root);
}
// 处理被动Effect
// 此函数会被作为宏任务调用 / 使用schduler调度
function flushPassiveEffect(pendingPassiveEffect) {
    // 处理卸载 把所有的Passive flag的effect都执行destor
    pendingPassiveEffect.unmount.forEach(function (unmountEffect) {
        (0, commitWork_1.commitHookEffectListUnmount)(hookEffectTags_1.Passive, unmountEffect);
    });
    pendingPassiveEffect.unmount = [];
    // 处理update 的destory flag为Passive|HookHasEffect
    pendingPassiveEffect.update.forEach(function (updateEffect) {
        (0, commitWork_1.commitHookEffectListDestory)(hookEffectTags_1.Passive | hookEffectTags_1.HookHasEffect, updateEffect);
    });
    // 处理update的create flag为Passive| HookHasEffect
    pendingPassiveEffect.update.forEach(function (updateEffect) {
        (0, commitWork_1.commitHookEffectListCreate)(hookEffectTags_1.Passive | hookEffectTags_1.HookHasEffect, updateEffect);
    });
    pendingPassiveEffect.update = [];
}


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.commitLayoutEffects = exports.commitMutationEffects = void 0;
exports.commitHookEffectListUnmount = commitHookEffectListUnmount;
exports.commitHookEffectListDestory = commitHookEffectListDestory;
exports.commitHookEffectListCreate = commitHookEffectListCreate;
var flags_1 = __webpack_require__(11);
var SyntheticEvent_1 = __webpack_require__(6);
var workTag_1 = __webpack_require__(12);
var hookEffectTags_1 = __webpack_require__(18);
/** 高阶函数 用来处理Effect */
function commitEffect(phrase, mask, callback) {
    /** 递归，DFS 找到最深的无subflags的节点 下面的不需要commit了 因为没有副作用 */
    return function (finishedWork, root) {
        // DFS
        var nextFinishedWork = finishedWork;
        while (nextFinishedWork !== null) {
            if ((nextFinishedWork.subTreeFlags & mask) !== flags_1.NoFlags &&
                nextFinishedWork.child) {
                // 递
                nextFinishedWork = nextFinishedWork.child;
            }
            else {
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
var commitMutationEffectsOnFiber = function (finishedWork, root) {
    // 处理每个节点的Effect
    // 获取节点的flags
    var flags = finishedWork.flags;
    if ((flags & flags_1.Placement) !== flags_1.NoFlags) {
        // 存在Placement
        // 处理placement
        commitPlacement(finishedWork);
        // 去掉副作用flag
        // 去掉某个flag: 0b0111&(~0b0100) => 0b0111&0b1011=> 0b0011 去掉了 0b0100
        finishedWork.flags &= ~flags_1.Placement;
    }
    if ((flags & flags_1.Update) !== flags_1.NoFlags) {
        commitUpdate(finishedWork);
        finishedWork.flags &= ~flags_1.Update;
    }
    if ((flags & flags_1.ChildDeletion) !== flags_1.NoFlags) {
        var deletion = finishedWork.delections;
        deletion.forEach(function (deleteOldFiber) {
            commitDeletion(deleteOldFiber, root);
        });
        finishedWork.flags &= ~flags_1.ChildDeletion;
    }
    if ((flags & flags_1.PassiveEffect) !== flags_1.NoFlags) {
        // 存在被动副作用
        commitPassiveEffect(finishedWork, root, "update");
    }
    // 卸载Ref 只有hostComponent需要卸载
    if (finishedWork.tag === workTag_1.HostComponent && (flags & flags_1.Ref) !== flags_1.NoFlags) {
        var current = finishedWork.alternate;
        if (current) {
            // 需要卸载current的ref 其实本质上current和finishedWork的ref都是一个
            saftyDetachRef(current);
        }
        // 卸载之后由于可能还会加载ref 所以这里的flag不能~Ref
    }
};
/** 用来处理 Layout副作用 [Ref] */
var commitLayoutEffectsOnFiber = function (finishedWork) {
    // 处理每个节点的Effect
    // 获取节点的flags
    var flags = finishedWork.flags;
    if (finishedWork.tag === workTag_1.HostComponent && (flags & flags_1.Ref) !== flags_1.NoFlags) {
        saftyAttachRef(finishedWork);
        finishedWork.flags &= ~flags_1.Ref;
    }
};
/** 收集被动副作用，这个函数可能会在
 *  1. commitMutationEffectsOnFiber调用
 *  2.  在delection时调用
 */
function commitPassiveEffect(fiber, root, type) {
    if (fiber.tag !== workTag_1.FunctionComponent)
        return;
    if (type === "update" && (fiber.flags & flags_1.PassiveEffect) === flags_1.NoFlags)
        return;
    var fcUpdateQueue = fiber.updateQueue;
    if (fcUpdateQueue && fcUpdateQueue.lastEffect) {
        // 收集effect
        root.pendingPassiveEffects[type].push(fcUpdateQueue.lastEffect);
    }
}
/** 处理Placement */
function commitPlacement(finishedWork) {
    /** 获取finishedWork的hostparent 用来挂载finishedWork对应的DOM （finishedWork可能也不是Host 后面有处理） */
    var hostParent = getHostParent(finishedWork);
    /** 获取finishedWork的Host sibling节点  */
    var hostSibling = getHostSibling(finishedWork);
    // 拿到parent和sibling了，就可以插入dom了
    // hostsibling不存在就是append 存在就是插入
    if (hostParent !== null) {
        insertOrAppendPlacementNodeIntoConatiner(finishedWork, hostParent, hostSibling);
    }
}
/** 处理update副作用 */
function commitUpdate(fiber) {
    if (fiber.tag === workTag_1.HostText) {
        fiber.stateNode.nodeValue = fiber.memorizedProps.content;
    }
    else {
        (0, SyntheticEvent_1.updateFiberProps)(fiber.stateNode, fiber.memorizedProps);
    }
}
/** 删除节点 */
function commitDeletion_NonRecruison(fiber, root) {
    var parent = getHostParent(fiber);
    if ((fiber.tag === workTag_1.HostComponent || fiber.tag === workTag_1.HostText) &&
        fiber.stateNode) {
        parent.removeChild(fiber.stateNode);
        if (fiber.tag === workTag_1.HostComponent) {
            // HostComponent删除的时候 需要卸载Ref
            saftyDetachRef(fiber);
        }
    }
    else {
        var childToDelete_1 = [];
        var findFn = function () {
            while (hostChild_1 !== null) {
                if (hostChild_1.stateNode &&
                    (hostChild_1.tag === workTag_1.HostComponent || hostChild_1.tag === workTag_1.HostText)) {
                    childToDelete_1.push(hostChild_1);
                    if (hostChild_1.tag === workTag_1.HostComponent) {
                        // HostComponent删除的时候 需要卸载Ref
                        saftyDetachRef(hostChild_1);
                    }
                    return;
                }
                else if (hostChild_1.tag === workTag_1.FunctionComponent) {
                    commitPassiveEffect(hostChild_1, root, "unmount");
                }
                if (hostChild_1.child !== null) {
                    hostChild_1 = hostChild_1.child;
                }
                else {
                    break;
                }
            }
        };
        // fiber不是host 递归查找
        var hostChild_1 = fiber.child;
        findChild: while (hostChild_1 !== null) {
            findFn();
            // 归
            while (hostChild_1.sibling === null) {
                if (hostChild_1.return === null || hostChild_1.return === fiber)
                    break findChild;
                hostChild_1 = hostChild_1.return;
            }
            hostChild_1 = hostChild_1.sibling;
        }
        childToDelete_1.forEach(function (child) {
            if (parent.contains(child.stateNode)) {
                parent.removeChild(child.stateNode);
            }
        });
    }
    // 断开链接
    var current = fiber.alternate;
    if (current) {
        current.alternate = null;
    }
    fiber.alternate = null;
    fiber.child = null;
    if (fiber.return !== null) {
        if (fiber.return.child === fiber) {
            // 第一个元素
            fiber.return.child = fiber.sibling;
        }
        else {
            var firstChild = fiber.return.child;
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
    var container = getHostParent(fiber);
    if (container) {
        deleteNodeFromContainer(container, fiber, root);
    }
}
/** 递归的方式删除节点 */
function deleteNodeFromContainer(container, childToDelete, root) {
    if (!container || !childToDelete)
        return;
    if ((childToDelete.tag === workTag_1.HostComponent || childToDelete.tag === workTag_1.HostText) && childToDelete.stateNode !== null) {
        /** 如果是host节点，直接删除即可 */
        if (container.contains(childToDelete.stateNode)) {
            container.removeChild(childToDelete.stateNode);
        }
        // 删除时，卸载Ref
        if (childToDelete.tag === workTag_1.HostComponent) {
            // HostComponent删除的时候 需要卸载Ref
            saftyDetachRef(childToDelete);
        }
    }
    else {
        /** 非host节点，递归删除 */
        if (childToDelete.tag === workTag_1.FunctionComponent) {
            /** 函数组件的情况下，需要收集Effect */
            commitPassiveEffect(childToDelete, root, "unmount");
        }
        var deleteNodeChild = childToDelete.child;
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
    var node = fiber.return;
    while (node !== null) {
        if (node.tag === workTag_1.HostComponent) {
            // host component 返回其stateNode
            return node.stateNode;
        }
        if (node.tag === workTag_1.HostRoot) {
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
    var node = fiber;
    // 找sibling节点,没有找parent，如果遇到hostComponent / hostRoot 直接返回null
    findSibling: while (true) {
        while (node.sibling === null) {
            var parent_1 = node.return;
            if (parent_1 === null ||
                parent_1.tag === workTag_1.HostComponent ||
                parent_1.tag === workTag_1.HostRoot) {
                /** 回溯的过程中 如果遇到了 hostComponent / hostRoot 说明找到了parent节点 不能再往上找了 */
                return null;
            }
            /** 继续往上查找 */
            node = parent_1;
        }
        // 执行到这里，说明存在sibling，移动node节点 -> sibling
        node.sibling.return = node.return;
        node = node.sibling;
        // 找到sibling了 此时开始向下查找，这里要注意，寻找的节点必须满足
        // 1. 是hostComponent / hostText
        // 2. 不能是placement节点 如果不满足，返回到回溯阶段
        while (node.tag !== workTag_1.HostComponent && node.tag !== workTag_1.HostText) {
            // 都不是，如果此时为Placement 下面的不用看了 因为当前节点下的DOM还没挂载,直接回溯
            if ((node.flags & flags_1.Placement) !== flags_1.NoFlags || node.child === null) {
                continue findSibling; // 直接跳到最外层循环,回溯
            }
            // 向下寻找
            node.child.return = node;
            node = node.child;
        }
        // 运行到此处 找到hostCompoent/hostText了 看是不是placement
        if ((node.flags & flags_1.Placement) === flags_1.NoFlags) {
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
    if (finishedWork.tag === workTag_1.HostComponent || finishedWork.tag == workTag_1.HostText) {
        if (hostSibling) {
            hostParent.insertBefore(finishedWork.stateNode, hostSibling);
        }
        else {
            hostParent.append(finishedWork.stateNode);
        }
    }
    else {
        // 如果finishwork不是host 比如是Fragment或者Function
        // 需要遍历其子节点 并且添加
        var child = finishedWork.child;
        while (child !== null) {
            insertOrAppendPlacementNodeIntoConatiner(child, hostParent, hostSibling);
            child = child.sibling;
        }
    }
}
/** effect相关 遍历lastEffect 根据flags判断是否需要执行 调用callback */
function commitHookEffectList(flags, lastEffect, callback) {
    var currentEffect = lastEffect.next;
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
    commitHookEffectList(flags, lastEffect, function (effect) {
        var destory = effect.destory;
        if (typeof destory === "function") {
            destory();
        }
        effect.tags &= ~hookEffectTags_1.HookHasEffect;
    });
}
/** 执行destory的effect */
function commitHookEffectListDestory(flags, lastEffect) {
    commitHookEffectList(flags, lastEffect, function (effect) {
        var destory = effect.destory;
        if (typeof destory === "function") {
            destory();
        }
    });
}
/** 执行创建的effect */
function commitHookEffectListCreate(flags, lastEffect) {
    commitHookEffectList(flags, lastEffect, function (effect) {
        var create = effect.create;
        if (typeof create === "function") {
            // 设置destory
            effect.destory = create();
        }
    });
}
exports.commitMutationEffects = commitEffect("mutation", flags_1.MutationMask | flags_1.PassiveMask, commitMutationEffectsOnFiber);
exports.commitLayoutEffects = commitEffect("layout", flags_1.LayoutMask, commitLayoutEffectsOnFiber);
/** 卸载Ref
 *  卸载时机 commit的mutation阶段 包括
 *  1. 组件卸载
 *  2. 组件更新时包含Ref （Ref变动）
 */
function saftyDetachRef(current) {
    // 这里传入的是current的fiber 也就是旧的fiber 卸载的也是旧的fiber
    // fiber会在createWorkinprogress复用传递 这里的作用就是 ref.current = null / ref(null)
    var ref = current.ref;
    if (ref === null)
        return;
    // ref可以是函数或者对象 判读类型
    if (typeof ref === "function") {
        // 卸载/更新变动之前卸载时 都会执行下ref函数 并且传入null
        ref(null);
    }
    else {
        ref.current = null;
    }
}
/** 附加Ref 附加时机
 *  commit的layout阶段 也就是真实dom更新完成 渲染之前
 */
function saftyAttachRef(finishedWork) {
    var ref = finishedWork.ref;
    var dom = finishedWork.stateNode;
    if (ref !== null) {
        if (typeof ref === "function") {
            ref(dom);
        }
        else {
            ref.current = dom;
        }
    }
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.completeWork = completeWork;
var flags_1 = __webpack_require__(11);
var SyntheticEvent_1 = __webpack_require__(6);
var workTag_1 = __webpack_require__(12);
var fiberLanes_1 = __webpack_require__(13);
/** 归的过程 主要逻辑有
 * 1. 不能复用的DOM创建 赋给stateNode
 * 2. 连接父子节点
 * 3. flags冒泡
 */
function completeWork(wip) {
    var _a;
    /** 真正需要操作的 只有HostComponent和HostText */
    var pendingProps = wip.pendingProps; //需要处理props
    var currentFiber = wip.alternate; // 当前生效的fiber
    switch (wip.tag) {
        case workTag_1.HostComponent:
            /** 处理HostComponent的情况 */
            if (currentFiber && currentFiber.stateNode) {
                // update
                if (currentFiber.ref !== wip.ref) {
                    wip.flags |= flags_1.Ref;
                }
                // 检查pendingProps和memroizedProps 如何不同则打上Update更新标签
                // if (pendingProps !== wip.memorizedProps) {
                //   wip.flags |= Update;
                // }  
                // 不要这样写 会导致事件处理函数的闭包陷阱 我们需要在每次更新的时候 update新的event
                wip.flags |= flags_1.Update;
            }
            else {
                // mount
                // 挂载阶段，直接创建DOM,保存到stateNode
                var domInstance = document.createElement(wip.type);
                // 在DOM上更新属性
                (0, SyntheticEvent_1.updateFiberProps)(domInstance, pendingProps);
                // stateNode保存instance
                wip.stateNode = domInstance;
                // 把所有的children dom元素加入到instance中
                // completeWork时 其所有子节点已经完成了递归
                appendAllChildren(domInstance, wip); // 这个操作只有HostComponent处理 HostText由于已经没有子节点 不需要这样操作
            }
            // 冒泡处理属性
            bubbleProperties(wip);
            return null;
        case workTag_1.HostText:
            if (currentFiber && currentFiber.stateNode) {
                // update
                if (((_a = currentFiber.memorizedProps) === null || _a === void 0 ? void 0 : _a.content) !== (pendingProps === null || pendingProps === void 0 ? void 0 : pendingProps.content)) {
                    wip.flags |= flags_1.Update;
                }
            }
            else {
                // mount
                var textInstance = document.createTextNode(pendingProps === null || pendingProps === void 0 ? void 0 : pendingProps.content);
                wip.stateNode = textInstance;
            }
            bubbleProperties(wip);
            return null;
        case workTag_1.HostRoot:
        case workTag_1.FunctionComponent:
        case workTag_1.Fragment:
        case workTag_1.MemoComponent:
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
    var node = wip.child;
    while (node !== null && node !== wip) {
        if (node.tag === workTag_1.HostComponent || node.tag === workTag_1.HostText) {
            instance.appendChild(node.stateNode);
        }
        else if (node.child) {
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
    var subtreeFlags = flags_1.NoFlags;
    var childLanes = fiberLanes_1.NoLane;
    var node = wip.child || null;
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
/* 23 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.flushSyncCallbacks = exports.scheduleMicroTask = void 0;
exports.scheduleSyncCallback = scheduleSyncCallback;
/** 存储callback数组 */
var syncTaskQueue = [];
/** 入队 */
function scheduleSyncCallback(callback) {
    syncTaskQueue.push(callback);
}
/** 队列flush lock 防止多次调用
 *  防止嵌套调用 flushSyncCallbacks
 */
var isFlushingSyncQueue = false;
/** flush清空队列 */
function _flushSyncCallbacks() {
    if (!isFlushingSyncQueue && syncTaskQueue.length > 0) {
        // 上锁
        isFlushingSyncQueue = true;
        try {
            // 执行任务
            syncTaskQueue.forEach(function (syncTask) { return (0, exports.scheduleMicroTask)(syncTask); });
        }
        catch (e) {
            console.error("同步微任务队列执行错误，错误信息:", e);
        }
        finally {
            // 执行结束  释放锁 清空队列
            isFlushingSyncQueue = false;
            syncTaskQueue = [];
        }
    }
}
/** 兼容多种环境的microTask */
exports.scheduleMicroTask = (typeof queueMicrotask === "function"
    ? queueMicrotask
    : typeof Promise === "function"
        ? function (callback) { return Promise.resolve().then(callback); }
        : setTimeout);
/** 微任务flush清空队列 */
var flushSyncCallbacks = function () { return (0, exports.scheduleMicroTask)(_flushSyncCallbacks); };
exports.flushSyncCallbacks = flushSyncCallbacks;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostsTab = void 0;
exports.SlowPost = SlowPost;
exports["default"] = App;
var react_1 = __webpack_require__(1);
var ReactSymbols_1 = __webpack_require__(2);
var Counter_1 = __webpack_require__(25);
var Input_1 = __webpack_require__(26);
var MemoComp_1 = __webpack_require__(27);
var Welcome_1 = __webpack_require__(28);
function fetchMockMessaage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve("Message From Mock Fetch!!!");
                    }, 1000);
                })];
        });
    });
}
function SlowPost(_a) {
    var index = _a.index;
    var startTime = performance.now();
    while (performance.now() - startTime < 4) { }
    return (0, react_1.createElement)("div", {
        style: {
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#f3f3f3",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "15px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#333",
            textAlign: "center",
        },
    }, "Slow Item Render Need 4ms");
}
var PostsTab = function PostsTab() {
    var items = [];
    for (var i = 0; i < 50; i++) {
        items.push((0, react_1.createElement)(SlowPost, {}));
    }
    return items;
};
exports.PostsTab = PostsTab;
function App() {
    var _a = (0, react_1.useTransition)(), isPending = _a[0], startTransition = _a[1];
    console.log("app re");
    var _b = (0, react_1.useState)("welcome"), type = _b[0], setType = _b[1];
    var content = type === "welcome" ?
        (0, react_1.createElement)(Welcome_1.default, {})
        : type === "counter"
            ? (0, react_1.createElement)(Counter_1.default, {})
            : type === "input"
                ? (0, react_1.createElement)(Input_1.default, {})
                : (0, react_1.createElement)(exports.PostsTab, {});
    return (0, react_1.createElement)(ReactSymbols_1.REACT_FRAGMENT_TYPE, {}, [
        // 简洁的菜单 (横向菜单)
        (0, react_1.createElement)("nav", {
            style: navContainerStyle,
        }, [
            (0, react_1.createElement)("ul", {
                style: menuStyle,
            }, [
                (0, react_1.createElement)("li", {
                    key: "welcome-menu",
                    onClick: function () { return setType("welcome"); },
                    style: menuItemStyle,
                }, "Weclome"),
                (0, react_1.createElement)("li", {
                    key: "counter-menu",
                    onClick: function () { return setType("counter"); },
                    style: menuItemStyle,
                }, "计数器"),
                (0, react_1.createElement)("li", {
                    key: "input-menu",
                    onClick: function () { return setType("input"); },
                    style: menuItemStyle,
                }, "输入框"),
                (0, react_1.createElement)("li", {
                    key: "hugedata-menu",
                    onClick: function () {
                        startTransition(function () {
                            setType("hugeData");
                        });
                    },
                    style: menuItemStyle,
                }, "大量数据 测试useTransition"),
            ]),
        ]),
        // 内容展示区域，放置在屏幕中心，占满屏幕
        (0, react_1.createElement)("div", {
            style: contentContainerStyle,
        }, [
            isPending ? ((0, react_1.createElement)("div", {
                style: {
                    textAlign: "center",
                    fontSize: "18px",
                    color: "#888",
                    marginTop: "20px",
                },
            }, "Loading Data...")) : (content),
        ]),
        // MemoComp 部分
        (0, react_1.createElement)(MemoComp_1.default, { style: memoCompStyle }),
    ]);
}
// 导航菜单项样式
var menuItemStyle = {
    listStyle: "none",
    padding: "10px 20px",
    fontSize: "18px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#fff",
    textTransform: "uppercase",
    transition: "background-color 0.3s, color 0.3s",
    margin: "0 15px",
    borderRadius: "5px",
    display: "inline-block", // 水平排列菜单项
};
// 菜单容器样式
var navContainerStyle = {
    backgroundColor: "#333", // 深色背景
    padding: "10px 0",
    position: "sticky",
    top: "0",
    zIndex: "100",
};
// 菜单样式
var menuStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0",
    padding: "0",
};
// 内容区域样式 - 居中且占满屏幕
var contentContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    height: 'calc( 100% - 93px )',
    backgroundColor: "#f5f5f5", // 背景色可以设置为浅灰色或自定义
    fontFamily: "'Arial', sans-serif",
    overflow: 'auto',
};
// MemoComp 样式
var memoCompStyle = {
    padding: "20px",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};
// Hover 动画 (菜单项悬停效果)
menuItemStyle[':hover'] = {
    backgroundColor: "#4CAF50", // 按钮背景色悬停变化
    color: "#fff", // 文字颜色悬停变化
};


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = Counter;
var react_1 = __webpack_require__(1);
function Counter() {
    var _a = (0, react_1.useState)(0), count = _a[0], setCount = _a[1];
    var testRef = (0, react_1.useRef)({});
    var domRef = (0, react_1.useRef)(null);
    var countPlusTen = (0, react_1.useMemo)(function () {
        return count + 10;
    }, [count]);
    var _b = (0, react_1.useState)(0), c = _b[0], setC = _b[1];
    setC(c + 1);
    console.log("re", c);
    return (0, react_1.createElement)("div", {
        style: cardContainerStyle,
    }, [
        // 卡片容器
        (0, react_1.createElement)("div", {
            style: cardStyle,
        }, [
            // 创建按钮 +1
            (0, react_1.createElement)("button", {
                key: "btn1",
                style: buttonStyle("green"),
                ref: domRef,
                onClick: function () {
                    setCount(count + 1);
                },
            }, "+1"),
            // 创建按钮 +2
            (0, react_1.createElement)("button", {
                key: "btn2",
                style: buttonStyle("blue"),
                onClick: function () {
                    setCount(count + 2);
                },
            }, "+2"),
            // 创建按钮 +3 (展示闭包陷阱)
            (0, react_1.createElement)("button", {
                key: "btn3",
                style: buttonStyle("red"),
                onClick: function () {
                    setTimeout(function () {
                        setCount(count + 3);
                    }, 1000);
                },
            }, "+3 (展示闭包陷阱 点击后延迟更新 你可以点击之后迅速点击其他的)"),
            // 计数器显示
            (0, react_1.createElement)("div", {
                style: counterDisplayStyle,
            }, [
                "计数器：",
                (0, react_1.createElement)("span", {
                    style: {
                        fontWeight: "bold",
                        fontSize: "36px",
                        color: "#333",
                    },
                }, String(count)),
            ]),
        ]),
    ]);
}
// 按钮样式函数，根据颜色返回不同样式
var buttonStyle = function (color) { return ({
    backgroundColor: color === "green" ? "#4CAF50" : color === "blue" ? "#2196F3" : "#FF5722", // 基于颜色传入不同背景色
    color: "white",
    padding: "15px 30px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "transform 0.2s ease, background-color 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "10px",
    display: "inline-block",
    textAlign: "center",
    width: "auto",
    maxWidth: "200px",
    lineHeight: "1.5",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    opacity: 0.9,
    ":hover": {
        transform: "scale(1.1)",
        backgroundColor: color === "green" ? "#45a049" : color === "blue" ? "#1e88e5" : "#e64a19",
    },
    ":active": {
        transform: "scale(1)",
        opacity: 1,
    },
}); };
// 整体卡片容器样式
var cardContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Roboto', sans-serif",
};
// 卡片样式
var cardStyle = {
    width: "350px",
    height: "400px", // 固定高度
    backgroundColor: "white",
    borderRadius: "12px", // 圆角
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // 阴影效果
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // 垂直居中
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ":hover": {
        transform: "scale(1.05)",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)", // 鼠标悬停时阴影更强
    },
};
// 计数器显示部分样式
var counterDisplayStyle = {
    marginTop: "30px",
    fontSize: "24px",
    color: "#333",
    fontWeight: "500",
};


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = Input;
var react_1 = __webpack_require__(1);
function SlowPost(_a) {
    var index = _a.index;
    var startTime = performance.now();
    while (performance.now() - startTime < 1) { }
    return (0, react_1.createElement)("h3", {
        style: {
            color: "#61dafb", // React 蓝色
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "10px",
        },
    }, "Slow Item Render Need 1ms");
}
var PostsTab = function PostsTab(_a) {
    var _b = _a.len, len = _b === void 0 ? 0 : _b;
    var items = [];
    for (var i = 0; i < len * 100; i++) {
        items.push((0, react_1.createElement)(SlowPost, {}));
    }
    return items;
};
function Input() {
    console.log("input re");
    var _a = (0, react_1.useState)("测试输入框内容同步"), appMessage = _a[0], setAppMessage = _a[1];
    var deferedAppMessage = (0, react_1.useDeferedValue)(appMessage);
    return (0, react_1.createElement)("div", { style: containerStyle }, (0, react_1.createElement)("input", {
        onInput: function (e) {
            setAppMessage(e.target.value);
        },
        value: appMessage,
        style: inputStyle,
        placeholder: "请输入内容",
    }), (0, react_1.createElement)("div", {
        style: { marginTop: "20px", fontSize: "18px", color: "#333" },
    }, appMessage));
}
// 输入框样式
var inputStyle = {
    display: "block",
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    borderRadius: "8px", // 圆角
    border: "1px solid #ccc", // 边框颜色
    boxSizing: "border-box",
    backgroundColor: "#f9f9f9", // 浅灰背景
    color: "#333", // 深色文本
    transition: "border-color 0.3s ease, box-shadow 0.3s ease", // 平滑过渡效果
    outline: "none", // 去掉默认的输入框高亮
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 阴影效果
    marginBottom: "20px", // 底部间距
};
// 输入框聚焦时样式
var inputFocusStyle = {
    borderColor: "#61dafb", // 聚焦时的边框颜色
    boxShadow: "0 0 8px rgba(0, 122, 255, 0.4)", // 聚焦时的阴影
};
// 容器样式
var containerStyle = {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px", // 卡片的圆角
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", // 外部阴影
    fontFamily: "'Roboto', sans-serif",
};


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(1);
exports["default"] = (0, react_1.memo)(function MemoComp() {
    console.log('memo rerender!');
    return (0, react_1.createElement)("div", {
        style: {
            backgroundColor: "lightgray", // 绿色
            color: "white",
            fontSize: "16px",
        },
    }, "MEMO COMPONENT （when menu change， this component never rerender）");
});


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = WelcomePage;
var react_1 = __webpack_require__(1);
function WelcomePage() {
    return (0, react_1.createElement)("div", { style: pageStyle }, (0, react_1.createElement)("div", { style: leftPanelStyle }, (0, react_1.createElement)("h1", { style: titleStyle }, "Welcome to My-React!"), (0, react_1.createElement)("p", { style: subtitleStyle }, "A lightweight React clone with core features like createElement, useState, useEffect, and more."), (0, react_1.createElement)("div", { style: sectionStyle }, (0, react_1.createElement)("h2", { style: sectionTitleStyle }, "What is My-React?"), (0, react_1.createElement)("p", { style: sectionTextStyle }, "My-React is a lightweight clone of React. It includes essential features like virtual DOM creation, state management with hooks, and task scheduling. The main goal is to understand the core principles behind React and its rendering lifecycle."))), (0, react_1.createElement)("div", { style: rightPanelStyle }, (0, react_1.createElement)("h2", { style: sectionTitleStyle }, "Features"), (0, react_1.createElement)("ul", { style: featureListStyle }, (0, react_1.createElement)("li", null, "Virtual DOM creation with createElement"), (0, react_1.createElement)("li", null, "Support for hooks like useState, useEffect, useTransition"), (0, react_1.createElement)("li", null, "Component management for functional and class components"), (0, react_1.createElement)("li", null, "Task scheduling with the scheduler for better performance")), (0, react_1.createElement)("div", { style: footerStyle }, (0, react_1.createElement)("h3", { style: footerTitleStyle }, "Get Started"), (0, react_1.createElement)("p", { style: footerTextStyle }, "To get started, follow the setup instructions below:"), (0, react_1.createElement)("pre", { style: codeBlockStyle }, "1. Install dependencies:\n" +
        "   npm install\n\n" +
        "2. Start the project:\n" +
        "   npm start\n"))));
}
var pageStyle = {
    display: "flex",
    flexDirection: "row", // 横向布局
    width: "100%",
    backgroundColor: "#f4f6f8",
    justifyContent: "space-between",
    padding: "40px",
    boxSizing: "border-box",
};
var leftPanelStyle = {
    flex: 1, // 左侧占据 50%
    padding: "40px",
    backgroundColor: "#61dafb",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    color: "#fff",
};
var rightPanelStyle = {
    flex: 1, // 右侧占据 50%
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
};
var titleStyle = {
    fontSize: "36px",
    fontWeight: "700",
};
var subtitleStyle = {
    fontSize: "20px",
    marginTop: "10px",
};
var sectionStyle = {
    marginTop: "40px",
};
var sectionTitleStyle = {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "15px",
};
var sectionTextStyle = {
    fontSize: "16px",
    lineHeight: "1.6",
};
var footerStyle = {
    marginTop: "40px",
    backgroundColor: "#4CAF50", // Green background for footer
    padding: "20px",
    borderRadius: "8px",
    color: "#fff",
};
var footerTitleStyle = {
    fontSize: "24px",
    fontWeight: "600",
};
var footerTextStyle = {
    fontSize: "18px",
};
var codeBlockStyle = {
    backgroundColor: "#2d2d2d",
    color: "#f7f7f7",
    padding: "20px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "16px",
    textAlign: "left",
    overflowX: "auto",
};
var featureListStyle = {
    listStyleType: "none",
    paddingLeft: "0",
    fontSize: "16px",
    color: "#444",
};


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(1);
var react_dom_1 = __webpack_require__(5);
var App_1 = __webpack_require__(24);
var root = (0, react_dom_1.createRoot)(document.querySelector("#root-master"));
root.render((0, react_1.createElement)(App_1.default, {}));

})();

/******/ })()
;
//# sourceMappingURL=main-69897a58-bundle.js.map