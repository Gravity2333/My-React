import {
  FulfilledThenable,
  RejectedThenable,
  Thenable,
} from "../share/ReactTypes";

/**
 * 用来包装 thenable对象，把满足Promise协议的对象，包装成Thenable类型的内部对象
 */

// 注意，抛出错误的时候 需要使用内部定义的错误，避免和用户定义错误混淆，取得错误内容通过导出的变量获取
export const SuspenseException = new Error(
  "Suspense内部Error，请将本错误向外抛出以保证Suspense正常工作！"
);

// 真正的 thenable
let suspendedThenable: Thenable<any> = null;

// 获取suspendedThenable
export function getSuspendedThenable() {
  const thenable = suspendedThenable;
  suspendedThenable = null;
  return thenable;
}

/** 处理 thenable相关 */
export function tractUseThenable(thenable: Thenable) {
  switch (thenable.status) {
    case "fulfilled":
      // 包装过 且fulfilled
      return thenable.value;
    case "rejected":
      // 包装过 且rejected
      return thenable.reason;
    default:
      // 没包装过 需要包装
      thenable.then(
        (value) => {
          (thenable as unknown as FulfilledThenable).status = "fulfilled";
          (thenable as unknown as FulfilledThenable).value = value;
        },
        (reason) => {
          (thenable as unknown as RejectedThenable).status = "rejected";
          (thenable as unknown as RejectedThenable).reason = reason;
        }
      );
      suspendedThenable = thenable;
      // throw出 thenable
      throw SuspenseException;
  }
}
