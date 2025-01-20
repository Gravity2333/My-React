/** 同步任务更新队列 */
type SyncCallback = (...args: any[]) => void;

/** 存储callback数组 */
let syncTaskQueue: SyncCallback[] = [];

/** 入队 */
export function scheduleSyncCallback(callback: SyncCallback) {
  syncTaskQueue.push(callback);
}

/** 队列flush lock 防止多次调用
 *  防止嵌套调用 flushSyncCallbacks
 */
let isFlushingSyncQueue = false;

/** flush清空队列 */
function _flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncTaskQueue.length > 0) {
    // 上锁
    isFlushingSyncQueue = true;

    try {
      // 执行任务
      syncTaskQueue.forEach((syncTask) => scheduleMicroTask(syncTask));
    } catch (e) {
      console.error("同步微任务队列执行错误，错误信息:", e);
    } finally {
      // 执行结束  释放锁 清空队列
      isFlushingSyncQueue = false;
      syncTaskQueue = [];
    }
  }
}

/** 兼容多种环境的microTask */
export const scheduleMicroTask = (
  typeof queueMicrotask === "function"
    ? queueMicrotask
    : typeof Promise === "function"
    ? (callback: SyncCallback) => Promise.resolve().then(callback)
    : setTimeout
) as (callback: SyncCallback) => void;

/** 微任务flush清空队列 */
export const flushSyncCallbacks = () => scheduleMicroTask(_flushSyncCallbacks);
