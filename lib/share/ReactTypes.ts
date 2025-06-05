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

export type Context<T> = {
  $$typeof: symbol | number;
  Provider: ContextProviderType<T>;
  Consumer: ContextConsumer<T>;
  _currentValue: T;
};

export type ContextProviderType<T> = {
  $$typeof: symbol | number;
  _context: Context<T>;
};

export type ContextConsumer<T> = {
  $$typeof: symbol | number;
  _context: Context<T>;
};

/** 定义 thenable */
export interface ThenableImple<Value = any, Result = any, Err = any> {
  then: (
    onFulfilled: (value: Value) => Result,
    onRejected: (err: Err) => Result
  ) => void | ThenableImple<Result>;
}

/** 定义没有被包裹 / 没有被唤醒的 Thenable */
export interface UntrackedThenable<Value = any, Result = any, Err = any>
  extends ThenableImple<Value, Result, Err> {
  status?: void;
}

/** 定义pending状态的 Thenable */
export interface PendingThenable<Value = any, Result = any, Err = any>
  extends ThenableImple<Value, Result, Err> {
  status: "pending";
  value: Value;
}

/** 定义fulfilled状态的 Thenable */
export interface FulfilledThenable<Value = any, Result = any, Err = any>
  extends ThenableImple<Value, Result, Err> {
  status: "fulfilled";
  value: Value;
}

/** 定义rejected状态的 Thenable */
export interface RejectedThenable<Value = any, Result = any, Err = any>
  extends ThenableImple<Value, Result, Err> {
  status: "rejected";
  reason: Err;
}

/** Thenable类型 */
export type Thenable<Value = any, Result = any, Err = any> =
  | UntrackedThenable<Value, Result, Err>
  | PendingThenable<Value, Result, Err>
  | FulfilledThenable<Value, Result, Err>
  | RejectedThenable<Value, Result, Err>;

/** 可以被唤醒的thenable */
export interface Wakeable extends ThenableImple<any, any, any> {}

/** use钩子需要的参数类型 */
export type Usable<T> = Thenable<T, any, T> | Context<T>;
