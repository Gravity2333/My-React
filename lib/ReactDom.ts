import { IDeadline } from "../lib/polyfill"
import { IElement } from "./typings"

const { polyfillRequestIdleCallback } = require("./utils/polyfill")

/**
 *  polyfill requestIdleCallback函数 
 *   防止某些浏览器环境不支持此方法 如:safiri 
 *   具体可以查看 whatCanIUse
 */
polyfillRequestIdleCallback()

// // 调度
// const scheduler = (deadline: IDeadline) => {
//     if(!deadline.didTimeout && deadline.timeRemaining() > 0) {
//         console.log(deadline.timeRemaining())
//         // console.log('hello!')
//     }
//     console.log('frame end')
//     window.requestIdleCallback(scheduler)
// }
// window.requestIdleCallback(scheduler)

export function render(root: IElement,container: HTMLElement) {
    //TODO
}