---
title: 手写Promise
tags:
  - Promise
categories:
  - 技术文档
  - 前端
  - Promise
date: 2020-08-20 23:56:54
---

# Promise 初始化

1. 建立 MyPromise 类, 并建立构造方法及参数 fn
2. 建立 MyPromise 静态常量, 三种状态 *PENDING*, *FULFILLED*, *REJECTED*
3. 建立 MyPromise 实例对象 state, 用来存储 promise 实例的状态
4. 建立 MyPromise 实例对象 value, 用来存储 promise 实例的值和拒因
5. 建立 MyPromise 实例方法 then, 接收两个参数
   * onFulFilled: 用来处理正常逻辑
   * onRejected: 用来处理异常逻辑
  

# 功能点 01: resolve 同步返回的值,要能在 then 方法中接收到

测试用例:

```js
    it("同步resolve(1) ", (done) => {
        const promise = new MyPromise((resolve, reject) => resolve(1));
        promise
            .then((data) => {
                expect(data).toBe(1);
                done();
                return 2;
            });
    });
```
解决方案:

1. 在 constructor 中, 初始化状态赋值为 PENDING, 执行构造参数 fn方法, 并传入 resolve 方法,和 reject 方法.用来接收异步返回值和拒因:value
```js
constructor(fn) {
    this.state = MyPromise.PENDING;
    this.value = undefined;
    // 异步缓存
    const resolve = (value) => {
        this.state = MyPromise.FULFILLED;
        this.value = value;
    };
    const reject = (value) => {
        this.state = MyPromise.REJECTED;
        this.value = value;
    };
    fn(resolve, reject);
}
```
2. resolve 方法中 将 promise 状态state 赋值为 FULFILLED, reject 方法中将 promise 状态 state 赋值为 REJECTED. 同时接收参数 value.这样就实现了 Promise 的实例化
```js
const promise = new MyPromise((resolve, reject) => e => resolve(1));
```
3. 要完成 then 方法,首先得明确 then 方法的参数和返回值
   * 参数: 
      + onFulfilled(成功回调方法): 参数为当前值 
      + onRejected(失败回调方法): 参数为拒因
   * 返回值: 新的promise对象,后面要能接着 then 
4. then 方法 onFulfilled传参 this.value; 并执行 resolve 方法 
```js
    then(onFulfilled, onRejected) {
        onFulfilled(this.value);
    }
```

# 功能点 02: resolve 异步返回的值,要能在 then 方法中接受到

测试用例:
```js
    it("异步resolve(1) ", (done) => {
        const promise = new MyPromise((resolve, reject) =>
            setTimeout(resolve, 1, 1)
        );
        promise
            .then((data) => {
                expect(data).toBe(1);
                done();
            })
    });
```

解决方案:

1. 如果 Promise 在 PENDING 状态,数据还没有回来,就要创建缓存队列 resolveCallbacks,缓存 then 中接收到的方法.
```js
    then(onFulfilled, onRejected) {
        if (this.state === MyPromise.PENDING) {
            this.resolveCallbacks.push((value) => {
                onFulfilled(value);
            });
        } else if (this.state === MyPromise.FULFILLED) {
            onFulfilled(this.value));
        }
    }
```
2. 当创建实例时异步调用 resolve() 时, 要遍历 resolveCallbacks,并执行其方法, 传入 this.value 的值. 
```js
    const resolve = (value) => {
        this.state = MyPromise.FULFILLED;
        this.value = value;
        this.resolveCallbacks.forEach((fn) => fn(this.value));
    };
```

3. resolveCallbacks为数组,是考虑到可以在同一个实例上多次进行 .then() 操作.
```js
// 测试用例
    it("异步resolve(1),同一实例多次 then", (done) => {
        const promise = new MyPromise((resolve, reject) =>
            setTimeout(resolve, 1, 1)
        );

        promise.then((data) => {
            expect(data).toBe(1);
        });
        promise.then((data) => {
            expect(data).toBe(1);
            done();
        });
    });
```
# 功能点 03: resolve 只有第一次生效, 多次在实例化 promise 时后面的 resolve 不生效

测试用例:

```js
    it(" resolve 只有第一次生效, 多次在实例化 promise 时后面的 resolve 不生效", (done) => {
        const promise = new MyPromise((resolve, reject) => {
            setTimeout(resolve, 0, 1);
            setTimeout(resolve, 0, 1);
        });

        const arr = [];
        promise.then((data) => {
            arr.push(data);
        });

        setTimeout(() => {
            expect(arr.toString()).toBe("1");
            done();
        }, 1);
    });
```
解决方案:

1. resolve调用后状态由 PENDING 变成了 FULFILED,由 promise.state 的状态可以判断是不是调用了 resolve 方法

```js
const resolve = (value) => {
    if (this.state === MyPromise.PENDING) {
        this.state = MyPromise.FULFILLED;
        this.value = value;
        this.resolveCallbacks.forEach((fn) => fn(this.value));
    }
};
```
2. 同样的,reject 也只允许调用一次

# 功能点 04: 支持链式调用

测试用例:

```js
    it("链式调用", (done) => {
        const promise = new MyPromise((resolve, reject) =>
            setTimeout(resolve, 0, 1)
        );

        const arr = [];
        promise
            .then((data) => {
                arr.push(data);
                return 2;
            })
            .then((data) => {
                arr.push(data);
            });
        setTimeout(() => {
            expect(arr.toString()).toBe("1,2");
            done();
        }, 100);
    });
```

解决方案:

1. 根据使用 Promise 的规范, then 后返回一个新的 promise,所以可以在 then 中 new 一个新的 Promise,并 resolve onFulFilled 的返回结果

```js
    then(onFulfilled, onRejected) {
        const promise2 = new Promise((resolve, reject) => {
            if (this.state === MyPromise.PENDING) {
                this.resolveCallbacks.push((value) => {
                    resolve(onFulfilled(value));
                });

                this.rejectCallbacks.push((value) => {
                    resolve(onRejected(value));
                });
            } else if (this.state === MyPromise.FULFILLED) {
                onFulfilled(this.value);
            } else if (this.state === MyPromise.REJECTED) {
                this.rejectCallbacks.push((value) => {
                    resolve(onRejected(value));
                });
            }
        });

        return promise2;
    }
```
# 功能点 05: 支持空的 then

测试用例:

```js
    it("支持空 then", (done) => {
        const promise = new MyPromise((resolve, reject) =>
            setTimeout(resolve, 0, 1)
        );

        const arr = [];
        promise.then().then((data) => {
            arr.push(data);
        });
        setTimeout(() => {
            expect(arr.toString()).toBe("1");
            done();
        }, 100);
    });
```

解决方案:

1. 



