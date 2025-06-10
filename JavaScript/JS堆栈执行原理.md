# JS 堆栈执行原理

[[toc]]

浏览器中的堆栈执行原理主要涉及**执行栈（Call Stack）**、**堆（Heap）** 和**任务队列（Event Queue）**，配合**事件循环（Event Loop）** 实现代码执行。以下是核心原理：

---

### 1. **执行栈（Call Stack）**
- **作用**：存储函数调用的栈结构（LIFO：后进先出）。
- **工作流程**：
    - 每调用一个函数，将其压入栈顶（称为“栈帧”）。
    - 函数执行完毕后，从栈顶弹出。
    - 栈为空时，表示代码执行结束。
- **示例**：
  ```javascript
  function a() { b(); }
  function b() { c(); }
  function c() { console.log("End"); }
  a();
  ```
  **栈顺序**：  
  `a()` → `b()` → `c()` → `console.log()`  
  执行后依次弹出。

---

### 2. **堆（Heap）**
- **作用**：存储复杂对象（如对象、数组等引用类型），内存分配无序。
- **特点**：变量在栈中保存对象的堆内存地址（引用）。

---

### 3. **异步任务与事件循环**
JavaScript 是单线程的，异步任务（如 `setTimeout`、`Promise`）通过以下机制处理：

#### (1) **任务队列（Event Queue）**
- 存储待执行的异步任务回调。
- 分为两种队列：
    - **宏任务队列（Macro Task Queue）**：  
      `setTimeout`、`setInterval`、DOM事件、I/O操作等。
    - **微任务队列（Micro Task Queue）**：  
      `Promise.then()`、`MutationObserver`、`queueMicrotask()`。

#### (2) **事件循环（Event Loop）**
1. **执行栈为空时**，检查微任务队列。
2. **清空所有微任务**（依次执行至队列为空）。
3. **执行一个宏任务**。
4. **重复步骤1~3**（循环）。

---

### 执行顺序示例
```javascript
console.log("Start");

setTimeout(() => console.log("Timeout"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

console.log("End");
```

**输出顺序**：
```
Start → End → Promise 1 → Promise 2 → Timeout
```

#### 步骤解析：
1. 同步代码入栈：  
   `console.log("Start")` → `console.log("End")`。
2. 异步任务分发：
    - `setTimeout` 回调放入**宏任务队列**。
    - `Promise.then()` 放入**微任务队列**。
3. 同步代码执行完毕（栈空）：
    - 先清空微任务队列：执行 `Promise.then()` 链（输出 `Promise 1` → `Promise 2`）。
    - 再执行一个宏任务：`setTimeout` 回调（输出 `Timeout`）。

---

### 关键规则总结
1. **同步代码优先执行**（执行栈）。
2. **微任务 > 宏任务**：  
   每次栈空后，先清空所有微任务，再执行一个宏任务。
3. **渲染时机**：  
   通常在微任务之后、宏任务之前进行UI渲染（浏览器优化策略）。

---

### 常见问题
- **栈溢出（Stack Overflow）**：递归未终止导致栈不断增长（如未设置递归基线）。
- **阻塞渲染**：长同步任务会阻塞UI更新（需拆分任务或使用异步）。

通过理解堆栈和事件循环，可以优化代码性能并避免常见异步陷阱。

1. http://ecma-international.org/ecma-262/6.0/#sec-execution-contexts
3. https://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%201st%20edition,%20June%201997.pdf
4. https://github.com/tc39
