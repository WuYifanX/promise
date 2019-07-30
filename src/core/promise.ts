import { microtask } from "./microtask";

export type Resolve<T> = (value?: T) => any;
export type Reject<T> = (value?: T) => any;

export type Status = "pending" | "resolved" | "rejected";
export type Then<T> = (
  onFulfilledCallback?: Resolve<T>,
  onRejectCallback?: Reject<T>
) => Promise<T>;

export type Executor<T> = (resolve: Resolve<T>, reject: Reject<T>) => void;

export class Promise<T = any> {
  public static resolve = (val: any) => {
    return new Promise(resolve => {
      resolve(val);
    });
  };

  public static reject = (reason: any) => {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  };

  public static race = (promises: Promise[]) => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  };

  private status: Status = "pending";
  private result?: T;
  private onFulfilledCallbacks: Array<Resolve<T>> = [];
  private onRejectCallbacks: Array<Reject<T>> = [];
  constructor(executor?: Executor<T>) {
    try {
      executor!(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  public resolve = (value?: T) => {
    microtask(() => {
      if (this.status === "pending") {
        this.status = "resolved";
        this.result = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    });
  };

  public reject = (reason?: T) => {
    microtask(() => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.result = reason;
        this.onRejectCallbacks.forEach(fn => fn());
      }
    });
  };

  public then: Then<T> = (onFulfilledCallback?, onRejectCallback?) => {
    const defaultOnFulfilledCallback = (value?: T) => value;
    const defaultOnRejectCallback = (reason?: T) => {
      throw reason;
    };

    onFulfilledCallback =
      typeof onFulfilledCallback === "function"
        ? onFulfilledCallback
        : defaultOnFulfilledCallback;

    onRejectCallback =
      typeof onFulfilledCallback === "function"
        ? onRejectCallback
        : defaultOnRejectCallback;

    const promise2 = new Promise((resolve, reject) => {
      let x;
      if (this.status === "pending") {
        this.onFulfilledCallbacks.push(() => {
          x = onFulfilledCallback!(this.result);
          this.resolvePromise(promise2, x, resolve, reject);
        });
        this.onRejectCallbacks.push(() => {
          x = onRejectCallback!(this.result);
          this.resolvePromise(promise2, x, resolve, reject);
        });
      } else if (this.status === "resolved") {
        x = onFulfilledCallback!(this.result);
        this.resolvePromise(promise2, x, resolve, reject);
      } else if (this.status === "rejected") {
        x = onRejectCallback!(this.result);
        this.resolvePromise(promise2, x, resolve, reject);
      }
    });
    return promise2;
  };

  private resolvePromise = (
    promise2: Promise,
    // x might be the return of a promise.
    x: any,
    resolve: Resolve<any>,
    reject: Reject<any>
  ) => {
    // cycle dependency
    if (x === promise2) {
      return reject(new TypeError("Chaining cycle detected for promise"));
    }
    // to avoid multitimes call
    let called: boolean | undefined;

    if (x != null && (typeof x === "object" || typeof x === "function")) {
      try {
        // A+规定，声明then = x的then方法
        const then: Then<T> | undefined = x.then;

        if (typeof then === "function") {
          // x is a promise
          // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
          then.call(
            x,
            y => {
              // 成功和失败只能调用一个
              if (called) {
                return;
              }
              called = true;
              // resolve的结果依旧是promise 那就继续解析
              this.resolvePromise(promise2, y, resolve, reject);
            },
            err => {
              // 成功和失败只能调用一个
              if (called) {
                return;
              }
              called = true;
              reject(err); // 失败了就失败了
            }
          );
        } else {
          // if is not a function, then resolve it.
          resolve(x);
        }
      } catch (e) {
        // 也属于失败
        if (called) {
          return;
        }
        called = true;
        // 取then出错了那就不要在继续执行了
        reject(e);
      }
    } else {
      resolve(x);
    }
  };
}
