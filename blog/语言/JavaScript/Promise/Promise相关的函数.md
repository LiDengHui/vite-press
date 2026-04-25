# Promise 相关的函数

以下是整理后的 Promise 相关方法 Markdown 表格，包含传统方法和新增方法：

### 📊 Promise 核心方法总览

| **方法名**                        | **类型** | **描述**                                 | **参数**                                              | **返回值**       | **使用场景**            |
| --------------------------------- | -------- | ---------------------------------------- | ----------------------------------------------------- | ---------------- | ----------------------- |
| **基础方法**                      |          |                                          |                                                       |                  |                         |
| `new Promise(executor)`           | 构造器   | 创建 Promise 对象                        | `executor(resolve, reject)` 函数                      | Promise 实例     | 封装异步操作            |
| `.then(onFulfilled, onRejected?)` | 实例方法 | 处理成功状态                             | `onFulfilled`: 成功回调<br>`onRejected`: 可选失败回调 | 新 Promise 对象  | 异步流程链式调用        |
| `.catch(onRejected)`              | 实例方法 | 处理失败状态                             | `onRejected`: 失败回调                                | 新 Promise 对象  | 错误捕获                |
| `.finally(onFinally)`             | 实例方法 | 无论成功/失败都执行                      | `onFinally`: 无参数回调                               | 新 Promise 对象  | 资源清理/日志记录       |
| **静态方法**                      |          |                                          |                                                       |                  |                         |
| `Promise.resolve(value)`          | 静态方法 | 创建已完成的 Promise                     | 任何类型值                                            | 已完成的 Promise | 同步值转 Promise        |
| `Promise.reject(reason)`          | 静态方法 | 创建已拒绝的 Promise                     | 错误原因                                              | 已拒绝的 Promise | 快速返回错误            |
| `Promise.all(iterable)`           | 静态方法 | 所有 Promise 成功时返回结果数组          | Promise 可迭代对象                                    | 新 Promise 对象  | 并行多个异步操作        |
| `Promise.allSettled(iterable)`    | 静态方法 | 所有 Promise 完成后返回状态结果数组      | Promise 可迭代对象                                    | 新 Promise 对象  | 需要所有操作的最终状态  |
| `Promise.race(iterable)`          | 静态方法 | 返回第一个完成的 Promise                 | Promise 可迭代对象                                    | 新 Promise 对象  | 超时控制/竞速场景       |
| `Promise.any(iterable)`           | 静态方法 | 返回第一个成功的 Promise                 | Promise 可迭代对象                                    | 新 Promise 对象  | 获取最快成功结果        |
| **新增方法 (ES2024+)**            |          |                                          |                                                       |                  |                         |
| `Promise.try(func)`               | 静态方法 | 统一包装同步/异步函数，自动捕获错误      | `func`: 要执行的函数                                  | 新 Promise 对象  | 混合任务链/错误安全封装 |
| `Promise.withResolvers()`         | 静态方法 | 返回 `{ promise, resolve, reject }` 对象 | 无                                                    | 解构对象         | 事件驱动/外部控制状态   |

---

### 🔍 方法特性对比表

| **特性**     | `Promise.all()` | `Promise.any()` | `Promise.allSettled()` | `Promise.race()` |
| ------------ | --------------- | --------------- | ---------------------- | ---------------- |
| **成功条件** | 全部成功        | 至少一个成功    | 全部完成               | 第一个完成       |
| **失败条件** | 任一失败        | 全部失败        | 永不失败               | 第一个失败       |
| **结果类型** | 值数组          | 单个值          | 状态对象数组           | 单个值/错误      |
| **错误处理** | 立即拒绝        | AggregateError  | 包含错误状态           | 立即拒绝         |
| **适用场景** | 强依赖并行操作  | 获取最快成功    | 收集所有操作状态       | 竞速/超时控制    |

---

### ⚡ 新增方法详解

| **方法**                  | **核心优势**                                  | **示例场景**                                                                      |
| ------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| `Promise.try()`           | • 统一同步/异步错误处理<br>• 自动捕获同步异常 | `Promise.try(() => JSON.parse(input)).catch(handleError)`                         |
| `Promise.withResolvers()` | • 外部控制 Promise 状态<br>• 避免变量污染     | `const {promise, resolve} = Promise.withResolvers()<br>event.on('done', resolve)` |

---

### 💎 使用建议

1. **错误处理**：始终使用 `.catch()` 或 `try/catch`（async/await）处理拒绝状态
2. **资源清理**：使用 `.finally()` 确保资源释放
3. **现代特性**：在支持环境（Node.js 22+ / Chrome 122+）优先使用 `Promise.try()` 和 `Promise.withResolvers()`
4. **并发控制**：
    - 全成功：`Promise.all()`
    - 需所有结果：`Promise.allSettled()`
    - 最快成功：`Promise.any()`

> 完整规范参考：[ECMAScript Promise](https://tc39.es/ecma262/#sec-promise-objects)
