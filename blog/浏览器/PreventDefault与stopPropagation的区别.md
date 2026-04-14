# PreventDefault与stopPropagation的区别

在浏览器事件处理中，`.preventDefault()` 和 `.stopPropagation()`（通常简写为 `.stop`）是用于控制事件行为的两个重要方法，它们的核心区别如下：

---

## 1. **`event.preventDefault()`**
- **作用**：阻止事件的**默认行为**（浏览器内置行为）。
- **典型应用场景**：
    - 阻止 `<a>` 标签的页面跳转
    - 阻止表单的自动提交
    - 阻止鼠标右键弹出浏览器菜单
- **示例**：
  ```javascript
  document.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault(); // 点击链接但不会跳转
  });
  ```

---

## 2. **`event.stopPropagation()`**
- **作用**：阻止事件在 **DOM 树中向上/向下传播**（冒泡或捕获阶段）。
- **典型应用场景**：
    - 阻止子元素事件触发父元素的事件监听器
    - 避免事件委托（Event Delegation）中的意外触发
- **示例**：
  ```javascript
  childElement.addEventListener('click', (event) => {
    event.stopPropagation(); // 阻止事件冒泡到父元素
    console.log("子元素事件触发");
  });

  parentElement.addEventListener('click', () => {
    console.log("父元素事件不会触发");
  });
  ```

---

## 3. **关键区别总结**
| 方法                      | 作用对象               | 影响范围                     |
|---------------------------|------------------------|------------------------------|
| `event.preventDefault()`  | **事件的默认行为**     | 阻止浏览器内置行为（如跳转） |
| `event.stopPropagation()` | **事件的传播流程**     | 阻止事件冒泡/捕获            |

---

## 4. **组合使用场景**
```javascript
button.addEventListener('click', (event) => {
  event.preventDefault();   // 阻止表单提交
  event.stopPropagation();  // 防止事件冒泡到父容器
  // 自定义逻辑...
});
```

---

## 5. **额外注意**
- **`event.stopImmediatePropagation()`**：  
  不仅阻止事件传播，还会**阻止同一元素上的其他监听器执行**。
  ```javascript
  element.addEventListener('click', (event) => {
    event.stopImmediatePropagation(); // 阻止下一个监听器执行
  });
  ```

---

## 总结图示
```
事件触发
│
├─ 默认行为? → `preventDefault()` 可阻止
│
├─ 捕获阶段 (父 → 子)
│   └─ `stopPropagation()` 可中断
│
├─ 目标阶段 (当前元素)
│   └─ `stopImmediatePropagation()` 可阻止其他监听器
│
└─ 冒泡阶段 (子 → 父)
    └─ `stopPropagation()` 可中断
```

理解这两个方法的区别，能更精确地控制事件流和浏览器行为！
