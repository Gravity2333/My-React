export interface IDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

interface IPortMessageParam {
  frameEndTime: DOMHighResTimeStamp;
  taskId: string;
}

// 刷新事件
const _REFRESH_TIME = 1 / 60;

// 任务Map
class TaskMap {
  private mapData: Map<string, any>;
  constructor() {
    this.mapData = new Map();
  }

  public set(taskName: string, task: any) {
    this.mapData.set(taskName, task);
  }

  public get(taskName) {
    return this.mapData.get(taskName);
  }

  public delete(taskName: string) {
    this.mapData.delete(taskName);
  }

  public clear() {
    this.mapData.clear();
  }
}

/** 手撸一个requestIdleCallback */
export function polyfillRequestIdleCallback() {
  if (!window.requestIdleCallback) {
    const messageChannel = new MessageChannel();
    const port1 = messageChannel.port1;
    const port2 = messageChannel.port2;

    // 用来存储任务
    const taskMap = new TaskMap();

    // monkey patch polyfill
    window.requestIdleCallback = function (
      callback: (deadline: IDeadline) => void
    ): number {
      // 存储任务
      const taskId = String(+new Date());
      taskMap.set(taskId, callback);
      return window.requestAnimationFrame(
        (currentTime: DOMHighResTimeStamp) => {
          // 当前帧结束时间
          const frameEndTime = currentTime + _REFRESH_TIME;
          port1.postMessage({
            taskId,
            frameEndTime,
          } as IPortMessageParam);
        }
      );
    };

    // 接收消息 处理事件
    port2.onmessage = function ({
      data: { taskId, frameEndTime },
    }: {
      data: IPortMessageParam;
    }) {
      // 结束时间 - 当前时间 = 剩余时间
      const timeRemaining = () => frameEndTime - performance.now();
      const wipFunc = taskMap.get(taskId);
      if (wipFunc) {
        wipFunc({
          timeRemaining,
          didTimeout: timeRemaining() <= 0,
        });
      }
      taskMap.delete(taskId);
    };

    // polyfill cancelIdleCaleback
    if (!window.cancelIdleCallback) {
      window.cancelIdleCallback = function (id: number) {
        window.cancelAnimationFrame(id);
      };
    }
  }
}
