/** element为文字的情况
 *  element的type可能为 HOSTComponent 即 div span
 *  函数
 *  文字，TEXT_ELEMENT_TYPE
 */

import { EffectCallback, HookDeps } from "../react-reconciler/fiberHooks";
import { REACT_ELEMENT_TYPE } from "../react-reconciler/ReactSymbols";
import { currentDispatcher, resolveDispatcher } from "./currentDispatcher";

export type ReactElementType = string | Function | Symbol | number;
/** 属性类型 */
export type ReactElementProps = Record<string, any>;
/** key */
export type Key = string;
/** Ref */
export type Ref = { current: any } | ((current: any) => void);
/** children  */
export type ReactElementChildren =
  | ReactElement
  | string
  | Array<ReactElementChildren>;

/** Element元素类型 */
export interface ReactElement {
  $$typeof: Symbol | number;
  key: Key;
  ref?: Ref;
  type: ReactElementType;
  props: ReactElementProps;
}

function handleChildren(child: ReactElementChildren) {
  if (typeof child === "string") {
    // 子节点为文字的情况
    return child;
  } else {
    // 普通节点的情况，递归调用createElement
    return child;
  }
}

/** 实现createElement方法 */
export function createElement(
  type: ReactElementType,
  props: ReactElementProps,
  ...children: ReactElementChildren[]
): ReactElement {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
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
    ref: props.ref ? props.ref : null,
    key: props.key ? String(props.key) : null,
    props: {
      ...props,
      /** 源码这里做了处理 如果只有一个child 直接放到children 如果有多个 则children为一个数组 */
      children:
        children?.length === 1
          ? handleChildren(children[0])
          : children.map(handleChildren),
    },
  };
}

export function useState<State>(initialState: (() => State) | State) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

export function useEffect(create: EffectCallback, deps: HookDeps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}

export function useTransition() {
  const dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
}
