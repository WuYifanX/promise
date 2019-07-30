## My Promise

使用TypeScript写的符合 Promise/A+ 标准的 promise.

### How to use

```typescript
const promise = new Promise();

promise.then((resolve, reject)=>{
  resolve(value);
})
```

### How to test
```typescript
yarn test
```

#### Refernence

[Promise的源码实现（完美符合Promise/A+规范)](https://github.com/YvetteLau/Blog/issues/2)

[Saber2pr Promise](https://github.com/Saber2pr/promise)
