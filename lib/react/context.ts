import { REACT_CONSUMER_TYPE, REACT_CONTEXT_TYPE, REACT_PROVIDER_TYPE } from "../share/ReactSymbols";

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
  Provider: ContextProvider<T>;
  Consumer: ContextConsumer<T>;
  _currentValue: T;
};

export type ContextProvider<T> = {
  $$typeof: symbol | number;
  _context: Context<T>;
};

export type ContextConsumer<T> = {
  $$typeof: symbol | number;
  _context: Context<T>;
};

/** 创建一个Context对象 */
export default function createContext<T>(defaultValue: T): Context<T> {
  const _context: Context<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    Provider: null,
    Consumer: null,
    _currentValue: defaultValue,
  };

  // add provider
  _context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context,
  };

  // add consumer
  _context.Consumer = {
    $$typeof: REACT_CONSUMER_TYPE,
    _context,
  };

  return _context;
}
