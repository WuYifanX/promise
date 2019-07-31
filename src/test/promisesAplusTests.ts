const promisesAplusTests = require("promises-aplus-tests");
import { Promise } from "../core/promise";

const adapter = {
  resolved: (value: any) => {
    return new Promise(resolve => {
      resolve(value);
    });
  },
  rejected: (reason: any) => {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  },
  deferred: () => {
    const dfd: any = {};
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
};

promisesAplusTests(adapter, (err: any) => {
  console.log(err);
});
