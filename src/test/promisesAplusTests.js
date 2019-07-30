const promisesAplusTests = require("promises-aplus-tests");

const adapter = {
  resolved: (value) => {
    return new Promise(resolve => {
      resolve(value);
    });
  },
  rejected: (reason) => {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  },
  deferred: () => {
    const dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
};

promisesAplusTests(adapter, (err) => {
  console.log(err);
});
