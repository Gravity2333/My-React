import { IDeadline } from "../lib/polyfill"

const { polyfillRequestIdleCallback } = require("./utils/polyfill")

// polyfill
polyfillRequestIdleCallback()

// 调度
const scheduler = (deadline: IDeadline) => {
    if(!deadline.didTimeout && deadline.timeRemaining() > 0) {
        console.log(deadline.timeRemaining())
        // console.log('hello!')
    }
    console.log('frame end')
    window.requestIdleCallback(scheduler)
}
window.requestIdleCallback(scheduler)