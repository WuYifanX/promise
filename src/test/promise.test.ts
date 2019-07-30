import { Promise } from "../core/promise";

describe("myPromise", () => {
  it("promise constructure will execute", done => {
    expect(true).toBeTruthy();
    new Promise(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  it("resolve and reject in promise is function", done => {
    new Promise((resolve, reject) => {
      expect(typeof resolve).toBe("function");
      expect(typeof reject).toBe("function");
      done();
    });
  });

  it("onFullFilled callback will fire in then", done => {
    const result = new Promise((resolve, reject) => {
      resolve("success");
    });
    result.then((value: any) => {
      expect(value).toEqual("success");
      done();
    });
  });

  it("static resolve method will resolve value", done => {
    Promise.resolve("success").then((value: string) => {
      expect(value).toBe("success");
      done();
    });
  });

  it("static reject method will reject reason", done => {
    Promise.reject("reason").then(
      () => {
        throw Error("should not implement this methods");
      },
      (reason: string) => {
        expect(reason).toBe("reason");
        done();
      }
    );
  });

  it("static race method will only receive the fastest resolve", done => {
    const fastestPromise = Promise.resolve(1);
    const latePromise = new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      });
    });

    Promise.race([latePromise, fastestPromise])!.then(result => {
      expect(result).toBe(1);
      done();
    });
  });

  it("static race method will only receive the fastest reject", done => {
    const fastestPromise = Promise.reject(1);
    const latePromise = new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      });
    });

    Promise.race([latePromise, fastestPromise])!.then(
      () => {
        throw Error("should not implement this methods");
      },
      (reason: string) => {
        expect(reason).toBe(1);
        done();
      }
    );
  });

  it("static promise all will wait until all promise is resolved", done => {
    const promise1 = Promise.resolve(1);
    const promise2 = new Promise(resolve => {
      resolve(2);
    });
    const promise3 = new Promise(resolve => {
      setTimeout(() => {
        resolve(3);
      });
    });

    Promise.all([promise3, promise2, promise1])!.then(value => {
      expect(value).toEqual([3, 2, 1]);
      done();
    });
  });

  it("static promise all will reject when any one promise is rejected", done => {
    const promise1 = Promise.reject(1);
    const promise2 = new Promise(resolve => {
      resolve(2);
    });
    const promise3 = new Promise(resolve => {
      setTimeout(() => {
        resolve(3);
      });
    });

    Promise.all([promise3, promise2, promise1])!.then(
      value => {
        throw new Error("never here");
      },
      reason => {
        expect(reason).toBe(1);
        done();
      }
    );
  });
});
