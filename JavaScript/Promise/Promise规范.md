---
title: Promise规范
tags:
  - js
  - Promise
categories:
  - 技术文档
  - 前端
  - js
date: 2020-08-19 22:32:07
---

# Promise A+ 规范

## 术语

| 术语         | 描述                                                        |
| ------------ | ----------------------------------------------------------- |
| Promise      | promise是一个拥有then方法的对象和函数                       |
| thenable     | 是一个定义了then方法的对象和函数,                           |
| value(值)    | 指任何JavaScript的合法指(包括 undefined、thenable、promise) |
| expection    | 是使用throw语句抛出的值                                     |
| reason(拒因) | 表示一个promise的拒绝原因                                   |


## Promise的状态

一个Promise当前状态必须为以下三种状态中的一种: 等待态(Pending)、执行态(FulFilled)、拒绝态(Rejected)

### 等待态(Pending)

处于等待态时,Promise需要满足一下条件:
* 可以迁移至执行态或拒绝态

### 执行态(Fulfilled)

处于执行态时,Promise需要满足一下条件:
* 不能迁移至其他任何状态
* 必须拥有一个不可变的终值

### 拒绝态(Rejected)

处于拒绝态时,promise需要满足一下条件:
* 不能迁移至其他任何状态
* 必须拥有一个不可变拒因
  
## Then 方法
一个 promise 必须提供一个 then 方法以访问其当前值\终值\拒因

promise 的 then 方法接受两个参数

```js
promise.then(onFulfilled, onRejected)
```

### 参数可选

`onFulfilled`和`onRejected`都是可选参数.

* 如果 onFulFilled 不是函数,其必须被忽略
* 如果 onRejected 不是函数,其必须被忽略

### onFulFilled 特征

如果 onFulFilled 是函数:

* 当 promise 执行结束后其必须被调用,其第一个参数为 promise 的终值
* 当 promise 执行结束前其不可被调用
* 其调用次数不可超过一次

### onRejected 特征

如果 onRejected 是函数

* 当 promise 被拒绝执行后其必须被调用,其第一个参数为 promise 的拒因
* 在 promise 被拒绝执行前其不可调用
* 其调用次数不可超过一次

### 调用时机

onFulFilled 和 onRejected 只有在执行环境堆栈仅包含平台代码的时候才能被调用

### 调用要求

onFulFilled 和 onRejected 必须被作为函数调用(即没有 this 值)

### 多次调用

then 方法可以被同一个 promise 调用多次

* 当 promise 成功执行时,所有 onFulfilled 需要按照其注册顺序依次回调
* 当 promise 被拒绝执行时,所有 onRejected 需要按照其注册顺序依次回调

### 返回

then 方法必须返回一个 promise 对象
```js
promise2 = promise1.then(onFulfilled,onRejected);
```
* 如果 onFulFilled 或者 onRejected 返回一个值 x,则运行下面 Promise 解决过程 `[[Resolve]](promise2, x)`
* 如果 onFulFilled 或者 onRejected 抛出一个异常 e,则 promise2 必须拒绝执行,并返回拒因 e
* 如果 onFulFilled 不是函数且 promise1 成功执行,promise2 必须成功执行并返回相同的值
* 如果 onRejected 不是函数且 promise1 拒绝执行, promise2 必须拒绝执行并返回相同的拒因
  
## Promise 解决过程

Promise 解决过程是一个抽象的操作, 其需要输入一个 promise 和一个值,我们表示`[[Resolve]](promise, x)`,如果 x 有 then 方法且看上去想一个 Promise, 解决程序即尝试使 promise 接受 x 的状态;否则其用 x 的值来执行 promise

这种 thenable 的特性使得 Promise 的实现更具通用性: 只要其暴露出一个遵循 Promise/A+协议的 then 方法即可; 这同时也使遵循 Promise/A+ 规范的实现与那些不太规范但可用的实现能良好共存

运行`[[Resolve]](promise, x)`遵循以下步骤:

### x 与 promise 相等

如果 promise 和 x 指向同一对象,以 TypeError 为拒因拒绝执行 promise
### x 为 Promise

如果 x 为 Promise,则使 promise 接受 x 的状态

* 如果 x 处于等待态, promise 需要保持为等待态直至 x 被执行或拒绝
* 如果 x 处于执行态, 用同样的值执行 promise
* 如果 x 处于拒绝态, 用同样的拒因拒绝 promise
  
### x 为对象或函数

如果 x 为对象或者函数:

* 把 x.then 赋值给 then
* 如果取 x.then 的值时抛出错误 e, 则以 e 为拒因拒绝 promise
* 如果 then 是函数, 将 x 作为函数的作用域 this 调用之. 传递两个回调函数作为参数,第一个参数叫做 resolvePromise, 第二个参数叫做 rejectPromise
  1. 如果 resolvePromise 以值 y 为参数被调用,则运行`[[Resolve]](promise, y)`
  2. 如果 rejectPromise 以拒因 r 作为参数被调用, 则以拒因 r 拒绝 promise
  3. 如果 resolvePromise 和 rejectPromise 均被调用,或者被同一参数调用了多次,则优先采用首次调用并忽略剩下的调用
  4. 如果调用 then 放大抛出异常 e:
      + 如果 resolvePromise 或 rejectPromise 已经被调用,则忽略之
      + 否则以 e 为拒因拒绝 promise
  5. 如果 then 不是函数,以 x 为参数执行 promise
* 如果 x 不为对象或者函数,以 x 为参数执行 promise

如果-个 promise 被一个循环的 thenable 链中的对象解决,而`[[Resolve]](promise, thenable)`的递归性质又使得其被再次调用,根据上述算法将会陷入无限递归之中.算法虽不强制要求,但也鼓励实施者检测这样的递归存在, 若检测到存在则以一个可识别的 TypeError 为拒因来拒绝 promise

# 参考资料

1. [Promise/A+规范 英文原版](https://promisesaplus.com/)
2. [Promise/A+规范 中文版本](https://www.ituring.com.cn/article/66566)
3. [Promise 实现](https://sobird.me/promise-getstarted-note.htm)