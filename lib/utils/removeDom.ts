import { DOMType, IFiber } from "../typings";

export function removeDom(dom: DOMType) {
  if (dom) {
    dom.parentNode.removeChild(dom);
  }
}

export default function handleDelection(delection: IFiber[]) {
  delection.forEach((deleteFiberItem) => {
    const parentFiberNode = deleteFiberItem.returns;

    if (typeof deleteFiberItem.type === "function") {
      if (deleteFiberItem?.child?.dom?.parentNode) {
        (deleteFiberItem.child.dom.parentNode as any).innerHTML = "";
      }
    }
    if (parentFiberNode && deleteFiberItem?.dom) {
      removeDom(deleteFiberItem?.dom);
    }
  });
  delection = []
}
