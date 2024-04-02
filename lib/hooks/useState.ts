import { isMount, nextUnitOfWork, reRender } from "../ReactDom";
import { IFiber, MemorizedState, MemorizedTask } from "../typings";
import { debounce } from "../utils/tools";

function _dispatchAction(hook: MemorizedState, action: any) {
    let updates: MemorizedTask | null = null
    if (typeof action === 'function') {
        updates = {
            action,
            next: null
        }
    } else {
        updates = {
            action: () => action,
            next: null
        }
    }
    // 插入环形链表
    if (!hook?.queue?.pending) {
        updates.next = updates
        hook.queue.pending = updates
    } else {
        updates.next = hook.queue.pending.next
        hook.queue.pending = hook.queue.pending.next = updates
    }
    // debounce(reRender, 100)()
    reRender()
}

/** 负责记录当前loop执行到的hook位置 */
export let workInProgressHook: MemorizedState | null = null
let lastUnitOfWork: IFiber | null = null
export default function useState<T>(initialState: T) {
    if (lastUnitOfWork !== nextUnitOfWork) {
        // nextUnitOfWork变化，上一轮循环结束，重制workInProgressHook
        workInProgressHook = null
        lastUnitOfWork = nextUnitOfWork
    }
    let hook: MemorizedState | null = null
    if (isMount) {
        /** 首次加载 */
        hook = {
            memorizedState: initialState,
            queue: { pending: null },
            next: null
        } as MemorizedState
        /** 给workInProgressHook和hook赋值 */
        if (!nextUnitOfWork.memorizedState) {
            workInProgressHook = nextUnitOfWork.memorizedState = hook
        } else {
            workInProgressHook = workInProgressHook.next = hook
        }
    } else {
        /** 非首次加载 */
        if (!workInProgressHook) {
            hook = workInProgressHook = nextUnitOfWork.memorizedState
        } else {
            hook = workInProgressHook = workInProgressHook.next
        }
    }

    let baseState = hook.memorizedState
    let workInProgressTask = hook.queue.pending?.next
    if (workInProgressTask) {
        do {
            baseState = workInProgressTask.action(baseState)
            workInProgressTask = workInProgressTask.next
        } while (workInProgressTask !== hook.queue.pending?.next)
    }
    // 更新hook.memorized
    hook.memorizedState = baseState
    hook.queue.pending = null
    return [baseState, _dispatchAction.bind(null, hook)]
}