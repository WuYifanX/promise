## My Promise

使用TypeScript写的符合 Promise/A+ 标准的 promise.

### How to use

```typescript
const promise = new Promise();

// Instance Methods
promise.then((resolve, reject)=>{
  resolve(value);
})

promise.catch((reason)=>{
  // deal with reason
})

// Static Methods:
Promise.resolve(value);

Promise.reject(reason);

Promise.race(promises);

Promise.all(promises);
```

### How to test
```typescript
yarn test
```

#### Refernence

[Promise的源码实现（完美符合Promise/A+规范)](https://github.com/YvetteLau/Blog/issues/2)

[Saber2pr Promise](https://github.com/Saber2pr/promise)
