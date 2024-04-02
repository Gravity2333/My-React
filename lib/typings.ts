export type ElementType = string | Function;
export type ElementProps = Record<string, any>;
export type ElementChildren = IElement | string;
export interface IElement {
  type?: ElementType;
  props: ElementProps;
}
export const _ELEMENT_ = "_element_";
export const _TEXT_ELEMENT_ = "_text_element_";
export type DOMType = HTMLElement | Text | Element;

export enum EffectTag {
  // 新增节点
  "PLACEMENT" = "PLACEMENT",
  // 复用 更新节点
  "UPDATE" = "UPDATE",
  // 删除节点
  "DELECTION" = "DELECTION",
}

export interface IFiber extends IElement {
  // 当前fiber节点的dom元素
  dom?: DOMType;
  // 当前fiber节点的父元素
  returns?: IFiber;
  // 当前fiber节点的兄弟元素
  sibling?: IFiber;
  // 当前fiber节点的child元素
  child?: IFiber;
  // effectTag 副作用标签 用来commit
  effectTag?: EffectTag;
  // alternate 指向旧的Fiber节点 (reconcile前的Fiber)
  alternate?: IFiber;
  // memorizedState 用来记录hooks信息
  memorizedState?: any;
}
