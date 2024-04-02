export type ElementType = string | Function;
export type ElementProps = Record<string, any>;
export type ElementChildren = IElement | string;
export interface IElement {
  type: ElementType;
  props: ElementProps;
}
export const _ELEMENT_ = "_element_";
export const _TEXT_ELEMENT_ = "_text_element_";
