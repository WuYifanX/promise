import { microtask } from "../core/microTask";

describe("microtask", () => {
  let result: number[];
  beforeEach(() => {
    result = [];
  });
  it("it will happen before macrotask and after execute stack", done => {
    setTimeout(() => {
      result.push(3);
    });
    microtask(() => {
      result.push(2);
    });
    result.push(1);

    setTimeout(() => {
      expect(result).toEqual([1, 2, 3]);
      done();
    });
  });
});
