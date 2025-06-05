# promise线程池

```ts
// 异步请求，最大并发3，请求全部完成后打印结果
export async function asyncPool<T>(poolLimit: number, array: T[], iteratorFn: (item: T) => unknown) {
  let res: Promise<any>[] = [];
  let executing: Promise<any>[] = [];

  for (let item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    res.push(p);

    if (poolLimit <= array.length) {
      const e: Promise<any> = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (poolLimit <= executing.length) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(res);
}

/**
 * 创建一个异步请求
 * @param i
 * @returns
 */
const curl = (i: number) => {
  console.log('开始' + i);
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(i);
      console.log('结束' + i);
    }, 1000 + Math.random() * 1000)
  );
};

// 创建一个数组
let urls = Array(10)
  .fill(0)
  .map((v, i) => i);

(async () => {
  const res = await asyncPool(3, urls, curl);
  console.log(res);
})();
```
