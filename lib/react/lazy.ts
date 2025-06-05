import { REACT_LAZY_TYPE } from "../share/ReactSymbols";
import { Thenable, Wakeable } from "../share/ReactTypes";

const Uninitialized = -1;
const Pending = 0;
const Fulfilled = 1;
const Rejected = 2;

// 没有被初始化的payload
type UnInitialzedPayload<LoadedComponentType> = {
  _status: typeof Uninitialized;
  _result: () => Thenable<{ default: LoadedComponentType }>;
};

// pendingPayload
type PendingPayload = {
  _status: typeof Pending;
  _result: Wakeable;
};

// fulfilled
type FulfilledPayload<LoadedComponentType> = {
  _status: typeof Fulfilled;
  _result: { default: LoadedComponentType };
};

// rejected
type RejectedPayload = {
  _status: typeof Rejected;
  _result: any;
};

type Payload<LoadedComponentType> =
  | UnInitialzedPayload<LoadedComponentType>
  | PendingPayload
  | FulfilledPayload<LoadedComponentType>
  | RejectedPayload;

/** lazy 组件类型 */
export type LazyComponentType<
  LoadedComponentType = any,
  PayloadType = Payload<LoadedComponentType>
> = {
  $$typeof: symbol | number;
  /** 负载 */
  _payload: PayloadType;
  /** init函数 传入payload 请求回组件 */
  _init: (payload: PayloadType) => LoadedComponentType;
};

/** 初始化lazy组件 */
function lazyInitializer<LoadedComponentType>(
  payload: Payload<LoadedComponentType>
): LoadedComponentType {
  if (payload._status === Uninitialized) {
    const ctor = payload._result;
    const wakeable = ctor();

    wakeable.then(
      (value) => {
        (payload as unknown as FulfilledPayload<LoadedComponentType>)._status =
          Fulfilled;
        (payload as unknown as FulfilledPayload<LoadedComponentType>)._result =
          value;
      },
      (reason) => {
        (payload as unknown as RejectedPayload)._status = Rejected;
        (payload as unknown as RejectedPayload)._result = reason;
      }
    );

    // 再次检查，是否当前已经决策了
    if (payload._status === Uninitialized) {
      // 没有 则初始化为PENDING状态
      (payload as unknown as PendingPayload)._status = Pending;
      (payload as unknown as PendingPayload)._result = wakeable;
    }
  }

  if (payload._status === Fulfilled) {
    return (payload as unknown as FulfilledPayload<LoadedComponentType>)._result
      .default;
  } else {
    // 没有决策 抛出
    throw payload._result;
  }
}

export function lazy<LoadedComponentType = any>(
  ctor: () => Thenable<{ default: LoadedComponentType }>
) {
  const _payload: Payload<LoadedComponentType> = {
    _status: Uninitialized,
    _result: ctor,
  };

  const _lazy: LazyComponentType<
    LoadedComponentType,
    Payload<LoadedComponentType>
  > = {
    $$typeof: REACT_LAZY_TYPE,
    _payload,
    _init: lazyInitializer,
  };

  return _lazy;
}
