import { PriorityLevel } from "../scheduler";

/** 事件转优先级 */
export function eventTypeToSchedulerPriority(eventType: string) {
  switch (eventType) {
    case "click":
    case "keydown":
    case "keyup":
    case "keydown":
    case "keypress":
    case "keyup":
    case "focusin":
    case "focusout":
      return PriorityLevel.IMMEDIATE_PRIORITY;
    case "scroll":
    case "resize":
    case "mousemove":
    case "mouseenter":
    case "mouseleave":
    case "touchstart":
    case "touchmove":
    case "touchend":
      return PriorityLevel.USER_BLOCKING_PRIORITY;

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
      return PriorityLevel.NORMAL_PRIORITY;

    case "abort":
    case "load":
    case "loadeddata":
    case "loadedmetadata":
    case "error":
    case "durationchange":
      return PriorityLevel.LOW_PRIORITY;

    default:
      return PriorityLevel.IDLE_PRIORITY;
  }
}

/** 可以代理的原生事件 */
export const nativeEvents = [
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
export const reactEvents = {
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
