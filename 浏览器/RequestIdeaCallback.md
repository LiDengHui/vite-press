`requestIdleCallback` 是浏览器提供的一个 API，用于在浏览器空闲时期执行低优先级任务，避免阻塞关键渲染和用户交互。以下是详细说明：

---

### **基本语法**
```javascript
const requestId = requestIdleCallback(callback[, options])
```

---

### **参数说明**
1. **`callback`**（必需）  
   当浏览器空闲时调用的函数，接收一个参数 `deadline`：
    - **`deadline.timeRemaining()`**  
      返回当前帧剩余空闲时间（毫秒），通常 ≤ 50ms（浏览器限制）。
    - **`deadline.didTimeout`**  
      布尔值，若为 `true` 表示回调因 `timeout` 超时被触发（非自然空闲）。

2. **`options`**（可选）  
   配置对象，唯一属性：
    - **`timeout`**（数值）  
      设置回调执行的超时时间（毫秒）。若指定时间内浏览器未调用回调，则强制在下一帧执行（此时 `deadline.didTimeout=true`）。

---

### **使用示例**
```javascript
// 定义空闲任务
function idleTask(deadline) {
  // 检查剩余时间或超时状态
  while (deadline.timeRemaining() > 0 || deadline.didTimeout) {
    if (tasks.length === 0) return;
    const task = tasks.pop();
    executeTask(task); // 执行具体任务
  }

  // 若还有任务，继续调度
  if (tasks.length > 0) {
    requestIdleCallback(idleTask, { timeout: 2000 }); // 设置2秒超时
  }
}

// 初始调度
requestIdleCallback(idleTask);
```

---

### **取消空闲回调**
```javascript
cancelIdleCallback(requestId); // 传入 requestIdleCallback 返回的ID
```

---

### **适用场景**
- 日志上报、数据分析
- 非关键资源的预加载
- 后台数据缓存
- 耗时计算（如大数据处理）

---

### **注意事项**
1. **避免操作 DOM**  
   空闲回调可能发生在渲染帧之间，直接操作 DOM 可能导致布局抖动。若需更新 UI，应结合 `requestAnimationFrame`。
2. **超时机制慎用**  
   设置 `timeout` 可能强制回调在非空闲期执行，影响页面性能。
3. **任务分块执行**  
   单次回调内执行时间应控制在几毫秒内，用 `timeRemaining()` 检查剩余时间，分批次处理大任务。
4. **兼容性**  
   支持 Chrome、Firefox、Edge，但不支持 Safari。可使用 [polyfill](https://github.com/aFarkas/requestIdleCallback) 或降级方案：

```javascript
window.requestIdleCallback = window.requestIdleCallback || 
 (cb) => setTimeout(() => cb({ timeRemaining: () => 1 }), 0);
```

---

### **与 `requestAnimationFrame` 对比**
| 特性           | `requestIdleCallback` | `requestAnimationFrame` |
|--------------|-----------------------|-------------------------|
| **触发时机**     | 浏览器空闲时                | 下一帧渲染前                  |
| **适用任务**     | 非关键、可延迟任务             | 动画、布局更新等关键任务            |
| **执行频率**     | 不固定（取决于空闲时间）          | 每帧一次（通常 60fps）          |
| **是否可能阻塞渲染** | 否                     | 是（若任务过长）                |

---

通过合理使用 `requestIdleCallback`，可以优化页面性能，确保用户交互的流畅性。