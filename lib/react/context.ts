import { REACT_CONSUMER_TYPE, REACT_CONTEXT_TYPE, REACT_PROVIDER_TYPE } from "../share/ReactSymbols";
import { Context } from "../share/ReactTypes";


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
