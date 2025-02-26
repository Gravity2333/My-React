// 被动的effect 默认存在
/**
 * PassiveEffect 是一种副作用标志，用于表示在组件的生命周期中执行的副作用类型。
 * 副作用是指在组件渲染期间可能执行的操作，例如订阅、取消订阅、数据获取等。
 * 而 PassiveEffect 表示一种被动的、不会触发组件重新渲染的副作用。
 * 这意味着在执行这种副作用时，React 不会因为副作用的执行而重新渲染组件。
 * 这对于性能优化非常有用，因为它允许开发人员在不影响渲染性能的情况下执行副作用操作。
 */
export const Passive = 0b0010;
// 当前hook存在effect需要处理
export const HookHasEffect = 0b0001;

export type HookEffectTag = number;
