import { Action, Dispatch } from "../react-reconciler/updateQueue";

export interface Dispatcher {
  useState: <T>(initialState: T | (() => T)) => [T, Dispatch<T>];
}

/** 共享的 当前的Dispatcher */
export const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

/** 解析 返回dispatcher */
export function resolveDispatcher(): Dispatcher{
    const dispatcher = currentDispatcher.current
    if(dispatcher === null){
        throw new Error('无法在函数组件外部使用hooks')
    }
    return dispatcher
}
