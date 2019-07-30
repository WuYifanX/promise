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
});